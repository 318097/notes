import React, { useState, useEffect } from "react";
import { Input, Button, message } from "antd";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { setSessionInStorage } from "../authService";
import { StyledSection } from "../styled";
import { setSession } from "../store/actions";
import { connect } from "react-redux";

const initialState = {
  password: "",
  username: "",
};

const Signin = ({ history, setSession, session }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (session && session.loggedIn) history.push("/");
  }, []);

  const handleInput = (key) => ({ target: { value } }) =>
    setForm((data) => ({ ...data, [key]: value }));

  const handleSignin = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/auth/login", form);

      setSessionInStorage(data);
      await setSession({
        loggedIn: true,
        info: "LOGIN",
        ...data,
      });
      axios.defaults.headers.common["authorization"] = data.token;
      setTimeout(() => history.push("/"), 400);
    } catch (err) {
      const { response: { data: errorMessage = "Error." } = {} } = err;
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledSection id="signin" className="curve-border-1">
      <h3>Signin</h3>
      <form>
        <Input
          className="mb"
          value={form.username}
          onChange={handleInput("username")}
          placeholder="Username"
        />
        <Input.Password
          className="mb"
          value={form.password}
          onChange={handleInput("password")}
          placeholder="Password"
          onPressEnter={handleSignin}
        />
        <br />
        <Button onClick={handleSignin} loading={loading}>
          Sign in
        </Button>

        <Button onClick={() => history.push("/signup")}>Sign up</Button>
      </form>
    </StyledSection>
  );
};

const mapStateToProps = ({ session }) => ({
  session,
});

export default connect(mapStateToProps, { setSession })(withRouter(Signin));
