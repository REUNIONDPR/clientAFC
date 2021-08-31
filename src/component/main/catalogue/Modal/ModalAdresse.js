import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { Tooltip } from '@material-ui/core';
import Cookie from 'js-cookie';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    select: {
        width: '400px',
    },
    blocForm: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginTop: theme.spacing(2),
        '& > * > *': {
            marginTop: theme.spacing(2),
        },
    },
    blocFormBtn: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: theme.spacing(2),
    },
    divSeparator: {
        alignSelf: 'center',
        '& > .separator': {
            marginRight: 'auto',
            marginLeft: 'auto',
            width: 0,
            height: '40px',
            border: '1px solid',
            margin: theme.spacing(1),
            borderColor: theme.palette.primary.main,
        },
    },
    checkArea: {
        marginTop: theme.spacing(2),
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid',
        minWidth: '700px',
        borderColor: theme.palette.primary.main,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        maxWidth: '80%',
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
    msgAlert: {
        color: 'red',
        fontStyle: 'italic',
    }
}));

export default function ModalAdresse(props) {
    const classes = useStyles();
    const [isSubmit, setIsSubmit] = useState(false) // Gestion des erreurs (champs vide)
    const dataRow = props.updateRow;
    const [textAdresse, setTextAdresse] = useState('');
    const [clickHandleSubmit, setClickHandleSubmit] = useState(false);

    const handleSubmit = (row) => {

        // setIsSubmit(true)
        // let submitting = true;
        // let action = dataRow.id === '' || dataRow.id === 0 ? 'create' : 'update';
        // // eslint-disable-next-line array-callback-return
        // // Object.entries(dataRow).map(([k, v]) => { if (v === '' && k !== 'id') { return submitting = false; } })
        // if (submitting) {
        //   switch (action) {
        //     case 'create': props.handleSubmitClickToParent(row, action); break;
        //     case 'update': props.handleEditSubmitClickToParent(row, action); break;
        //     default: props.handleErrorSubmit();
        //   }
        // }
    }

    const [adresse, setAdresse] = useState({ ville: 'all', adresse: 'all' })

    const handleChange = (key, value) => {
        if (key === 'ville') {
            setAdresse({ ville: value, adresse: 'all' });
            setTextAdresse('')
        } else setAdresse({ ...adresse, adresse: value })
    };

    const [listAdresse, setListAdresse] = useState([]);
    useEffect(() => {
        axios({
            method: 'GET',
            url: 'adresse/findOuter?commune=' + adresse.ville + '&id_cata=' + dataRow.id,
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        }).then((response) => setListAdresse(response.data));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [adresse.ville])

    const [listVille, setListVille] = useState([]);
    useEffect(() => {
        axios({
            method: 'GET',
            url: 'global/findAll?table=ville',
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        }).then((response) => setListVille(response.data));
        setAdresse({ ville: 'all', adresse: 'all' })
    }, [])

    const [checkClose, setCheckClose] = useState(true)
    const handleChangeCheckBox = () => {
        setCheckClose(!checkClose)
    }

    const removeAddFromList = (adresse) => {
        setAdresse({ ville: adresse.ville, adresse: 'all' });
        setListAdresse(listAdresse.filter((v) => v.id !== adresse.adresse))
    }

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={props.openModal}
                onClose={() => props.handleCloseModal()}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={props.openModal}>
                    <div className={classes.paper}>
                        <div className={classes.titleModal}>
                            <div><h2 id="transition-modal-title">Adresse</h2></div>
                            <div>
                                <Tooltip title="Fermer" aria-label="close">
                                    <IconButton aria-label="fermer" color="primary" onClick={() => props.handleCloseModal(dataRow)}>
                                        <CloseIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>
                        <form className={classes.root} noValidate autoComplete="off">
                            <FormControl className={classes.select} size="small" variant="outlined">
                                <InputLabel id="demo-simple-select-outlined-label">Ville</InputLabel>
                                <Select
                                    value={adresse.ville || 'all'}
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    name='ville'
                                    label='Ville'
                                >
                                    <MenuItem value="all">
                                        <em>Choisir</em>
                                    </MenuItem>
                                    {listVille.length > 0 && listVille.map((v) => <MenuItem key={'ville_' + v.id} value={v.id}>{v.libelle}</MenuItem>)}
                                </Select>
                            </FormControl>

                            <div className={classes.blocForm}>
                                <div>
                                    <Typography>Choisir parmis les adresse éxistante</Typography>
                                    <FormControl className={classes.select} size="small" variant="outlined" disabled={adresse.ville === 'all'}>
                                        <InputLabel id="demo-simple-select-outlined-label">Adresse</InputLabel>
                                        <Select
                                            value={adresse.adresse || 'all'}
                                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                                            name='adresse'
                                            label='Adresse'
                                        >
                                            setTextAdresse
                                            <MenuItem value="all">
                                                <em>Choisir</em>
                                            </MenuItem>
                                            {listAdresse.length > 0 && listAdresse.map((v) => <MenuItem key={'adresse_' + v.id} value={v.id}>{v.adresse}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                    <div className={classes.blocFormBtn}>
                                        <Button disabled={adresse.adresse === 'all'}
                                            onClick={() => {
                                                props.handleAddAdresse(dataRow, listAdresse.filter((v) => v.id === adresse.adresse)[0])
                                                if (checkClose) { props.handleCloseModal(dataRow) } else removeAddFromList(adresse)
                                            }}
                                            variant="contained" color="primary" >
                                            Ajouter
                                        </Button>
                                    </div>
                                </div>
                                <div className={classes.divSeparator}>
                                    <div className={'separator'}></div><Typography>Ou</Typography><div className={'separator'}></div>
                                </div>
                                <div>
                                    <Typography>Créer une nouvelle adresse</Typography>
                                    <TextField
                                        disabled={adresse.ville === 'all'}
                                        label="Nouvelle adresse"
                                        multiline
                                        size="small"
                                        onChange={(e) => setTextAdresse(e.target.value)}
                                        value={textAdresse}
                                        // rows={1}
                                        placeholder="Nouvelle adresse"
                                        variant="outlined"
                                    />
                                    <div className={classes.blocFormBtn}>
                                        <Button disabled={adresse.ville === 'all' || textAdresse === ''}
                                            onClick={() => { 
                                                props.handleCreateAdresse(dataRow, {
                                                    id:'', 
                                                    adresse:textAdresse + ' - ' + listVille.filter((v) => v.id === adresse.ville)[0].libelle
                                                }, adresse.ville)
                                                if (checkClose) { props.handleCloseModal(dataRow) } else setTextAdresse('')
                                            }}
                                            variant="contained" color="primary" >
                                            Créer
                                        </Button>
                                    </div>
                                </div>
                            </div>

                        </form>
                        <div className={classes.checkArea}>
                            <FormControlLabel
                                control={<Checkbox checked={checkClose} onChange={handleChangeCheckBox} color="secondary" name="checkedClose" />}
                                label="Fermer la fenêtre après validation"
                            />
                        </div>
                    </div>
                </Fade>
            </Modal>
        </div >
    );
}
