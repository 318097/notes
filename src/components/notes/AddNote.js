import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Modal, Input, Radio, Checkbox, Button, Divider } from "antd";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import _ from "lodash";
import {
  addNote,
  updateNote,
  setModalMeta,
  updateUploadNote,
  setNextNoteForEditing,
} from "../../store/actions";
import colors from "@codedrops/react-ui";
import SelectCollection from "../SelectCollection";
import { generateSlug, md } from "../../utils";
import { noteType } from "../../constants";

const { TextArea } = Input;

const StyledContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 100%;
  overflow: auto;
  padding: 10px 0 10px 10px;
  .post-form {
    flex: 1 0 auto;
    overflow-x: auto;
    padding-right: 8px;
  }
  div.preview {
    background: ${colors.shade1};
    border-radius: 5px;
    flex: 0 0 40%;
    padding: 8px;
    margin-left: 8px;
    margin-right: 10px;
    overflow-x: auto;
    .preview-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  @media (max-width: 1024px) {
    div.preview {
      display: none;
    }
  }
`;

const initialState = {
  type: "DROP",
  title: "",
  content: "```js\n\n```",
  url: "",
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
  appLoading,
  activeCollection,
}) => {
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [previewMode, setPreviewMode] = useState("PREVIEW");
  const [collection, setCollection] = useState();
  const [note, setNote] = useState(initialState);

  useEffect(() => {
    if (modalVisibility) {
      if (mode === "add") {
        setNote({ ...initialState, tags: [] });
        setCollection(activeCollection);
      } else {
        setNote({ ...selectedNote });
        setCollection(selectedNote.collectionId);
      }
    }
  }, [mode, selectedNote, modalVisibility]);

  const handleClose = async () => setModalMeta();

  const setData = (update) => setNote((data) => ({ ...data, ...update }));

  const handleOk = async () => {
    setLoading(true);
    try {
      if (mode === "edit") await updateNote({ ...note });
      else if (mode === "add")
        await addNote({ ...note, userId: session.uid }, collection);
      else await updateUploadNote({ ...note, viewed: true });
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const handleUpdateAndNext = () =>
    setNextNoteForEditing({ ...note, viewed: true });

  const updateSlug = (e) => {
    if (note.status === "POSTED") return;
    const newSlug = generateSlug({
      title: e.target.value,
      prevSlug: note.slug,
    });
    setData({ slug: newSlug });
  };

  return (
    <Modal
      title={mode === "add" ? "ADD NOTE" : "EDIT NOTE"}
      centered={true}
      maskClosable={false}
      wrapClassName="react-ui"
      destroyOnClose={true}
      style={{ padding: "0" }}
      visible={modalVisibility}
      width="60vw"
      confirmLoading={loading}
      okText={mode === "add" ? "Add" : "Update"}
      onOk={handleOk}
      onCancel={handleClose}
      footer={[
        <Button
          key="preview-button"
          type="link"
          onClick={() => setShowPreview((prev) => !prev)}
        >
          Preview
        </Button>,
        <Divider type="vertical" />,
        <Button key="cancel-button" onClick={handleClose}>
          Cancel
        </Button>,
        <Fragment key="update-and-next-button">
          {mode !== "add" && (
            <Button type="danger" onClick={handleUpdateAndNext}>
              Update and next
            </Button>
          )}
        </Fragment>,
        <Button
          type="primary"
          key="add-button"
          onClick={handleOk}
          disabled={appLoading}
        >
          {mode === "add" ? "Add" : "Update"}
        </Button>,
      ]}
    >
      <StyledContainer>
        <div className="post-form">
          <div className="flex space-between mb">
            <Radio.Group
              buttonStyle="solid"
              value={note.type}
              onChange={({ target: { value } }) =>
                setData({
                  type: value,
                  title: value === "QUIZ" ? "Quiz" : _.get(note, "title", ""),
                })
              }
            >
              {noteType.map(({ value }) => (
                <Radio.Button key={value} value={value}>
                  {value}
                </Radio.Button>
              ))}
            </Radio.Group>

            <SelectCollection
              collection={collection}
              setCollection={(value) => {
                setCollection(value);
                // if (mode !== "add") setData({ collectionId: value });
              }}
            />
          </div>
          <Input
            className="mb"
            autoFocus
            placeholder="Title"
            value={note.title}
            onBlur={updateSlug}
            onChange={({ target: { value } }) => setData({ title: value })}
          />
          <Input
            className="mb"
            placeholder="Slug"
            value={note.slug}
            disabled={note.status === "POSTED"}
            onChange={({ target: { value } }) => setData({ slug: value })}
          />
          {note.type !== "CHAIN" && (
            <SimpleMDE
              className="mb"
              value={note.content}
              onChange={(value) => setData({ content: value })}
              options={{
                spellChecker: false,
                placeholder: "Content...",
                hideIcons: ["guide", "preview", "fullscreen", "side-by-side"],
              }}
            />
          )}
          <Input
            className="mb"
            placeholder="URL"
            value={note.url}
            onChange={({ target: { value } }) => setData({ url: value })}
          />
          {note.type === "QUIZ" && (
            <SimpleMDE
              className="mb"
              value={note.solution}
              onChange={(value) => setData({ solution: value })}
              options={{
                spellChecker: false,
                placeholder: "Solution",
                hideIcons: ["guide", "preview", "fullscreen", "side-by-side"],
              }}
            />
          )}
          <div className="mt">
            <Checkbox.Group
              options={tags}
              value={note.tags}
              onChange={(value) => setData({ tags: value })}
            />
          </div>
        </div>
        {showPreview && (
          <div className="preview">
            <div className="preview-header">
              <h4>Preview</h4>
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
                <h3
                  dangerouslySetInnerHTML={{
                    __html: md.render(note.title || ""),
                  }}
                ></h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: md.render(note.content || ""),
                  }}
                ></div>
              </Fragment>
            ) : (
              <div className="preview">
                {md.render(note.title || "")}
                <br />
                <div className="preview-body">
                  {md.render(note.content || "")}
                </div>
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
  activeCollection,
  settings,
  appLoading,
}) => ({
  modalVisibility: visibility,
  selectedNote,
  mode,
  session,
  tags: _.map(_.get(settings, "tags", []), ({ label }) => ({
    label,
    value: label,
  })),
  activeCollection,
  appLoading,
});

const mapDispatchToProps = {
  addNote,
  updateNote,
  setModalMeta,
  updateUploadNote,
  setNextNoteForEditing,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddNote);
