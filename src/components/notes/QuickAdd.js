import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Modal, Input, Button, Tag } from "antd";
import { addNote, setQuickAddModalMeta } from "../../store/actions";
import SelectCollection from "../SelectCollection";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  .quick-add-header {
    display: flex;
    margin-bottom: 40px;
    .ant-input {
      margin-left: 20px;
    }
  }
  .quick-add-tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .ant-tag {
      margin: 0 10px 10px 0;
    }
  }
`;

const QuickAdd = ({
  addNote,
  modalVisibility,
  appLoading,
  activeCollection,
  setQuickAddModalMeta,
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [collection, setCollection] = useState(activeCollection);
  const [input, setInput] = useState("");

  useEffect(() => {}, []);

  const handleClose = async () => {
    setQuickAddModalMeta();
    clearData();
  };

  const clearData = () => {
    setData([]);
    setInput("");
  };

  const handleOk = async () => {
    setLoading(true);
    try {
      await addNote(data.map((title) => ({ title, status: "QUICK_ADD" })));
      clearData();
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const handleChange = ({ target: { value } }) => {
    setInput(value);
  };

  const handleKeyDown = (e) => {
    if (e.which === 188) {
      const tag = input.trim().replace(",", "");
      setData((prev) => [...prev, tag]);
      setTimeout(() => setInput(""));
    }
  };

  const removeTag = (removedTag) =>
    setData((prev) => prev.filter((tag) => tag !== removedTag));

  return (
    <Modal
      title="QUICK ADD"
      centered={true}
      maskClosable={false}
      destroyOnClose={true}
      style={{ padding: "0" }}
      visible={modalVisibility}
      confirmLoading={loading}
      onOk={handleOk}
      onCancel={handleClose}
      footer={[
        <Button key="cancel-button" onClick={handleClose}>
          Cancel
        </Button>,
        <Button
          type="primary"
          key="add-button"
          onClick={handleOk}
          disabled={appLoading}
        >
          {data.length ? `Add ${data.length} items` : "Add"}
        </Button>,
      ]}
    >
      <StyledContainer>
        <div className="quick-add-header">
          <SelectCollection
            collection={collection}
            setCollection={setCollection}
          />
          <Input
            autoFocus
            placeholder="Items"
            value={input}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
          />
        </div>
        <div className="quick-add-tags">
          {data.map((item) => (
            <Tag closable key={item} onClose={() => removeTag(item)}>
              {item}
            </Tag>
          ))}
        </div>
      </StyledContainer>
    </Modal>
  );
};

const mapStateToProps = ({
  quickAddModalMeta: { visibility } = {},
  session,
  activeCollection,
  appLoading,
}) => ({
  modalVisibility: visibility,
  session,
  activeCollection,
  appLoading,
});

const mapDispatchToProps = { setQuickAddModalMeta, addNote };

export default connect(mapStateToProps, mapDispatchToProps)(QuickAdd);
