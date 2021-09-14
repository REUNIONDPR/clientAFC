
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export default function CardWaiting(props) {
    const classes = {};
    return (
        <>

            <p>{props.OF} contacté le {props.date}</p>

            <div className={classes.blockSolActiveRadio}>
                <FormControl component="fieldset">
                    <RadioGroup row aria-label="responseOF" className={classes.radioGrp} name="responseOF" onChange={props.handleChangeRadioResp}>
                        <FormControlLabel
                            value="refus"
                            control={<Radio color="secondary" />}
                            label="Refusé"
                        />
                        <FormControlLabel
                            value="accept"
                            control={<Radio color="secondary" />}
                            label="Accepté"
                        />
                    </RadioGroup>
                </FormControl>
            </div>
            <div>
                {props.showDetailRefus && <TextField
                    label="Détail du refus de l'OF"
                    fullWidth
                    multiline
                    rows={4}
                    value={props.refusReason}
                    onChange={props.handleChangeRefusReason}
                    placeholder="Détail du refus de l'OF"
                    variant="outlined"
                />}
            </div>
            <div className={classes.blockSolActiveBtn}>
                {props.radioSelected === ''
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