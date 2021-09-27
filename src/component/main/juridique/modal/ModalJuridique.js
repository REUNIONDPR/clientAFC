import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import { Tooltip } from '@material-ui/core';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import TextField from '@material-ui/core/TextField';
import { codeToName } from '../../../../utilities/Function';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid',
        borderColor: theme.palette.primary.main,
        boxShadow: theme.shadows[5],
        paddingLeft: theme.spacing(3),
        width: '90%',
        maxHeight: '90%',
        // overflow: 'scroll',
    },
    tooltip: {
        fontSize: '15px',
        maxWidth: 'none',
    },
    titleModal: {
        height: '10vh',
        borderBottom: '2px solid',
        borderColor: theme.palette.primary.main,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleModalBtn: {
        display: 'flex',
        alignItems: 'center',
    },
    body: {
        maxHeight: '80vh',
        overflowY: 'scroll',
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(2),
        }
    },
    btnDelete:{
        display: 'flex',
        width: '500px',
        alignContent: 'flex-start',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
}))
export default function ModalJuridique(props) {
    const classes = useStyles();
    const [deleteItem, setDeleteItem] = useState(false);

    const isNumber = (field) => {
        switch (field) {
            case 'n_marche': return true;
            case 'siret': return true;
            case 'telephone': return true;
            case 'telephone2': return true;
            case 'cp': return true;
            default: return false;
        }
    }

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={props.openModal}
            onClose={() => props.handleOpenModal(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={props.openModal}>
                <div className={classes.paper}>
                    <div className={classes.titleModal}>
                        <div>
                            <h2 id="transition-modal-title">
                                {props.updateData.id === '' || props.updateData.id === 0
                                    ? "Ajouter un "
                                    : "Modifier un "}
                                {codeToName(props.baseSelected)}
                            </h2>
                        </div>

                        <div className={classes.titleModalBtn}>
                            {props.updateData.id !== '' && (
                                deleteItem
                                    ? <div className={classes.btnDelete}>
                                        <span>Etes vous sur ? </span>
                                        <Button variant="contained" color="secondary" onClick={() => setDeleteItem(false)}>Annuler</Button>
                                        <Button variant="contained" color="primary" onClick={props.handleDelete}>Oui, supprimer!</Button>
                                    </div>
                                    : <Tooltip title="Attention ! Supprimer un élément peux avoir des réactions en chaines." aria-label="delete" classes={{ tooltip: classes.tooltip }}>
                                        <IconButton aria-label="delete" color="primary" onClick={() => setDeleteItem(true)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>)}
                            <Tooltip title="Fermer" aria-label="close" classes={{ tooltip: classes.tooltip }}>
                                <IconButton aria-label="close" color="primary" onClick={() => props.handleOpenModal(false)}>
                                    <CloseRoundedIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>

                    <div className={`${classes.body} scrollBar-personnalize`}>
                        {Object.entries(props.updateData).filter(([k, v]) => k !== 'id').map(([k, v]) => (
                            isNumber(k)
                                ? <TextField required type="number" size="small" label={codeToName(k)} variant="outlined"
                                    key={k}
                                    error={v === '' ? true : false}
                                    value={v}
                                    name={k}
                                    onChange={props.handleChangeUpdateData} />
                                : <TextField required type="text" size="small" label={codeToName(k)} variant="outlined"
                                    key={k}
                                    error={v === '' ? true : false}
                                    value={v}
                                    multiline
                                    name={k}
                                    onChange={props.handleChangeUpdateData} />

                        ))}
                        <Button disabled={Object.entries(props.updateData).filter(([k, v]) => k !== 'id' && v === '').length > 0} variant="contained" color="primary" onClick={props.handleValideUpdateData}>Enregistrer</Button>
                    </div>



                </div>
            </Fade>
        </Modal>
    )
}