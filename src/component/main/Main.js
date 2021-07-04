import React from 'react';
// { useContext, useEffect, useState }
import { makeStyles } from '@material-ui/core/styles';
import NavbarV from '../global/Navbar/Navbar';
import Grid from '@material-ui/core/Grid';
// import { SocketContext } from '../../context/socket.context';
// import SnackBar from '../global/SnackBar/SnackBar';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
    backgroundColor: '#fff',
    position: 'relative',
  },
  main: {
    overflow: 'hidden',
    width: '70%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '2%'
  }
}));


export default function Main(props) {

  const classes = useStyles();
  // const [openSnackBar, setOpenSnackBar] = useState(false);
  // const [messageSnackBar, setMessageSnackBar] = useState('');
  // const [severity, setSeverity] = useState('success');
  // const { socket } = useContext(SocketContext);

  // const handleClose = () => {
  //   setOpenSnackBar(false);
  // }

  // useEffect(() => {
  //   socket.on('etatConnection', (data) => {
  //     setOpenSnackBar(true);
  //     setMessageSnackBar(data.message);
  //     setSeverity(data.severity);
  //   })
  // }, [socket])

  return (
    <>
      {/* <SnackBar open={openSnackBar}
        message={messageSnackBar}
        handleClose={handleClose}
        severity={severity}
      /> */}
      <div className={classes.drawer}>
        <NavbarV />
      </div>
      <div className={classes.main}>
        <Grid>
          {props.children}
        </Grid>
      </div>
    </>
  )
};