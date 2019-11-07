import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import marked from 'marked';
import { Modal, Button, Input } from 'antd';

import { addNote } from '../store/actions';

const { TextArea } = Input;

const CustomContainer = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;

  form, div.preview{
    background: lightgrey;
    padding: 20px 10px;
    margin: 10px;
    border-radius: 5px;
  }
  form{
    flex: 1 1 59%;
  }
  div.preview{
    flex: 1 1 39%;
  }
`;

const AddNote = ({ addNote }) => {
  const [modalVisibility, setModalVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [note, setNote] = useState({
    title: '',
    content: ''
  });

  const setModalVisibilityStatus = status => () => setModalVisibility(status);

  const setNoteData = (key, value) => setNote(prev => ({
    ...prev,
    [key]: value
  }));

  const add = () => {
    setLoading(true);
    addNote({ ...note });
    setLoading(false);
    setModalVisibility(false);
  }

  return (
    <Fragment>
      <Button onClick={setModalVisibilityStatus(true)}>Add</Button>
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
            <Input placeholder="Title" value={note.title} onChange={e => setNoteData('title', e.target.value)} />
            <TextArea rows="7" placeholder="Content..." value={note.content} onChange={e => setNoteData('content', e.target.value)}></TextArea>
          </form>
          {showPreview && (
            <div className="preview">
              <div dangerouslySetInnerHTML={{ __html: marked(note.title || '') }}></div>
              <div dangerouslySetInnerHTML={{ __html: marked(note.content || '') }}></div>
            </div>
          )}
        </CustomContainer>
      </Modal>
    </Fragment>
  );
};

const mapDispatchToProps = ({ addNote });

export default connect(null, mapDispatchToProps)(AddNote);
