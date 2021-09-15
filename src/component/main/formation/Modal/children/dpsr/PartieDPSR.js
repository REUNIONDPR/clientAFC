import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { IsPermitted } from '../../../../../../utilities/Function';

export default function PartieDPSR(props) {
    
    const isDisabled = !IsPermitted(props.user, 'sollicitation', 'updateDT')

    return (
        <>
            <TextField disabled={isDisabled} required type="text" size="small" label="N° article" variant="outlined"
                value={props.updateFormation.nConv}
                onChange={(e) => props.handleChangeFormation('nConv', e.target.value)}
            />

            <Button disabled={isDisabled} onClick={console.log('action')} variant="outlined" color="primary">
                Annuler
            </Button>

            <Button disabled={isDisabled} onClick={console.log('action')} variant="contained" color="primary">
                Valider
            </Button>
            <p>BRS</p>
        </>
    )
}