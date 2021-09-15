import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { IsPermitted } from '../../../../../../utilities/Function';

export default function PartieBRS(props) {
    const isDisabled = !IsPermitted(props.user, 'sollicitation', 'updateDDO')
    
    return (
        <>
            <p>DDO</p>
            <TextField disabled={isDisabled} required type="text" size="small" label="N° article" variant="outlined"
                value={props.updateFormation.n_Article}
                onChange={(e) => props.handleChangeFormation('n_Article', e.target.value)}
            />

            <Button disabled={isDisabled} onClick={props.handleCancelSollicitation} variant="outlined" color="primary">
                Annuler
            </Button>

            {props.sollicitation.dateValidationDDO
                ? <Button disabled={isDisabled} onClick={() => props.handleEditFormation('DDO', false)} variant="contained" color="primary">
                    Modifier
                </Button>
                : <Button disabled={isDisabled} onClick={() => props.handleValideSollicitation('DDO')} variant="contained" color="primary">
                    Valider
                </Button>}
        </>
    )
}