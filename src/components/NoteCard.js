import React, { useState } from 'react'
import marked from 'marked';
import styled from 'styled-components';
import { Tag, Icon, Popover, Popconfirm } from 'antd';
import { connect } from 'react-redux';

import { editNote, deleteNote } from '../store/actions';

const Wrapper = styled.div`
width: 215px;
height: 115px;
margin: 7px;
padding: 5px;
background: white;
border-radius: 5px;
border: 1px solid lightgrey;
box-shadow: 3px 3px 3px lightgrey;
overflow: hidden;
transition: 1s;
display: flex;
position: relative;

flex-direction: column;
&:hover{
  background: #f7f7f7;
}
.title{
  text-align: center;
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
`

const NoteCard = ({ note, editNote, deleteNote }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const { title = '', content = '', type = 'DROP', tags = [], id } = note;

  const handleFavorite = () => { };

  const handleEdit = () => {
    editNote(id);
    setShowDropdown(false);
  };

  const handleDelete = () => {
    deleteNote(id);
    setShowDropdown(false);
  };

  return (
    <Wrapper>
      {type && <h3 className="title">{title}</h3>}
      <div className="content" dangerouslySetInnerHTML={{ __html: marked(content) }}></div>
      <div className="tags">
        {tags.map((tag, index) => <Tag key={index}>{tag.toUpperCase()}</Tag>)}
      </div>
      <DropdownWrapper>
        <Icon type="more" onClick={() => setShowDropdown(prevState => !prevState)} />
        {showDropdown && (<div className="dropdown">
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
        </div>)}
      </DropdownWrapper>
    </Wrapper>
  )
};

const mapStateToProps = ({ notes }) => ({ notes });
const mapDispatchToProps = ({ editNote, deleteNote });

export default connect(mapStateToProps, mapDispatchToProps)(NoteCard);
