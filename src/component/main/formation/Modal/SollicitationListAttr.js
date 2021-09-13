
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import CheckIcon from '@material-ui/icons/Check';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    tooltip: {
        fontSize: '15px',
        maxWidth: 'none',
    },
    icon: {
        fill: '#777777',
        cursor: 'default',
    },
    avatar: {
        color: theme.palette.getContrastText(theme.palette.secondary.main),
        backgroundColor: theme.palette.secondary.main,
    },
    green: {
        color: '#fff',
        backgroundColor: green[500],
    },
    blockSolAttr: {
        display: 'flex',
        alignItems: 'center',
    },
    blockAttributaire: {
        // width: '40%',
    },
    blockSollicitation: {
        width: '60%',
        display: 'flex',
        justifyContent: 'center',
    },
    listAttributaire: {
        padding: 0,
        border: '1px solid #e0e0e0',
    },
    spinnerBtn: {
        color: "#fff",
    },
    attributaireDestinataire: {
        whiteSpace: 'nowrap',
    },
    attributaireStatus: {
        margin: 0,
        display: 'block',
        color: 'red',
    }
}));

export default function SollicitationListAttr(props) {
    const classes = useStyles();
    
    return (
        <div key={'divList_' + props.data.priorite}>
            <ListItem disabled={props.data.disabled} button alignItems="flex-start" key={'ListItem_' + props.data.libelle}>
                <ListItemAvatar key={'ListItemAvatar_' + props.data.priorite}>
                    <Avatar className={props.data.disabled 
                            ? '' 
                            : (props.data.sol && props.data.sol.etat === 2)
                                ? classes.green
                                : classes.avatar} 
                        key={'avatar' + props.data.priorite}>
                        {(props.data.sol && props.data.sol.etat === 2)
                            ? <CheckIcon />
                            : props.data.priorite}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText key={'ListItemText_' + props.data.priorite}
                    primary={props.data.libelle}
                    secondary={

                        <>
                            <Typography
                                component="span"
                                variant="body2"
                                className={classes.attributaireDestinataire}
                                color="textPrimary">
                                {`${props.data.destinataire} — ${props.data.destinataireMail}`}
                            </Typography>
                            {props.data.disabled &&
                                <span className={classes.attributaireStatus}>
                                    {props.data.text} {(props.data.sol && props.data.sol.information) && ' : ' + props.data.sol.information}
                                </span>}
                        </>

                    }
                />
            </ListItem>
            {/* <Divider variant="inset" component="li" key={'divider_' + props.data.priorite} /> */}
        </div>
    )
}