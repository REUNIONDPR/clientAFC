import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { IsPermitted } from '../../../../../utilities/Function';
import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

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
        '& > *':{
            marginRight:theme.spacing(1)
        }
    }
}))

export default function PartieBRS(props) {
    const classes = useStyles();
    const isDisabled = !IsPermitted(props.user, 'sollicitation', 'updateDDO')
    const [n_Article, setN_Article] = useState('')

    useEffect(() => {
        setN_Article(props.updateFormation.n_Article)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className={classes.blockDDO}>
            <div>Cadre réservé à la DO</div>

            <div className={classes.blockAction}>
                <TextField disabled={isDisabled || props.updateFormation.date_ValidationDDO !== ''} required type="text" size="small" label="N° article" variant="outlined"
                    value={props.updateFormation.n_Article}
                    onChange={(e) => props.handleChangeFormation('n_Article', e.target.value)}
                />
                <Button disabled={isDisabled || props.updateFormation.n_Article === n_Article} onClick={() => props.handleEditFormation('DDO', false)} variant="contained" color="primary">
                    Modifier
                </Button>
            </div>

            <div  className={classes.blockAction}>
                <Button disabled={isDisabled} onClick={props.handleCancelSollicitation} variant="outlined" color="primary">
                    Annuler la formation
                </Button>
                <Button disabled={isDisabled || props.sollicitation.date_ValidationDDO ? true : false} onClick={() => props.handleValideSollicitation('DDO')} variant="contained" color="primary">
                    Valider
                </Button>
            </div>
        </div >
    )
}