import { Icon } from "antd";
import styled from "styled-components";
import colors from "@codedrops/react-ui";

const StyledIcon = styled(Icon)`
  margin: 0 3px;
  transition: 0.6s;
  background: #e6e3e3;
  cursor: pointer;
  border-radius: 50%;
  padding: 5px;
  &:hover {
    background: lightgrey;
    transform: scale(1.2);
  }
`;

const ProfileIcon = styled.div`
  margin: 0 3px;
  padding: 0;
  cursor: pointer;
  transition: 0.6s;
  height: 24px;
  width: 24px;
  display: inline-block;
  overflow: hidden;
  border-radius: 50%;
  position: absolute;
  right: -8px;
  img {
    width: 100%;
  }
`;

const StyledSection = styled.section`
  margin: 0 auto;
  max-width: 275px;
  padding: 50px 15px;
  text-align: center;
  background: ${colors.bg};
  border: 1px solid ${colors.strokeOne};
  h3 {
    font-size: 1.4rem;
    text-align: center;
    text-transform: uppercase;
    margin-bottom: 30px;
  }
  button {
    margin: 5px 5px 0 0;
  }
`;

const MessageWrapper = styled.div`
  font-size: 3.6rem;
  text-align: center;
  color: lightgrey;
  font-weight: bold;
  text-transform: uppercase;
`;

export { StyledIcon, ProfileIcon, StyledSection, MessageWrapper };
