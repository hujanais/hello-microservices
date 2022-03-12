import React from 'react';
import PropTypes from 'prop-types';
import styles from './Login.module.css';
import { Button, Card, CardActions, CardContent, TextField, Typography } from '@mui/material';

const Login = ({onLoginResult}) => (

  <div className={styles.Login}>
   <Card variant="outlined" sx={{ minWidth: 275 }}>
   <CardContent>
   <Typography variant='h5' color="text.primary" gutterBottom>
        Login
      </Typography>
        <TextField id="standard-basic" label="Username" variant="standard" sx={{margin:1}}/>
        <TextField id="standard-basic" label="Password" variant="standard" sx={{margin:1}} />
      </CardContent>
      <CardActions>
          <Button variant="outlined" onClick={() => {
            const resp = doLogin();
            onLoginResult(resp)
            }}>Login</Button>
      </CardActions>
   </Card>
  </div>
);

const doLogin = () => {
  console.log('doLogin')
  return true;
};

Login.propTypes = {
  onLoginResult: PropTypes.func.isRequired
};

Login.defaultProps = {
};

export default Login;
