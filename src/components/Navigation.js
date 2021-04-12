import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Divider } from "antd";
import colors from "@codedrops/react-ui";
import { Icon as AntIcon } from "antd";
import { withRouter } from "react-router-dom";
import {
  logout,
  toggleSettingsDrawer,
  setModalMeta,
  setQuickAddModalMeta,
} from "../store/actions";

const StyledNavigation = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: ${colors.bar};
  padding: 10px;
  .app-name {
    color: ${colors.chrome};
    font-size: 2.6rem;
    position: relative;
    top: -6px;
    left: 1px;
    transition: 0.6s;
    &:hover {
      color: ${colors.steel};
    }
  }
  nav {
    display: flex;
    flex-direction: column;
    .ant-icon {
      color: ${colors.chrome};
      height: 24px;
      width: 24px;
      font-size: 20px;
      transition: 0.6s;
      margin-top: 10px;
      &.active,
      &:hover {
        color: ${colors.orange};
      }
    }
  }
`;

const navItems = [
  {
    type: "home",
    key: "home",
  },
  {
    type: "line-chart",
    key: "stats",
  },
  {
    type: "divider",
  },
  {
    type: "plus",
    key: "add",
  },
  {
    type: "fire",
    key: "quick-add",
  },
  {
    type: "upload",
    key: "upload",
  },
  {
    type: "divider",
  },
  {
    type: "setting",
    key: "setting",
  },
  {
    type: "logout",
    key: "logout",
  },
];

const Navigation = ({
  logout,
  toggleSettingsDrawer,
  setModalMeta,
  setQuickAddModalMeta,
  history,
  session,
  activePage,
}) => {
  if (!session) return null;

  const handleNavigation = (key) => {
    switch (key) {
      case "home":
      case "stats":
      case "upload":
        history.push(`/${key}`);
        break;
      case "add":
        setModalMeta({ visibility: true });
        break;
      case "quick-add":
        setQuickAddModalMeta({ visibility: true });
        break;
      case "setting":
        toggleSettingsDrawer(true);
        break;
      case "logout":
        logout();
        break;
      default:
        return;
    }
  };

  return (
    <StyledNavigation>
      <div className="app-name">N</div>
      <nav>
        {navItems.map(({ type, key }, idx) => {
          if (type === "divider") return <Divider key={`divider-${idx}`} />;
          return (
            <AntIcon
              className={`ant-icon ${activePage === key ? "active" : ""}`}
              type={type}
              key={key}
              onClick={() => handleNavigation(key)}
            />
          );
        })}
      </nav>
    </StyledNavigation>
  );
};

const mapStateToProps = ({ session, activePage }) => ({
  session,
  activePage,
});

const mapDispatchToProps = {
  logout,
  toggleSettingsDrawer,
  setModalMeta,
  setQuickAddModalMeta,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Navigation)
);
