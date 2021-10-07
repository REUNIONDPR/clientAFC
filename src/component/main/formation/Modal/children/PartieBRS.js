import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { IsPermitted } from '../../../../../utilities/Function';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Confirm from '../../../../global/Confirm';

const useStyles = makeStyles((theme) => ({
    blockDDO: {
        padding: theme.spacing(2),
        minWidth: 500,
        '& > *': {
            paddingBottom: theme.spacing(1),
        },
    },
    blockAction: {
        display: 'flex',
        alignItems:'center',
        '& > *': {
            marginRight: theme.spacing(1)
        }
    }
}))

export default function PartieBRS(props) {
    const classes = useStyles();
    const isDisabled = !IsPermitted(props.user, 'sollicitation', 'updateDDO')
    const [n_Article, setN_Article] = useState(props.updateFormation.n_Article.split('-')[1])
    const [openConfirm, setOpenConfirm] = useState(false)
    const n_Article_base = props.updateFormation.n_Article.split('-')[0];
    const [error, setError] = useState(false)

    const handleClose = () => {
        setOpenConfirm(false)
    }
    const handleValide = () => {
        props.changeNArticle(n_Article_base+'-'+n_Article)
        setOpenConfirm(false)
    }
    
    const handleChangeArticle = (value) => {
        let regex = new RegExp("[a-z]|[A-Z]");
        setError(regex.test(value) || isNaN(parseInt(value))) 
        setN_Article(value)
    }
    
    return (
        <div className={classes.blockDDO}>
            <Confirm open={openConfirm} value={{ key: 'n_Article', value_old: props.updateFormation.n_Article, value_new: n_Article_base+'-'+n_Article }}
                message={"Le compteur pour la formation sera mis à jour."} 
                handleClose={handleClose}
                handleValide={handleValide} />
            <div>Cadre réservé à la DO</div>

            <div className={classes.blockAction || (props.sollicitation.date_ValidationDDO !== '')}>
                <span>{n_Article_base}-</span>
                <TextField disabled={isDisabled} error={error} required type="text" size="small" label="N° article" variant="outlined"
                    value={n_Article}
                    onChange={(e) => handleChangeArticle(e.target.value)}
                />
                <Button disabled={isDisabled || (props.sollicitation.date_ValidationDDO ? true : false) || error}
                    onClick={() => setOpenConfirm(true)} variant="contained" color="primary">
                    Modifier
                </Button>
            </div>

            <div className={classes.blockAction}>
                <Button disabled={isDisabled || (props.sollicitation.etat === 10 ? false : props.sollicitation.date_ValidationDDO ? true : false)} onClick={() => props.handleValideSollicitation('DDO')} variant="contained" color="primary">
                    Valider
                </Button>
            </div>
        </div >
    )
}