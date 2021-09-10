import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { Tooltip } from '@material-ui/core';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import Stepper from './Stepper';
import SendIcon from '@material-ui/icons/Send';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import InputAdornment from '@material-ui/core/InputAdornment';
import { codeToName } from '../../../../utilities/Function';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

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
    blocFormFullWidth: {
        width: '100%',
        margin: theme.spacing(1),
        '& > *': {
            width: '100%',
        },
    },
    blocForm: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '& > *': {
            margin: theme.spacing(1),
            width: '100%',
        },
    },
    blocFormEnd: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid',
        borderColor: theme.palette.primary.main,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        width: '80%',
    },
    blockEndForm: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    btnActionModal: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    titleModal: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    blockDateINT_date: {
        display: 'flex',
        justifyContent: 'space-around',
    },
    msgError: {
        textAlign: 'center',
        color: 'red',
        fontStyle: 'italic',
        margin: 0,
        padding: 0,
    },
    avatar: {
        color: theme.palette.getContrastText(theme.palette.secondary.main),
        backgroundColor: theme.palette.secondary.main,
    },
    blockSolAttr: {
        display: 'flex',
        alignItems: 'center',
    },
    blockAttributaire:{
        width: '40%',
    },
    blockSollicitation: {
        width: '60%',
        display: 'flex',
        justifyContent: 'center',
    },
    listAttributaire: {
        border: '1px solid #e0e0e0',
    },
}));

export default function ModalCreateSol(props) {
    const classes = useStyles();
    const [isSubmit, setIsSubmit] = useState(); // Gestion des erreurs (champs vide)

    useEffect(() => {
        setIsSubmit(false)
    }, [props])

    const handleSubmit = () => {
        setIsSubmit(true)
        props.handleSaveFormation();
        //   let action = dataRow.id === '' || dataRow.id === 0 ? 'create' : 'update';

        //   switch (action) {
        //     case 'create': props.handleSubmitClickToParent(row, action); break;
        //     case 'update': props.handleSubmitModalClick(row, action); break;
        //     default: props.handleErrorSubmit();
        //   }

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
                            <div><h2 id="transition-modal-title">{props.updateFormation.id === '' || props.updateFormation.id === 0 ? "Ajouter une" : "Modifier la"} formation</h2></div>
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
                        <form noValidate autoComplete="off">
                            <div className={classes.blocForm}>
                                <FormControl size="small" variant="outlined"
                                    error={props.updateFormation.id_lot === 'all'}
                                    disabled={props.updateFormation.id !== ''}>
                                    <InputLabel>Lot</InputLabel>
                                    {props.lotList.length > 0 &&
                                        <Select
                                            value={props.updateFormation.id_lot}
                                            onChange={(e) => props.handleChangeFormation(e.target.name, e.target.value)}
                                            fullWidth
                                            name='id_lot'
                                            label='Lot *'
                                        >
                                            <MenuItem value="all">
                                                <em>Choisir</em>
                                            </MenuItem>
                                            {props.lotList.map((v) => (
                                                <MenuItem key={v.id + '_' + v.libelle} value={v.id}>{v.libelle}</MenuItem>
                                            ))}
                                        </Select>
                                    }
                                </FormControl>
                                <FormControl size="small" variant="outlined" error={props.updateFormation.id_cata === 'all' ? true : false}
                                    disabled={props.updateFormation.id_lot === 'all' || props.updateFormation.id !== ''}>
                                    <InputLabel>Catlogue</InputLabel>
                                    {props.catalogueList &&
                                        <Select
                                            value={props.catalogueList.length > 0 ? props.updateFormation.id_cata : 'all'}
                                            onChange={(e) => props.handleChangeFormation(e.target.name, e.target.value)}
                                            fullWidth
                                            name='id_cata'
                                            label='Catalogue *'
                                        >
                                            <MenuItem value="all">
                                                <em>Choisir</em>
                                            </MenuItem>
                                            {props.catalogueList.map((v) => (
                                                <MenuItem key={v.id + '_' + v.intitule_form_marche} value={v.id}>{v.intitule_form_marche}</MenuItem>
                                            ))}
                                        </Select>
                                    }
                                </FormControl>
                            </div>


                            {(props.updateFormation.id_lot !== 'all' && props.updateFormation.id_cata !== 'all') && <> <div className={classes.blocForm}>
                                <FormControl size="small" variant="outlined" error={props.updateFormation.id_commune === 'all' ? true : false}
                                    disabled={props.updateFormation.id_cata === 'all' ? true : false}>
                                    <InputLabel>Commune</InputLabel>
                                    {props.communeList &&
                                        <Select
                                            value={props.communeList.length > 0 ? props.updateFormation.id_commune : 'all'}
                                            onChange={(e) => props.handleChangeFormation(e.target.name, e.target.value)}
                                            fullWidth
                                            name='id_commune'
                                            label='Commune'
                                        // startAdornment={
                                        //     props.updateFormation.id !== '' &&
                                        //     <InputAdornment position="start">
                                        //         <ErrorOutlineIcon className={classes.icon} />
                                        //     </InputAdornment>
                                        // } 
                                        >
                                            <MenuItem value="all">
                                                <em>Choisir</em>
                                            </MenuItem>
                                            {props.communeList.map((v) => (
                                                <MenuItem key={v.id + '_' + v.libelle} value={v.id}>{v.libelle}</MenuItem>
                                            ))}
                                        </Select>
                                    }
                                </FormControl>

                                <FormControl size="small" variant="outlined" error={props.updateFormation.agence_ref === 'all' ? true : false}
                                    disabled={props.updateFormation.id_cata === 'all' ? true : false}>
                                    <InputLabel>Agence REF</InputLabel>
                                    {props.agence_refList &&
                                        <Select
                                            value={props.agence_refList.length > 0 ? props.updateFormation.agence_ref : 'all'}
                                            onChange={(e) => props.handleChangeFormation(e.target.name, e.target.value)}
                                            fullWidth
                                            name='agence_ref'
                                            label='Agence REF *'
                                        >
                                            <MenuItem value="all">
                                                <em>Choisir</em>
                                            </MenuItem>
                                            {props.agence_refList.map((v) => (
                                                <MenuItem key={v.id + '_' + v.libelle_ape} value={v.id}>{v.libelle_ape}</MenuItem>
                                            ))}
                                        </Select>
                                    }
                                </FormControl>

                                <TextField required type="number" size="small" label="Nombre de place" variant="outlined"
                                    disabled={props.updateFormation.id_commune === 'all'}
                                    error={props.updateFormation.nb_place === '' ? true : false}
                                    value={props.updateFormation.nb_place}
                                    onChange={(e) => props.handleChangeFormation('nb_place', e.target.value)}
                                // InputProps={
                                //     props.updateFormation.id !== '' && {
                                //         startAdornment: (
                                //             <InputAdornment position="start">
                                //                 <ErrorOutlineIcon className={classes.icon} />
                                //             </InputAdornment>),
                                //     }} 
                                />
                                <TextField required type="number" size="small" label="Vague" variant="outlined"
                                    disabled={props.updateFormation.id_commune === 'all'}
                                    error={props.updateFormation.vague === '' ? true : false}
                                    value={props.updateFormation.vague}
                                    onChange={(e) => props.handleChangeFormation('vague', e.target.value)} />
                            </div>

                                <div className={classes.blocForm}>

                                    <FormControl size="small" variant="outlined"
                                        disabled={props.updateFormation.id_commune === 'all'}>
                                        <InputLabel>Dispositif</InputLabel>
                                        {props.dispositifList &&
                                            <Select
                                                value={props.dispositifList.length > 0 ? props.updateFormation.dispositif : 'all'}
                                                onChange={(e) => props.handleChangeFormation(e.target.name, e.target.value)}
                                                fullWidth
                                                name='dispositif'
                                                label='Dispositif *'
                                            >
                                                <MenuItem value="all">
                                                    <em>Choisir</em>
                                                </MenuItem>
                                                {props.dispositifList.map((v) => (
                                                    <MenuItem key={v.id + '_' + v.libelle} value={v.id}>{v.libelle}</MenuItem>
                                                ))}
                                            </Select>
                                        }
                                    </FormControl>

                                    <TextField
                                        id="dateEntree"
                                        disabled={props.updateFormation.id_commune === 'all'}
                                        error={props.updateFormation.date_entree === '' ? true : false}
                                        value={props.updateFormation.date_entree}
                                        size="small"
                                        variant="outlined"
                                        label="Date d'entrée *"
                                        type="date"
                                        onChange={(e) => props.handleChangeFormation('date_entree', e.target.value)}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    // InputProps={
                                    //     props.updateFormation.id !== '' && {
                                    //         startAdornment: (
                                    //             <InputAdornment position="start">
                                    //                 <ErrorOutlineIcon className={classes.icon} />
                                    //             </InputAdornment>),
                                    //     }} 
                                    />
                                    <TextField
                                        id="dateFin"
                                        size="small"
                                        variant="outlined"
                                        label="Date de fin"
                                        type="date"
                                        value={props.updateFormation.date_fin}
                                        disabled
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true,
                                        }} />
                                </div>

                                <div className={classes.blocForm}>
                                    <div>
                                        <div className={classes.blockDateINT_date}>
                                            <TextField
                                                id="DDINT1"
                                                error={props.updateFormation.interruption_1 > 15}
                                                disabled={props.updateFormation.id_commune === 'all'}
                                                value={props.updateFormation.date_DDINT1}
                                                size="small"
                                                variant="outlined"
                                                label="Date début INT 1"
                                                type="date"
                                                InputProps={
                                                    props.updateFormation.id !== ''
                                                        ? {
                                                            // startAdornment: (
                                                            //     <InputAdornment position="start">
                                                            //         <ErrorOutlineIcon className={classes.icon} />
                                                            //     </InputAdornment>),
                                                            inputProps: { min: props.updateFormation.date_entree }
                                                        } : {
                                                            inputProps: { min: props.updateFormation.date_entree }
                                                        }
                                                }
                                                onChange={(e) => props.handleChangeFormation('date_DDINT1', e.target.value)}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                            <TextField
                                                id="DFINT1"
                                                error={props.updateFormation.interruption_1 > 15}
                                                disabled={props.updateFormation.id_commune === 'all' || props.updateFormation.date_DDINT1 === ''}
                                                value={props.updateFormation.date_DFINT1}
                                                size="small"
                                                variant="outlined"
                                                label="Date fin INT 1"
                                                type="date"
                                                InputProps={
                                                    props.updateFormation.id !== ''
                                                        ? {
                                                            // startAdornment: (
                                                            // <InputAdornment position="start">
                                                            //     <ErrorOutlineIcon className={classes.icon} />
                                                            // </InputAdornment>),
                                                            inputProps: { min: props.updateFormation.date_DDINT1 }
                                                        } : {
                                                            inputProps: { min: props.updateFormation.date_DDINT1 }
                                                        }
                                                }
                                                onChange={(e) => props.handleChangeFormation('date_DFINT1', e.target.value)}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </div>
                                        {props.updateFormation.interruption_1 > 15 &&
                                            <p className={classes.msgError}>Supérieur à 15 jours</p>}
                                    </div>
                                    <div>
                                        <div className={classes.blockDateINT_date}>
                                            <TextField
                                                id="DDINT2"
                                                error={props.updateFormation.interruption_2 > 15}
                                                disabled={props.updateFormation.id_commune === 'all' || props.updateFormation.date_DFINT1 === ''}
                                                value={props.updateFormation.date_DDINT2}
                                                size="small"
                                                variant="outlined"
                                                label="Date début INT 2"
                                                type="date"
                                                InputProps={
                                                    props.updateFormation.id !== ''
                                                        ? {
                                                            // startAdornment: (
                                                            //     <InputAdornment position="start">
                                                            //         <ErrorOutlineIcon className={classes.icon} />
                                                            //     </InputAdornment>),
                                                            inputProps: { min: props.updateFormation.date_DFINT1 }
                                                        } : {
                                                            inputProps: { min: props.updateFormation.date_DFINT1 }
                                                        }
                                                }
                                                onChange={(e) => props.handleChangeFormation('date_DDINT2', e.target.value)}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                            <TextField
                                                id="DFINT2"
                                                error={props.updateFormation.interruption_2 > 15}
                                                disabled={props.updateFormation.id_commune === 'all' || props.updateFormation.date_DDINT2 === ''}
                                                value={props.updateFormation.date_DFINT2}
                                                size="small"
                                                variant="outlined"
                                                label="Date fin INT 2"
                                                type="date"
                                                InputProps={
                                                    props.updateFormation.id !== ''
                                                        ? {
                                                            // startAdornment: (
                                                            //     <InputAdornment position="start">
                                                            //         <ErrorOutlineIcon className={classes.icon} />
                                                            //     </InputAdornment>),
                                                            inputProps: { min: props.updateFormation.date_DDINT2 }
                                                        } : {
                                                            inputProps: { min: props.updateFormation.date_DDINT2 }
                                                        }
                                                }
                                                onChange={(e) => props.handleChangeFormation('date_DFINT2', e.target.value)}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </div>
                                        {props.updateFormation.interruption_2 > 15 &&
                                            <p className={classes.msgError}>Supérieur à 15 jours</p>}
                                    </div>
                                </div>
                            </>}
                        </form>

                        <div className={classes.blockEndForm}>
                            <div className={classes.blockEndError}>
                                {/* <ErrorOutlineIcon className={classes.icon} /> : Changement qui necessite de resolliciter l'ensemble des OF */}
                            </div>
                            <div className={classes.btnActionModal}>
                                <Button onClick={props.handleCloseModal} variant="outlined" color="primary">
                                    Annuler
                                </Button>
                                {props.updateFormation.interruption_1 > 15 ||
                                    props.updateFormation.interruption_2 > 15 ||
                                    props.updateFormation.nb_place === '' ||
                                    props.updateFormation.vague === '' ||
                                    props.updateFormation.dispositif === 'all' ||
                                    props.updateFormation.date_entree === '' ||
                                    props.updateFormation.agence_ref === 'all'
                                    ? <Button disabled variant="contained" color="primary">
                                        Enregistrer
                                    </Button>
                                    : isSubmit ? <Button onClick={() => setIsSubmit(false)}
                                        variant="contained" color="primary" endIcon={<CircularProgress size={20} color="secondary" />}>
                                        Enregistrer
                                    </Button>
                                        : <Button onClick={handleSubmit} variant="contained" color="primary">
                                            Enregistrer
                                        </Button>
                                }
                            </div>

                        </div>
                        <div className={classes.blockSolAttr}>
                            <div  className={classes.blockAttributaire}>
                                {props.attributaireList.length > 0 &&
                                    <List className={classes.listAttributaire}>
                                        {props.attributaireList.map((v, i) =>
                                            <div key={'divList_' + v.priorite}>
                                                <ListItem disabled={i > 1} alignItems="flex-start" key={'ListItem_' + v.libelle}>
                                                    <ListItemAvatar key={'ListItemAvatar_' + v.priorite}>
                                                        <Avatar className={classes.avatar} key={'avatar' + v.priorite}>{v.priorite}</Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText key={'ListItemText_' + v.priorite}
                                                        primary={v.libelle}
                                                        secondary={`${v.destinataire} — ${v.destinataireMail}`}
                                                    />
                                                </ListItem>
                                                <Divider variant="inset" component="li" key={'divider_' + v.priorite} />
                                            </div>
                                        )}
                                    </List>
                                }

                            </div>
                            <div className={classes.blockSollicitation}>

                                {props.updateFormation.id_sol === 0 &&
                                    <div className={classes.sollicitaitonBtn}>
                                        {props.attributaireList.length > 0 ?
                                            <Button onClick={props.handleCreateSollicitation} variant="contained" color="secondary"
                                                startIcon={<SendIcon />}>
                                                Solliciter les OFs
                                            </Button>
                                            : <Button disabled variant="contained" color="secondary"
                                                startIcon={<SendIcon />}>
                                                Aucun OF à contacter
                                            </Button>}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}
