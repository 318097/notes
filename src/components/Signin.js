import React, { useState } from "react";
import { Input, Button, Icon, Divider } from "antd";
import { withRouter } from "react-router-dom";

import { auth, signInWithGoogle } from "../firebase";
import { StyledSection } from "../styled";

const initialState = {
  password: "",
  email: ""
};

const Signin = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialState);

  const handleInput = key => ({ target: { value } }) =>
    setForm(data => ({ ...data, [key]: value }));

  const handleSignin = async () => {
    try {
      setLoading(true);
      const { email, password } = form;
      await auth.signInWithEmailAndPassword(email, password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledSection>
      <h3>Signin</h3>
      <form>
        <Input
          value={form.email}
          onChange={handleInput("email")}
          placeholder="Email"
        />
        <Input.Password
          value={form.password}
          onChange={handleInput("password")}
          placeholder="Password"
          onPressEnter={handleSignin}
        />
        <br />
        <Button ghost type="primary" onClick={handleSignin} loading={loading}>
          Sign in
        </Button>

        <Button onClick={signInWithGoogle}>
          Sign in
          <Icon type="google" />
        </Button>

        <Divider />

        <Button ghost type="danger" onClick={() => history.push("/signup")}>
          Sign up
        </Button>
      </form>
    </StyledSection>
  );
};

export default withRouter(Signin);
