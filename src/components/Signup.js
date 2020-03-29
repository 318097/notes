import React, { useState } from "react";
import { Input, Button, message } from "antd";
import { withRouter } from "react-router-dom";

import { StyledSection } from "../styled";
const initialState = {
  name: "",
  password: "",
  email: ""
};

const Signup = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialState);

  const handleInput = key => ({ target: { value } }) =>
    setForm(data => ({ ...data, [key]: value }));

  const handleSignup = async () => {};

  return (
    <StyledSection>
      <h3>Signup</h3>
      <form>
        <Input
          value={form.name}
          onChange={handleInput("name")}
          placeholder="Name"
        />
        <Input
          value={form.email}
          onChange={handleInput("email")}
          placeholder="Email"
        />
        <Input.Password
          value={form.password}
          onChange={handleInput("password")}
          placeholder="Password"
          onPressEnter={handleSignup}
        />
        <br />
        <Button type="primary" onClick={handleSignup} loading={loading}>
          Sign up
        </Button>
      </form>
    </StyledSection>
  );
};

export default withRouter(Signup);
