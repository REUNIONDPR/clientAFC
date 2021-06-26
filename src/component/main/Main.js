import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import NavbarV from '../global/Navbar/Navbar';
import Grid from '@material-ui/core/Grid';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
    backgroundColor: '#fff',
    position:'relative',
    height:'100vh',
  },
  main:{
    overflow:'hidden',
    width: '70%',
    marginLeft: 'auto',
    marginRight: 'auto',
  }
}));


export default function Main(props){
  
  const classes = useStyles();
  
  return (
    <>
      <div className={classes.drawer}>
          <NavbarV/>
      </div>
      <div className={classes.main}>
        <Grid>
          {props.children}
        </Grid>
      </div>
    </>
  )
};