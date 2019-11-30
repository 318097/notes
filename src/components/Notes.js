import React, { useEffect, Fragment } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { fetchNotes } from '../store/actions';
import NoteCard from './NoteCard';

import { MessageWrapper } from '../styled';

const Wrapper = styled.div`
display: flex;
justify-content: center;
flex-wrap: wrap;
.card-wrapper{
  width: 215px;
  height: 115px;
  margin: 7px;
  cursor: pointer;
  .card{
    .title, .content{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 13px;
    }
    &:hover{
      background: #efefef;
    }
    .content{
      overflow: hidden;
    }
  }
}
`

const Notes = ({ fetchNotes, data, session, appLoading, history }) => {
  useEffect(() => {
    if (session) fetchNotes();
  }, [session]);

  const handleClick = id => () => history.push(`/note/${id}`);

  const NoData = () => !appLoading && <MessageWrapper>Empty</MessageWrapper>;

  return (
    <section>
      {
        data.length ?
          <Wrapper>
            {data.map(note => (
              <div
                className="card-wrapper"
                key={note._id}
                onClick={handleClick(note._id)}
              >
                <NoteCard note={note} dropdownView={true} />
              </div>
            ))}
          </Wrapper> :
          <NoData />
      }
    </section>
  );
};

const mapStateToProps = ({ notes, session, appLoading }) => ({ data: notes, session, appLoading });

const mapDispatchToProps = ({ fetchNotes });

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Notes));
