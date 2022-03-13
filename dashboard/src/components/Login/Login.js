import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./Login.module.css";
import { Button, Card, CardActions, CardContent, TextField, Typography } from "@mui/material";

const Login = ({ onLoginResult }) => {
  const [loginMessage, setLoginMessage] = useState("---");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={styles.Login}>
      <Card variant="outlined" sx={{ width: 275 }}>
        <CardContent>
          <Typography variant="h5" color="text.primary" gutterBottom>
            Login via Auth-API
          </Typography>
          <TextField
            id="standard-basic"
            label="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            variant="standard"
            sx={{ margin: 1 }}
          />
          <TextField
            id="standard-basic"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="standard"
            sx={{ margin: 1 }}
          />
        </CardContent>
        <CardActions>
          <Button
            variant="outlined"
            onClick={async () => {
              const resp = await doLogin(username, password);
              if (resp.isSuccess) {
                setLoginMessage("login successful");
              } else {
                setLoginMessage("login failed.");
              }
              onLoginResult(resp);
            }}
          >
            Login
          </Button>
          <div style={{ marginLeft: 10, fontSize: 18 }}>{loginMessage}</div>
          <Typography color="text.secondary"></Typography>
        </CardActions>
      </Card>
    </div>
  );
};

/**
 * login via authentication server
 * @param {*} username
 * @param {*} password
 * @returns {isSuccess: boolean, jwtToken: string}
 */
const doLogin = async (username, password) => {
  console.log("trying fetch");

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ Username: username, Password: password }),
  };

  const response = await fetch("/api/users", requestOptions);
  console.log(response);
  if (response.status !== 200) {
    return { isSuccess: false, jwtToken: null };
  }
  const jwtToken = await response.json();
  console.log(jwtToken.jwt);
  return { isSuccess: true, jwtToken: jwtToken.jwt };
};

Login.propTypes = {
  onLoginResult: PropTypes.func.isRequired,
};

Login.defaultProps = {};

export default Login;
