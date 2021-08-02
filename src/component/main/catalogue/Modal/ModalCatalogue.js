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
  const [isSubmit, setIsSubmit] = useState(false)
  const [dataRow, setDataRow] = useState({});

  useEffect(() => {
    if (props.openModal && props.updateRow) {
      setDataRow(props.updateRow)
    } else {
      setDataRow({
        id: '',
        display_lot: '',
        n_Article: '',
        intitule_form_marche: '',
        formacode: '',
        display_niveau: '',
        display_objectif: '',
        nb_heure_socle: '',
        nb_heure_ent: '',
        nb_heure_appui: '',
        nb_heure_soutien: '',
        prixTrancheA: '',
        prixTrancheB: '',
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
              <div><h2 id="transition-modal-title">Ajouter une formation</h2></div>
              <div>
                <Tooltip title="Supprimer" aria-label="delete">
                  <IconButton aria-label="delete" color="secondary" onClick={() => props.handleDeleteClick(dataRow)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
            <form className={classes.root} noValidate autoComplete="off">
              <div className={classes.blocFormFullWidth}>
                <SelectPersonnalize
                  error={isSubmit && dataRow.display_lot === '' ? true : false}
                  handleChangeValue={handleChangeValue}
                  table='lot'
                  rowKey='display_lot'
                  value={dataRow.display_lot}
                  label='Lot'
                />
              </div>

              <div className={classes.blocForm}>
                <TextField size="small" required label="N° Article" variant="outlined"
                  error={isSubmit && dataRow.n_Article === '' ? true : false} value={dataRow.n_Article}
                  onChange={(e) => handleChangeValue('n_Article', e.target.value)} />

                <TextField size="small" required label="Intitulé base Form" variant="outlined"
                  error={isSubmit && dataRow.intitule_form_marche === '' ? true : false} value={dataRow.intitule_form_marche}
                  onChange={(e) => handleChangeValue('intitule_form_marche', e.target.value)} />

                <TextField size="small" required label="Intitulé base Art" variant="outlined"
                  error={isSubmit && dataRow.intitule_form_marche === '' ? true : false} value={dataRow.intitule_form_marche}
                  onChange={(e) => handleChangeValue('intitule_form_marche', e.target.value)} />

              </div>

              <div className={classes.blocForm}>
                <TextField size="small" label="FormaCode" variant="outlined"
                  error={isSubmit && dataRow.formacode === '' ? true : false} value={dataRow.formacode}
                  onChange={(e) => handleChangeValue('formacode', e.target.value)} />

                <SelectPersonnalize
                  handleChangeValue={handleChangeValue}
                  table='formation_niveau'
                  rowKey='display_niveau'
                  error={isSubmit && dataRow.display_niveau === '' ? true : false}
                  value={dataRow.display_niveau}
                  label='Niveau'
                />
                <SelectPersonnalize
                  handleChangeValue={handleChangeValue}
                  table='formation_objectif'
                  error={isSubmit && dataRow.display_objectif === '' ? true : false}
                  rowKey='display_objectif'
                  value={dataRow.display_objectif}
                  label='Objectif'
                />
              </div>

              <div className={classes.blocForm}>
                <TextField required type="number" size="small" label="Heure socle" variant="outlined"
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
