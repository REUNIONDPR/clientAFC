import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SelectPersonnalize from '../../../global/utils/Select';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { Tooltip } from '@material-ui/core';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid',
    borderColor: theme.palette.secondary.main,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxWidth: '80%',
  },
  btnActionModal: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  titleModal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
}));

export default function ModalCatalogue(props) {
  const classes = useStyles();
  const [isSubmit, setIsSubmit] = useState(false) // Gestion des erreurs (champs vide)
  const [dataRow, setDataRow] = useState({});
  
  useEffect(() => {
    if (props.openModal && props.updateRow) {
      setDataRow(props.updateRow)
    } else {
      setDataRow({
        id: '',
        display_lot: '',
        id_cata: '',
        user: '',
        dt: '',
        statut: '',
        agent_ref: '',
        agence_ref: '',
        dispositif: '',
        n_article: '',
        nb_place: '',
        adresse: '',
        of_dispensateur: '',
        date_creation: '',
        date_entree: '',
        date_fin: '',
        date_DDINT1: '',
        date_DFINT1: '',
        date_DDINT2: '',
        date_DFINT2: '',
        date_conv: '',
        n_conv: '',
        date_icop: '',
        date_validation: '',
        vague: '',
      })
    }
    setIsSubmit(false)
  }, [props.openModal, props.updateRow])

  const handleChangeValue = (k, v) => {
    setDataRow({ ...dataRow, [k]: v })
  }

  const handleSubmit = (row) => {
    setIsSubmit(true)
    let submitting = true;
    let action = dataRow.id === '' || dataRow.id === 0 ? 'create' : 'update';
    // eslint-disable-next-line array-callback-return
    // Object.entries(dataRow).map(([k, v]) => { if (v === '' && k !== 'id') { return submitting = false; } })
    if (submitting) {
      switch (action) {
        case 'create': props.handleSubmitClickToParent(row, action); break;
        case 'update': props.handleEditSubmitClickToParent(row, action); break;
        default: props.handleErrorSubmit();
      }
    }
  }
  const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

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
              <div><h2 id="transition-modal-title">{dataRow.id === '' || dataRow.id === 0 ? "Ajouter une" : "Modifier la"} formation</h2></div>
              <div>
              {(dataRow.id === '' || dataRow.id === 0)
                ? <Tooltip title="Supprimer" aria-label="delete">
                  <IconButton aria-label="delete" color="secondary" onClick={() => props.handleDeleteClick(dataRow)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                :<Tooltip title="Fermer" aria-label="close">
                <IconButton aria-label="close" color="secondary" onClick={() => props.handleCloseModal}>
                  <CloseRoundedIcon />
                </IconButton>
              </Tooltip>
      }
              </div>
            </div>
            agent_ref
            agence_ref
            dispositif
            nb_place
            adresse
            of_dispensateur
            date_entree
            date_fin
            date_DDINT1
            date_DFINT1
            date_DDINT2
            date_DFINT2
            date_icop
            n_conv
            vague
            <form className={classes.root} noValidate autoComplete="off">
              <div className={classes.blocForm}>
                <SelectPersonnalize
                  error={isSubmit && dataRow.display_lot === '' ? true : false}
                  handleChangeValue={handleChangeValue}
                  path={'global/findAll?table=lot'}
                  rowKey='display_lot'
                  value={dataRow.display_lot}
                  displayvalue='libelle'
                  label='Lot'
                />
                {dataRow.display_lot
                  ? <SelectPersonnalize
                    error={isSubmit && dataRow.id_cata === '' ? true : false}
                    handleChangeValue={handleChangeValue}
                    path={'catalogue/find?table=catalogue&lot=' + dataRow.display_lot}
                    rowKey='id_cata'
                    value={dataRow.id_cata}
                    displayvalue='intitule_form_marche'
                    label='Catalogue'
                  />
                  : <FormControl size="small"  variant="outlined" className={classes.formControl}>
                    <InputLabel htmlFor="outlined-age-native-simple">Catalogue</InputLabel>
                    <Select
                      native
                      value={''}
                      label="Catalogue"
                      inputProps={{
                        name: 'cata',
                        id: 'outlined-cata-native-simple',
                      }}
                    ><option aria-label="None" value="" />
                    </Select>
                  </FormControl>}
              </div>

              <div className={classes.blocForm}>
              </div>

              <div className={classes.blocForm}>
                <TextField
                  id="date"
                  label="Birthday"
                  type="date"
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />   <TextField required type="number" size="small" label="Heure socle" variant="outlined"
                  error={isSubmit && dataRow.nb_heure_socle === '' ? true : false} value={dataRow.nb_heure_socle}
                  onChange={(e) => setDataRow({ ...dataRow, nb_heure_socle: e.target.value })} />

                <TextField required type="text" size="small" label="Heure Ent" variant="outlined"
                  error={isSubmit && dataRow.nb_heure_ent === '' ? true : false} value={dataRow.nb_heure_ent}
                  onChange={(e) => setDataRow({ ...dataRow, nb_heure_ent: e.target.value })} />

                <TextField required type="number" size="small" label="Heure Appui" variant="outlined"
                  error={isSubmit && dataRow.nb_heure_appui === '' ? true : false} value={dataRow.nb_heure_appui}
                  onChange={(e) => setDataRow({ ...dataRow, nb_heure_appui: e.target.value })} />

                <TextField required type='text' size="small" label="Heure Soutien" variant="outlined"
                  error={isSubmit && dataRow.nb_heure_soutien === '' ? true : false} value={dataRow.nb_heure_soutien}
                  onChange={(e) => setDataRow({ ...dataRow, nb_heure_soutien: e.target.value })} />

                <TextField required type="number" size="small" label="Prix < 6 pers" variant="outlined"
                  error={isSubmit && dataRow.prixTrancheA === '' ? true : false} value={dataRow.prixTrancheA}
                  onChange={(e) => setDataRow({ ...dataRow, prixTrancheA: e.target.value })} />

                <TextField required type="number" size="small" label="Prix > 6 pers" variant="outlined"
                  error={isSubmit && dataRow.prixTrancheB === '' ? true : false} value={dataRow.prixTrancheB}
                  onChange={(e) => setDataRow({ ...dataRow, prixTrancheB: e.target.value })} />
              </div>

            </form>

            <div className={classes.btnActionModal}>

              <Button onClick={props.handleCloseModal} variant="outlined" color="secondary">
                Annuler
              </Button>
              <Button onClick={() => handleSubmit(dataRow)} variant="contained" color="secondary">
                Enregistrer
              </Button>

            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
