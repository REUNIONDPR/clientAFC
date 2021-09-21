import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { InputAdornment } from '@material-ui/core';
import Confirm from '../../../../../global/Confirm';

const useStyles = makeStyles((theme) => ({
    main: {
        // padding: theme.spacing(2, 4, 3),  
    },
    tooltip: {
        fontSize: '15px',
        maxWidth: 'none',
    },
    icon: {
        fill: '#777777',
        cursor: 'default',
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
    spinnerBtn: {
        color: "#fff",
    }
}));

export default function Formulaire(props) {
    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState({});

    const handleOpenDialog = (k, older, newer) => {
        setValue({ key: k, value_old:older, value_new: newer })
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setValue({})
        setOpen(false);
    };

    const handleValideDialog = () => {
        setOpen(false);
        props.handleChangeFormation(value.key, value.value_new, true)
    }

    return (<div className={classes.main}>
        <Confirm open={open} handleValide={handleValideDialog} handleClose={handleCloseDialog} value={value} />
        <Button onClick={handleOpenDialog} variant="contained" color="primary">
            open
        </Button>

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
                    <InputLabel>Commune *</InputLabel>
                    {props.communeList &&
                        <Select
                            value={props.communeList.length > 0 ? props.updateFormation.id_commune : 'all'}
                            onChange={(e) => props.updateFormation.id !== ''
                                ? handleOpenDialog(e.target.name, props.updateFormation.id_commune, e.target.value)
                                : props.handleChangeFormation(e.target.name, e.target.value)}
                            fullWidth
                            name='id_commune'
                            label='Commune'
                            startAdornment={
                                props.updateFormation.id !== '' &&
                                <InputAdornment position="start">
                                    <ErrorOutlineIcon className={classes.icon} />
                                </InputAdornment>
                            }
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
                    <InputLabel>Agence REF *</InputLabel>
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
                    onChange={(e) => props.updateFormation.id !== ''
                        ? handleOpenDialog('nb_place', props.updateFormation.nb_place, e.target.value)
                        : props.handleChangeFormation('nb_place', e.target.value)}
                    InputProps={
                        props.updateFormation.id !== ''
                            ? {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <ErrorOutlineIcon className={classes.icon} />
                                    </InputAdornment>),
                            }
                            : { 'aria-label': 'description' }}
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
                        error={props.updateFormation.date_entree_demandee === '' ? true : false}
                        value={props.updateFormation.date_entree_demandee}
                        size="small"
                        variant="outlined"
                        label="Date d'entrée *"
                        type="date"
                        onChange={(e) => props.updateFormation.id !== ''
                            ? Math.abs(parseInt(new Date(e.target.value) - new Date(props.updateFormation.date_entree_fixe)) / (24 * 3600 * 1000)) > 15 
                                ? handleOpenDialog('date_entree_demandee', props.updateFormation.date_entree_fixe, e.target.value)
                                : props.handleChangeFormation('date_entree_demandee', e.target.value)
                            : props.handleChangeFormation('date_entree_demandee', e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={
                            props.updateFormation.id !== ''
                                ? {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <ErrorOutlineIcon className={classes.icon} />
                                        </InputAdornment>),
                                }
                                : { 'aria-label': 'description' }}
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
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <ErrorOutlineIcon className={classes.icon} />
                                                </InputAdornment>),
                                            inputProps: { min: props.updateFormation.date_entree_demandee }
                                        } : {
                                            inputProps: { min: props.updateFormation.date_entree_demandee }
                                        }
                                }
                                onChange={(e) => props.updateFormation.id !== ''
                                    ? handleOpenDialog('date_DDINT1', props.updateFormation.date_DDINT1, e.target.value)
                                    : props.handleChangeFormation('date_DDINT1', e.target.value)}
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
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <ErrorOutlineIcon className={classes.icon} />
                                                </InputAdornment>),
                                            inputProps: { min: props.updateFormation.date_DDINT1 }
                                        } : {
                                            inputProps: { min: props.updateFormation.date_DDINT1 }
                                        }
                                }
                                onChange={(e) => props.updateFormation.id !== ''
                                    ? handleOpenDialog('date_DFINT1', props.updateFormation.date_DFINT1, e.target.value)
                                    : props.handleChangeFormation('date_DFINT1', e.target.value)}
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
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <ErrorOutlineIcon className={classes.icon} />
                                                </InputAdornment>),
                                            inputProps: { min: props.updateFormation.date_DFINT1 }
                                        } : {
                                            inputProps: { min: props.updateFormation.date_DFINT1 }
                                        }
                                }
                                onChange={(e) => props.updateFormation.id !== ''
                                    ? handleOpenDialog('date_DDINT2', props.updateFormation.date_DDINT2, e.target.value)
                                    : props.handleChangeFormation('date_DDINT2', e.target.value)}
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
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <ErrorOutlineIcon className={classes.icon} />
                                                </InputAdornment>),
                                            inputProps: { min: props.updateFormation.date_DDINT2 }
                                        } : {
                                            inputProps: { min: props.updateFormation.date_DDINT2 }
                                        }
                                }
                                onChange={(e) => props.updateFormation.id !== ''
                                    ? handleOpenDialog('date_DFINT2', props.updateFormation.date_DFINT2, e.target.value)
                                    : props.handleChangeFormation('date_DFINT2', e.target.value)}
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
                {props.updateFormation.id !== '' && <>
                    <ErrorOutlineIcon className={classes.icon} />
                    : Changement qui necessite de solliciter à nouveau l'ensemble des OF dans l'ordre de priorité
                </>}
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
                    props.updateFormation.date_entree_demandee === '' ||
                    props.updateFormation.agence_ref === 'all'
                    ? <Button disabled variant="contained" color="primary">
                        Enregistrer
                    </Button>
                    : props.updateFormation.id === ''
                        ? props.isSubmit
                            ? <Button onClick={props.handleIsSubmitting}
                                variant="contained" color="primary" endIcon={<CircularProgress size={20} className={classes.spinnerBtn} />}>
                                Enregistrer
                            </Button>
                            : <Button onClick={() => props.handleSubmit(props.createNewFormationFromThis)} variant="contained" color="primary">
                                Enregistrer
                            </Button>
                        : props.isSubmit
                            ? <Button onClick={props.handleIsSubmitting}
                                variant="contained" color="primary" endIcon={<CircularProgress size={20} className={classes.spinnerBtn} />}>
                                Modifier
                            </Button>
                            : <Button onClick={props.handleSubmit} variant="contained" color="primary">
                                Modifier
                            </Button>
                }
            </div>

        </div>
    </div>
    )
}