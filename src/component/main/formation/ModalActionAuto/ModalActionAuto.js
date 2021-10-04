import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import { Tooltip } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/Inbox';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { dateCount } from '../../../../utilities/Function';
// import Stepper from './Stepper';
// import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tooltip: {
        fontSize: '15px',
        maxWidth: 'none',
    },
    icon: {
        fill: '#777777',
        cursor: 'default',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid',
        borderColor: theme.palette.primary.main,
        boxShadow: theme.shadows[5],
        paddingLeft: theme.spacing(3),
        width: '50%',
        maxHeight: '90%',
        // overflow: 'scroll',
    },
    titleModal: {
        height: '10vh',
        borderBottom: '2px solid',
        borderColor: theme.palette.primary.main,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing(1)
    },
    titleModalBtn: {
        display: 'flex',
        alignItems: 'center',
    },
    spinnerBtn: {
        color: "#fff",
    },
    body: {
        maxHeight: '75vh',
        overflowY: 'scroll',
    },
    bodyMain: {
        padding: theme.spacing(2, 1, 2, 0),
    },
    formCancel: {
        color: 'red',
        position: 'absolute',
        top: '40%',
        left: '30%',
        transform: 'rotate(-15deg)',
        fontSize: 35,
        border: '1px solid',
        padding: theme.spacing(2),
        backgroundColor: '#fff',
        zIndex: 999,
    },
    flexCadre: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: theme.spacing(2)
    },
    btnActionModal: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

export default function ModalCreateSol(props) {
    const classes = useStyles();

    const handleClose = () => {
        props.handleClose();
        props.handleCloseModal();
    }

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={props.openModal}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={props.openModal}>
                    <div className={classes.paper}>
                        <div className={classes.titleModal}>
                            <div><h2 id="transition-modal-title">Attention !</h2></div>
                            {/* {(props.updateFormation.id !== '') && <Stepper />} */}
                            <div className={classes.titleModalBtn}>
                                <Tooltip title="Fermer" aria-label="close" classes={{ tooltip: classes.tooltip }}>
                                    <IconButton aria-label="close" color="primary" onClick={handleClose}>
                                        <CloseRoundedIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>
                        <div className={`${classes.body} scrollBar-personnalize`}>
                            <span>
                                La sollicitation sur les formations suivantes sera automatiquement annulée car l'OF
                                n'a pas répondu dans le temps imparti.
                            </span>
                            <List component="nav" aria-label="main mailbox folders">
                                {props.formationListToCancel.map((v) => (
                                    <ListItem button key={v.id}>
                                        <ListItemIcon>
                                            <InboxIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={v.intitule} secondary={`${v.n_Article}. Aucune réponse depuis ${dateCount(new Date(v.dateMailOF), new Date(), true)} jours`} />
                                    </ListItem>
                                ))}
                            </List>
                            <div className={classes.btnActionModal}>
                                {props.isSubmit
                                    ? <Button onClick={props.handleIsSubmitting}
                                        variant="contained" color="primary" endIcon={<CircularProgress size={20} className={classes.spinnerBtn} />}>
                                        OK
                                    </Button>
                                    : <Button onClick={props.handleCloseModal} variant="contained" color="primary">
                                        OK
                                    </Button>}
                            </div>
                        </div>
                    </div>
                </Fade>
            </Modal>
        </div >
    );
}
