import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid',
    borderColor: theme.palette.secondary.main,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function NewFormation(props) {
  const classes = useStyles();
  const [dataRow, setDataRow] = useState({}); 
  
  useEffect(() => {
    // console.log(props)
    // if (props.openModal && props.updateRow) {
    //   console.log(props)
    // } else {
    //   setDataRow({
    //     id: '',
    //     lot: '',
    //     user: '',
    //     statut: '',
    //     dispositif: '',
    //     nb_place: '',
    //     dateEntree: '',
    //     dateIcop: '',
    //     nConv: '',
    //     DateFin: '',
    //     DDINT1: '',
    //     DFINT1: '',
    //     DDINT2: '',
    //     DFINT2: '',
    //   })
    // }
  }, [props.openModal, props.updateRow])

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
            <h2 id="transition-modal-title">Transition modal</h2>
            <p id="transition-modal-description">react-transition-group animates me.</p>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
