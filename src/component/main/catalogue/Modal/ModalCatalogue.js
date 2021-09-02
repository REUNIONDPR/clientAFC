import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SelectPersonnalize from '../../../global/utils/SelectPersonnalize';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import { IsPermitted } from '../../../../utilities/Function';
import CircularProgress from '@material-ui/core/CircularProgress';
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

export default function ModalCatalogue(props) {
  const classes = useStyles();
  const [isSubmit, setIsSubmit] = useState(false) // Gestion des erreurs (champs vide)
  const dataRow = props.updateRow;
  const [clickHandleSubmit, setClickHandleSubmit] = useState(false)
  
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
      setClickHandleSubmit(false);
    }
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
                  error={isSubmit && dataRow.id_lot === '' ? true : false}
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

                  error={isSubmit && dataRow.niveau_form === '' ? true : false}
                  handleChangeValue={props.handleChangeUpdateRow}
                  path={'global/findAll?table=formation_niveau'}
                  rowKey='niveau_form'
                  value={dataRow.niveau_form}
                  displayvalue='libelle'
                  label='Niveau'
                />
                <SelectPersonnalize
                  error={isSubmit && dataRow.objectif_form === '' ? true : false}
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

            <div className={classes.btnActionModal}>

              <Button onClick={props.handleCloseModal} variant="outlined" color="primary">
                Annuler
              </Button>
              {clickHandleSubmit
                ? <Button variant="contained" color="primary"
                  endIcon={<CircularProgress size={20} />}>
                  Enregistrer
                </Button> :
                <Button onClick={() => {setClickHandleSubmit(true); handleSubmit(dataRow)}} variant="contained" color="primary" >
                  Enregistrer
                </Button> }


            </div>
          </div>
        </Fade>
      </Modal>
    </div >
  );
}
