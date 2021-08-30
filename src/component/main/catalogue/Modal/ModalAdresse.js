import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import SelectPersonnalize from '../../../global/utils/SelectPersonnalize';
import { IsPermitted } from '../../../../utilities/Function';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    blocForm: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: theme.spacing(1),
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid',
        minWidth: '600px',
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

    const [clickHandleSubmit, setClickHandleSubmit] = useState(false)

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
        console.log(key, value)
        setAdresse({ ...adresse, [key]: value })
    };

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
                        </div>
                        <form className={classes.root} noValidate autoComplete="off">
                            <div className={classes.blocForm}>

                                <SelectPersonnalize
                                    error={isSubmit && adresse.ville === 'all' ? true : false}
                                    handleChangeValue={handleChange}
                                    path={'global/findAll?table=ville'}
                                    rowKey='ville'
                                    value={adresse.ville}
                                    displayvalue='libelle'
                                    label='Ville'
                                />

                                {adresse.ville !== 'all'
                                    ? <SelectPersonnalize
                                        error={isSubmit && adresse.adresse === 'all' ? true : false}
                                        handleChangeValue={handleChange}
                                        path={'global/findAll?table=adresse&commune=' + adresse.ville}
                                        rowKey='adresse'
                                        value={adresse.adresse}
                                        displayvalue='adresse'
                                        label='Adresse'
                                    />
                                    : <FormControl size="small" variant="outlined" disabled={true}>
                                        <InputLabel id="demo-simple-select-outlined-label">Adresse</InputLabel>
                                        <Select>
                                            <MenuItem value="all">
                                                <em>Choisir</em>
                                            </MenuItem>
                                        </Select>
                                    </FormControl>}
                                <Button onClick={() => { setClickHandleSubmit(true); handleSubmit(dataRow) }} variant="contained" color="primary" >
                                    Ajouter
                                </Button>
                            </div>

                        </form>
                        <div className={classes.btnActionModal}>

                            <Button onClick={props.handleCloseModal} variant="outlined" color="primary">
                                Annuler
                            </Button>
                            {clickHandleSubmit
                                ? <Button variant="contained" color="primary"
                                    endIcon={<CircularProgress size={20} />}>
                                    Enregistrer
                                </Button> :
                                <Button onClick={() => { setClickHandleSubmit(true); handleSubmit(dataRow) }} variant="contained" color="primary" >
                                    Enregistrer
                                </Button>}


                        </div>

                    </div>
                </Fade>
            </Modal>
        </div >
    );
}
