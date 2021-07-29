import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  main: {
    overflow: 'hidden',
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '2%',
    [theme.breakpoints.up(600)]:{
      width: '60%',
    },
    [theme.breakpoints.up(1200)]:{
      width: '60%',
    },
    [theme.breakpoints.up(1600)]:{
      width: '50%',
    },
  }
}));


export default function Main(props) {

  const classes = useStyles();

  return (
    <div className={classes.main}>
      <Grid>
        {props.children}
      </Grid>
    </div>
  )
};