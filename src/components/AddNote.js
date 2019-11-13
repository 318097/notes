import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import marked from 'marked';
import { Modal, Input, Radio, Divider, Checkbox } from 'antd';
import SimpleMDE from "react-simplemde-editor";

import { addNote, updateNote, setAddNoteModalVisibility } from '../store/actions';

import { StyledIcon } from '../styled';

import './AddNote.scss';
import "easymde/dist/easymde.min.css";

const CustomContainer = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;

  form, div.preview{
    padding: 20px 10px;
  }
  form{
    flex: 1 1 59%;
  }
  div.preview{
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
  tags: []
};

const tagOptions = [
  { label: "JAVASCRIPT", value: "JAVASCRIPT" },
  { label: "REACT", value: "REACT" }
];

const AddNote = ({ addNote, updateNote, modalVisibility, setAddNoteModalVisibility, mode, selectedNote }) => {
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [previewMode, setPreviewMode] = useState('PREVIEW');
  const [note, setNote] = useState(initialState);

  useEffect(() => {
    if (modalVisibility) {
      if (mode === 'edit') setNote({ ...selectedNote });
      else setNote({ ...initialState, tags: [] });
    }
  }, [mode, selectedNote, modalVisibility]);

  const setModalVisibilityStatus = (status, mode) => async () => setAddNoteModalVisibility(status, mode);

  const setData = (key, value) => setNote(data => ({ ...data, [key]: value }));

  const handleOk = async () => {
    setLoading(true);

    if (mode === 'edit')
      await updateNote({ ...note });
    else
      await addNote({ ...note });

    setLoading(false);
    setModalVisibilityStatus(false)();
  };

  return (
    <Fragment>
      <StyledIcon type="plus"
        onClick={setModalVisibilityStatus(true, 'add')}
      />
      <Modal
        title={mode === 'edit' ? 'EDIT NOTE' : 'ADD NOTE'}
        centered={true}
        visible={modalVisibility}
        okText={mode === 'edit' ? 'Update' : 'Add'}
        onOk={handleOk}
        onCancel={setModalVisibilityStatus(false)}
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
              onChange={({ target: { value } }) => setData('title', value)}
            />
            <SimpleMDE
              value={note.content}
              onChange={value => setData('content', value)}
              options={{
                spellChecker: false,
                placeholder: 'Content...',
                hideIcons: ["guide", "preview", "fullscreen", "side-by-side"],
              }}
            />
            <Checkbox.Group
              options={tagOptions}
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
              {
                previewMode === 'PREVIEW' ?
                  <Fragment>
                    <div dangerouslySetInnerHTML={{ __html: marked(note.title || '') }}></div>
                    <div dangerouslySetInnerHTML={{ __html: marked(note.content || '') }}></div>
                  </Fragment> :
                  <div>
                    {marked(note.title)}<br />
                    {marked(note.content)}
                  </div>
              }
            </div>
          )}
        </CustomContainer>
      </Modal>
    </Fragment>
  );
};

const mapStateToProps = ({ addNoteModalVisibility, selectedNote, mode }) => ({ modalVisibility: addNoteModalVisibility, selectedNote, mode });
const mapDispatchToProps = ({ addNote, updateNote, setAddNoteModalVisibility });

export default connect(mapStateToProps, mapDispatchToProps)(AddNote);
