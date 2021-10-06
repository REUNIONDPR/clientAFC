import { Button, makeStyles, Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    container: {
        padding:theme.spacing(2),
        marginTop: '30vh',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '30vw',
        '& > *':{
            margin:theme.spacing(2)
        }
    },
    body:{
        textAlign:'center',
    }
}))

export default function Unauthorized() {
    const classes = useStyles();

    return (
        <Paper className={classes.container}>
            <div className={classes.body}>Oups, la page n'éxiste pas.</div>
            <div className={classes.body}><Button variant='contained' href="/formation" color="primary">Redirection</Button> </div>
        </Paper>
    )
}