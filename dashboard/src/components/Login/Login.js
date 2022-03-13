import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./Login.module.css";
import { Button, Card, CardActions, CardContent, TextField, Typography } from "@mui/material";

const Login = ({ onLoginResult }) => {
  const [loginMessage, setLoginMessage] = useState("---");

  return (
    <div className={styles.Login}>
      <Card variant="outlined" sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography variant="h5" color="text.primary" gutterBottom>
            Login
          </Typography>
          <TextField id="standard-basic" label="Username" variant="standard" sx={{ margin: 1 }} />
          <TextField id="standard-basic" label="Password" variant="standard" sx={{ margin: 1 }} />
        </CardContent>
        <CardActions>
          <Button
            variant="outlined"
            onClick={async () => {
              const resp = await doLogin();
              console.log("doLogin responsed");
              setLoginMessage("login successful");
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

const doLogin = async () => {
  console.log("trying fetch");
  const response = await (await fetch("/api/users")).json();
  console.log(response);
  return true;
};

Login.propTypes = {
  onLoginResult: PropTypes.func.isRequired,
};

Login.defaultProps = {};

export default Login;
