import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import { Tooltip } from '@material-ui/core';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
// import Stepper from './Stepper';
import Formulaire from './children/Formulaire';
import Sollicitation from './children/sollicitation/Sollicitation';
import PartieBRS from './children/PartieBRS';
import PartieDPSR from './children/PartieDPSR';
import Commentaire from '../../../global/commentaire/Commentaire';
import CardSkeleton from './children/sollicitation/card/CardSkeleton';
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
    flexCadre: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: theme.spacing(2)
    }
}));

export default function ModalCreateSol(props) {
    const classes = useStyles();
    const [isSubmit, setIsSubmit] = useState({ 
        formulaireSubmit:false, 
        formulaireCancel:false,
        responseSollicitation:false,
        createSol:false,
    }); // Gestion des spinner dans les boutons : 'Tu as bien appuyé sur le btn, je reflechi'

    useEffect(() => {
        setIsSubmit({...isSubmit, 
            formulaireSubmit:false, 
            formulaireCancel:false,
            responseSollicitation:false,
            createSol:false,
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])

    const handleSubmit = (newFormFromOther) => {
        setIsSubmit({...isSubmit, formulaireSubmit:true})

        props.updateFormation.id === ''
            ? props.handleSaveFormation(newFormFromOther)
            : props.handleEditFormation();
    }

    const handleIsSubmitting = () => {
        setIsSubmit(!isSubmit)
    }

    const handleCreateSollicitation = (sollicitation) => {
        setIsSubmit({...isSubmit, createSol:true});
        props.handleCreateSollicitation(sollicitation)
    }
    const handleCancelFormation = () => {
        setIsSubmit({...isSubmit, formulaireCancel:true});
        props.handleCancelFormation();
    }
    
    const handleResponseSollicitation = (response, sollicitation, reason) => {
        setIsSubmit({...isSubmit, responseSollicitation:true});
        props.handleResponseSollicitation(response, sollicitation, reason);
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
                                        ? "Ajouter une "
                                        : "Détail de la "}
                                    formation
                                </h2>
                            </div>
                            {/* {(props.updateFormation.id !== '') && <Stepper />} */}
                            <div className={classes.titleModalBtn}>
                                <Commentaire user={props.user} formation={props.updateFormation} />
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
                                    user={props.user}
                                    isSubmit={isSubmit}
                                    handleIsSubmitting={handleIsSubmitting}
                                    updateFormation={props.updateFormation}
                                    handleCloseModal={props.handleCloseModal}
                                    lotList={props.lotList}
                                    dispositifList={props.dispositifList}
                                    agence_refList={props.agence_refList}
                                    bassinList={props.bassinList}
                                    catalogueList={props.catalogueList}
                                    communeList={props.communeList}
                                    handleCancelFormation={handleCancelFormation}
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
                                            handleCreateSollicitation={handleCreateSollicitation}
                                            handleSubmitSol={props.handleSubmitSol}
                                            isSubmittingSol={isSubmit}
                                            sollicitationList={props.sollicitationList}
                                            handleResponseSollicitation={handleResponseSollicitation}
                                            handlAddIcop={props.handlAddIcop}
                                            icopList={props.icopList}
                                            lieuExecutionList={props.lieuExecutionList}
                                            handleChangeSollicitation={props.handleChangeSollicitation}
                                            sollicitation={props.sollicitation}
                                            handleValideSollicitation={props.handleValideSollicitation}
                                            user={props.user}
                                        />
                                        <div className={classes.flexCadre}>
                                            {props.sollicitation.date_ValidationDT &&
                                                <PartieBRS
                                                    updateFormation={props.updateFormation}
                                                    handleChangeFormation={props.handleChangeFormation}
                                                    handleValideSollicitation={props.handleValideSollicitation}
                                                    sollicitation={props.sollicitation}
                                                    changeNArticle={props.changeNArticle}
                                                    user={props.user}
                                                />}
                                            {(props.sollicitation.date_EditBRS && props.sollicitation.etat !== 10) &&
                                                <PartieDPSR
                                                    updateFormation={props.updateFormation}
                                                    handleChangeFormation={props.handleChangeFormation}
                                                    handleValideSollicitation={props.handleValideSollicitation}
                                                    sollicitation={props.sollicitation}
                                                    handleEditFormation={props.handleEditFormation}
                                                    handleSaveConv={props.handleSaveConv}
                                                    user={props.user}
                                                />}
                                        </div>
                                    </>
                                    : (props.updateFormation.id !== '' && props.attributaireList.length === 0)
                                    ? <CardSkeleton />
                                    : props.updateFormation.id !== '' && <p>Pas d'OF attaché à la formation</p>
                                }
                            </div>
                        </div>
                    </div>
                </Fade>
            </Modal>
        </div >
    );
}
