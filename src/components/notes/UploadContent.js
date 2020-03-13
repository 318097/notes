/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { Button, message, PageHeader, Radio, Input } from "antd";
import Card from "./Card";
import { connect } from "react-redux";
import axios from "axios";
import styled from "styled-components";
import uuid from "uuid";

import { setModalMeta } from "../../store/actions";
import Icon from "../Icon";
import { firestore } from "../../firebase";
import { generateSlug } from "../../utils";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  .card-wrapper {
    height: 300px;
    width: 300px;
    margin: 5px;
    position: relative;
    .card {
      .title {
        margin: 10px;
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
      font-size: 9px;
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

const UploadContent = ({ session, dispatch, finishEditing, selectedNote }) => {
  const [disable, setDisable] = useState(true);
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
    if (rawData) {
      processData();
      setDisable(false);
    }
  }, [rawData]);

  useEffect(() => {
    processData();
  }, [fileParsing]);

  const handleUpload = event => {
    const [document] = event.target.files;

    if (!document) return;

    const reader = new FileReader();
    reader.readAsText(document);
    reader.onload = () => setRawData(reader.result);
  };

  const processData = () => {
    if (!rawData) return;
    const fileContent = rawData.split(new RegExp(fileParsing)).map(item => {
      let { title, content } = parseItem(item.trim(), dataType);
      return {
        tags: [],
        type: dataType,
        title,
        content,
        tempId: uuid(),
        slug: generateSlug(title)
      };
    });
    setData(fileContent);
  };

  const addData = async () => {
    const { storage } = session;
    setLoading(true);

    if (storage === "FIREBASE") {
      const createdAt = new Date().toISOString();
      const userId = session.uid;
      const batch = firestore.batch();
      data.forEach(item => {
        const ref = firestore.collection("notes").doc();
        batch.set(ref, {
          ...item,
          tags: [],
          type: "DROP",
          createdAt,
          userId
        });
      });
      await batch.commit();
    } else {
      await axios.post("/posts", { data });
    }

    setRawData(null);
    setData([]);
    setLoading(false);
    message.success(`${data.length} notes added successfully.`);
  };

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
          <Button key="select-file" onClick={() => inputEl.current.click()}>
            Select File
          </Button>,
          <Button
            key="upload-button"
            onClick={addData}
            disabled={disable}
            loading={loading}
          >
            Upload <Icon type="upload" />
          </Button>
        ]}
      />
      <Wrapper>
        {data.map((item, i) => (
          <div className="card-wrapper" key={item.tempId}>
            <Card view="UPLOAD" note={item} />
            <span className="index-number">#{i + 1}</span>
            <Icon
              onClick={() =>
                dispatch(
                  setModalMeta({
                    selectedNote: item,
                    mode: "edit-upload",
                    finishEditing: false,
                    visibility: true
                  })
                )
              }
              className="edit-icon"
              type="edit"
            />
            <Icon
              onClick={removeItem(item.tempId)}
              className="delete-icon"
              type="delete"
            />
          </div>
        ))}
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

const mapStateToProps = ({
  session,
  modalMeta: { finishEditing, selectedNote }
}) => ({
  session,
  finishEditing,
  selectedNote
});

export default connect(mapStateToProps)(UploadContent);
