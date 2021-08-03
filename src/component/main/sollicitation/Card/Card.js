
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles({
    root: {
        width: '30%',
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 16,
    },
    number: {
        fontSize: 56,
        textAlign: 'center',
        color: '#000',
    },
    cardAction: {
        display: 'flex',
        padding: 8,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    contentCard: {
        padding: 8,
    },
    boxCard:{
        display:'flex',
        justifyContent:'space-around',
        paddingBottom: 8,
    }
});

export default function CardPersonnalize(props) {
    const classes = useStyles();

    return (
        <Card className={classes.root} >
            <div className={classes.contentCard}>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    {props.title}
                </Typography>
                <Typography className={classes.number} color="textSecondary">
                    {props.number}
                </Typography>
            </div>
            <Box className={classes.boxCard}>
                <Button onClick={props.handleClick} variant={props.selected ? "contained" : 'outlined'} color="secondary">
                    Voir
                </Button>
            </Box>
        </Card>
    );
}