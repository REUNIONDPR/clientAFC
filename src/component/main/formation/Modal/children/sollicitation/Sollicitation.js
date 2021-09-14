
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
import { dateFormat, dateTimeFormat } from '../../../../../../utilities/Function';
import TextField from '@material-ui/core/TextField';
import { useState } from 'react';
import CardValide from './CardValide';
import CardWaiting from './CardWaiting';

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
        justifyContent: 'space-between',
    },
    blockAttributaire: {
        width: '49%',
    },
    blockSollicitation: {
        width: '49%',
        // display: 'flex',
        // justifyContent: 'center',
    },
    listAttributaire: {
        padding: 0,
        border: '1px solid #e0e0e0',
    },
    spinnerBtn: {
        color: "#fff",
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

        let Obj = { etat: false, error: false, text: '', finDeSollicitation: false };
        // etat : disable ou pas
        // error : couleur du message (undefined pour normal = bleu)
        // text : text à afficher
        // finDeSollicitation : pour trouver la sollicitation suivante si refus de l'OF.
        // isSolValidate : si la sollicitation à été validé

        Obj = arrayCommunes.indexOf(props.updateFormation.id_commune) === -1
            ? { ...Obj, etat: true, error: true, text: 'Commune indisponible', finDeSollicitation: true }
            : { ...Obj }

        let sol = props.sollicitationFormation.find((s) => s.attributaire === v.id)

        let isSolValidate = false;
        if (sol) {
            let myDate = dateTimeFormat(sol.date_etat)
            if (sol.etat === 8) {
                Obj = { etat: false, error: true, text: `L'OF à refusé la sollicitation le ${myDate.date} à ${myDate.time}`, finDeSollicitation: true }
            } else if (sol.etat === 3) {
                isSolValidate = true;
                Obj = { etat: false, error: false, text: `L'OF à accepté la sollicitation le ${myDate.date} à ${myDate.time}`, finDeSollicitation: true }
            } else {
                Obj = { etat: false, error: undefined, text: `Sollicité le ${myDate.date} à ${myDate.time}`, finDeSollicitation: false }
            }
        }

        return { ...v, disabled: Obj.etat, text: Obj.text, texterror: Obj.error, sol: sol, finDeSollicitation: Obj.finDeSollicitation, isSolValidate: isSolValidate };
    })

    const nextSollicitation = arrayAttributaire.find((v) => !v.finDeSollicitation);
    const isSolValidate = arrayAttributaire.find((v) => v.isSolValidate);

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
                {isSolValidate
                    ? <CardValide />
                    : nextSollicitation
                        ? nextSollicitation.sol
                            ? !nextSollicitation.sol.dateRespOF && <CardWaiting
                                OF={nextSollicitation.libelle}
                                date={dateFormat(nextSollicitation.sol.dateMailOF)}
                                handleChangeRadioResp={handleChangeRadioResp}
                                refusReason={refusReason}
                                handleChangeRefusReason={handleChangeRefusReason}
                                showDetailRefus={showDetailRefus}
                                radioSelected={radioSelected}
                                handleClickValide={() => props.handleResponseSollicitation(radioSelected, nextSollicitation.sol, refusReason)} />
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
                        : <div>
                            <p>Plus d'OF à contacter</p>
                            <Button onClick={props.handleCancelForm} variant="contained" color="secondary" >
                                Cliquez pour annuler la formation
                            </Button>
                        </div>}

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