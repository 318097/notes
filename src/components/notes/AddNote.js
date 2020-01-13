import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import marked from "marked";
import { Modal, Input, Radio, Divider, Checkbox } from "antd";
import SimpleMDE from "react-simplemde-editor";

import { addNote, updateNote, setModalMeta } from "../../store/actions";

import { generateSlug, tagList } from "../../utils";

import "easymde/dist/easymde.min.css";

const CustomContainer = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;

  form,
  div.preview {
    padding: 20px 10px;
  }
  form {
    flex: 1 1 59%;
  }
  div.preview {
    background: #f3f3f3;
    margin: 10px;
    border-radius: 5px;
    flex: 1 1 39%;
  }
`;

const initialState = {
  type: "DROP",
  title: "",
  content: "",
  slug: "",
  tags: []
};

const AddNote = ({
  session,
  addNote,
  updateNote,
  setModalMeta,
  modalVisibility,
  mode,
  selectedNote
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

  const closeModal = async () => setModalMeta();

  const setData = (key, value) => setNote(data => ({ ...data, [key]: value }));

  const handleOk = async () => {
    setLoading(true);
    try {
      if (mode === "edit") await updateNote({ ...note });
      else if (mode === "add") await addNote({ ...note, userId: session.uid });
      else await setModalMeta({ selectedNote: note, finishEditing: true });
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  return (
    <Modal
      title={mode === "add" ? "ADD NOTE" : "EDIT NOTE"}
      centered={true}
      visible={modalVisibility}
      okText={mode === "add" ? "Add" : "Update"}
      onOk={handleOk}
      onCancel={closeModal}
      width="80vw"
      confirmLoading={loading}
    >
      <CustomContainer>
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
            onChange={value => setData("content", value)}
            options={{
              spellChecker: false,
              placeholder: "Content...",
              hideIcons: ["guide", "preview", "fullscreen", "side-by-side"]
            }}
          />
          <Checkbox.Group
            options={tagList}
            value={note.tags}
            onChange={value => setData("tags", value)}
          />
        </form>
        {showPreview && (
          <div className="preview">
            <div className="flex space-between">
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
            <Divider />
            {previewMode === "PREVIEW" ? (
              <Fragment>
                <div
                  dangerouslySetInnerHTML={{
                    __html: marked(note.title || "")
                  }}
                ></div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: marked(note.content || "")
                  }}
                ></div>
              </Fragment>
            ) : (
              <div>
                {marked(note.title)}
                <br />
                {marked(note.content)}
              </div>
            )}
          </div>
        )}
      </CustomContainer>
    </Modal>
  );
};

const mapStateToProps = ({
  modalMeta: { visibility, mode, selectedNote },
  session
}) => ({
  modalVisibility: visibility,
  selectedNote,
  mode,
  session
});
const mapDispatchToProps = {
  addNote,
  updateNote,
  setModalMeta
};

export default connect(mapStateToProps, mapDispatchToProps)(AddNote);
