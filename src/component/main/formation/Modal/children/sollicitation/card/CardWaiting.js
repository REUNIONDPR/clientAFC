import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    blockCenter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));
export default function CardWaiting(props) {
    const classes = useStyles();
    
    return (
        <>
            <div className={classes.blockCenter}>
                <FormControl component="fieldset">
                    <RadioGroup row aria-label="responseOF" className={classes.radioGrp} name="responseOF" 
                        onChange={props.handleChangeRadioResp}>
                        <FormControlLabel
                            value="refus"
                            disabled={props.updateFormation.etat === 20}
                            control={<Radio color="secondary" />}
                            label="Refusé"
                        />
                        <FormControlLabel
                            value="accept"
                            disabled={props.updateFormation.etat === 20}
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
                    disabled={!props.showDetailRefus}
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
                    : <Button onClick={props.handleClickValide} variant="contained" color="secondary">
                        Enregistrer
                    </Button>
                }
            </div> </>
    )
}