import React from 'react'
import marked from 'marked';
import styled from 'styled-components';
import { Tag } from 'antd';

const Wrapper = styled.div`
width: 215px;
height: 115px;
background: white;
border: 1px solid lightgrey;
margin: 7px;
padding: 5px;
border-radius: 5px;
box-shadow: 3px 3px 3px lightgrey;
overflow: hidden;
transition: 1s;
display: flex;
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

const NoteView = ({ note }) => {
  const { title = '', content = '', type = 'DROP', tags = [] } = note;
  return (
    <Wrapper>
      {type === 'POST' && <h3 className="title">{title}</h3>}
      <div className="content" dangerouslySetInnerHTML={{ __html: marked(content) }}></div>
      <div className="tags">
        {tags.map((tag, index) => <Tag key={index}>{tag.toUpperCase()}</Tag>)}
      </div>
    </Wrapper>
  )
};

export default NoteView;
