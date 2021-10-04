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
import { codeToName, dateFormat, calculDateFin, getDateToday, getDateTime, dateCount } from '../../../utilities/Function';
import SnackBar from '../../global/SnackBar/SnackBar';
import './sollicitation.css';
import { IsPermitted } from '../../../utilities/Function';
import IconButton from '@material-ui/core/IconButton';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Filter from './filter/Filter';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Commentaire from '../../global/commentaire/Commentaire';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import { Tooltip } from '@material-ui/core';
import ModalActionAuto from './ModalActionAuto/ModalActionAuto';

// import { title } from 'process';
// import Cards from './Card/Cards';
// import ListItemIcon from '@material-ui/core/ListItemIcon';

// const getDateToday = () => {
//     let date = new Date();
//     return date.getFullYear() + '-' +
//         (date.getMonth() + 1).toString().padStart(2, '0') + '-' +
//         date.getDate().toString().padStart(2, '0');
// }

const useStyles = makeStyles((theme) => ({
    containerTable: {
        maxHeight: '80vh',
        overflow: 'scroll',
    }, table: {
        minWidth: 650,
    },
    flex: {
        display: 'flex',
        alignItems: 'center',
    },
    error: {
        backgroundColor: theme.palette.warning.main
    },
    iconError: {
        fill: 'red'
    },
    cellHead: {
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
    },
    etatTooltip: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        '& > *': {
            marginLeft: theme.spacing(2)
        }
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
    },
    listOptions: {
        padding: 0,
        position: 'absolute',
        right: 50,
        border: '1px solid ' + theme.palette.secondary.main,
        '& > *': {
            textAlign: 'right',
        }
    },
    blockBRS: {
        '& > *': {
            marginRight: theme.spacing(2)
        },
    },
    formControlLot: {
        width: 300,
    },
    formControlOf: {
        width: 300,
    }

}));

export default function Formation() {

    const classes = useStyles();
    const { user } = useContext(UserContext);

    const columnTableau = [
        'id_lot',
        'n_Article',
        'userFct',
        'agence_ref',
        'dispositif',
        'commune',
        'etat_libelle',
        'date_entree_demandee',
        'date_fin',
    ]

    const [formationList, setFormationList] = useState([]);
    const [formationListDisplay, setFormationListDisplay] = useState([]);
    const [filterValues, setFilterValues] = useState({
        id_lot: 'all',
        etat: [],
    });
    ;
    // 'Ouvrir' le menu d'édition de BRS (pour la DDO)
    const [editionBRS, setEditionBRS] = useState(false)

    // Annule les sollicitation sans réponse > 5 jrs
    const [formationListToCancel, setFormationListToCancel] = useState([]);
    const [openModalAuto, setOpenModalAuto] = useState(false);

    // Differentes listes
    const [lotList, setLotList] = useState([]);
    const [etatList, setEtatList] = useState([]);
    const [dispositifList, setDispositifList] = useState([]);
    const [catalogueList, setCatalogueList] = useState([]);
    const [agence_refList, setAgence_refList] = useState([])
    const [communeList, setCommuneList] = useState([]);
    const [icopList, setIcopList] = useState([]);
    const [lieuExecutionList, setLieuExecutionList] = useState([])
    const [sollicitationList, setSollicitationList] = useState([]);
    const [attributaireList, setAttributaireList] = useState([]);

    // openMoreOptions = id de la formation à ouvrir dans le modal
    // moreOptionsList = liste des options à afficher
    const [openMoreOptions, setOpenMoreOptions] = useState('');
    const [moreOptionsList, setMoreOptionsList] = useState([]);

    // Objet formation pour le modal
    const [updateFormation, setupdateFormation] = useState({
        id: '',
        id_lot: 'all',
        id_cata: 'all',
        intitule: '',
        idgasi: user.idgasi,
        userFct: user.fonction,
        etat: 1,
        etat_libelle: '',
        agence_ref: 'all',
        dispositif: 1,
        n_Article: '',
        nbarticle: 0,
        nb_place: '',
        adresse: '',
        commune: '',
        id_commune: 'all',
        date_creation: '',
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
        nConv_tmp: '',
        vague: '',
        id_sol: '',
        id_attributaire: '',
        dateMailOF: null,
        dateRespOF: null,
    });

    // Utiliser pour suivre la sollicitation une fois celle ci validée (etat = 3)
    const [sollicitation, setSollicitation] = useState({
        id_sol: '',
        id_formation: '',
        attributaire: '',
        dateMailOF: '',
        dateRespOF: '',
        etat: '',
        date_etat: '',
        lieu_execution: 'all',
        id_dateIcop: '',
        date_ValidationDT: '',
        date_ValidationDDO: '',
    })

    const [openModalCreateSol, setOpenModalCreateSol] = useState(false)

    // --------------- SnackBar
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [messageSnackBar, setMessageSnackBar] = useState('');
    const [severity, setSeverity] = useState();
    const [anchorElMenu, setAnchorElMenu] = React.useState(null);
    const openMenu = Boolean(anchorElMenu);

    const handleCloseSnackbar = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackBar(false);
        setMessageSnackBar('');
    };
    /* ------------------------------------------- */

    const handleClickOpenMenu = (event, id) => {
        setOpenMoreOptions(id)
        setAnchorElMenu(event.currentTarget);
    };

    const handleCloseOpenMenu = () => {
        setAnchorElMenu(null);
    };

    // --------------- useEffect
    useEffect(() => {
        if (user.idgasi) {
            setupdateFormation({ ...updateFormation, idgasi: user.idgasi, userFct: user.fonction });
        }

        switch (parseInt(user.fonction)) {
            case 1: setMoreOptionsList(['show', 'contact', 'cancel']); break;
            case 2: setMoreOptionsList(['show', 'contact', 'cancel']); break;
            case 6: setMoreOptionsList(['show', 'contact', 'cancel']); break;
            default: setMoreOptionsList(['show', 'cancel']); break;

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    useEffect(() => {
        axios({
            method: 'GET',
            url: `/formation/findAll`,
            headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
        }).then((response) => {
            let formList = response.data.map((v) => {
                return {
                    ...v,
                    date_creation: v.date_creation ? dateFormat(v.date_creation, 'ANG') : '',
                    date_entree_demandee: v.date_entree_demandee ? dateFormat(v.date_entree_demandee, 'ANG') : '',
                    date_entree_fixe: v.date_entree_fixe ? dateFormat(v.date_entree_fixe, 'ANG') : '',
                    date_DDINT1: v.date_DDINT1 ? dateFormat(v.date_DDINT1, 'ANG') : '',
                    date_DDINT2: v.date_DDINT2 ? dateFormat(v.date_DDINT2, 'ANG') : '',
                    date_DFINT1: v.date_DFINT1 ? dateFormat(v.date_DFINT1, 'ANG') : '',
                    date_DFINT2: v.date_DFINT2 ? dateFormat(v.date_DFINT2, 'ANG') : '',
                    date_fin: v.date_fin ? dateFormat(v.date_fin, 'ANG') : '',
                    date_nconv: v.date_nconv ? dateFormat(v.date_nconv, 'ANG') : '',
                };
            });
            let solToCancel = formList.filter((v) =>
                v.dateMailOF !== null &&
                v.dateRespOF === null &&
                dateCount(new Date(v.dateMailOF), new Date(), true) > 5 &&
                v.userFct === user.fonction &&
                v.etat === 1);

            if (solToCancel.length > 0) {
                setOpenModalAuto(true);
                setFormationListToCancel(solToCancel);
            }
            setFormationList(formList);
        });

        axios({
            method: 'GET',
            url: 'global/findAll?table=lot',
            headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
        }).then((response) => setLotList(response.data));

        axios({
            method: 'GET',
            url: 'global/findAll?table=dispositif',
            headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
        }).then((response) => setDispositifList(response.data));

        axios({
            method: 'GET',
            url: 'global/findAll?table=ape',
            headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
        }).then((response) => setAgence_refList(response.data));

        axios({
            method: 'GET',
            url: 'global/findAll?table=sollicitation_etat',
            headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
        }).then((response) => {
            setEtatList([{ etat: 'En cours d\'élaboration.', id: 0 }, ...response.data])
            let allEtat = response.data.filter((v) => v.id !== 20).map((v) => v.id)
            allEtat.unshift(0)
            setFilterValues({ ...filterValues, etat: allEtat })
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        setAttributaireLotSelected('all');
        let etat = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

        if (editionBRS && filterValues.id_lot !== 'all') {
            axios({
                method: 'GET',
                url: 'sollicitation/OFValidePourBRS?id_lot=' + filterValues.id_lot,
                headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
            }).then((response) => setAttributaireLotList(response.data))
        } else if (filterValues.id_lot === 'all') {
            setFilterValues({ ...filterValues, id_attributaire: 'all' })
            setAttributaireLotList([]);
        } else if (!editionBRS) {
            setAttributaireLotList([]);

        }
        setFilterValues({ ...filterValues, etat: etat, id_attributaire: 'all' })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editionBRS, filterValues.id_lot])

    useEffect(() => {
        if (formationList.length > 0) {
            let array = [];
            array = formationList.filter((v) => {
                for (let key in filterValues) {
                    if (filterValues[key] === 'all' || filterValues[key] === '') continue;
                    if (key === 'id_lot' || key === 'id_attributaire' || key === 'userFct' || key === 'agence_ref' ||
                        key === 'dispositif') {
                        if ((v[key] && v[key].toString()) !== filterValues[key].toString()) return false
                    } else if (key === 'etat') {
                        let value = [];
                        value = filterValues[key];
                        if (value.length > 0) {
                            if (value.indexOf(v[key]) === -1) return false;
                        } else {
                            return false;
                        }
                    } else if (key === 'n_Article') {
                        if (v[key].indexOf(filterValues[key]) === -1) return false
                    } else {
                        return false
                    }
                }
                return v;
            })

            setFormationListDisplay(array)
        }
    }, [filterValues, formationList])

    // useEffect(() => {
    //     console.log(formationList)
    //     setFormationListDisplay(formationList)
    // }, [formationList])
    /* ------------------------------------------- */

    const handleShowFormation = () => {
        handleCloseOpenMenu()
        let formation = {};

        // Si le modal s'ouvre pour voir une formation
        if (openMoreOptions !== '') {
            formation = formationList.find((v) => v.id === openMoreOptions);
            setupdateFormation({ ...updateFormation, ...formation });
            // Si un OF à accepté une sollicitation -> formation validé (etat = 5)

            if (formation.etat > 2 && formation.etat < 20) {
                axios({
                    method: 'GET',
                    url: 'sollicitation/find?id_sol=' + formation.id_sol,
                    headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
                }).then((response) => setSollicitation({ ...sollicitation, ...response.data[0] }))

                axios({
                    method: 'GET',
                    url: 'sollicitation/icop?id_sol=' + formation.id_sol,
                    headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
                }).then((response) => setIcopList(response.data))

                axios({
                    method: 'GET',
                    url: 'sollicitation/lieuExecution?id_sol=' + formation.id_sol,
                    headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
                }).then((response) => setLieuExecutionList(response.data))
            }

            setOpenMoreOptions('');
        }

        // Si id_lot !== 'all' = récupère le catalgoue du lot
        if (formation && formation.id_lot !== 'all') {
            axios({
                method: 'GET',
                url: '/catalogue/find?field=id_lot&data=' + formation.id_lot,
                headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
            }).then((response) => {
                setCatalogueList(response.data);
            });
        }

        // Si id_cata !== 'all' = récupère les communes possible (selon les attributaires)
        if (formation && formation.id_cata !== 'all') {
            axios({
                method: 'GET',
                url: '/catalogue/findCommune?id_cata=' + formation.id_cata,
                headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
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
                    headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
                }).then((response) => setAttributaireList(response.data));

                axios({
                    method: 'GET',
                    url: '/sollicitation/findAll?' + sql,
                    headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
                }).then((response) => setSollicitationList(response.data));
            }
        }

        setOpenModalCreateSol(true);
    }

    // Savoir si la modification de la formation cause une resollicitation des OF (quelle form doit être remplacée)
    const [createNewFormationFromThis, setCreateNewFormationFromThis] = useState({ etat: false, field: '', user: '' })

    const handleCreateNewFormationFromThis = (k, v) => {
        setCreateNewFormationFromThis({ etat: true, idChange: updateFormation.id, fieldChange: k, valueChange: updateFormation[k], userChange: user.idgasi });
        // Si commune ajouter le libelle de la commune
        let commune = updateFormation.commune
        if (k === 'id_commune') commune = v === 'all' ? '' : communeList.find((x) => x.id === v).libelle;
        setupdateFormation({ ...updateFormation, id: '', [k]: v, commune: commune });
        setSollicitationList([])
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
                        headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
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
                        headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
                    }).then((response) => {
                        setCommuneList(response.data)
                    });
                    // Get donnée de la formation demandée
                    axios({
                        method: 'GET',
                        url: '/catalogue/find?field=id&data=' + v,
                        headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
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
            case 'agence_ref':
                let agence_ref_libelle = v === 'all' ? '' : agence_refList.find((x) => x.id === v).libelle_ape;
                setupdateFormation({ ...updateFormation, [k]: v, agence_ref_libelle: agence_ref_libelle });
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
        changePrincipal ? handleCreateNewFormationFromThis(k, v) : ChangeFormation(k, v);
    };

    const handleChangeSollicitation = (k, v) => {
        setSollicitation({ ...sollicitation, [k]: v })
    }

    const handleSaveFormation = (createNewFormationFromThis) => {
        axios({
            method: 'PUT',
            url: 'formation/create',
            data: {
                ...updateFormation, date_creation: getDateToday(), etat: 1,
                date_entree_fixe: updateFormation.date_entree_demandee,
                createNewFormationFromThis: createNewFormationFromThis,
            },
            headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), },
        }).then((response) => {
            if (response.status === 200) {
                let newFormationList = [];
                if (createNewFormationFromThis.etat) {
                    newFormationList = [...formationList].filter((v) => v.id !== createNewFormationFromThis.idChange)
                } else {
                    newFormationList = [...formationList];
                }
                newFormationList.push({
                    ...updateFormation, id: response.data.insertId,
                    etat: 1,
                    etat_libelle: "En cours d'élaboration",
                    date_entree_fixe: updateFormation.date_entree_demandee,
                    id_sol: null,
                });

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

    const handleChangeNArticle = (new_n_Article) => {
        let n_Article = new_n_Article.split('-')[0];
        let nb = parseInt(new_n_Article.split('-')[1]);
        axios({
            method: 'put',
            url: 'catalogue/updateCompteur',
            data: { n_Article: n_Article, nb: nb },
            headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), },
        }).then((response) => {
            if (response.status === 200) {
                setupdateFormation({ ...updateFormation, n_Article: n_Article + '-' + nb.toString().padStart(3, '0') })
                handleEditFormation({ ...updateFormation, n_Article: n_Article + '-' + nb.toString().padStart(3, '0') })
            } else {
                setMessageSnackBar('Erreur lors de la mise à jour du compteur');
                setSeverity('error');
                setOpenSnackBar(true);
            }
        })
        // 
    }
    const handleEditFormation = (newUpdateFormation = updateFormation) => {
        axios({
            method: 'PUT',
            url: 'formation/update',
            data: newUpdateFormation,
            headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), },
        }).then((response) => {
            if (response.status === 200) {

                if ((newUpdateFormation.etat === 9 || newUpdateFormation.etat === 12) && newUpdateFormation.etat < 20) {
                    // Modification sur BRS édité
                    handleChangeBRS();
                } else {
                    let newFormationList = formationList.map((v) => v.id === newUpdateFormation.id ? newUpdateFormation : v);
                    setFormationList(newFormationList);
                }
                setMessageSnackBar('Formation modifié avec succès');
                setSeverity('success');

                // handleCloseModal();
            } else {
                // handleCloseModal();
                setMessageSnackBar('Erreur lors de la création de la foramtion');
                setSeverity('error');
            }
            setOpenSnackBar(true);
        });
    }

    const handleSendMailOF = () => {
        console.log('sendmail', openMoreOptions)
    }

    const handleCancelFormation = () => {
        console.log('Annuler ?', updateFormation)
    }

    const handleCloseModal = () => {
        setCreateNewFormationFromThis({ etat: false });
        setOpenModalCreateSol(false);
        setCatalogueList([]);
        setCommuneList([]);
        setAttributaireList([]);
        setSollicitationList([]);
        setIcopList([]);
        setSollicitation({
            id_sol: '',
            id_formation: '',
            attributaire: '',
            dateMailOF: '',
            dateRespOF: '',
            etat: '',
            date_etat: '',
            lieu_execution: 'all',
            id_dateIcop: '',
            date_ValidationDT: '',
            date_ValidationDDO: '',
        });
        setupdateFormation({
            id: '',
            id_lot: 'all',
            id_cata: 'all',
            intitule: '',
            idgasi: user.idgasi,
            userFct: user.fonction,
            etat: 1,
            etat_libelle: '',
            agence_ref: 'all',
            dispositif: 1,
            n_Article: '',
            nbarticle: 0,
            nb_place: '',
            adresse: '',
            commune: '',
            id_commune: 'all',
            date_creation: '',
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
            nConv_tmp: '',
            vague: '',
            id_attributaire: '',
            dateMailOF: null,
            dateRespOF: null,
        });
    };


    // ------------------------- sollicitation
    const [isSubmittingSol, setIsSubmittingSol] = useState(false)
    const handleSubmitSol = () => {
        setIsSubmittingSol(!isSubmittingSol)
    }
    const handleCreateSollicitation = (sollicitation) => {

        setIsSubmittingSol(true)

        // Envoi MAIL à tester
        // axios({
        //     method: 'POST',
        //     url: '/mail/sendSollicitationOF',
        //     data: updateFormation,
        //     headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
        // }).then((response) => console.log(response))

        axios({
            method: 'PUT',
            url: '/sollicitation/create',
            data: { ...updateFormation, attributaire: sollicitation.id, information:user.nom },
            headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
        }).then((response) => {

            setIsSubmittingSol(false)
            if (response.status === 200) {

                // if (updateFormation.etat === 1) {
                //     axios({
                //         method: 'PUT',
                //         url: '/formation/updateEtat',
                //         data: { ...updateFormation, etat: 2 },
                //         headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
                //     })
                // }

                // update etat formation -> Sollicitation en cours
                // updateEtatFormation(2, 'Sollicitation en cours', '');

                let time = getDateToday();
                let newTime = time.replace(' ', 'T') + '.000';

                let currentDate = new Date();
                let date =
                    currentDate.getFullYear().toString().padStart(2, '0') + '-' +
                    (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' +
                    currentDate.getDate().toString().padStart(2, '0');

                let newSol = ({
                    id_sol: response.data.insertId,
                    attributaire: sollicitation.id,
                    dateMailOF: date,
                    dateRespOF: '',
                    date_ValidationDT: '',
                    date_ValidationDDO: '',
                    date_etat: newTime,
                    etat: 1,
                    id_dateIcop: '',
                    id_formation: updateFormation.id,
                    lieu_execution: '',
                })
                let newSollArray = [...sollicitationList];
                newSollArray.push(newSol)

                const newFormationList = formationList.map((v) => v.id === updateFormation.id ?
                    { ...updateFormation, etat: 1, etat_libelle: 'Mail envoyé à l\'OF', id_sol: response.data.insertId } : v)

                setupdateFormation({ ...updateFormation, etat: 1, etat_libelle: 'Mail envoyé à l\'OF', id_sol: response.data.insertId })
                setSollicitation(newSol)
                setFormationList(newFormationList)
                setSollicitationList(newSollArray)
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

    const handleResponseSollicitation = (resp, sol, txt) => {

        let time = getDateToday();

        let newTime = time.replace(' ', 'T') + '.000Z';

        let etat = 0;
        let text = '';
        if (resp === 'accept') {
            // Accepte la sollicitation, passe à l'état 3
            etat = 4;
            text = 'L\'OF à accepté la sollicitation';
        } else if (resp === 'refus') {
            // Refuse la sollicitation, passe à l'état 8
            etat = 3;
            text = 'L\'OF à refusé la sollicitation';
        }

        axios({
            method: 'PUT',
            url: 'sollicitation/update',
            data: { id_sol: sol.id_sol, etat: etat, dateRespOF: time, dateTime: time, information: txt === '' ? user.idgasi : txt },
            headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
        }).then((response) => {
            if (response.status === 200) {

                // Met à jour le tableau des sollicitations actuelles.
                let newSollArray = sollicitationList.map((v) => {
                    if (v.id_sol === sol.id_sol) {
                        return { ...v, etat: etat, date_etat: newTime, information: txt, dateRespOF: time }
                    } else return v;
                })

                let newSol = {}
                // Si l'OF accepte, met à jour l'état de la formation.
                if (etat === 4) {
                    // Mettre à jour le hook sollicitation
                    newSol = {
                        ...sollicitation,
                        id_sol: sol.id_sol,
                        id_formation: sol.id_formation,
                        attributaire: sol.attributaire,
                        dateMailOF: sol.dateMailOF,
                        dateRespOF: time,
                        etat: etat,
                        date_etat: time,
                    }

                    // Récupère liste des adresse pour la formation
                    axios({
                        method: 'GET',
                        url: 'sollicitation/lieuExecution?id_sol=' + sol.id_sol,
                        headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
                    }).then((response) => setLieuExecutionList(response.data))
                }

                // UpdateFotmation et etat de la formation
                let newUpdateFormation = {
                    ...updateFormation, etat: etat, etat_libelle: text, dateRespOF: time,
                    id_attributaire: sol.attributaire
                }

                setSollicitation(newSol)
                setupdateFormation(newUpdateFormation)
                setFormationList(formationList.map((v) => v.id === updateFormation.id ? newUpdateFormation : v))
                setSollicitationList(newSollArray)
            } else {
                setMessageSnackBar('Une erreur inconnue est survenue');
                setSeverity('error');
                setOpenSnackBar(true);
            }
        })

    }

    const handlAddIcop = (icop) => {

        if (icop && sollicitation.id_sol !== '') {
            let dateTime = getDateTime(icop, 'ANG');
            axios({
                method: 'put',
                url: 'sollicitation/addIcop',
                data: { id_sol: sollicitation.id_sol, icop: dateTime.date + ' ' + dateTime.time },
                headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
            }).then((response) => {
                if (response.status === 200) {
                    let newArrIcop = [...icopList];
                    newArrIcop.push({ id: response.data.insertId, dateIcop: (dateTime.date + ' ' + dateTime.time).replace(' ', 'T') })
                    setIcopList(newArrIcop)
                }
            })
        } else {
            console.log('Une erreur inconnue est survenue : FORM_handleAddIcop')
            setMessageSnackBar('Une erreur inconnue est survenue');
            setSeverity('error');
            setOpenSnackBar(true);
        }
    }

    const handleValideSollicitation = (valideType) => {
        // Clique sur btn Valider / accepter -> modalFormation / Sollicitation / Cadre DT ou Cadre DDO
        let dateTime = getDateToday();
        let information = '';
        let etat = '';
        let etat_libelle = '';
        let sol = { ...sollicitation };

        if (sol.etat === 9 || sol.etat === 12) {
            handleChangeBRS()
            // .then((response) => {
            //     if (response.status === 200) {
            //         setMessageSnackBar('Modification du BRS.');
            //         setSeverity('success');
            //     }
            // });

            // } else if (etat !== '') {
        } else {

            switch (valideType) {
                case 'DT':
                    if (sol.date_ValidationDT) {
                        etat = 5;
                        sol.date_ValidationDT = '';
                        sol.date_ValidationDDO = '';
                        etat_libelle = 'Modification de la DT';
                        information = 'Modifiation DT (' + user.idgasi + ')';
                    } else {
                        etat = 6;
                        sol.date_ValidationDT = dateTime;
                        etat_libelle = 'Validé par la DT';
                        information = 'Validation DT (' + user.idgasi + ')';
                    }
                    break;
                case 'DDO':
                    // if (sol.date_ValidationDDO) {
                    //     etat = 7;
                    //     sol.date_ValidationDDO = '';
                    //     etat_libelle = 'Modification de la DDO';
                    //     information = 'Modifiation DDO (' + user.idgasi + ')';
                    // } else {
                    //     // updateEtatFormation(4, 'Validé DDO', '')
                    etat = 8;
                    sol.date_ValidationDDO = sol.date_ValidationDDO ? sol.date_ValidationDDO : dateTime;
                    etat_libelle = 'Validé par la DDO';
                    information = 'Validation DDO (' + user.idgasi + ')';
                    // }
                    break;
                default:
                    break;
            }

            axios({
                method: 'put',
                url: 'sollicitation/save',
                data: {
                    sollicitation: sol,
                    information: information,
                    dateTime: dateTime,
                    etat: etat,
                },
                headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
            }).then((response) => {

                if (response.status === 200) {

                    let newSollArray = sollicitationList.map((v) => {
                        if (v.id_sol === sol.id_sol) {
                            return { ...v, etat: etat, date_etat: dateTime, information: information }
                        } else return v;
                    })
                    // UpdateFotmation et etat de la formation
                    let newUpdateFormation = { ...updateFormation, etat: etat, etat_libelle: etat_libelle }
                    setupdateFormation(newUpdateFormation)
                    setFormationList(formationList.map((v) => v.id === updateFormation.id ? newUpdateFormation : v))
                    setSollicitation({ ...sol, etat: etat, etat_libelle: etat_libelle })
                    setSollicitationList(newSollArray)


                    setMessageSnackBar('Sollicitation validée.');
                    setSeverity('success');

                } else {
                    setMessageSnackBar('Une erreur est survenue lors de la validation de la sollicitation.');
                    setSeverity('error');
                }
                (etat !== 5 && etat !== 7) && setOpenSnackBar(true);
            })
        }
    }

    const handleChangeFilter = (k, v) => {
        setFilterValues({ ...filterValues, [k]: v })
    }

    const [attributaireLotSelected, setAttributaireLotSelected] = useState('all');
    const [attributaireLotList, setAttributaireLotList] = useState([]);
    const [editingBRS, setEditingBRS] = useState(false)

    const handleToggleEditionBRS = () => {
        setEditionBRS(!editionBRS)
    }

    const handleChangeAttribLotSelected = (id) => {
        setFilterValues({ ...filterValues, id_attributaire: id, etat: id === 'all' ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : [7, 8, 10, 11] })
        setAttributaireLotSelected(id)
    }
    const handleEditionBRS = () => {
        // Récupère les données pour BDD / BRS
        axios({
            method: 'get',
            url: 'sollicitation/findBRS?id_lot=' + filterValues.id_lot + '&attributaire=' + attributaireLotSelected + '&user=' + user.idgasi,
            headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
        }).then((response) => {
            if (response.status === 200) {
                if (response.data.length > 0) {
                    let time = getDateToday();
                    let lot = response.data[0].lot ? response.data[0].lot.split(' - ')[0].replace(' ', '') : 'LOT?';
                    let formation_brs_existant = response.data.find((v) => v.filename !== null)
                    let pos_version = 0;
                    let version = 0;
                    let nb = 0;
                    let filename = '';
                    let n_brs = ''

                    if (formation_brs_existant) {
                        pos_version = formation_brs_existant.filename.indexOf('V')
                        version = parseInt(formation_brs_existant.filename[pos_version + 1]) + 1
                        n_brs = formation_brs_existant.n_brs.replace('V' + formation_brs_existant.filename[pos_version + 1], 'V' + version)
                        filename = formation_brs_existant.filename
                            .replace('V' + formation_brs_existant.filename[pos_version + 1], 'V' + version)
                    } else {
                        nb = (response.data[0].nb_brs + 1).toString().padStart(3, '0');
                        n_brs = `BRS2021 - AFC2019 - ACCORD CADRE - ${lot} - ${nb} - V${version}`;
                        filename = `BRS${nb}-${lot}V${version}.xlsx`;
                    }

                    const brs = {
                        lot: response.data[0].lot,
                        n_marche: response.data[0].n_marche,
                        remplace: formation_brs_existant ? formation_brs_existant.n_brs : '',
                        n_brs: n_brs,
                    }
                    const attrib = {
                        titulaire: response.data[0].titulaire,
                        siret: response.data[0].siret,
                        representantMail: response.data[0].representantMail,
                        representant: response.data[0].representant,
                        adresse: response.data[0].adresse,
                        telephone: response.data[0].telephone,
                    }
                    let array_id_sol = Object.values(response.data).map((v) => v.id_sol)
                    let rowsTable = Object.values(response.data).map((v) => {
                        let dateEntree = getDateTime(v.date_entree_demandee).date;
                        let dateFin = getDateTime(v.date_fin).date;
                        let dateIcop = getDateTime(v.dateIcop).date;
                        return [v.utilisateur, v.n_Article,
                        v.intitule_form_marche,
                        v.objectif,
                        v.niveau,
                        v.formacode,
                        v.lieu_execution,
                            '',
                            30,
                        v.nb_place,
                        v.heure_max_session,
                        v.heure_entreprise,
                        v.heure_centre,
                            dateEntree,
                            dateFin,
                            '',
                            '',
                            '',
                            dateIcop,
                        ]
                    })

                    // INERT BRS dans la BDD + INSERT brs_histo + INERT/UPDATE brs_compteur
                    axios({
                        method: 'put',
                        url: 'brs/create',
                        data: {
                            n_brs: n_brs,
                            replace_brs: formation_brs_existant ? formation_brs_existant.id_brs : 0,
                            filename: filename,
                            id_lot: filterValues.id_lot,
                            id_attributaire: filterValues.id_attributaire,
                            dateTime: time,
                            nb_brs: response.data[0].nb_brs + 1,
                        },
                        headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
                    }).then((responseCreate) => {
                        if (responseCreate.status === 200) {

                            // Renseigne la table brs_id_sol + update sol_histo
                            axios({
                                method: 'put',
                                url: 'sollicitation/addToBRS',
                                data: {
                                    sollicitation: array_id_sol,
                                    id_brs: responseCreate.data.insertId,
                                    dateTime: time,
                                    filename: filename,
                                },
                                headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
                            })
                            // Créer fichier BRS et Download
                            createBRS(lot, n_brs, filename, brs, attrib, rowsTable)

                            setMessageSnackBar('Données mises à jours. Le téléchargement vas commencer');
                            setSeverity('success');

                            const newFormationList = formationList.map((v) =>
                                array_id_sol.indexOf(v.id_sol) !== -1 ? { ...v, etat: 9, etat_libelle: 'BRS Edité' } : v)
                            setFormationList(newFormationList)

                        } else {
                            setMessageSnackBar('Une erreur est survenue. Réessayer.');
                            setSeverity('error');
                        }

                        setOpenSnackBar(true);
                    })
                    
                } else console.log('Aucune donnée')
            }
            setEditingBRS(false)
            // Reset filtre OF
            // setAttributaireLotSelected('all')
            // setAttributaireLotList([])
        })
    }

    const createBRS = (lot, n_brs, filename, brs, attrib, rowsTable) => {
        // Créer le BRS et le télécharge
        axios({
            method: 'put',
            responseType: "blob",
            url: 'BRS/createFile',
            data: {
                lot: lot,
                n_brs: n_brs,
                filename: filename,
                brs: brs,
                attrib: attrib,
                rowsTable: rowsTable,
            },
            headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
        }).then((response) => {
            setEditingBRS(false)
            if (response.status === 200) {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                let fileName = response.headers['content-disposition'].split('=')[1]

                link.setAttribute("download", `${fileName}`);
                document.body.appendChild(link);
                link.click();
            }
        }).catch((error) => { console.log(error); });
    }

    const [ascOrder, setAscOrder] = useState({ key: '', ASC: true })
    const handleOrderBy = (k) => {
        setAscOrder({ key: k, ASC: !ascOrder.ASC })
        let newArray = [...formationListDisplay].sort((a, b) => {
            let ordered = [];
            if (k === 'userFct' || k === 'dispositif' || k === 'id_lot') {
                ordered = ascOrder.ASC ? b[k] - a[k] : a[k] - b[k];
            } else if (k === 'date_entree_demandee' || k === 'date_fin') {
                ordered = ascOrder.ASC ? new Date(b[k]) - new Date(a[k]) : new Date(a[k]) - new Date(b[k]);
            } else if (k === 'n_Article' || k === 'etat_libelle' || k === 'commune') {
                ordered = ascOrder.ASC
                    ? b[k] > a[k] ? -1 : a[k] > b[k] ? 1 : 0
                    : b[k] > a[k] ? 1 : a[k] > b[k] ? -1 : 0;
            }
            return ordered;
        });
        setFormationListDisplay(newArray)
    }

    const handleSaveConv = () => {
        const dateTime = getDateToday();

        if (updateFormation.nConv_tmp && updateFormation.nConv_tmp !== '') {
            axios({
                method: 'put',
                url: 'formation/conventionnement',
                data: { ...sollicitation, nConv: updateFormation.nConv_tmp, date_nConv: dateTime, user: user.idgasi },
                headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
            }).then((response) => {
                if (response.status === 200) {
                    const newFormationList = formationList.map((v) => v.id === updateFormation.id ?
                        { ...v, etat: 12, etat_libelle: 'Formation conventionnée', nConv: updateFormation.nConv_tmp } : v)
                    setFormationList(newFormationList)
                    setMessageSnackBar('N° conventionnement enregistré!');
                    setSeverity('success');
                } else {
                    setMessageSnackBar('Erreur d\'enregistrement du N° conventionnement.');
                    setSeverity('error');
                }
                setOpenSnackBar(true);
            })
        }
    }

    const handleChangeBRS = () => {
        console.log("------------------ MODIF BRS ---------------- ")
        let dateTime = getDateToday();
        let etat = 10;
        let information = 'Modification du BRS';
        let etat_libelle = 'Modification du BRS en cours';
        let sol = { ...sollicitation }
        sol.date_ValidationDT = dateTime;
        sol.date_ValidationDDO = '';
        sol.date_EditBRS = '';
        sol.date_nConv = '';

        axios({
            method: 'put',
            url: 'brs/edit',
            data: { ...sollicitation, dateTime: dateTime, information: user.idgasi + ' : ' + information },
            headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
        }).then((response) => {
            console.log(response.data)
            if (response.status === 200) {

                let newSollArray = sollicitationList.map((v) => {
                    if (v.id_sol === sol.id_sol) {
                        return { ...v, etat: etat, date_etat: dateTime, reason: information }
                    } else return v;
                })

                // UpdateFotmation et etat de la formation
                let newUpdateFormation = { ...updateFormation, etat: etat, etat_libelle: etat_libelle }
                setupdateFormation(newUpdateFormation)
                setFormationList(
                    formationList.map((v) => v.id === updateFormation.id
                        ? newUpdateFormation
                        : response.data.map((x) => x.id_formation).indexOf(v.id) > -1
                            ? { ...v, etat: 11, etat_libelle: "En attente d'édition d'un nouveau BRS" }
                            : v))
                setSollicitation({ ...sol, etat: etat, etat_libelle: etat_libelle })
                setSollicitationList(newSollArray)
            }
        })


        // if (sollicitation.etat === 9) {
        //     // Change sollicitation souhaitée
        //     // les autres sollicitation du BRS phase 'en attente de modification'
        //     // Prevenir DDO pur validation + edition


        //     // Recupére BRS et ensemble sollicitation
        //     // Nouveau BRS avec changements appliqué

        //     console.log(sollicitationList)
        //     console.log('Rédité BRS')
        //     console.log(sollicitation)
        // }
    }


    // A la fermeture du modal automatique, lance les requetes pour annuler les sollicitations sans réponse
    const [isSubmitModalAuto, setIsSubmitModalAuto] = useState(false)
    const handleCloseModalAuto = () => {
        let time = getDateToday();
        let newFormationList = [...formationList];
        for (let i = 0; i < formationListToCancel.length; i++) {
            axios({
                method: 'put',
                url: 'sollicitation/update',
                data: { id_sol: formationListToCancel[i].id_sol, etat: 3, dateRespOF: null, dateTime: time, information: 'Appli AFC : Aucune réponse en ' + dateCount(new Date(formationListToCancel[i].dateMailOF), new Date(), true) + ' jours.' },
                headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
            }).then((response) => {
                if (i === formationListToCancel.length - 1) { setIsSubmitModalAuto(false); setOpenModalAuto(false) }
            })
            newFormationList.find((v) => v.id === formationListToCancel[i].id).etat = 3;
            newFormationList.find((v) => v.id === formationListToCancel[i].id).etat_libelle = 'L\'OF à refusé la sollicitation';
        }
        setIsSubmitModalAuto(false);
        setOpenModalAuto(false);
        setFormationList(newFormationList)
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
                    <div className={classes.title} >Liste des formations ({formationListDisplay.length})</div>
                    {IsPermitted(user, 'brs', 'create') &&
                        <div className={classes.blockBRS}>

                            {(editionBRS) && <>
                                <FormControl size="small" variant="outlined" className={classes.formControlLot} >
                                    <InputLabel id="demo-simple-select-outlined-label" className={classes.select_orange}>Lot</InputLabel>
                                    <Select
                                        name='id_lot'
                                        value={filterValues.id_lot ? filterValues.id_lot : 'all'}
                                        // onChange={(e) => props.handleChangeSelect(props.column.key, e.target.value)}
                                        onChange={(e) => handleChangeFilter(e.target.name, e.target.value)}
                                        label='Lot' >
                                        <MenuItem value="all"><em>Tous</em></MenuItem>
                                        {lotList.map((v) => (
                                            <MenuItem key={v.id} value={v.id} >
                                                {v.libelle}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl size="small" variant="outlined" className={classes.formControlOf} >
                                    <InputLabel className={classes.select_orange}>OF</InputLabel>
                                    <Select
                                        name='OF'
                                        value={attributaireLotSelected}
                                        // onChange={(e) => props.handleChangeSelect(props.column.key, e.target.value)}
                                        onChange={(e) => handleChangeAttribLotSelected(e.target.value)}
                                        label='OF' >
                                        <MenuItem value="all"><em>Tous</em></MenuItem>
                                        {attributaireLotList.map((v) => (
                                            <MenuItem key={'selectOF_EditBRS_' + v.id} value={v.id} >
                                                {v.libelle}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <Button disabled={!editionBRS || editingBRS ||
                                    filterValues.id_lot === 'all' ||
                                    attributaireLotSelected === 'all'}
                                    variant="contained" color="primary" onClick={() => { setEditingBRS(true); handleEditionBRS() }}>Edititer</Button>
                            </>}
                            <FormControlLabel
                                control={<Switch checked={editionBRS} onChange={handleToggleEditionBRS} name="checkedA" />}
                                label=" Mode édition BRS"
                            />
                        </div>
                    }




                    {IsPermitted(user, 'formation', 'create') &&
                        <div className={classes.btn} >
                            <Button variant="contained" color="primary" onClick={handleShowFormation}>Créer une sollicitation</Button>
                        </div>}
                </div>

                <Paper>
                    <TableContainer component={Paper} className={`${classes.containerTable} scrollBar-personnalize`}>
                        <Table size="small" className={classes.table} aria-label="simple table">
                            <TableHead>
                                {formationList.length > 0 && <Filter
                                    data={formationList}
                                    lotList={lotList}
                                    etatList={etatList}
                                    filterValues={filterValues}
                                    handleChangeFilter={handleChangeFilter}
                                />}
                                <TableRow>
                                    {columnTableau.map((v) =>
                                        <TableCell onClick={() => handleOrderBy(v)} className={classes.cellHead} key={'cellHead_' + v}>
                                            <div className={classes.flex} >
                                                {(ascOrder.key === v) &&
                                                    (!ascOrder.ASC
                                                        ? <ArrowDownwardIcon fontSize="small" />
                                                        : <ArrowUpwardIcon fontSize="small" />)}
                                                <span>{codeToName(v)}</span>
                                            </div>
                                        </TableCell>
                                    )}
                                    <TableCell align="right"></TableCell>
                                </TableRow >
                            </TableHead >
                            <TableBody>
                                {formationList.length > 0
                                    ? formationListDisplay.map((row) => (
                                        <TableRow key={row.id + '_' + row.n_Article} className={row.etat === 20 ? classes.error : ''}>
                                            <TableCell component="th" scope="row">
                                                {codeToName('lot_' + row.id_lot)}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {row.n_Article}
                                            </TableCell>
                                            <TableCell>{codeToName('fonction_' + row.userFct)}</TableCell>
                                            <TableCell>{row.agence_ref_libelle}</TableCell>
                                            <TableCell>{codeToName('dispositif_' + row.dispositif)}</TableCell>
                                            <TableCell>{row.commune}</TableCell>
                                            <TableCell>
                                                <div className={classes.flex}>
                                                    {/* Si l'of a pas encore répondu ET temps de réponse > 5 jours ET etat = 1 (En attente de réponse). Affiche icone */}
                                                    {((row.dateMailOF !== null && row.dateRespOF === null) && dateCount(new Date(row.dateMailOF), new Date(), true) > 5 && row.etat === 1) &&
                                                        (row.userFct === user.fonction
                                                            ? <Tooltip title="L'OF n'a pas répondu dans le temps imparti." aria-label="comm" classes={{ tooltip: classes.tooltip }}>
                                                                <IconButton onClick={() => setOpenModalAuto(true)}>
                                                                    <NotificationImportantIcon className={classes.iconError} />
                                                                </IconButton>
                                                            </Tooltip>
                                                            : <Tooltip title="L'OF n'a pas répondu dans le temps imparti." aria-label="comm" classes={{ tooltip: classes.tooltip }}>
                                                                <NotificationImportantIcon className={classes.iconError} />
                                                            </Tooltip>)
                                                    }
                                                    {row.etat_libelle}
                                                </div>
                                            </TableCell>
                                            <TableCell>{dateFormat(row.date_entree_demandee)}</TableCell>
                                            <TableCell>{dateFormat(row.date_fin)}</TableCell>
                                            <TableCell>
                                                <div className={classes.flex}>
                                                    <Commentaire user={user} formation={row} />
                                                    <IconButton size="small" aria-label="Editer" color="secondary" onClick={(e) => handleClickOpenMenu(e, row.id)}>
                                                        <MoreHorizIcon fontSize="small" />
                                                    </IconButton>
                                                </div>
                                            </TableCell>
                                        </TableRow>))
                                    : <TableRow>
                                        <TableCell colSpan={10}>Aucune formation</TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table >
                    </TableContainer >
                </Paper >
            </div >

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

            {formationListToCancel &&
                <ModalActionAuto openModal={openModalAuto}
                    handleCloseModal={handleCloseModalAuto}
                    formationListToCancel={formationListToCancel}
                    isSubmit={isSubmitModalAuto}
                    handleClose={() => setIsSubmitModalAuto(true)}
                />}

            {openModalCreateSol &&
                <ModalFormation
                    openModal={openModalCreateSol}
                    handleCloseModal={handleCloseModal}
                    updateFormation={updateFormation}
                    createNewFormationFromThis={createNewFormationFromThis}
                    sollicitation={sollicitation}
                    user={user}

                    // Formulaire
                    lotList={lotList}
                    handleCancelFormation={handleCancelFormation}
                    dispositifList={dispositifList}
                    agence_refList={agence_refList}
                    catalogueList={catalogueList}
                    communeList={communeList}
                    handleChangeFormation={handleChangeFormation}
                    handleSaveFormation={handleSaveFormation}
                    handleEditFormation={handleEditFormation}
                    changeNArticle={handleChangeNArticle}

                    // Sollicitation
                    attributaireList={attributaireList}
                    handleCreateSollicitation={handleCreateSollicitation}
                    handleSubmitSol={handleSubmitSol}
                    isSubmittingSol={isSubmittingSol}
                    sollicitationList={sollicitationList}
                    handleResponseSollicitation={handleResponseSollicitation}
                    handlAddIcop={handlAddIcop}
                    icopList={icopList}
                    lieuExecutionList={lieuExecutionList}
                    handleChangeSollicitation={handleChangeSollicitation}
                    handleValideSollicitation={handleValideSollicitation}
                    handleSaveConv={handleSaveConv}
                />}
            <p>{"Si modif BRS = annul toute les soll, annulé le brs aussi"}</p>
            <p>{"Gérer le temps de réponse de l'OF. Si > 5 jour ouvré passe à l'of suivant"}</p>
            <p>{"Verifier tout les états 10 et 11 : 10 formation qu'on modifie, 11: Formation en attente de nouveau BRS"}</p>

        </>
    )
}