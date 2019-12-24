/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { Button, message, Icon, PageHeader, Radio } from "antd";
import Card from "./Card";
import { connect } from "react-redux";
import axios from "axios";
import styled from "styled-components";
import uuid from "uuid";

import { setNoteToEdit } from "../store/actions";
import { StyledIcon } from "../styled";
import { firestore } from "../firebase";

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

const UploadContent = ({
  session,
  dispatch,
  uploadNoteStatus,
  selectedNote
}) => {
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataType, setDataType] = useState("POST");
  const [rawData, setRawData] = useState(null);
  const [fileParsing, setFileParsing] = useState({
    splitter: "===[\r\ns]"
  });

  const inputEl = useRef(null);

  useEffect(() => {
    if (!uploadNoteStatus) return;
    setData(prev =>
      prev.map(item => {
        if (item.tempId === selectedNote.tempId) return selectedNote;
        return item;
      })
    );
  }, [uploadNoteStatus]);

  useEffect(() => {
    if (rawData) {
      processData();
      setDisable(false);
    }
  }, [rawData]);

  const handleUpload = e => {
    const [document] = e.target.files;

    if (!document) return;

    const reader = new FileReader();
    reader.readAsText(document);
    reader.onload = () => setRawData(reader.result);
  };

  const processData = () => {
    const fileContent = rawData
      .split(new RegExp(fileParsing.splitter))
      .map(item => {
        let [title, ...content] = item.trim().split("\n");
        return {
          tags: [],
          type: dataType,
          title: title.replace(/#/gi, ""),
          content: content.join("\n"),
          tempId: uuid()
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
          <Radio.Group
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
            <StyledIcon
              onClick={removeItem(item.tempId)}
              className="delete-icon"
              type="delete"
            />
            <StyledIcon
              onClick={() => dispatch(setNoteToEdit(item))}
              className="edit-icon"
              type="edit"
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

const mapStateToProps = ({ session, uploadNoteStatus, selectedNote }) => ({
  session,
  uploadNoteStatus,
  selectedNote
});

export default connect(mapStateToProps)(UploadContent);
