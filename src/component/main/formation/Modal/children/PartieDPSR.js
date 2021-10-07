import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { IsPermitted } from '../../../../../utilities/Function';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    blockDPSR: {
        padding:theme.spacing(2),
        minWidth:500,
        '& > *': {
            paddingBottom: theme.spacing(1),
        },
    },
    blockAction: {
        display: 'flex',
        justifyContent: 'space-between',
    },
}))

export default function PartieDPSR(props) {
    const classes = useStyles();
    const isDisabled = !IsPermitted(props.user, 'sollicitation', 'conv')

    return (
        <div className={classes.blockDPSR}>
            <div>Cadre réservé à la DPSR</div>
            <div className={classes.blockAction}>
                <TextField disabled={isDisabled || (props.updateFormation.nConv !== '' && props.updateFormation.nConv !== null)}
                    required type="text" size="small" label="Conventionnement" variant="outlined"
                    value={props.updateFormation.nConv ? props.updateFormation.nConv : props.updateFormation.nConv_tmp}
                    onChange={(e) => props.handleChangeFormation('nConv_tmp', e.target.value)}
                />

                <Button disabled={isDisabled || !(props.updateFormation.nConv_tmp !== '')} onClick={props.handleSaveConv} variant="contained" color="primary">
                    Valider
                </Button>
            </div>
        </div>
    )
}