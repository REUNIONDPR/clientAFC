
import List from '@material-ui/core/List';
import SendIcon from '@material-ui/icons/Send';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import SollicitationListAttr from './SollicitationListAttr';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { dateFormat, dateTimeFormat } from '../../../../utilities/Function';
import TextField from '@material-ui/core/TextField';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
    icon: {
        fill: '#777777',
        cursor: 'default',
    },
    avatar: {
        color: theme.palette.getContrastText(theme.palette.secondary.main),
        backgroundColor: theme.palette.secondary.main,
    },
    blockSolAttr: {
        display: 'flex',
        alignItems: 'center',
    },
    blockAttributaire: {
        // width: '40%',
    },
    blockSollicitation: {
        width: '60%',
        display: 'flex',
        justifyContent: 'center',
    },
    listAttributaire: {
        padding: 0,
        border: '1px solid #e0e0e0',
    },
    spinnerBtn: {
        color: "#fff",
    },
    attributaireDestinataire: {
        whiteSpace: 'nowrap',
    },
    attributaireStatus: {
        margin: 0,
        display: 'block',
        color: 'red',
    },
    radioGrp: {
        justifyContent: 'space-evenly',
    },
    blockSolActiveRadio: {
        display: 'flex',
        justifyContent: 'space-evenly',
    },
    blockSolActiveBtn: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: theme.spacing(2),
    },
    blockSolToContact: {
        display: 'flex',
        justifyContent: 'center'
    },
}));

export default function Sollicitation(props) {
    const classes = useStyles();
    const [showDetailRefus, setShowDetailRefus] = useState(false);

    const arrayAttributaire = props.attributaireList.map((v) => {

        let arrayCommunes = v.id_communes
            ? v.id_communes.includes('-') ? v.id_communes.split('-').map((v) => parseInt(v)) : [parseInt(v.id_communes)]
            : [];

        let Obj = { etat: false, text: '' };
        Obj = arrayCommunes.indexOf(props.updateFormation.id_commune) === -1
            ? { etat: true, text: 'Commune indisponible' }
            : { etat: false, text: '' }

        let sol = props.sollicitationFormation.find((s) => s.attributaire === v.id)

        if (sol && sol.etat === 3) {
            let myDate = dateTimeFormat(sol.date_etat)
            Obj = { etat: true, text: `L'OF à refusé la formation le ${myDate.date} à ${myDate.time}` }
        }

        return { ...v, disabled: Obj.etat, text: Obj.text, sol: sol };
    })

    const nextSollicitation = arrayAttributaire.find((v) => !v.disabled);

    const [radioSelected, setRadioSelected] = useState('');
    const [refusReason, setRefusReason] = useState('');

    const handleChangeRefusReason = (e) => {
        setRefusReason(e.target.value)
    }

    const handleChangeRadioResp = (e) => {
        let response = e.target.value

        setRadioSelected(response)
        setShowDetailRefus(response === 'refus')
    }
    
    return (
        <div className={classes.blockSolAttr}>
            <div className={classes.blockAttributaire}>
                {props.attributaireList.length > 0 &&
                    <List className={classes.listAttributaire}>
                        {arrayAttributaire.map((v, i) =>
                            <SollicitationListAttr data={v} key={'list_' + i} />
                        )}
                    </List>
                }

            </div>
            <div className={classes.blockSollicitation}>
                {nextSollicitation
                    ? nextSollicitation.sol
                        ? <div>
                            <p>{nextSollicitation.libelle} contacté le {dateFormat(nextSollicitation.sol.dateMailOF)}</p>
                            {nextSollicitation.sol.dateRespOF
                                ? <><p>Affiche la sollicitation validé</p></>
                                :
                                <>
                                    <div className={classes.blockSolActiveRadio}>
                                        <FormControl component="fieldset">
                                            <RadioGroup row aria-label="responseOF" className={classes.radioGrp} name="responseOF" onChange={handleChangeRadioResp}>
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
                                        {showDetailRefus && <TextField
                                            label="Détail du refus de l'OF"
                                            fullWidth
                                            multiline
                                            rows={4}
                                            value={refusReason}
                                            onChange={handleChangeRefusReason}
                                            placeholder="Détail du refus de l'OF"
                                            variant="outlined"
                                        />}
                                    </div>
                                    <div className={classes.blockSolActiveBtn}>
                                        {radioSelected === ''
                                            ? <Button disabled variant="contained" color="secondary">
                                                Enregistrer
                                            </Button>
                                            : <Button onClick={() => props.handleResponseSollicitation(radioSelected, nextSollicitation.sol, refusReason)} variant="contained" color="secondary">
                                                Enregistrer
                                            </Button>
                                        }
                                    </div> </>}

                        </div>
                        : <div>
                            <div><p>{nextSollicitation.libelle}</p></div>
                            <div className={classes.blockSolToContact}>{props.isSubmittingSol
                                ? <Button onClick={props.handleSubmitSol} variant="contained" color="secondary"
                                    endIcon={<CircularProgress size={20} className={classes.spinnerBtn} />}
                                    startIcon={<SendIcon />}>
                                    Solliciter l'OF
                                </Button>
                                : <Button onClick={() => props.handleCreateSollicitation(nextSollicitation)} variant="contained" color="secondary"
                                    startIcon={<SendIcon />}>
                                    Solliciter l'OF
                                </Button>}
                            </div>
                        </div>
                    : <p>Plus d'OF à contacter</p>}

                {/* <p>Si changement formation => créer nouvelle formation copie de celle là pour créer de nouvelle sollicitation</p>
                        <p> id_sol = 0 si aucune sollicitation ? -> Afficher les bouton pour solliciter</p> */}
                {/* {props.updateFormation.id_sol === 0 &&
                    <div className={classes.sollicitaitonBtn}>
                        {props.attributaireList.length > 0
                            ? props.isSubmittingSol
                                ? <Button onClick={props.handleSubmitSol} variant="contained" color="secondary"
                                    endIcon={<CircularProgress size={20} className={classes.spinnerBtn} />}
                                    startIcon={<SendIcon />}>
                                    Solliciter les OFs
                                </Button>
                                : <Button onClick={props.handleCreateSollicitation} variant="contained" color="secondary"
                                    startIcon={<SendIcon />}>
                                    Solliciter les OFs
                                </Button>

                            : <Button disabled variant="contained" color="secondary"
                                startIcon={<SendIcon />}>
                                Aucun OF à contacter
                            </Button>}
                    </div>
                } */}
            </div>
        </div>
    )
}