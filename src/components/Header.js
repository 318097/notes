import React from 'react'
import styled from 'styled-components';

import AddNote from './AddNote';

const Container = styled.header`
  display: flex;
  background: #f7f7f7;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 10px;
  h3{
    flex: 1 1 70%;
    margin: 0;
    margin-left: 10px;
    text-transform: capatilize;
    font-weight: bold;
    vertical-align: center;
  }
`

const Header = () => {
  return (
    <Container>
      <h3>
        Notes
      </h3>
      <AddNote />
    </Container>
  )
}

export default Header
