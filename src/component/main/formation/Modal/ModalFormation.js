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
import PartieBRS from './children/brs/PartieBRS';
import CommentIcon from '@material-ui/icons/Comment';
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
        width: '90%',
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
    },
    titleModalBtn: {
        display: 'flex',
        alignItems: 'center',
    },
    spinnerBtn: {
        color: "#fff",
    },
    body: {
        maxHeight: '80vh',
        overflowY: 'scroll',
    },
    bodyMain: {
        padding: theme.spacing(2, 1, 2, 0),
    }
}));

export default function ModalCreateSol(props) {
    const classes = useStyles();
    const [isSubmit, setIsSubmit] = useState(); // Gestion des erreurs (champs vide)

    useEffect(() => {
        setIsSubmit(false)
    }, [props])

    const handleSubmit = (newFormFromOther) => {
        setIsSubmit(true)
        props.updateFormation.id === ''
            ? props.handleSaveFormation(newFormFromOther)
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
    console.log(props.sollicitation)
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
                                        ? "Ajouter une "
                                        : "Détail de la "}
                                    formation
                                </h2>
                            </div>
                            {/* {(props.updateFormation.id !== '') && <Stepper />} */}
                            <div className={classes.titleModalBtn}>

                                {/* <Tooltip title="Ajouter un commentaire" aria-label="comm" classes={{ tooltip: classes.tooltip }}> */}
                                    <IconButton disabled aria-label="close" color="primary" onClick={() => console.log('Créer un comm')}>
                                        <CommentIcon />
                                    </IconButton>
                                {/* </Tooltip> */}
                                <Tooltip title="Fermer" aria-label="close" classes={{ tooltip: classes.tooltip }}>
                                    <IconButton aria-label="close" color="primary" onClick={props.handleCloseModal}>
                                        <CloseRoundedIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>
                        <div className={`${classes.body} scrollBar-personnalize`}>
                            <div className={classes.bodyMain}>
                                <Formulaire
                                    isSubmit={isSubmit}
                                    handleIsSubmitting={handleIsSubmitting}
                                    updateFormation={props.updateFormation}
                                    handleCloseModal={props.handleCloseModal}
                                    lotList={props.lotList}
                                    dispositifList={props.dispositifList}
                                    agence_refList={props.agence_refList}
                                    catalogueList={props.catalogueList}
                                    communeList={props.communeList}
                                    handleSubmit={handleSubmit}
                                    sollicitation={props.sollicitation}
                                    createNewFormationFromThis={props.createNewFormationFromThis}
                                    handleChangeFormation={props.handleChangeFormation}
                                />
                                {/* Aficher seulement si updateFormation.id !== '' ? */}
                                {(props.updateFormation.id !== '' && props.attributaireList.length > 0)
                                    ? <>
                                        <Sollicitation
                                            attributaireList={props.attributaireList}
                                            updateFormation={props.updateFormation}
                                            handleCreateSollicitation={props.handleCreateSollicitation}
                                            handleSubmitSol={props.handleSubmitSol}
                                            isSubmittingSol={props.isSubmittingSol}
                                            sollicitationList={props.sollicitationList}
                                            handleResponseSollicitation={props.handleResponseSollicitation}
                                            handlAddIcop={props.handlAddIcop}
                                            icopList={props.icopList}
                                            lieuExecutionList={props.lieuExecutionList}
                                            handleChangeSollicitation={props.handleChangeSollicitation}
                                            sollicitation={props.sollicitation}
                                            handleValideSollicitation={props.handleValideSollicitation}
                                            user={props.user}
                                        />
                                        {props.sollicitation.dateValidationDT &&
                                            <PartieBRS
                                                updateFormation={props.updateFormation}
                                                handleChangeFormation={props.handleChangeFormation}
                                                handleCancelSollicitation={props.handleCancelSollicitation}
                                                handleValideSollicitation={props.handleValideSollicitation}
                                                sollicitation={props.sollicitation}
                                                handleEditFormation={props.handleEditFormation}
                                                user={props.user}
                                            />}
                                    </>
                                    : <p>Pas d'OF attaché à la formation</p>
                                }
                            </div>
                        </div>
                    </div>
                </Fade>
            </Modal>
        </div >
    );
}
