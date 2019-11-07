import React, { useState, useEffect } from 'react'
import { firestore } from '../firebase';
import marked from 'marked';
import styled from 'styled-components';

const Note = styled.div`
p{
  color: green;
}
`;

const Notes = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = () => {
    firestore
      .collection('notes')
      .get()
      .then(querySnapshot => {
        const data = [];
        querySnapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
        setData(data);
      });
  };

  return (
    <div>
      {data.map(note => (
        <Note key={note.id}>
          <h3>{note.title}</h3>
          <div dangerouslySetInnerHTML={{ __html: marked(note.content || '') }}></div>
        </Note>
      ))}
    </div>
  )
}

export default Notes
