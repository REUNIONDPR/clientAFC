
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { green, red } from '@material-ui/core/colors';

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
    red: {
        color: '#fff',
        backgroundColor: red[500],
    },
    attributaireDestinataire: {
        whiteSpace: 'nowrap',
    },
    attributaireStatus: {
        margin: 0,
        fontWeight: 'bold',
        display: 'block',
    },
    errorMsg:{
        color: 'red',
    },
    valideMsg:{
        color: 'green',
    },
    SollMsg:{
        color: 'blue',
    },
}));

export default function SollicitationListAttr(props) {
    const classes = useStyles();
    
    return (
        <div key={'divList_' + props.data.priorite}>
            <ListItem disabled={props.data.disabled} button alignItems="flex-start" 
                key={'ListItem_' + props.data.libelle} onClick={() => props.handleChangeSollicitationSelected(props.data.id)}>
                <ListItemAvatar key={'ListItemAvatar_' + props.data.priorite}>
                    {props.data.disabled
                        ? <Avatar key={'avatar' + props.data.priorite}>{props.data.priorite}</Avatar>
                        : (props.data.etat > 3 && props.data.etat !== 20) // Si l'OF a accepté la sol
                                ? <Avatar className={classes.green}
                                    key={'avatar' + props.data.priorite}>
                                    <CheckIcon />
                                </Avatar>
                                : props.data.etat === 3 // Si l'OF a refusé la sol
                                    ? <Avatar className={classes.red}
                                        key={'avatar' + props.data.priorite}>
                                        <ClearIcon />
                                    </Avatar>
                                    : <Avatar className={classes.avatar} // Si l'OF a pas encore répondu
                                        key={'avatar' + props.data.priorite}>
                                        {props.data.priorite}
                                    </Avatar>
                            // : <Avatar className={classes.avatar} // Prochain OF à contacter
                            //     key={'avatar' + props.data.priorite}>
                            //     {props.data.priorite}
                            // </Avatar>
                    }
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
                            {props.data.text &&
                                <span className={ `${classes.attributaireStatus} 
                                    ${props.data.texterror === undefined 
                                        ? classes.SollMsg 
                                        : props.data.texterror 
                                            ? classes.errorMsg 
                                            : classes.valideMsg} ` }>
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