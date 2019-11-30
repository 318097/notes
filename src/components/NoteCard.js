import React, { useState, Fragment } from 'react'
import marked from 'marked';
import styled, { css } from 'styled-components';
import { Tag, Icon, Popover, Popconfirm } from 'antd';
import { connect } from 'react-redux';

import { editNote, deleteNote } from '../store/actions';

const Wrapper = styled.div`
background: white;
padding: 5px;
position: relative;
height: 100%;
width: 100%;
border-radius: 5px;
border: 1px solid lightgrey;
box-shadow: 3px 3px 3px lightgrey;
transition: 1s;
display: flex;
flex-direction: column;

.title{
  font-size: 16px;
  text-align: center;
  margin-bottom: 5px;
}
.content{
  padding: 5px;
  word-wrap: break-word;
  flex: 1 1 auto;
  width: 100%;
  pre{
    font-size: 14px;
    margin: 0 auto;
    border: 1px solid lightgrey;
  }
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

const NoteCard = ({
  note,
  editNote,
  deleteNote,
  view = 'CARD',
  dropdownView
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const { title = '', content = '', type = 'DROP', tags = [], _id } = note || {};
  const showTitle = type !== 'DROP' || view === 'UPLOAD';
  const showContent = view === 'UPLOAD' || (view === 'CARD' && type !== 'POST');

  const handleFavorite = () => { };

  const handleEdit = () => {
    editNote(_id);
    setShowDropdown(false);
  };

  const handleDelete = () => {
    deleteNote(_id);
    setShowDropdown(false);
  };

  if (!note) return <Fragment />

  return (
    <Wrapper className="card">
      {showTitle && <h3 className="title">{title}</h3>}
      {
        showContent &&
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: marked(content) }}
        >
        </div>
      }
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

export default connect(mapStateToProps, mapDispatchToProps)(NoteCard);
