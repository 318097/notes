import React, { useState, useEffect } from "react";
import { Input, Button, message } from "antd";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { setLocalSession, isLoggedIn } from "../authService";
import { StyledSection } from "../styled";
import { setSession } from "../store/actions";

const initialState = {
  password: "",
  username: ""
};

const Signin = ({ history, dispatch }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (isLoggedIn()) history.push("/");
  }, []);

  const handleInput = key => ({ target: { value } }) =>
    setForm(data => ({ ...data, [key]: value }));

  const handleSignin = async () => {
    setLoading(true);
    try {
      const {
        data: { token, user }
      } = await axios.post("/auth/login", form);

      setLocalSession({ ...user, token });

      dispatch(setSession({ loggedIn: true, info: "LOGIN" }));
      history.push("/");
    } catch (err) {
      const { response: { data: errorMessage = "Error." } = {} } = err;
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledSection>
      <h3>Signin</h3>
      <form>
        <Input
          value={form.username}
          onChange={handleInput("username")}
          placeholder="Username"
        />
        <Input.Password
          value={form.password}
          onChange={handleInput("password")}
          placeholder="Password"
          onPressEnter={handleSignin}
        />
        <br />
        <Button type="primary" onClick={handleSignin} loading={loading}>
          Sign in
        </Button>

        <Button type="danger" onClick={() => history.push("/signup")}>
          Sign up
        </Button>
      </form>
    </StyledSection>
  );
};

export default withRouter(Signin);
