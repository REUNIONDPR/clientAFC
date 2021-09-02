import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  main: {
    overflow: 'hidden',
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    [theme.breakpoints.down(1400)]:{
      width: '75%',
    },
  },
  grid:{
    marginTop: 20,
  }
}));


export default function Main(props) {

  const classes = useStyles();

  return (
    <div className={classes.main}>
      <Grid className={classes.grid}>
        {props.children}
      </Grid>
    </div>
  )
};