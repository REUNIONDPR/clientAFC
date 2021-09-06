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
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import Divider from '@material-ui/core/Divider';
import CloseIcon from '@material-ui/icons/Close';
import { IsPermitted } from '../../../../utilities/Function';
import Select from '@material-ui/core/Select';
import SaveIcon from '@material-ui/icons/Save';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { Tooltip, Typography } from '@material-ui/core';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Chip from '@material-ui/core/Chip';
import axios from 'axios';
import Cookie from 'js-cookie';

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
  },
  blockOF: {
    display: 'flex',
    alignItems: 'center',
    '& > *': {
      marginRight: theme.spacing(1),
    },
  },
  inputNumber: { width: 100, minWidth: 100 },
  selectOf: { maxWidth: '50%' },
  spinnerBtn: { color: theme.palette.spinnerBtnContained.main, },
  blockOfForm: {
    maxHeight: 222,
    overflowY: 'scroll',
    paddingTop: 1,
  },
  dividerTop: { margin: '20px 20px 0 20px' },
  dividerDown: { margin: '0 20px 20px 20px' },
  OFTitle: { textAlign: 'center', margin: 10 },
  lastRow: {
    textAlign: 'center',
    '&:hover': {
      background: 'pink',
      cursor: 'pointer'
    }
  }
}));

export default function ModalCatalogue(props) {
  const classes = useStyles();
  const [isSubmit, setIsSubmit] = useState(false) // Gestion des erreurs (champs vide)
  const dataRow = props.updateRow;
  const [clickHandleSubmit, setClickHandleSubmit] = useState(false)
  const [listOf, setListOf] = useState([]);
  const [listOfSelect, setListOfSelect] = useState([]);
  const [listCommuneSelect, setListCommuneSelect] = useState([]);

  const handleSubmit = () => {
    setIsSubmit(true)

    let action = dataRow.id === '' || dataRow.id === 0 ? 'create' : 'update';

    // Vérifie que les champs sont renseignés - formation.
    let error_field = Object.entries(dataRow)
      .filter(([k, v]) => k !== 'id' && k !== 'id_of_cata' && k !== 'adresse' && !k.includes('of') && v === '').length > 0;

    // Vérifie que les champs sont renseignés - OF.
    let error_of = listOf.filter((v) => v.priorite === '' || v.libelle === '' || v.error).length > 0;

    if (!error_of && !error_field) {
      switch (action) {
        // case 'create': props.handleSubmitClickToParent(dataRow, listOf); break;
        case 'create': console.log('create ? '); break;
        case 'update': props.handleEditSubmitClickToParent(dataRow, listOf); break;
        default: props.handleErrorSubmit();
      }
    }
    setClickHandleSubmit(false);
  }

  useEffect(() => {
    setListOf([...dataRow.list_of]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataRow.list_of])

  const handleChangePriorite = (value, id) => {
    let newListOf = [];
    if (value !== '') {
      value = parseInt(value) < 1 ? 1 : parseInt(value)
      // Verifie la disponibilité de la priorité
      let error = false;
      newListOf = listOf.map((v) => {
        if (v.priorite === value && v.id !== id) {
          error = true;
          return { ...v, error: true }
        } else if (v.id === id) return { ...v, priorite: value }
        else return { ...v, error: false }
      })
      error
        ? newListOf.find((v) => v.id === id)['error'] = true
        : newListOf.find((v) => v.id === id)['error'] = false
    } else {
      newListOf = listOf.map((v) => v.id === id ? { ...v, priorite: '' } : v)
    }
    setListOf(newListOf);
  }
  const [creatingPossible, setCreatingPossible] = useState(true)
  const handleCreateNewOF = () => {
    const arrayOf = [...listOf];
    if (creatingPossible) {

      axios({
        method: 'GET',
        url: 'attributaire/findOuter?id_cata=' + dataRow.id,
        headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
      }).then((response) => setListOfSelect(response.data));

      axios({
        method: 'GET',
        url: 'adresse/findOuterCommune?id_cata_attr=' + dataRow.id_of_cata,
        headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
      }).then((response) => setListCommuneSelect(response.data));

      arrayOf.push({ id: 'new_' + listOf.length, priorite: '', libelle: '' });
      setListOf(arrayOf);
      setCreatingPossible(false)
    }
  }

  const handleDeleteNewOf = (id) => {
    setListOf(listOf.filter((v) => v.id !== id))
  }
  const handleDeleteOf = (id) => {
    props.handleDeleteOf(id, dataRow.id);
  }

  const handleChangeValueSelectOF = (id, value) => {
    let OfSelected = listOfSelect.filter((v) => v.id === value);
    let libelle = OfSelected.length > 0 ? OfSelected[0].libelle : '';
    setListOf(listOf.map((v) => v.id === id ? { ...v, id_attr: value, libelle: libelle } : v))
  }
  const handleChangeValueSelectCommune = (id, value) => {
    let communeSelected = listCommuneSelect.filter((v) => v.id === value);
    let libelle = communeSelected.length > 0 ? communeSelected[0].libelle : '';
    setListOf(listOf.map((v) => v.id === id ? { ...v, id_commune: value, commune: libelle } : v))
  }

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={props.openModal}
        onClose={() => { props.handleHideDeleteIcon(); setClickHandleSubmit(false); props.handleCloseModal() }}
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
                {dataRow.id !== ''
                  ? IsPermitted(props.user, 'sollicitation', 'delete')
                    ? props.deleteClick
                      ? <>
                        <div className={classes.btnActionModal}><span className={classes.msgAlert}>Valider la suppression de la formation</span>
                          <Button onClick={props.handleHideDeleteIcon} variant="outlined" color="primary">
                            Annuler
                          </Button>
                          <Button onClick={() => props.handleDeleteClick(dataRow)} variant="contained" color="primary">
                            Supprimer
                          </Button>
                        </div>
                      </>
                      : < Tooltip title="Supprimer" aria-label="delete">
                        <IconButton aria-label="delete" color="primary" onClick={props.handleShowDeleteIcon}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>

                    : < Tooltip title="Fermer" aria-label="close">
                      <IconButton aria-label="fermer" color="primary" onClick={() => props.handleCloseModal(dataRow)}>
                        <CloseIcon />
                      </IconButton>
                    </Tooltip>
                  : < Tooltip title="Fermer" aria-label="close">
                    <IconButton aria-label="fermer" color="primary" onClick={() => props.handleCloseModal(dataRow)}>
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                }
              </div>
            </div>
            <form className={classes.root} noValidate autoComplete="off">
              <div className={classes.blocFormFullWidth}>
                <SelectPersonnalize
                  error={isSubmit && dataRow.id_lot === 'all' ? true : false}
                  handleChangeValue={props.handleChangeUpdateRow}
                  path={'global/findAll?table=lot'}
                  rowKey='id_lot'
                  value={dataRow.id_lot}
                  displayvalue='libelle'
                  label='Lot'
                />
              </div>

              <div className={classes.blocForm}>
                <TextField size="small" required label="N° Article" variant="outlined"
                  error={isSubmit && dataRow.n_Article === '' ? true : false} value={dataRow.n_Article}
                  onChange={(e) => props.handleChangeUpdateRow('n_Article', e.target.value)} />

                <TextField size="small" required label="Intitulé base Form" variant="outlined"
                  error={isSubmit && dataRow.intitule_form_marche === '' ? true : false} value={dataRow.intitule_form_marche}
                  onChange={(e) => props.handleChangeUpdateRow('intitule_form_marche', e.target.value)} />

                <TextField size="small" required label="Intitulé base Art" variant="outlined"
                  error={isSubmit && dataRow.intitule_form_base_article === '' ? true : false} value={dataRow.intitule_form_base_article}
                  onChange={(e) => props.handleChangeUpdateRow('intitule_form_base_article', e.target.value)} />

              </div>

              <div className={classes.blocForm}>
                <TextField size="small" label="FormaCode" variant="outlined"
                  error={isSubmit && dataRow.formacode === '' ? true : false} value={dataRow.formacode}
                  onChange={(e) => props.handleChangeUpdateRow('formacode', e.target.value)} />

                <SelectPersonnalize
                  error={isSubmit && dataRow.niveau_form === 'all' ? true : false}
                  handleChangeValue={props.handleChangeUpdateRow}
                  path={'global/findAll?table=formation_niveau'}
                  rowKey='niveau_form'
                  value={dataRow.niveau_form}
                  displayvalue='libelle'
                  label='Niveau'
                />
                <SelectPersonnalize
                  error={isSubmit && dataRow.objectif_form === 'all' ? true : false}
                  handleChangeValue={props.handleChangeUpdateRow}
                  path={'global/findAll?table=formation_objectif'}
                  rowKey='objectif_form'
                  value={dataRow.objectif_form}
                  displayvalue='libelle'
                  label='Objectif'
                />
              </div>

              <div className={classes.blocForm}>
                <TextField required type="number" size="small" label="Heure socle" variant="outlined"
                  error={isSubmit && dataRow.nb_heure_socle === '' ? true : false} value={dataRow.nb_heure_socle}
                  onChange={(e) => props.handleChangeUpdateRow('nb_heure_socle', e.target.value)}
                />

                <TextField required type="text" size="small" label="Heure Ent" variant="outlined"
                  error={isSubmit && dataRow.nb_heure_ent === '' ? true : false} value={dataRow.nb_heure_ent}
                  onChange={(e) => props.handleChangeUpdateRow('nb_heure_ent', e.target.value)}
                />

                <TextField required type="number" size="small" label="Heure Appui" variant="outlined"
                  error={isSubmit && dataRow.nb_heure_appui === '' ? true : false} value={dataRow.nb_heure_appui}
                  onChange={(e) => props.handleChangeUpdateRow('nb_heure_appui', e.target.value)}
                />

                <TextField required type='text' size="small" label="Heure Soutien" variant="outlined"
                  error={isSubmit && dataRow.nb_heure_soutien === '' ? true : false} value={dataRow.nb_heure_soutien}
                  onChange={(e) => props.handleChangeUpdateRow('nb_heure_soutien', e.target.value)}
                />

                <TextField required type="number" size="small" label="Prix < 6 pers" variant="outlined"
                  error={isSubmit && dataRow.prixTrancheA === '' ? true : false} value={dataRow.prixTrancheA}
                  onChange={(e) => props.handleChangeUpdateRow('prixTrancheA', e.target.value)}
                />

                <TextField required type="number" size="small" label="Prix > 6 pers" variant="outlined"
                  error={isSubmit && dataRow.prixTrancheB === '' ? true : false} value={dataRow.prixTrancheB}
                  onChange={(e) => props.handleChangeUpdateRow('prixTrancheB', e.target.value)}
                />
              </div>

            </form>
            <Divider className={classes.dividerTop} />
            <Typography className={classes.OFTitle}>OF Dispensateur</Typography>
            <TableContainer className={`${classes.table} scrollBar-personnalize`}>
              <Table aria-label="collapsible table" size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Priorité</TableCell>
                    <TableCell>Attributaires</TableCell>
                    <TableCell>Communes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listOf && listOf.map((v) => (
                    <TableRow key={'OF_' + v.id} >
                      <TableCell>
                        <Tooltip title="Supprimer l'OF" aria-label="delete">
                          <IconButton aria-label="delete" color="primary" onClick={() => handleDeleteOf(v.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <TextField error={v.error}
                          label="Priorité" type="number" size="small" className={classes.inputNumber}
                          value={v.priorite} variant="outlined" onChange={(e) => handleChangePriorite(e.target.value, v.id)}
                        />
                      </TableCell>
                      <TableCell>
                        {v.libelle}
                      </TableCell>
                      <TableCell>
                        {v.commune && v.commune.includes(':')
                          ? v.commune.split(':').map((x) => <Chip
                            label={x}
                            onDelete={() => console.log('delete COMMUNE FROM ATR')}
                            color="secondary"
                            variant="outlined"
                          />)
                          : <Chip
                            label={v.commune}
                            onDelete={() => console.log('delete COMMUNE FROM ATR')}
                            color="secondary"
                            variant="outlined"
                          />}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableBody><TableCell colspan={4} className={classes.lastRow}>Ajouter une ligne</TableCell></TableBody>
              </Table>
            </TableContainer>



            <Divider className={classes.dividerDown} />
            {dataRow.id &&
              <div className={`${classes.blockOfForm} scrollBar-personnalize`}>
                {listOf && listOf.map((v) =>
                  <div key={'OF_' + v.id} className={classes.blockOF}>
                    {v.id.toString().includes('new')
                      ? <>
                        <Tooltip title="Annuler" aria-label="cancel">
                          <IconButton aria-label="cancel" color="primary" onClick={() => {
                            setCreatingPossible(true);
                            handleDeleteNewOf(v.id)
                          }}>
                            <CancelOutlinedIcon />
                          </IconButton>
                        </Tooltip>
                        <TextField error={v.priorite === '' || v.error}
                          label="Priorité" type="number" size="small" className={classes.inputNumber}
                          value={v.priorite} variant="outlined" onChange={(e) => handleChangePriorite(e.target.value, v.id)}
                        />
                        <FormControl size="small" variant="outlined" className={classes.selectOf} error={!v.id_attr || v.id_attr === 'all'}>
                          <InputLabel id="demo-simple-select-outlined-label">Attributaire</InputLabel>
                          {listOfSelect.length > 0 &&
                            <Select
                              value={v.id_attr ? v.id_attr : 'all'}
                              onChange={(e) => handleChangeValueSelectOF(e.target.name, e.target.value)}
                              name={v.id}
                              label='Attributaire'
                            >
                              <MenuItem value="all">
                                <em>Choisir</em>
                              </MenuItem>
                              {listOfSelect.map((v) => (
                                <MenuItem key={v.id + '_' + v.libelle} value={v.id}>{v.libelle}</MenuItem>
                              ))}
                            </Select>
                          }
                        </FormControl>

                        <FormControl size="small" variant="outlined" className={classes.selectCommune} error={!v.id_commune || v.id_commune === 'all'}>
                          <InputLabel id="demo-simple-select-outlined-label">Commune</InputLabel>
                          {listCommuneSelect.length > 0 &&
                            <Select
                              value={v.id_commune ? v.id_commune : 'all'}
                              onChange={(e) => handleChangeValueSelectCommune(e.target.name, e.target.value)}
                              name={v.id}
                              label='Commune'
                            >
                              <MenuItem value="all">
                                <em>Choisir</em>
                              </MenuItem>
                              {listCommuneSelect.map((v) => (
                                <MenuItem key={v.id + '_' + v.libelle} value={v.id}>{v.libelle}</MenuItem>
                              ))}
                            </Select>
                          }
                        </FormControl>

                        {v.priorite && v.id_attr && !v.error
                          ? <Tooltip title="Enregistrer" aria-label="save">
                            <IconButton aria-label="save" color="primary" onClick={() => {
                              setCreatingPossible(true);
                              props.handleSaveNewOf(dataRow, v)
                            }}>
                              <SaveIcon />
                            </IconButton>
                          </Tooltip>
                          : <IconButton disabled aria-label="save" color="primary">
                            <SaveIcon />
                          </IconButton>
                        }
                      </>


                      : <>
                        <Tooltip title="Supprimer l'OF" aria-label="delete">
                          <IconButton aria-label="delete" color="primary" onClick={() => handleDeleteOf(v.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                        <TextField error={v.error}
                          label="Priorité" type="number" size="small" className={classes.inputNumber}
                          value={v.priorite} variant="outlined" onChange={(e) => handleChangePriorite(e.target.value, v.id)}
                        />
                        {v.libelle} -
                        <Chip
                          label={v.commune}
                          onDelete={() => console.log('delete COMMUNE FROM ATR')}
                          color="secondary"
                          variant="outlined"
                        />
                      </>}


                  </div>
                )}

                <div key={'OF_add'} className={classes.blockOF}>
                  {creatingPossible
                    ? <Tooltip title="Ajouter un OF" aria-label="add">
                      <IconButton aria-label="add" color="primary" onClick={handleCreateNewOF}>
                        <AddCircleOutlineIcon />
                      </IconButton>
                    </Tooltip>
                    : <IconButton disabled aria-label="add" color="primary">
                      <AddCircleOutlineIcon />
                    </IconButton>
                  }
                </div>
              </div>}

            <Divider className={classes.dividerDown} />
            <div className={classes.btnActionModal}>

              <Button onClick={props.handleCloseModal} variant="outlined" color="primary">
                Annuler
              </Button>
              {clickHandleSubmit
                ? <Button variant="contained" color="primary"
                  endIcon={<CircularProgress size={20} className={classes.spinnerBtn} />}>
                  Enregistrer
                </Button> :
                <Button onClick={() => { setClickHandleSubmit(true); handleSubmit() }}
                  variant="contained" color="primary" >
                  Enregistrer
                </Button>}


            </div>
          </div>
        </Fade>
      </Modal>
    </div >
  );
}
