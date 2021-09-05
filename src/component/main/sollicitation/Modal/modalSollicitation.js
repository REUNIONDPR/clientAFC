import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SelectPersonnalize from '../../../global/utils/SelectPersonnalize';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { Tooltip } from '@material-ui/core';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Stepper from './Stepper';

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
  const [isSubmit, setIsSubmit] = useState(); // Gestion des erreurs (champs vide)
  const [dataRow, setDataRow] = useState({});

  useEffect(() => {
    if (props.openModal && props.updateRow) {
      setDataRow(props.updateRow)
    } else {
      setDataRow({
        id: '',
        display_lot: '',
        id_cata: '',
        user: props.user.idgasi,
        dt: '',
        statut: '',
        agent_ref: '',
        agence_ref: '',
        dispositif: 1,
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
  }, [props])

  // const handleChangeValue = (k, v) => {
  //   console.log(dataRow)
  //   if (k === 'id_cata') { setShowBlock_1(true) }
  //   if (k === 'display_lot') {
  //     setDataRow({ ...dataRow, id_cata: '', [k]: v })
  //   } else {
  //     setDataRow({ ...dataRow, [k]: v })
  //   }
  // }
  const handleChangeValue = (e) => {
    let v = e.target.value;
    let k = e.target.name;

    if (k === 'display_lot') {
      setDataRow({ ...dataRow, id_cata: '', [k]: v })
    } else if (k === 'id_cata') {
      setDataRow({
        ...dataRow,
        display_lot: dataRow.display_lot,
        id_cata: v,
        dt: '',
        statut: '',
        agent_ref: '',
        agence_ref: '',
        dispositif: 1,
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
    } else {
      setDataRow({ ...dataRow, [k]: v })
    }

  }

  // const handleSubmit = (row) => {

  //   setIsSubmit(true)
  //   let action = dataRow.id === '' || dataRow.id === 0 ? 'create' : 'update';

  //   switch (action) {
  //     case 'create': props.handleSubmitClickToParent(row, action); break;
  //     case 'update': props.handleSubmitModalClick(row, action); break;
  //     default: props.handleErrorSubmit();
  //   }

  // }

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
              {(dataRow.statut !== '') && <Stepper />}
              <div>
                {(dataRow.id === '' || dataRow.id === 0)
                  ? <Tooltip title="Fermer" aria-label="delete">
                    <IconButton aria-label="close" color="primary" onClick={props.handleCloseModal}>
                      <CloseRoundedIcon />
                    </IconButton>
                  </Tooltip>
                  : <Tooltip title="Supprimer" aria-label="delete">
                    <IconButton aria-label="delete" color="primary" onClick={() => props.handleDeleteClick(dataRow)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                }
              </div>
            </div>
            <form className={classes.root} noValidate autoComplete="off">
              <div className={classes.blocForm}>
                <SelectPersonnalize
                  error={dataRow.display_lot === '' ? true : false}
                  handleChangeValue={handleChangeValue}
                  path={'global/findAll?table=lot'}
                  rowKey='display_lot'
                  value={dataRow.display_lot}
                  displayvalue='libelle'
                  label='Lot *'
                />
                {dataRow.display_lot !== ''
                  ? <SelectPersonnalize
                    error={isSubmit && dataRow.id_cata === '' ? true : false}
                    handleChangeValue={handleChangeValue}
                    path={`global/find?table=catalogue&condition=${JSON.stringify({ id_lot: dataRow.display_lot })}`}
                    rowKey='id_cata'
                    value={dataRow.id_cata}
                    displayvalue='intitule_form_marche'
                    label='Catalogue *'
                  />
                  : <FormControl size="small" variant="outlined" className={classes.formControl}>
                    <InputLabel htmlFor="outlined-age-native-simple">Catalogue</InputLabel>
                    <Select
                      native
                      disabled
                      value={1}
                      label="Catalogue *"
                      inputProps={{
                        name: 'cata',
                        id: 'outlined-cata-native-simple',
                      }}
                    ><option aria-label="Choisir un lot" value={1}>Choisir un lot</option>
                    </Select>
                  </FormControl>}
              </div>

              {(dataRow.display_lot !== '' && dataRow.id_cata !== '') && <> <div className={classes.blocForm}>
                {/* {true && <> <div className={classes.blocForm}> */}
                {/* <TextField required type="text" size="small" label="Agent Ref" variant="outlined"
                  error={isSubmit && dataRow.agent_ref === '' ? true : false} value={dataRow.agent_ref}
                  onChange={(e) => setDataRow({ ...dataRow, agent_ref: e.target.value })} />
                <SelectPersonnalize
                  error={isSubmit && dataRow.display_lot === '' ? true : false}
                  handleChangeValue={handleChangeValue}
                  path={'global/findAll?table=lot'}
                  rowKey='display_lot'
                  value={dataRow.display_lot}
                  displayvalue='libelle'
                  label='Agence Ref'
                /> */}
                <TextField required type="number" size="small" label="Nombre de place" variant="outlined"
                  error={isSubmit && dataRow.nb_place === '' ? true : false} value={dataRow.nb_place}
                  onChange={(e) => setDataRow({ ...dataRow, nb_place: e.target.value })} />
                <SelectPersonnalize
                  error={isSubmit && dataRow.dispositif === '' ? true : false}
                  handleChangeValue={handleChangeValue}
                  path={'global/findAll?table=dispositif'}
                  rowKey='dispositif'
                  value={dataRow.dispositif}
                  displayvalue='libelle'
                  label='Dispositif *'
                />
                <TextField required type="number" size="small" label="Vague" variant="outlined"
                  error={isSubmit && dataRow.vague === '' ? true : false} value={dataRow.vague}
                  onChange={(e) => setDataRow({ ...dataRow, vague: e.target.value })} />
              </div>

                <div className={classes.blocForm}>
                  <SelectPersonnalize
                    error={isSubmit && dataRow.of_dispensateur === '' ? true : false}
                    handleChangeValue={handleChangeValue}
                    path={`global/find?table=attributaire&condition=${JSON.stringify({ id_lot: dataRow.display_lot })}&join=${JSON.stringify(
                      {
                        0: { table: "attributaire_lot", alias: "x", key: "t.id", fk: 'id_attributaire' }
                      }
                    )}`}

                    rowKey='of_dispensateur'
                    value={dataRow.of_dispensateur}
                    displayvalue='libelle'
                    label='OF Dispensateur *'
                  />
                  {/* <SelectPersonnalize
                    error={isSubmit && dataRow.adresse === '' ? true : false}
                    handleChangeValue={handleChangeValue}
                    path={`global/find?table=adresse&condition=${JSON.stringify({ id_cata: dataRow.id_cata })}&join=${JSON.stringify(
                      {
                        0: { table: "adresse_attributaire", alias: "a1", key: "t.id", fk: 'id_adresse' },
                        1: { table: "adresse_catalogue", alias: "a2", key: "a1.id", fk: 'id_adresse_attributaire' }
                      }
                    )}`}
                    rowKey='adresse'
                    value={dataRow.adresse}
                    displayvalue='adresse'
                    label='Adresse *'
                  /> */}

                  <TextField
                    id="dateEntree"
                    error={isSubmit && dataRow.date_entree === '' ? true : false}
                    defaultValue={dataRow.date_entree}
                    size="small"
                    variant="outlined"
                    label="Date d'entrée *"
                    type="date"
                    onChange={(e) => setDataRow({ ...dataRow, date_entree: e.target.value })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    id="dateICOP"
                    error={isSubmit && dataRow.date_icop === '' ? true : false}
                    defaultValue={dataRow.date_icop}
                    size="small"
                    variant="outlined"
                    label="Date d'icop *"
                    type="date"
                    onChange={(e) => setDataRow({ ...dataRow, date_icop: e.target.value })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>

                <div className={classes.blocForm}>
                  <TextField
                    id="DDINT1"
                    defaultValue={dataRow.date_DDINT1}
                    size="small"
                    variant="outlined"
                    label="Date début INT 1"
                    type="date"
                    onChange={(e) => setDataRow({ ...dataRow, date_DDINT1: e.target.value })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    id="DFINT1"
                    defaultValue={dataRow.date_DFINT1}
                    size="small"
                    variant="outlined"
                    label="Date fin INT 1"
                    type="date"
                    onChange={(e) => setDataRow({ ...dataRow, date_DFINT1: e.target.value })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    id="DDINT2"
                    defaultValue={dataRow.date_DDINT2}
                    size="small"
                    variant="outlined"
                    label="Date début INT 2"
                    type="date"
                    onChange={(e) => setDataRow({ ...dataRow, date_DDINT2: e.target.value })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    id="DFINT2"
                    defaultValue={dataRow.date_DFINT2}
                    size="small"
                    variant="outlined"
                    label="Date fin INT 2"
                    type="date"
                    onChange={(e) => setDataRow({ ...dataRow, date_DFINT2: e.target.value })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>

                <div className={classes.blocFormEnd}>
                  <div>
                    <TextField
                      id="dateFin"
                      size="small"
                      variant="outlined"
                      label="Date de fin"
                      type="date"
                      disabled
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </div>
                  {(dataRow.statut === 2) &&
                    <TextField required type="text" size="small" label="N° Conventionnement" variant="outlined"
                      error={isSubmit && dataRow.n_conv === '' ? true : false} value={dataRow.n_conv}
                      onChange={(e) => setDataRow({ ...dataRow, n_conv: e.target.value })} />
                  }
                </div>
              </>}
            </form>

            <div className={classes.btnActionModal}>

              <Button onClick={props.handleCloseModal} variant="outlined" color="primary">
                Annuler
              </Button>
              <Button onClick={() => props.handleSubmitModalClick(dataRow)} variant="contained" color="primary">
                Enregistrer
              </Button>

            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
