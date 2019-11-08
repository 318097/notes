import React, { useState, useEffect } from 'react'
import { firestore } from '../firebase';

import NoteView from './NoteView';

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
    <div className="flex">
      {data.map(note => <NoteView key={note.id} note={note} />)}
    </div>
  )
}

export default Notes
