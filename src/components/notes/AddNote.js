import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import marked from "marked";
import { Modal, Input, Radio, Checkbox, Button } from "antd";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

import {
  addNote,
  updateNote,
  setModalMeta,
  updateUploadNote,
  setNextNoteForEditing,
} from "../../store/actions";
import { generateSlug } from "../../utils";
import colors from "../../colors";

const StyledContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 100%;
  form {
    padding: 10px;
  }
  form {
    flex: 1 1 59%;
  }
  div.preview {
    padding: 10px;
    margin: 8px;
    background: ${colors.shade1};
    height: 96%;
    border-radius: 5px;
    flex: 1 1 39%;
    overflow: auto;
  }
`;

const initialState = {
  type: "DROP",
  title: "",
  content: "",
  slug: "",
  tags: [],
};

const AddNote = ({
  session,
  addNote,
  updateNote,
  setModalMeta,
  modalVisibility,
  mode,
  selectedNote,
  tags,
  updateUploadNote,
  setNextNoteForEditing,
}) => {
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [previewMode, setPreviewMode] = useState("PREVIEW");
  const [note, setNote] = useState(initialState);

  useEffect(() => {
    if (modalVisibility) {
      if (mode === "add") setNote({ ...initialState, tags: [] });
      else setNote({ ...selectedNote });
    }
  }, [mode, selectedNote, modalVisibility]);

  const handleClose = async () => setModalMeta();

  const setData = (key, value) =>
    setNote((data) => ({ ...data, [key]: value }));

  const handleOk = async () => {
    setLoading(true);
    try {
      if (mode === "edit") await updateNote({ ...note });
      else if (mode === "add") await addNote({ ...note, userId: session.uid });
      else await updateUploadNote({ ...note });
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const handleUpdateAndNext = () =>
    setNextNoteForEditing({ ...note, viewed: true });

  return (
    <Modal
      title={mode === "add" ? "ADD NOTE" : "EDIT NOTE"}
      centered={true}
      style={{ padding: "0" }}
      visible={modalVisibility}
      width="80vw"
      confirmLoading={loading}
      okText={mode === "add" ? "Add" : "Update"}
      onOk={handleOk}
      onCancel={handleClose}
      footer={[
        <Button key="cancel-button" onClick={handleClose}>
          Cancel
        </Button>,
        <Button type="primary" key="add-button" onClick={handleOk}>
          {mode === "add" ? "Add" : "Update"}
        </Button>,
        <Fragment key="update-and-next-button">
          {mode !== "add" && (
            <Button type="danger" onClick={handleUpdateAndNext}>
              Update and next
            </Button>
          )}
        </Fragment>,
      ]}
    >
      <StyledContainer>
        <form>
          <Radio.Group
            buttonStyle="solid"
            value={note.type}
            onChange={({ target: { value } }) => setData("type", value)}
          >
            <Radio.Button value="POST">POST</Radio.Button>
            <Radio.Button value="DROP">DROP</Radio.Button>
          </Radio.Group>

          <Input
            autoFocus
            placeholder="Title"
            value={note.title}
            onChange={({ target: { value } }) => setData("title", value)}
            onBlur={() => setData("slug", generateSlug(note.title))}
          />
          <Input
            placeholder="Slug"
            value={note.slug}
            onChange={({ target: { value } }) => setData("slug", value)}
          />
          <SimpleMDE
            value={note.content}
            onChange={(value) => setData("content", value)}
            options={{
              spellChecker: false,
              placeholder: "Content...",
              hideIcons: ["guide", "preview", "fullscreen", "side-by-side"],
            }}
          />
          <Checkbox.Group
            options={tags}
            value={note.tags}
            onChange={(value) => setData("tags", value)}
          />
        </form>
        {showPreview && (
          <div className="preview">
            <div className="flex space-between align-center">
              <h3>Preview</h3>
              <Radio.Group
                defaultValue={previewMode}
                buttonStyle="solid"
                onChange={({ target: { value } }) => setPreviewMode(value)}
              >
                <Radio.Button value="PREVIEW">PREVIEW</Radio.Button>
                <Radio.Button value="CODE">CODE</Radio.Button>
              </Radio.Group>
            </div>
            <div className="divider"></div>
            {previewMode === "PREVIEW" ? (
              <Fragment>
                <div
                  dangerouslySetInnerHTML={{
                    __html: marked(note.title || ""),
                  }}
                ></div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: marked(note.content || ""),
                  }}
                ></div>
              </Fragment>
            ) : (
              <div className="preview">
                {marked(note.title)}
                <br />
                <div className="preview-body">{marked(note.content)}</div>
              </div>
            )}
          </div>
        )}
      </StyledContainer>
    </Modal>
  );
};

const mapStateToProps = ({
  modalMeta: { visibility, mode, selectedNote },
  session,
  tags,
}) => ({
  modalVisibility: visibility,
  selectedNote,
  mode,
  session,
  tags,
});
const mapDispatchToProps = {
  addNote,
  updateNote,
  setModalMeta,
  updateUploadNote,
  setNextNoteForEditing,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddNote);
