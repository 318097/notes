import React, { useState } from "react";
import { Input, Button, message } from "antd";

import { auth, createNewFirebaseUser } from '../firebase';
import { StyledSection } from '../styled';

const initialState = {
  name: "",
  password: "",
  email: "",
};

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialState);

  const handleInput = key => ({ target: { value } }) => setForm(data => ({ ...data, [key]: value }));

  const handleSignup = async () => {
    try {
      setLoading(true);
      const { email, password, name } = form;
      const { user } = await auth.createUserWithEmailAndPassword(email, password);
      user.updateProfile({
        displayName: name
      });

      const { uid } = user;
      await createNewFirebaseUser({
        email, uid, name
      });
    } catch (err) {
      const { code } = err;
      if (code === 'auth/email-already-in-use')
        message.error('This email id already exists.');
    } finally {
      setLoading(true);
    }
  };

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
        <Button
          type="primary"
          onClick={handleSignup}
          loading={loading}
        >
          Sign-up
          </Button>
      </form>
    </StyledSection>
  );
}

export default Signup;
