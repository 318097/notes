/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { Button, message, PageHeader, Radio, Input, Tag } from "antd";
import Card from "@bit/ml318097.mui.card";
import Icon from "@bit/ml318097.mui.icon";
import { connect } from "react-redux";
import axios from "axios";
import styled from "styled-components";
import uuid from "uuid";
import marked from "marked";

import { setModalMeta } from "../../store/actions";
import { generateSlug } from "../../utils";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  column-gap: 6px;
  justify-content: center;
  .card-wrapper {
    height: 300px;
    margin: 3px 0;
    position: relative;
    .card {
      padding: 20px 12px;
      .title {
        margin-bottom: 10px;
      }
      .content {
        overflow: auto;
      }
    }
    .index-number {
      position: absolute;
      top: 7px;
      left: 7px;
      text-decoration: underline;
      font-style: italics;
      font-size: 1.1rem;
    }
    .edit-icon {
      position: absolute;
      top: 6px;
      right: 2px;
      color: green;
    }
    .delete-icon {
      position: absolute;
      top: 33px;
      right: 2px;
      color: red;
    }
  }
`;

const parseItem = (item, type = "POST") => {
  let title, content;
  switch (type) {
    case "POST":
      [title, ...content] = item.split("\n");
      title = title.replace(/#/gi, "");
      content = content.join("\n");
      break;
    case "DROP":
      [title, content] = item.split("=>");
      title = title.replace(/-/, "");
      content = `${title} - ${content}`;
      title = "";
      break;
    default:
      return;
  }
  return {
    title,
    content
  };
};

const UploadContent = ({ dispatch, finishEditing, selectedNote }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataType, setDataType] = useState("POST");
  const [rawData, setRawData] = useState(null);
  const [fileParsing, setFileParsing] = useState("===[\r\n]");

  const inputEl = useRef(null);

  useEffect(() => {
    if (dataType === "POST") setFileParsing("===[\r\n]");
    else if (dataType === "DROP") setFileParsing("[\r\n]");
  }, [dataType]);

  useEffect(() => {
    if (!finishEditing) return;
    setData(prev =>
      prev.map(item => {
        if (item.tempId === selectedNote.tempId) return selectedNote;
        return item;
      })
    );
  }, [finishEditing]);

  useEffect(() => {
    processData();
  }, [rawData, fileParsing]);

  const handleUpload = event => {
    const [document] = event.target.files;

    if (!document) return;

    const reader = new FileReader();
    reader.readAsText(document);
    reader.onload = () => setRawData(reader.result);
  };

  const processData = () => {
    if (!rawData) return;
    const fileContent = rawData
      .split(new RegExp(fileParsing))
      .map(item => {
        let { title = "", content = "" } = parseItem(item.trim(), dataType);
        return {
          tags: [],
          type: dataType,
          title,
          content,
          tempId: uuid(),
          slug: generateSlug(title)
        };
      })
      .filter(item => item.title || item.content);
    setData(fileContent);
  };

  const addData = async () => {
    try {
      setLoading(true);
      await axios.post("/posts", { data });
      message.success(`${data.length} notes added successfully.`);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setRawData(null);
      setData([]);
    }
  };

  const editItem = item => () =>
    dispatch(
      setModalMeta({
        selectedNote: item,
        mode: "edit-upload",
        finishEditing: false,
        visibility: true
      })
    );

  const removeItem = tempId => () =>
    setData(prev => prev.filter(item => item.tempId !== tempId));

  return (
    <section>
      <PageHeader
        title="File Upload"
        extra={[
          <Input
            key="file-splitter"
            style={{ width: "110px" }}
            placeholder="File splitter"
            value={JSON.stringify(fileParsing)}
            onChange={({ target: { value } }) =>
              setFileParsing(JSON.parse(value))
            }
          />,
          <Radio.Group
            key="data-type"
            buttonStyle="solid"
            value={dataType}
            onChange={({ target: { value } }) => setDataType(value)}
          >
            <Radio.Button value="POST">POST</Radio.Button>
            <Radio.Button value="DROP">DROP</Radio.Button>
          </Radio.Group>,
          <span key="upload-buttons">
            {rawData ? (
              <Button onClick={addData} loading={loading}>
                {`Upload ${data.length} ${dataType.toLowerCase()}`}{" "}
                <Icon type="upload" />
              </Button>
            ) : (
              <Button type="dashed" onClick={() => inputEl.current.click()}>
                Select File
              </Button>
            )}
          </span>
        ]}
      />
      <Wrapper>
        {data.map((item, i) => {
          const { title = "", content = "", tags = [] } = item;
          return (
            <div className="card-wrapper" key={item.tempId}>
              <Card>
                <h3 className="title">{title}</h3>
                <div
                  className="content"
                  dangerouslySetInnerHTML={{ __html: marked(content) }}
                ></div>
                <div className="tags">
                  {tags.map(tag => (
                    <Tag key={tag}>{tag.toUpperCase()}</Tag>
                  ))}
                </div>
              </Card>

              <span className="index-number">#{i + 1}</span>
              <Icon
                onClick={editItem(item)}
                className="edit-icon"
                type="edit"
              />
              <Icon
                onClick={removeItem(item.tempId)}
                className="delete-icon"
                type="delete"
              />
            </div>
          );
        })}
      </Wrapper>
      <input
        ref={inputEl}
        type="file"
        style={{ visibility: "hidden" }}
        onChange={handleUpload}
      />
    </section>
  );
};

const mapStateToProps = ({ modalMeta: { finishEditing, selectedNote } }) => ({
  finishEditing,
  selectedNote
});

export default connect(mapStateToProps)(UploadContent);
