import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import { UserContext } from '../../../context/user.context';
import Cookie from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import ModalFormation from './Modal/ModalFormation';
import { codeToName, dateFormat, calculDateFin } from '../../../utilities/Function';
import SnackBar from '../../global/SnackBar/SnackBar';
import './sollicitation.css';
import { Tooltip } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import { IsPermitted } from '../../../utilities/Function';
import IconButton from '@material-ui/core/IconButton';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { exit } from 'process';
// import { title } from 'process';
// import Cards from './Card/Cards';
// import ListItemIcon from '@material-ui/core/ListItemIcon';

const getDateToday = () => {
    let date = new Date();
    return date.getFullYear() + '-' +
        (date.getMonth() + 1).toString().padStart(2, '0') + '-' +
        date.getDate().toString().padStart(2, '0');
}

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
    etatTooltip:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    icon: {
        fill: '#777777',
        cursor: 'default',
    },
    tooltip: {
        fontSize: '15px',
        maxWidth: 'none',
    },
    categorie: {
        marginTop: 20,
    },
    categorieTitle: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        display: 'flex',
        padding: '10px 0 10px 10px',
        width: '20%',
        border: '1px solid grey',
        borderRadius: '0 20px 0 0',
        background: theme.palette.primary.main,
        color: '#fff'
    },
    btn: {
        marginRight: 20,
    }, listOptions: {
        padding: 0,
        position: 'absolute',
        right: 50,
        border: '1px solid ' + theme.palette.secondary.main,
        '& > *': {
            textAlign: 'right',
        }
    },

}));

export default function Sollicitation() {

    const classes = useStyles();
    const { user } = useContext(UserContext);

    const [formationList, setFormationList] = useState([]);
    const [lotList, setLotList] = useState([]);
    const [dispositifList, setDispositifList] = useState([]);
    const [catalogueList, setCatalogueList] = useState([]);
    const [agence_refList, setAgence_refList] = useState([]);
    const [communeList, setCommuneList] = useState([]);

    const [sollicitationFormation, setSollicitationFormation] = useState([]);
    const [attributaireList, setAttributaireList] = useState([]);

    const [openMoreOptions, setOpenMoreOptions] = useState('');
    const [moreOptionsList, setMoreOptionsList] = useState([]);
    const [openModalCreateSol, setOpenModalCreateSol] = useState(false)
    const [updateFormation, setupdateFormation] = useState({
        id: '',
        id_lot: 'all',
        id_cata: 'all',
        intitule: '',
        idgasi: user.idgasi,
        userFct: '',
        dt: '',
        etat: 1,
        agence_ref: 'all',
        dispositif: 1,
        n_Article: '',
        nbarticle: 0,
        nb_place: '',
        adresse: '',
        commune: '',
        id_commune: 'all',
        date_creation: getDateToday(),
        date_entree_demandee: '',
        date_entree_fixe: '',
        date_fin: '',
        date_DDINT1: '',
        date_DFINT1: '',
        interruption_1: 0,
        date_DDINT2: '',
        date_DFINT2: '',
        interruption_2: 0,
        heure_max_session: 0,
        heure_entreprise: 0,
        heure_centre: 0,
        date_nconv: '',
        nConv: '',
        vague: '',
        id_sol: '',
    });

    // --------------- SnackBar
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [messageSnackBar, setMessageSnackBar] = useState('');
    const [severity, setSeverity] = useState();
    const [anchorElMenu, setAnchorElMenu] = React.useState(null);
    const openMenu = Boolean(anchorElMenu);

    const handleClickOpenMenu = (event, id) => {
        setOpenMoreOptions(id)
        setAnchorElMenu(event.currentTarget);
    };

    const handleCloseOpenMenu = () => {
        setAnchorElMenu(null);
    };
    const handleCloseSnackbar = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackBar(false);
        setMessageSnackBar('');
    };

    useEffect(() => {
        if (user.idgasi) {
            setupdateFormation({ ...updateFormation, idgasi: user.idgasi, userFct: user.fonction });
        }

        switch (parseInt(user.fonction)) {
            case 1: setMoreOptionsList(['show', 'contact', 'cancel']); break;
            case 2: setMoreOptionsList(['show', 'contact', 'cancel']); break;
            case 6: setMoreOptionsList(['show', 'contact', 'cancel']); break;
            default: setMoreOptionsList(['show']); break;

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])



    const handleShowFormation = () => {
        handleCloseOpenMenu()
        let formation = {};
        if (openMoreOptions !== '') {
            formation = formationList.find((v) => v.id === openMoreOptions);
            setupdateFormation(formation);
            setOpenMoreOptions('');
        }

        // Si lotList est vide = premier fois qu'on ouvre le modal
        if (lotList.length === 0) {
            axios({
                method: 'GET',
                url: 'global/findAll?table=lot',
                headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
            }).then((response) => setLotList(response.data));
        }

        // Si dispositifList est vide = premier fois qu'on ouvre le modal
        if (dispositifList.length === 0) {
            axios({
                method: 'GET',
                url: 'global/findAll?table=dispositif',
                headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
            }).then((response) => setDispositifList(response.data));
        }

        // Si agence_refList est vide = premier fois qu'on ouvre le modal
        if (agence_refList.length === 0) {
            axios({
                method: 'GET',
                url: 'global/findAll?table=ape',
                headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
            }).then((response) => setAgence_refList(response.data));
        }

        // Si id_lot !== 'all' = récupère le catalgoue du lot
        if (formation && formation.id_lot !== 'all') {
            axios({
                method: 'GET',
                url: '/catalogue/find?field=id_lot&data=' + formation.id_lot,
                headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
            }).then((response) => {
                setCatalogueList(response.data);
            });
        }

        // Si id_cata !== 'all' = récupère les communes possible (selon les attributaires)
        if (formation && formation.id_cata !== 'all') {
            axios({
                method: 'GET',
                url: '/catalogue/findCommune?id_cata=' + formation.id_cata,
                headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
            }).then((response) => {
                setCommuneList(response.data);
            });

            // si formation déjà créer, 
            // Récupère list des attr possible
            // Récupère list des sol ?
            if (formation.id !== '') {
                let sql = `id_formation=${formation.id}`
                axios({
                    method: 'GET',
                    url: '/formation/findAttributaires?' + sql,
                    headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
                }).then((response) => setAttributaireList(response.data));

                axios({
                    method: 'GET',
                    url: '/sollicitation/find?' + sql,
                    headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
                }).then((response) => setSollicitationFormation(response.data));
            }
        }

        setOpenModalCreateSol(true);
    }

    const [createNewFormationFromThis, setCreateNewFormationFromThis] = useState(false)

    const handleCreateNewFormationFromThis = () => {
        setCreateNewFormationFromThis(true);
        setupdateFormation({ ...updateFormation, id: '' })
        setSollicitationFormation([])
    }
    const ChangeFormation = (k, v) => {
        let calcul_date_fin = { date_fin: '', interruption_1: '', interruption_2: '' };

        switch (k) {
            case 'id_lot':
                setupdateFormation({ ...updateFormation, [k]: v, id_cata: 'all' })
                if (v !== 'all') {
                    // Get formation du lot concerné
                    axios({
                        method: 'GET',
                        url: '/catalogue/find?field=id_lot&data=' + v,
                        headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
                    }).then((response) => {
                        setCatalogueList(response.data);
                    });
                }
                break;
            case 'id_cata':
                if (v !== 'all') {

                    let intitule = v === 'all' ? '' : catalogueList.find((x) => x.id === v).intitule;

                    // Get commune disponible pour la foramtion demandée
                    axios({
                        method: 'GET',
                        url: '/catalogue/findCommune?id_cata=' + v,
                        headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
                    }).then((response) => {
                        setCommuneList(response.data)
                    });
                    // Get donnée de la formation demandée
                    axios({
                        method: 'GET',
                        url: '/catalogue/find?field=id&data=' + v,
                        headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
                    }).then((response) => {

                        // Calcul nombre d'heure de formation
                        let catalogue = response.data[0];

                        let heure_socle = parseInt(catalogue.nb_heure_socle);
                        let appui_recherche_emploi = parseInt(catalogue.nb_heure_appui);
                        let soutien_personnalise = catalogue.nb_heure_soutien.includes(',')
                            ? parseFloat(catalogue.nb_heure_soutien.replace(',', '.'))
                            : parseFloat(catalogue.nb_heure_soutien);
                        let formation_entreprise = parseInt(catalogue.nb_heure_ent);

                        if (isNaN(heure_socle) || isNaN(appui_recherche_emploi) ||
                            isNaN(soutien_personnalise) || isNaN(formation_entreprise))
                            return false;

                        let remise_a_niveau = Math.round(heure_socle * .2);
                        soutien_personnalise = Math.round(heure_socle * (soutien_personnalise / 100));

                        let formation_entreprise_trentePrct = Math.round(heure_socle * 0.3);
                        let formation_entreprise_heureFixe = formation_entreprise;

                        // 30% max, sinon on prend le nombre d'heure indiqué
                        formation_entreprise = formation_entreprise_heureFixe > formation_entreprise_trentePrct
                            ? formation_entreprise_trentePrct
                            : formation_entreprise_heureFixe;

                        let interruption_1 = 0;
                        let interruption_2 = 0;

                        let heure_centre = heure_socle +
                            remise_a_niveau +
                            appui_recherche_emploi +
                            soutien_personnalise;

                        let heure_entreprise = formation_entreprise;

                        let heure_max_session = heure_centre + heure_entreprise;

                        let n_article = catalogue.n_Article + '-' + (catalogue.nb + 1).toString().padStart(3, '0');

                        setupdateFormation({
                            ...updateFormation, [k]: v, id_commune: 'all',
                            intitule: intitule,
                            n_Article: n_article,
                            nbarticle: catalogue.nb ? catalogue.nb : 0,
                            heure_max_session: heure_max_session,
                            interruption_1: interruption_1,
                            interruption_2: interruption_2,
                            heure_entreprise: heure_entreprise,
                            heure_centre: heure_centre,
                        });
                    });
                } else setupdateFormation({ ...updateFormation, [k]: v, id_commune: 'all' });
                break;
            case 'id_commune':
                let commune = v === 'all' ? '' : communeList.find((x) => x.id === v).libelle;
                setupdateFormation({ ...updateFormation, [k]: v, commune: commune });
                break;
            case 'date_entree_demandee':
                calcul_date_fin = calculDateFin({
                    ...updateFormation,
                    date_DDINT1: '',
                    date_DFINT1: '',
                    date_DDINT2: '',
                    date_DFINT2: '',
                    [k]: v
                });

                setupdateFormation({
                    ...updateFormation,
                    date_DDINT1: '',
                    date_DFINT1: '',
                    date_DDINT2: '',
                    date_DFINT2: '',
                    date_fin: calcul_date_fin.date_fin,
                    [k]: v
                });
                break;
            case 'date_DDINT1':
                if (updateFormation.date_DFINT1 !== '') {
                    calcul_date_fin = calculDateFin({
                        ...updateFormation,
                        date_DFINT1: v === '' ? '' : updateFormation.date_DFINT1,
                        [k]: v
                    });
                }
                setupdateFormation({
                    ...updateFormation,
                    date_DFINT1: v === '' ? '' : updateFormation.date_DFINT1,
                    date_fin: calcul_date_fin.date_fin,
                    interruption_1: calcul_date_fin.interruption_1,
                    [k]: v
                });
                break;
            case 'date_DFINT1':
                calcul_date_fin = calculDateFin({ ...updateFormation, [k]: v });
                setupdateFormation({
                    ...updateFormation,
                    date_fin: calcul_date_fin.date_fin,
                    interruption_1: calcul_date_fin.interruption_1,
                    [k]: v
                });
                break;
            case 'date_DDINT2':
                if (updateFormation.date_DFINT2 !== '') {
                    calcul_date_fin = calculDateFin({
                        ...updateFormation,
                        date_DFINT2: v === '' ? '' : updateFormation.date_DFINT2,
                        [k]: v
                    });
                }
                setupdateFormation({
                    ...updateFormation,
                    date_DFINT2: v === '' ? '' : updateFormation.date_DFINT2,
                    date_fin: calcul_date_fin.date_fin,
                    interruption_2: calcul_date_fin.interruption_2,
                    [k]: v
                });
                break;
            case 'date_DFINT2':
                calcul_date_fin = calculDateFin({ ...updateFormation, [k]: v });
                setupdateFormation({
                    ...updateFormation,
                    date_fin: calcul_date_fin.date_fin,
                    interruption_2: calcul_date_fin.interruption_2,
                    [k]: v
                });
                break;

            default:
                setupdateFormation({ ...updateFormation, [k]: v });
        };
    }
    const handleChangeFormation = (k, v, changePrincipal = false) => {

        if (changePrincipal) {
            // Changement sur données principales => recommence les sollicitations
            // Pour la date d'entrée l'OF les négos peuvent se jouer à +/- 15 jours
            let resetForm;
            if (k === 'date_entree_demandee') {
                resetForm = Math.abs(parseInt(new Date(v) - new Date(updateFormation.date_entree_fixe)) / (24 * 3600 * 1000)) > 15;
            } else resetForm = true;

            if (resetForm) {
                handleCreateNewFormationFromThis();
            } else ChangeFormation(k, v)
        } else ChangeFormation(k, v)

    };

    useEffect(() => {
        axios({
            method: 'GET',
            url: `/formation/findAll`,
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        }).then((response) => {
            let formList = response.data.map((v) => {
                return {
                    ...v,
                    date_DDINT1: v.date_DDINT1 ? dateFormat(v.date_DDINT1, 'ANG') : '',
                    date_DDINT2: v.date_DDINT2 ? dateFormat(v.date_DDINT2, 'ANG') : '',
                    date_DFINT1: v.date_DFINT1 ? dateFormat(v.date_DFINT1, 'ANG') : '',
                    date_DFINT2: v.date_DFINT2 ? dateFormat(v.date_DFINT2, 'ANG') : '',
                    date_creation: v.date_creation ? dateFormat(v.date_creation, 'ANG') : '',
                    date_entree_demandee: v.date_entree_demandee ? dateFormat(v.date_entree_demandee, 'ANG') : '',
                    date_entree_fixe: v.date_entree_fixe ? dateFormat(v.date_entree_fixe, 'ANG') : '',
                    date_fin: v.date_fin ? dateFormat(v.date_fin, 'ANG') : '',
                    date_nconv: v.date_nconv ? dateFormat(v.date_nconv, 'ANG') : '',
                };
            });
            setFormationList(formList);
        });
    }, [user]);

    const handleSaveFormation = () => {
        axios({
            method: 'PUT',
            url: 'formation/create',
            data: updateFormation,
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), },
        }).then((response) => {
            if (response.status === 200) {
                let newFormationList = [...formationList];
                newFormationList.push({ ...updateFormation, id: response.data.insertId });
                setFormationList(newFormationList);
                setMessageSnackBar('Formation créé');
                setSeverity('success');
            } else {
                setMessageSnackBar('Erreur lors de la création de la foramtion');
                setSeverity('error');
            }
            handleCloseModal();
            setOpenSnackBar(true);
        });
    };

    const handleEditFormation = () => {
        console.log(updateFormation)
        axios({
            method: 'PUT',
            url: 'formation/update',
            data: updateFormation,
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), },
        }).then((response) => {
            console.log(response.data)
            // if (response.status === 200) {
            //     let newFormationList = [...formationList];
            //     newFormationList.push({ ...updateFormation, id: response.data.insertId });
            //     setFormationList(newFormationList);
            //     setMessageSnackBar('Formation créé');
            //     setSeverity('success');
            //     handleCloseModal();
            // } else {
            //     handleCloseModal();
            //     setMessageSnackBar('Erreur lors de la création de la foramtion');
            //     setSeverity('error');
            // }
            // setOpenSnackBar(true);
        });

    }

    const handleSendMailOF = () => {
        console.log('sendmail', openMoreOptions)
    }

    const handleCancelFormation = () => {
        console.log('Annuler ?', openMoreOptions)
    }

    const handleCloseModal = () => {
        setCreateNewFormationFromThis(false);
        setOpenModalCreateSol(false);
        setCatalogueList([]);
        setCommuneList([]);
        setupdateFormation({
            id: '',
            id_lot: 'all',
            id_cata: 'all',
            intitule: '',
            idgasi: user.idgasi,
            userFct: '',
            dt: '',
            etat: 1,
            agence_ref: 'all',
            dispositif: 1,
            n_Article: '',
            nbarticle: 0,
            nb_place: '',
            adresse: '',
            commune: '',
            id_commune: 'all',
            date_creation: getDateToday(),
            date_entree_demandee: '',
            date_entree_fixe: '',
            date_fin: '',
            date_DDINT1: '',
            date_DFINT1: '',
            interruption_1: 0,
            date_DDINT2: '',
            date_DFINT2: '',
            interruption_2: 0,
            date_nconv: '',
            nConv: '',
            vague: '',
        });
    };


    // ------------------------- sollicitation
    const [isSubmittingSol, setIsSubmittingSol] = useState(false)
    const handleSubmitSol = () => {
        setIsSubmittingSol(!isSubmittingSol)
    }
    const handleCreateSollicitation = (sollicitation) => {

        setIsSubmittingSol(true)
        // axios({
        //     method: 'POST',
        //     url: '/mail/sendSollicitationOF',
        //     data: updateFormation,
        //     headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        // }).then((response) => console.log(response))

        axios({
            method: 'PUT',
            url: '/sollicitation/create',
            data: { ...updateFormation, attributaire: sollicitation },
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        }).then((response) => {
            setIsSubmittingSol(false)
            if (response.status === 200) {
                let currentDate = new Date();
                let date =
                    currentDate.getFullYear().toString().padStart(2, '0') + '-' +
                    (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' +
                    currentDate.getDate().toString().padStart(2, '0');

                let newSollArray = [...sollicitationFormation];
                newSollArray.push({
                    attributaire: sollicitation.id,
                    dateMailOF: date,
                    dateRespOF: null,
                    dateValidation: null,
                    date_etat: date,
                    etat: 1,
                    id_dateIcop: null,
                    id_formation: updateFormation.id,
                    lieu_execution: null,
                })
                setSollicitationFormation(newSollArray)

                setMessageSnackBar('Sollicitation envoyé.');
                setSeverity('success');
            } else {
                setMessageSnackBar('Erreur lors de la création de la foramtion');
                setSeverity('error');
            }
            // handleCloseModal();
            setOpenSnackBar(true);
        })

    }

    const handleResponseSollicitation = (resp, sollicitation, txt) => {
        txt = txt === '' ? null : txt

        let currentDate = new Date();
        let time =
            currentDate.getFullYear().toString().padStart(2, '0') + '-' +
            (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' +
            currentDate.getDate().toString().padStart(2, '0') + ' ' +
            currentDate.getHours().toString().padStart(2, '0') + ":" +
            currentDate.getMinutes().toString().padStart(2, '0') + ":" +
            currentDate.getSeconds().toString().padStart(2, '0');
        let newTime = time.replace(' ', 'T') + '.000Z';

        let etat = 0;
        if (resp === 'accept') {
            // Accepte la sollicitation, passe à l'état 2
            etat = 2;
        } else if (resp === 'refus') {
            // Refuse la sollicitation, passe à l'état 3
            etat = 3;
        }

        let newSollForm = sollicitationFormation.map((v) => {
            if (v.id_sol === sollicitation.id_sol) {
                return { ...v, etat: etat, date_etat: newTime, reason: txt }
            } else return v;
        })
        if (newSollForm.filter((v) => v.etat !== 3).length === 0){
            // Il n'y a plus d'OF à contacter
            axios()
        } 
        setSollicitationFormation(newSollForm)

        // axios({
        //     method: 'PUT',
        //     url: 'sollicitation/update',
        //     data: { id_sol: sollicitation.id_sol, etat: etat, dateTime: time, reason: txt },
        //     headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        // }).then((response) => {
        //     if (response.status === 200) {

        //         let newSollForm = sollicitationFormation.map((v) => {
        //             if (v.id_sol === sollicitation.id_sol) {
        //                 return { ...v, etat: etat, date_etat: newTime, reason: txt }
        //             } else return v;
        //         })
        //         setSollicitationFormation(newSollForm)
        //     } else {
        //         setMessageSnackBar('Une erreur inconnue est survenue');
        //         setSeverity('error');
        //         setOpenSnackBar(true);
        //     }
        // })


    }

    return (
        <>
            <SnackBar
                open={openSnackBar}
                message={messageSnackBar}
                severity={severity}
                handleClose={handleCloseSnackbar}
            />

            <div className={classes.categorie} >
                <div className={classes.categorieTitle} >
                    <div className={classes.title} >En attente d'envoi vers l'OF</div>
                    {IsPermitted(user, 'formation', 'create') &&
                        <div className={classes.btn} >
                            <Button variant="contained" color="primary" onClick={handleShowFormation}>Créer une sollicitation</Button>
                        </div>}
                </div>
                <Paper>
                    <TableContainer component={Paper}>
                        <Table size="small" className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>N° Article</TableCell>
                                    <TableCell align="right">Contact</TableCell>
                                    <TableCell align="right">REF</TableCell>
                                    <TableCell align="right">Dispositif</TableCell>
                                    <TableCell align="right">Commune</TableCell>
                                    <TableCell align="right">Etat</TableCell>
                                    <TableCell align="right">Date d'entrée</TableCell>
                                    <TableCell align="right">Date de fin</TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {formationList.length > 0
                                    ? formationList.map((row) => (
                                        <TableRow key={row.n_Article}>
                                            <TableCell component="th" scope="row">
                                                {row.n_Article}
                                            </TableCell>
                                            <TableCell align="right">{codeToName('fonction_' + row.userFct)}</TableCell>
                                            <TableCell align="right">{row.agence_ref}</TableCell>
                                            <TableCell align="right">{codeToName('dispositif_' + row.dispositif)}</TableCell>
                                            <TableCell align="right">{row.commune}</TableCell>
                                            <TableCell align="right">
                                                {row.etat_formation_tooltip
                                                    ? <div className={classes.etatTooltip}>
                                                    {row.etat_formation}
                                                        <Tooltip classes={{ tooltip: classes.tooltip }} title={row.etat_formation_tooltip} aria-label="close">
                                                            <InfoIcon className={classes.icon} />
                                                        </Tooltip>
                                                    </div>
                                                    : row.etat_formation}
                                            </TableCell>
                                            <TableCell align="right">{dateFormat(row.date_entree_demandee)}</TableCell>
                                            <TableCell align="right">{dateFormat(row.date_fin)}</TableCell>
                                            <TableCell align="right">
                                                <IconButton size="small" aria-label="Editer" color="secondary" onClick={(e) => handleClickOpenMenu(e, row.id)}>
                                                    <MoreHorizIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>))
                                    : <TableRow>
                                        <TableCell align="right">Aucune formation en attente</TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </div>

            <Menu
                id="long-menu"
                anchorEl={anchorElMenu}
                keepMounted
                open={openMenu}
                onClose={handleCloseOpenMenu}
            >
                {moreOptionsList.indexOf('show') > -1 &&
                    <MenuItem button dense onClick={handleShowFormation}>
                        Voir plus
                    </MenuItem>}

                {moreOptionsList.indexOf('contact') > -1 &&
                    <MenuItem button dense onClick={handleSendMailOF}>
                        Voir les contacts
                    </MenuItem>}

                {moreOptionsList.indexOf('cancel') > -1 &&
                    <MenuItem button dense onClick={handleCancelFormation}>
                        Annuler la formation
                    </MenuItem>}
            </Menu>

            {openModalCreateSol &&
                <ModalFormation
                    openModal={openModalCreateSol}
                    handleCloseModal={handleCloseModal}
                    updateFormation={updateFormation}
                    createNewFormationFromThis={createNewFormationFromThis}
                    user={user}

                    // Formulaire
                    lotList={lotList}
                    dispositifList={dispositifList}
                    agence_refList={agence_refList}
                    catalogueList={catalogueList}
                    communeList={communeList}
                    handleChangeFormation={handleChangeFormation}
                    handleSaveFormation={handleSaveFormation}
                    handleEditFormation={handleEditFormation}

                    // Sollicitation
                    attributaireList={attributaireList}
                    handleCreateSollicitation={handleCreateSollicitation}
                    handleSubmitSol={handleSubmitSol}
                    isSubmittingSol={isSubmittingSol}
                    sollicitationFormation={sollicitationFormation}
                    handleResponseSollicitation={handleResponseSollicitation}
                />}


        </>
    )
}