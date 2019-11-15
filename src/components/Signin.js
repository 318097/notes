import React, { useState } from "react";
import { Input, Button, Icon } from "antd";

import { auth, signInWithGoogle } from '../firebase';
import { StyledSection } from '../styled';

const initialState = {
  password: "",
  email: "",
};

const Signin = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialState);

  const handleInput = key => ({ target: { value } }) => setForm(data => ({ ...data, [key]: value }));

  const handleSignin = async () => {
    setLoading(true);
    const { email, password } = form;
    const result = await auth.signInWithEmailAndPassword(email, password);
    setLoading(false);
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
        <Button
          type="primary"
          onClick={handleSignin}
          loading={loading}
        >
          Sign-in
          </Button>

        <Button
          onClick={signInWithGoogle}>
          Sign in
          <Icon type="google" />
        </Button>
      </form>
    </StyledSection>
  );
}

export default Signin;
