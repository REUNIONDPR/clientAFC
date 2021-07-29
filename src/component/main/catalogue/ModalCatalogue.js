import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import SelectPersonnalize from '../../global/utils/Select';

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
}));

export default function ModalCatalogue(props) {
  const classes = useStyles();
  const [dataRow, setDataRow] = useState({});

  useEffect(() => {
    if (props.openModal && props.updateRow) {
      setDataRow(props.updateRow)
      console.log(props.updateRow)
    } else {
      setDataRow({
        id: '',
        display_lot: '',
        n_Article: '',
        intitule_form_marche: '',
        formacode: '',
        display_formation_niveau: '',
        display_formation_objectif: '',
        nb_heure_socle: '',
        nb_heure_ent: '',
        nb_heure_appui: '',
        nb_heure_soutien: '',
        prixTrancheA: '',
        prixTrancheB: '',
      })
    }
  }, [props.openModal, props.updateRow])

  const handleChangeValue = (k, v) => {
    setDataRow({ ...dataRow, [k]: v })
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
            <h2 id="transition-modal-title">Ajouter une formation</h2>

            <form className={classes.root} noValidate autoComplete="off">
              <div className={classes.blocFormFullWidth}>
                <SelectPersonnalize
                  handleChangeValue={handleChangeValue}
                  table='lot'
                  rowKey='display_lot'
                  value={dataRow.display_lot}
                  label='Lot'
                />
              </div>

              <div className={classes.blocForm}>
                <TextField size="small" label="N° Article" variant="outlined" value={dataRow.n_Article} />
                <TextField size="small" label="Intitulé base Form" variant="outlined" value={dataRow.intitule_form_marche} />
                <TextField size="small" label="Intitulé base Art" variant="outlined" value={dataRow.intitule_form_marche} />
              </div>

              <div className={classes.blocForm}>
                <TextField size="small" label="FormaCode" variant="outlined" value={dataRow.formacode} />
                
                <SelectPersonnalize
                  handleChangeValue={handleChangeValue}
                  table='formation_niveau'
                  rowKey='display_formation_niveau'
                  value={dataRow.display_formation_niveau}
                  label='Niveau'
                />
                <SelectPersonnalize
                  handleChangeValue={handleChangeValue}
                  table='formation_objectif'
                  rowKey='display_formation_objectif'
                  value={dataRow.display_formation_objectif}
                  label='Objectif'
                />
              </div>

              <div className={classes.blocForm}>
                <TextField type="number" size="small" label="Heure socle" variant="outlined" value={dataRow.nb_heure_socle} onChange={(e) => setDataRow({ ...dataRow, nb_heure_socle: e.target.value })} />
                <TextField size="small" label="Heure Ent" variant="outlined" value={dataRow.nb_heure_ent} onChange={(e) => setDataRow({ ...dataRow, nb_heure_ent: e.target.value })} />
                <TextField type="number" size="small" label="Heure Appui" variant="outlined" value={dataRow.nb_heure_appui} onChange={(e) => setDataRow({ ...dataRow, nb_heure_appui: e.target.value })} />
                <TextField size="small" label="Heure Soutien" variant="outlined" value={dataRow.nb_heure_soutien} onChange={(e) => setDataRow({ ...dataRow, nb_heure_soutien: e.target.value })} />
                <TextField type="number" size="small" label="Prix < 6 pers" variant="outlined" value={dataRow.prixTrancheA} onChange={(e) => setDataRow({ ...dataRow, prixTrancheA: e.target.value })} />
                <TextField type="number" size="small" label="Prix > 6 pers" variant="outlined" value={dataRow.prixTrancheB} onChange={(e) => setDataRow({ ...dataRow, prixTrancheB: e.target.value })} />
              </div>

            </form>

            <div className={classes.btnActionModal}>

              <Button onClick={props.handleCloseModal} variant="outlined" color="secondary">
                Annuler
              </Button>
              <Button onClick={() => props.handleEditSubmitClickToParent(dataRow)} variant="contained" color="secondary">
                Enregistrer
              </Button>

            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
