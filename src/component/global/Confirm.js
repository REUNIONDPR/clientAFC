import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import { codeToName, dateFormat } from '../../utilities/Function';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    value:{
        display:'flex',
        alignItems: 'flex-start',
        '& > *':{
            marginRight:theme.spacing(2),
        },
    },
}));

export default function Confirm(props) {
    const classes = useStyles();
    const { handleClose, handleValide, open } = props;
    
    const handleCancel = () => {
        handleClose();
    };

    const handleOk = () => {
        handleValide();
    };

    return (
        <Dialog
            maxWidth="xs"
            aria-labelledby="confirmation-dialog-title"
            open={open}
        >
            <DialogTitle id="confirmation-dialog-title">Demande de confirmation</DialogTitle>
            <DialogContent dividers>
                <p>Confirmez-vous la modification ?</p>
                <div className={classes.value}>
                    <div>{codeToName(props.value.key)} : </div>
                    <div>{(props.value.key && props.value.key.includes('date')) 
                        ? props.value.value_old ? dateFormat(props.value.value_old) : 'Aucune date' 
                        : props.value.value_old }</div>
                    <div><ArrowRightAltIcon /></div>
                    <div>{(props.value.key && props.value.key.includes('date')) 
                        ? props.value.value_new ? dateFormat(props.value.value_new) : 'Aucune date' 
                        : props.value.value_new }</div>
                </div>
                <p>Les OF devront être à nouveau sollicités. </p>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel} color="primary">
                    Non
                </Button>
                <Button onClick={handleOk} variant="contained" color="primary">
                    Oui
                </Button>
            </DialogActions>
        </Dialog>
    );
}
