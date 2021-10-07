import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { IsPermitted } from '../../../../../../../utilities/Function';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    blockCenter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    spinnerBtn: {
        color: "#fff",
    },
}));

export default function CardWaiting(props) {
    const classes = useStyles();
    const isDisabled = !(IsPermitted(props.user, 'sollicitation', 'updateDT')) ||
        props.user.fonction !== props.updateFormation.userFct ||
        props.updateFormation.etat > 15

    return (
        <>
            <div className={classes.blockCenter}>
                <FormControl component="fieldset">
                    <RadioGroup row aria-label="responseOF" className={classes.radioGrp} name="responseOF"
                        onChange={props.handleChangeRadioResp}>
                        <FormControlLabel
                            value="refus"
                            disabled={props.updateFormation.etat > 15 || isDisabled}
                            control={<Radio color="secondary" />}
                            label="Refusé"
                        />
                        <FormControlLabel
                            value="accept"
                            disabled={props.updateFormation.etat > 15 || isDisabled}
                            control={<Radio color="secondary" />}
                            label="Accepté"
                        />
                    </RadioGroup>
                </FormControl>
            </div>
            <div>
                <TextField
                    label="Détail si refus"
                    fullWidth
                    disabled={!props.showDetailRefus || isDisabled}
                    multiline
                    rows={4}
                    value={props.refusReason}
                    onChange={props.handleChangeRefusReason}
                    placeholder="Détail si refus"
                    variant="outlined"
                />
            </div>
            
            <div className={classes.blockCenter}>
                {(props.radioSelected === '' || props.updateFormation.etat === 20)
                    ? <Button disabled variant="contained" color="secondary">
                        Enregistrer
                    </Button>
                    : props.isSubmittingSol.responseSollicitation
                        ? <Button disabled={isDisabled} variant="contained" color="secondary"
                            endIcon={<CircularProgress size={20} className={classes.spinnerBtn} />}>
                            Enregistrer
                        </Button>
                        : <Button disabled={isDisabled} onClick={props.handleClickValide} variant="contained" color="secondary">
                            Enregistrer
                        </Button>
                }
            </div> </>
    )
}