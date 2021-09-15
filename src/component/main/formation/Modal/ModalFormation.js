import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import { Tooltip } from '@material-ui/core';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
// import Stepper from './Stepper';
import Formulaire from './children/formation/Formulaire';
import Sollicitation from './children/sollicitation/Sollicitation';
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
        padding: theme.spacing(2, 4, 3),
        width: '90%',
    },
    titleModal: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    spinnerBtn: {
        color: "#fff",
    }
}));

export default function ModalCreateSol(props) {
    const classes = useStyles();
    const [isSubmit, setIsSubmit] = useState(); // Gestion des erreurs (champs vide)

    useEffect(() => {
        setIsSubmit(false)
    }, [props])

    const handleSubmit = () => {
        setIsSubmit(true)
        props.updateFormation.id === ''
            ? props.handleSaveFormation()
            : props.handleEditFormation();
        //   let action = dataRow.id === '' || dataRow.id === 0 ? 'create' : 'update';

        //   switch (action) {
        //     case 'create': props.handleSubmitClickToParent(row, action); break;
        //     case 'update': props.handleSubmitModalClick(row, action); break;
        //     default: props.handleErrorSubmit();
        //   }

    }

    const handleIsSubmitting = () => {
        setIsSubmit(!isSubmit)
    }
    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={props.openModal}
                onClose={props.handleCloseModal}
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
                                    {props.updateFormation.id === '' || props.updateFormation.id === 0
                                        ? "Ajouter une"
                                        : "Modifier la"}
                                    formation
                                </h2>
                            </div>
                            {/* {(props.updateFormation.id !== '') && <Stepper />} */}
                            <div>
                                {/* {(props.updateFormation.id === '' || props.updateFormation.id === 0)
                                    ? <Tooltip title="Fermer" aria-label="delete">
                                        <IconButton aria-label="close" color="primary" onClick={props.handleCloseModal}>
                                            <CloseRoundedIcon />
                                        </IconButton>
                                    </Tooltip>
                                    : <Tooltip title="Supprimer" aria-label="delete">
                                        <IconButton aria-label="delete" color="primary" onClick={() => props.handleDeleteClick(props.updateFormation)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                } */}
                                <Tooltip title="Fermer" aria-label="close">
                                    <IconButton aria-label="close" color="primary" onClick={props.handleCloseModal}>
                                        <CloseRoundedIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>

                        <Formulaire
                            isSubmit={isSubmit}
                            handleIsSubmitting={handleIsSubmitting}
                            updateFormation={props.updateFormation}
                            lotList={props.lotList}
                            dispositifList={props.dispositifList}
                            agence_refList={props.agence_refList}
                            catalogueList={props.catalogueList}
                            communeList={props.communeList}
                            handleSubmit={handleSubmit}
                            handleChangeFormation={props.handleChangeFormation}
                        />
                        {/* Aficher seulement si updateFormation.id !== '' ? */}
                        {(!props.createNewFormationFromThis && props.attributaireList.length > 0)
                            ? <Sollicitation
                                attributaireList={props.attributaireList}
                                updateFormation={props.updateFormation}
                                handleCreateSollicitation={props.handleCreateSollicitation}
                                handleSubmitSol={props.handleSubmitSol}
                                isSubmittingSol={props.isSubmittingSol}
                                sollicitationFormation={props.sollicitationFormation}
                                handleResponseSollicitation={props.handleResponseSollicitation}
                                handlAddIcop={props.handlAddIcop}
                            />
                            : <p>Pas d'OF attaché à la formation</p>}
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}
