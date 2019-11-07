import React, { useState, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import marked from 'marked';
import { Modal, Button, Input, Radio, Divider } from 'antd';
import SimpleMDE from "react-simplemde-editor";

import './AddNote.css';
import { addNote } from '../store/actions';

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

const AddNote = ({ addNote }) => {
  const [modalVisibility, setModalVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [previewMode, setPreviewMode] = useState('PREVIEW');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const setModalVisibilityStatus = status => () => setModalVisibility(status);

  const add = () => {
    setLoading(true);
    addNote({ title, content });
    setLoading(false);
    setModalVisibility(false);
  }

  return (
    <Fragment>
      <Button
        onClick={setModalVisibilityStatus(true)}
      >
        Add
      </Button>

      <Modal
        title='Add Note'
        visible={modalVisibility}
        okText='Add'
        onOk={add}
        onCancel={setModalVisibilityStatus(false)}
        width="80vw"
        style={{
          height: '80vh'
        }}
      >
        <CustomContainer>
          <form>
            <Input
              autoFocus
              placeholder="Title"
              value={title}
              onChange={({ target: { value } }) => setTitle(value)}
            />
            <SimpleMDE
              value={content}
              onChange={value => setContent(value)}
              options={{
                spellChecker: false,
                placeholder: 'Content...',
                hideIcons: ["guide", "preview", "fullscreen", "side-by-side"],
              }}
            />
          </form>
          {showPreview && (
            <div className="preview">
              <div className="flex space-between">
                <h3>Preview</h3>
                <Radio.Group defaultValue={previewMode} buttonStyle="solid" onChange={({ target: { value } }) => setPreviewMode(value)}>
                  <Radio.Button value="PREVIEW">Preview</Radio.Button>
                  <Radio.Button value="CODE">Code</Radio.Button>
                </Radio.Group>
              </div>
              <Divider />
              {
                previewMode === 'PREVIEW' ?
                  <Fragment>
                    <div dangerouslySetInnerHTML={{ __html: marked(title || '') }}></div>
                    <div dangerouslySetInnerHTML={{ __html: marked(content || '') }}></div>
                  </Fragment> :
                  <div>
                    {marked(title)}<br />
                    {marked(content)}
                  </div>
              }
            </div>
          )}
        </CustomContainer>
      </Modal>
    </Fragment>
  );
};

const mapDispatchToProps = ({ addNote });

export default connect(null, mapDispatchToProps)(AddNote);
