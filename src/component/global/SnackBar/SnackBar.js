import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function CustomizedSnackbars(props) {
  const {open}  =  props;
  const {message}  = props;
  const {handleClose} = props;
  const {severity} = props;    

  return (
    <div>
      <Snackbar anchorOrigin={{ vertical:'top', horizontal:'right' }} open={open} autoHideDuration={2000}>
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
