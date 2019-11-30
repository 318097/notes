import React, { useState, useEffect } from 'react'
import { Button, message } from 'antd';
import NoteCard from './NoteCard';
import { connect } from 'react-redux';
import axios from 'axios';
import styled from 'styled-components';

import { firestore } from '../firebase';


const Wrapper = styled.div`
display: flex;
justify-content: center;
flex-wrap: wrap;
.card-wrapper{
  height: 300px;
  width: 300px;
  overflow: auto;
  margin: 10px;
  position: relative;
}
`

const UploadContent = ({ dispatch, session }) => {
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [rawData, setRawData] = useState(null);
  const [fileParsing, setFileParsing] = useState({
    splitter: '===[\r\n\s]',
  });

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
  }

  const processData = () => {
    const fileContent = rawData
      .split(new RegExp(fileParsing.splitter))
      .map((item, index) => {
        let [title, ...content] = item.trim().split('\n');
        return {
          title: title.replace(/#/gi, ''),
          content: content.join('\n'),
          index
        }
      });
    setData(fileContent);
  };

  const addData = async () => {
    const { storage } = session;
    setLoading(true);

    if (storage === 'FIREBASE') {
      const createdAt = new Date().toISOString();
      const userId = session.uid;
      const batch = firestore.batch();
      data.forEach(({ index, ...item }) => {
        const ref = firestore.collection('notes').doc();
        batch.set(
          ref,
          {
            ...item,
            tags: [],
            type: 'DROP',
            createdAt,
            userId
          }
        );
      });
      await batch.commit();
    } else {
      await axios.post('/posts', { data });
    }

    setRawData(null);
    setData([]);
    message.success(`${data.length} notes added successfully.`);
    setLoading(false);
  };

  return (
    <section>
      <div className="flex space-between">
        <input type="file" name='file' onChange={handleUpload} />
        <Button onClick={addData} disabled={disable} loading={loading}>Add</Button>
      </div>
      <Wrapper>
        {data.map(item => (
          <div className="card-wrapper" key={item.index}>
            <NoteCard view="UPLOAD" note={item} />
          </div>
        ))}
      </Wrapper>
    </section>
  )
}

const mapStateToProps = ({ session }) => ({ session });

export default connect(mapStateToProps)(UploadContent);
