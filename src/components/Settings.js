import React from 'react'
import { Drawer } from 'antd';
import { connect } from 'react-redux';
import { toggleSettingsDrawer } from '../store/actions';

const Settings = ({ settings, settingsDrawerVisibility, dispatch }) => {
  const handleClose = () => dispatch(toggleSettingsDrawer(false));
  return (
    <Drawer
      title="Settings"
      placement="bottom"
      closable={true}
      onClose={handleClose}
      visible={settingsDrawerVisibility}
    >
      <section>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </section>
    </Drawer>
  );
}

const mapStateToProps = ({ settings, settingsDrawerVisibility }) => ({ settings, settingsDrawerVisibility })

export default connect(mapStateToProps)(Settings);
