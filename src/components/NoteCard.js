import React, { useState, Fragment } from 'react'
import marked from 'marked';
import styled, { css } from 'styled-components';
import { Tag, Icon, Popover, Popconfirm } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { editNote, deleteNote } from '../store/actions';

const CardStyles = css`
width: 215px;
height: 115px;
margin: 7px;
overflow: hidden;
cursor: pointer;
padding: 5px;
`;

const ExpandedStyles = css`
max-width: 400px;
margin: 20px auto;
padding: 30px 20px;
`

const UploadDataStyles = css`
height: 300px;
width: 300px;
overflow: auto;
margin: 10px;
`

const Wrapper = styled.div`
${({ view }) => view === 'CARD' ? CardStyles : (view === 'EXPANDED' ? ExpandedStyles : UploadDataStyles)}
position: relative;
background: white;
border-radius: 5px;
border: 1px solid lightgrey;
box-shadow: 3px 3px 3px lightgrey;
transition: 1s;
display: flex;
flex-direction: column;
&:hover{
  background: #f7f7f7;
}
.title{
  text-align: center;
  margin-bottom: 5px;
  font-weight: bold;
}
.content{
  flex: 1 1 auto;
  overflow: hidden;
  p{
    text-align: center;
  }
}
.tags{
  .ant-tag{
    margin-right: 3px;
    padding: 0px 4px;
    font-size: 9px;
  }
}
`;

const DropdownWrapper = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  .dropdown{
    display: flex;
    flex-direction: column;
    position: absolute;
    background: lightgrey;
    padding: 5px;
    right: -4px;
    top: 19px;
    border-radius: 15px;
    & > * {
      margin: 2px 0;
    }
  }
`;

const NoteCard = ({ history, note, editNote, deleteNote, view = 'CARD', dropdownView }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const { title = '', content = '', type = 'DROP', tags = [], id } = note || {};

  const handleFavorite = () => { };

  const handleEdit = () => {
    editNote(id);
    setShowDropdown(false);
  };

  const handleDelete = () => {
    deleteNote(id);
    setShowDropdown(false);
  };

  const handleClick = e => {
    // console.log(e, e.target);
    if (view === 'CARD')
      return history.push(`/note/${id}`);
  };

  if (!note) return <Fragment />

  return (
    <Wrapper view={view}>
      {type && <h3 className="title">{title}</h3>}
      <div
        onClick={handleClick}
        className="content"
        dangerouslySetInnerHTML={{ __html: marked(content) }}
      >
      </div>
      <div className="tags">
        {tags.map((tag, index) => <Tag key={index}>{tag.toUpperCase()}</Tag>)}
      </div>
      {
        dropdownView &&
        <DropdownWrapper className="dropdown-wrapper">
          <Icon type="more" onClick={() => setShowDropdown(prevState => !prevState)} />
          {showDropdown && (
            <div className="dropdown">
              <Popover placement="right" content="Favorite">
                <Icon onClick={handleFavorite} type="heart" />
              </Popover>
              <Popover placement="right" content="Edit">
                <Icon onClick={handleEdit} type="edit" />
              </Popover>
              <Popover placement="right" content="Delete">
                <Popconfirm
                  title="Delete?"
                  onConfirm={handleDelete}
                  placement="right"
                  okText="Yes"
                  cancelText="No"
                >
                  <Icon type="delete" />
                </Popconfirm>
              </Popover>
            </div>
          )}
        </DropdownWrapper>
      }
    </Wrapper>
  )
};

const mapStateToProps = ({ notes }) => ({ notes });
const mapDispatchToProps = ({ editNote, deleteNote });

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NoteCard));
