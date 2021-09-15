
import List from '@material-ui/core/List';
import SendIcon from '@material-ui/icons/Send';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import SollicitationListAttr from './SollicitationListAttr';
import { dateFormat, dateTimeFormat } from '../../../../../../utilities/Function';
import { useEffect, useState } from 'react';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CardValide from './CardValide';
import CardWaiting from './CardWaiting';
import CommentIcon from '@material-ui/icons/Comment';
import axios from 'axios';
import Cookie from 'js-cookie';
import CardHisto from './CardHisto';

const useStyles = makeStyles((theme) => ({
    blockSolAttr: {
        paddingTop: theme.spacing(5),
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'space-between',
    },
    blockAttributaire: {
        width: '47%',
        border: '1px solid #e0e0e0',
    },
    blockSollicitation: {
        width: '47%',
        border: '1px solid #e0e0e0',
        padding: 16,
        // display: 'flex',
        // justifyContent: 'center',
    },
    listAttributaire: {
        padding: 0,
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
    block: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
    },
    blockTitle: {
        display: 'flex',
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        '& > svg': {
            color: 'green',
        }
    },
}));

export default function Sollicitation(props) {
    const classes = useStyles();
    const [showDetailRefus, setShowDetailRefus] = useState(false);
    const [arrayAttrib, setArrayAttrib] = useState([]);
    const [radioSelected, setRadioSelected] = useState('');
    const [refusReason, setRefusReason] = useState('');
    const [sollicitationSelected, setSollicitationSelected] = useState(0);
    const [nextSollicitation, setNextSollicitation] = useState({})
    const [sollicitationVisible, setSollicitationVisible] = useState({ id: '', sol: {} });
    const [historicList, setHistoricList] = useState([])

    useEffect(() => {
        let firstSol = true;
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

            let sol = props.sollicitationList.find((s) => s.attributaire === v.id) || {}

            let isSolValidate = false;

            if (sol.hasOwnProperty('date_etat')) {
                let myDate = dateTimeFormat(sol.date_etat)
                if (sol.etat === 8) {
                    Obj = { etat: false, error: true, text: `L'OF à refusé la sollicitation le ${myDate.date} à ${myDate.time}`, finDeSollicitation: true }
                } else if (sol.etat === 3) {
                    if (firstSol) firstSol = false; // Ne plus avoir accès aux sollicitations suivantes
                    isSolValidate = true;
                    Obj = { etat: false, error: false, text: `L'OF à accepté la sollicitation le ${myDate.date} à ${myDate.time}`, finDeSollicitation: true }
                } else if (sol.etat === 4) {
                    if (firstSol) firstSol = false; // Ne plus avoir accès aux sollicitations suivantes
                    isSolValidate = true;
                    Obj = { etat: false, error: false, text: `Validation de la DT le ${myDate.date} à ${myDate.time}`, finDeSollicitation: true }
                } else if (sol.etat === 5) {
                    if (firstSol) firstSol = false; // Ne plus avoir accès aux sollicitations suivantes
                    isSolValidate = true;
                    Obj = { etat: false, error: false, text: `Validation de la DDO le ${myDate.date} à ${myDate.time}`, finDeSollicitation: true }
                } else {
                    if (firstSol) firstSol = false; // Ne plus avoir accès aux sollicitations suivantes le temps que celle ci évolue
                    Obj = { etat: false, error: undefined, text: `Sollicité le ${myDate.date} à ${myDate.time}`, finDeSollicitation: false }
                }
            } else {
                Obj = { etat: !firstSol, error: undefined, text: `Aucune sollicitation`, finDeSollicitation: false }
                if (firstSol) firstSol = false;
            }

            return {
                ...v, ...sol,
                disabled: Obj.etat,
                text: Obj.text,
                texterror: Obj.error,
                finDeSollicitation: Obj.finDeSollicitation,
                isSolValidate: isSolValidate
            };
        })

        setArrayAttrib(arrayAttributaire)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.sollicitationList])

    useEffect(() => {
        if (arrayAttrib.length > 0) {
            
            if (sollicitationSelected === 0) {
                let solValide = arrayAttrib.find((v) => v.isSolValidate);
                if (!solValide) {
                    solValide = arrayAttrib.find((v) => !v.finDeSollicitation);
                }
                setNextSollicitation(solValide);
                setSollicitationVisible(solValide);
            } else {
                let sol = arrayAttrib.find((v) => v.id === sollicitationSelected);
                if(sol.finDeSollicitation && !sol.isSolValidate){
                    // axios get histo
                    axios({
                        method:'GET',
                        url:'sollicitation/findHistoric?id_sol='+sol.id_sol,
                        headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
                    }).then((response) => setHistoricList(response.data))
                }else setHistoricList([])
                setSollicitationVisible(sol);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sollicitationSelected, arrayAttrib])

    const handleChangeSollicitationSelected = (id) => {
        setSollicitationSelected(id)
    }
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
                        {arrayAttrib.map((v, i) =>
                            <SollicitationListAttr
                                nextSollicitation={nextSollicitation}
                                handleChangeSollicitationSelected={handleChangeSollicitationSelected}
                                data={v}
                                key={'list_' + i}
                            />
                        )}
                    </List>
                }

            </div>
            <div className={classes.blockSollicitation}>
                {sollicitationVisible &&
                    <div className={classes.block} >
                        <div className={classes.blockTitle}>
                            {sollicitationVisible.libelle} {sollicitationVisible.dateValidationDT && <CheckCircleOutlineIcon />}
                        </div>

                        {!sollicitationVisible.dateMailOF // Si OF pas encore contacté
                            ? <div className={classes.blockSolToContact}>{props.isSubmittingSol
                                ? <Button onClick={props.handleSubmitSol} variant="contained" color="secondary"
                                    endIcon={<CircularProgress size={20} className={classes.spinnerBtn} />}
                                    startIcon={<SendIcon />}>
                                    Solliciter l'OF
                                </Button>
                                : <Button disabled={sollicitationVisible.id !== nextSollicitation.id} onClick={() => props.handleCreateSollicitation(sollicitationVisible)} variant="contained" color="secondary"
                                    startIcon={<SendIcon />}>
                                    Solliciter l'OF
                                </Button>}
                            </div>
                            : !sollicitationVisible.dateRespOF  // Si pas encore de réponse de l'OF 
                                ? <CardWaiting
                                    OF={sollicitationVisible.libelle}
                                    date={dateFormat(sollicitationVisible.dateMailOF)}
                                    handleChangeRadioResp={handleChangeRadioResp}
                                    refusReason={refusReason}
                                    handleChangeRefusReason={handleChangeRefusReason}
                                    showDetailRefus={showDetailRefus}
                                    radioSelected={radioSelected}
                                    handleClickValide={() => props.handleResponseSollicitation(radioSelected, sollicitationVisible, refusReason)}
                                />
                                : sollicitationVisible.isSolValidate // Si sollicitation validée
                                    ? <CardValide
                                        updateFormation={props.updateFormation}
                                        handlAddIcop={props.handlAddIcop}
                                        icopList={props.icopList}
                                        lieuExecutionList={props.lieuExecutionList}
                                        handleChangeSollicitation={props.handleChangeSollicitation}
                                        sollicitation={props.sollicitation}
                                        handleValideSollicitation={props.handleValideSollicitation}
                                        user={props.user}
                                    />
                                    : <CardHisto data={historicList} />
                        }
                    </div>}
                {/* {sollicitationVisible.isSolValidate
                    ? <CardValide 
                        updateFormation={props.updateFormation} 
                        handlAddIcop={props.handlAddIcop} 
                        icopList={props.icopList}
                        lieuExecutionList={props.lieuExecutionList}
                        handleChangeSollicitation={props.handleChangeSollicitation} 
                        sollicitation={props.sollicitation}
                        handleValideSollicitation={props.handleValideSollicitation}
                        user={props.user}
                        />
                    : sollicitationVisible
                        ? sollicitationVisible.sol
                            ? !sollicitationVisible.sol.dateRespOF && <CardWaiting
                                OF={sollicitationVisible.libelle}
                                date={dateFormat(sollicitationVisible.sol.dateMailOF)}
                                handleChangeRadioResp={handleChangeRadioResp}
                                refusReason={refusReason}
                                handleChangeRefusReason={handleChangeRefusReason}
                                showDetailRefus={showDetailRefus}
                                radioSelected={radioSelected}
                                handleClickValide={() => props.handleResponseSollicitation(radioSelected, sollicitationVisible.sol, refusReason)} />
                            : <div>
                                <div><p>{sollicitationVisible.libelle}</p></div>
                                <div className={classes.blockSolToContact}>{props.isSubmittingSol
                                    ? <Button onClick={props.handleSubmitSol} variant="contained" color="secondary"
                                        endIcon={<CircularProgress size={20} className={classes.spinnerBtn} />}
                                        startIcon={<SendIcon />}>
                                        Solliciter l'OF
                                    </Button>
                                    : <Button onClick={() => props.handleCreateSollicitation(sollicitationVisible)} variant="contained" color="secondary"
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
                        </div>} */}

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
            {/* <CommentIcon /> */}
        </div>
    )
}