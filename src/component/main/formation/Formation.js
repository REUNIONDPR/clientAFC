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
import { codeToName, dateFormat, calculDateFin, getDateToday, dateTimeFormat } from '../../../utilities/Function';
import SnackBar from '../../global/SnackBar/SnackBar';
import './sollicitation.css';
import { Tooltip } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
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
    table: {
        minWidth: 650,
    },
    flex: {
        display: 'flex',
        alignItems: 'center',
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
    }, listOptions: {
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
        'etat_formation',
        'date_entree_demandee',
        'date_fin',
    ]

    const [formationList, setFormationList] = useState([]);
    const [formationListDisplay, setFormationListDisplay] = useState([]);
    const [filterValues, setFilterValues] = useState({
        id_lot: 'all',
        etat: [1, 2, 3, 4, 5],
    });

    const [lotList, setLotList] = useState([]);
    const [etatList, setEtatList] = useState([]);
    const [dispositifList, setDispositifList] = useState([]);
    const [catalogueList, setCatalogueList] = useState([]);
    const [agence_refList, setAgence_refList] = useState([]);
    const [communeList, setCommuneList] = useState([]);

    const [editionBRS, setEditionBRS] = useState(false)

    const [icopList, setIcopList] = useState([]);
    const [lieuExecutionList, setLieuExecutionList] = useState([])

    const [sollicitationList, setSollicitationList] = useState([]);
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
        userFct: user.fonction,
        etat: 1,
        etat_formation: '',
        etat_formation_tooltip: '',
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
        vague: '',
        id_sol: '',
        id_attributaire: '',
    });

    // Utiliser pour suivre la sollicitation une fois celle ci validée (etat = 3)
    const [sollicitation, setSollicitation] = useState({
        id_sol: '',
        id_formation: '',
        attributaire: '',
        dateMailOF: '',
        dateRespOF: '',
        lieu_execution: 'all',
        id_dateIcop: '',
        dateValidationDT: '',
        dateValidationDDO: '',
    })

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
    // --------------- SnackBar

    // --------------- useEffect
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

        axios({
            method: 'GET',
            url: 'global/findAll?table=lot',
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        }).then((response) => setLotList(response.data));

        axios({
            method: 'GET',
            url: 'global/findAll?table=dispositif',
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        }).then((response) => setDispositifList(response.data));

        axios({
            method: 'GET',
            url: 'global/findAll?table=ape',
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        }).then((response) => setAgence_refList(response.data));

        axios({
            method: 'GET',
            url: 'global/findAll?table=formation_etat',
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        }).then((response) => setEtatList(response.data))
    }, [user]);

    useEffect(() => {
        setAttributaireLotSelected('all');
        if (editionBRS && filterValues.id_lot !== 'all') {
            axios({
                method: 'GET',
                url: 'sollicitation/OFValidePourBRS?id_lot=' + filterValues.id_lot,
                headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
            }).then((response) => setAttributaireLotList(response.data))
        } else if (filterValues.id_lot === 'all') {
            setAttributaireLotList([]);
        } else if (!editionBRS) {
            setAttributaireLotList([]);
            setFilterValues({ ...filterValues, etat: [1, 2, 3, 4], id_attributaire: '' })

        }

    }, [editionBRS, filterValues.id_lot])

    useEffect(() => {
        console.log(formationList)
        setFormationListDisplay(formationList)
    }, [formationList])

    // --------------- useEffect


    // --------------- filter



    // --------------- filter

    const updateEtatFormation = (etat, text, tooltip) => {

        let id_formation = updateFormation.id;
        let time = getDateToday();

        axios({
            method: 'put',
            url: 'formation/historique',
            data: { id_formation: id_formation, id_etat: etat, date_etat: time, information: user.idgasi },
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        }).then((response) => {
            if (response.status === 200) {
                let newFormationList = formationList.map((v) => v.id === id_formation
                    ? {
                        ...v,
                        etat: etat,
                        etat_formation: text,
                        etat_formation_tooltip: tooltip,
                    }
                    : v)
                setFormationList(newFormationList)
            }
        })
    }

    // useEffect(() => {
    //     console.log(sollicitation)
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [sollicitation])

    const handleShowFormation = () => {
        handleCloseOpenMenu()
        let formation = {};

        // Si le modal s'ouvre pour voir une formation
        if (openMoreOptions !== '') {
            formation = formationList.find((v) => v.id === openMoreOptions);
            setupdateFormation({ ...updateFormation, ...formation });
            console.log(formation)
            // Si un OF à accepté une sollicitation -> formation validé (etat = 3)
            if (formation.etat === 3 || formation.etat === 4) {

                axios({
                    method: 'GET',
                    url: 'sollicitation/find?id_sol=' + formation.id_sol,
                    headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
                }).then((response) => setSollicitation({ ...sollicitation, ...response.data[0] }))

                axios({
                    method: 'GET',
                    url: 'sollicitation/icop?id_sol=' + formation.id_sol,
                    headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
                }).then((response) => setIcopList(response.data))

                axios({
                    method: 'GET',
                    url: 'sollicitation/lieuExecution?id_sol=' + formation.id_sol,
                    headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
                }).then((response) => setLieuExecutionList(response.data))
            }

            setOpenMoreOptions('');
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
                    url: '/sollicitation/findAll?' + sql,
                    headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
                }).then((response) => setSollicitationList(response.data));
            }
        }

        setOpenModalCreateSol(true);
    }

    // Savoir si la modification de la formation cause une resollicitation des OF (quel form doit être remplacée)
    const [createNewFormationFromThis, setCreateNewFormationFromThis] = useState({ etat: false, field: '', user: '' })

    const handleCreateNewFormationFromThis = (k, v) => {
        setCreateNewFormationFromThis({ etat: true, idChange: updateFormation.id, fieldChange: k, valueChange: updateFormation[k], userChange: user.idgasi });
        setupdateFormation({ ...updateFormation, id: '', [k]: v })
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
                ...updateFormation, date_creation: getDateToday(),
                date_entree_fixe: updateFormation.date_entree_demandee,
                createNewFormationFromThis: createNewFormationFromThis,
            },
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), },
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
                    etat_formation: "En cours d'élaboration",
                    etat_formation_tooltip: null,
                    date_entree_fixe: updateFormation.date_entree_demandee,
                    id_sol: null,
                });
                console.log(newFormationList)
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
        setCreateNewFormationFromThis({ etat: false });
        setOpenModalCreateSol(false);
        setCatalogueList([]);
        setCommuneList([]);
        setAttributaireList([]);
        setSollicitationList([]);
        setupdateFormation({
            id: '',
            id_lot: 'all',
            id_cata: 'all',
            intitule: '',
            idgasi: user.idgasi,
            userFct: user.fonction,
            etat: 1,
            etat_formation: '',
            etat_formation_tooltip: '',
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
            vague: '',
            id_attributaire: '',
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
        //     headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        // }).then((response) => console.log(response))

        axios({
            method: 'PUT',
            url: '/sollicitation/create',
            data: { ...updateFormation, attributaire: sollicitation.id },
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        }).then((response) => {

            setIsSubmittingSol(false)
            if (response.status === 200) {

                // update etat formation -> Sollicitation en cours
                updateEtatFormation(2, 'Sollicitation en cours', '');

                let time = getDateToday();
                let newTime = time.replace(' ', 'T') + '.000';

                let currentDate = new Date();
                let date =
                    currentDate.getFullYear().toString().padStart(2, '0') + '-' +
                    (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' +
                    currentDate.getDate().toString().padStart(2, '0');

                let newSollArray = [...sollicitationList];
                newSollArray.push({
                    id_sol: response.data.insertId,
                    attributaire: sollicitation.id,
                    dateMailOF: date,
                    dateRespOF: null,
                    dateValidationDT: null,
                    dateValidationDDO: null,
                    date_etat: newTime,
                    etat: 1,
                    id_dateIcop: null,
                    id_formation: updateFormation.id,
                    lieu_execution: null,
                })

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
        txt = txt === '' ? null : txt

        let time = getDateToday();

        let newTime = time.replace(' ', 'T') + '.000Z';

        let etat = 0;
        let text = '';
        let tooltip = '';
        if (resp === 'accept') {
            // Accepte la sollicitation, passe à l'état 2
            etat = 3;
            text = 'Validée';
            tooltip = 'L\'OF à accepté la sollicitation';
        } else if (resp === 'refus') {
            // Refuse la sollicitation, passe à l'état 3
            etat = 8;
            text = 'Annulée';
            tooltip = 'Aucun OF n\'a répondu favorablement aux sollicitations';
        }

        axios({
            method: 'PUT',
            url: 'sollicitation/update',
            data: { id_sol: sol.id_sol, etat: etat, dateTime: time, reason: txt },
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        }).then((response) => {
            if (response.status === 200) {

                // Met à jour le tableau des sollicitations actuelles.
                let newSollArray = sollicitationList.map((v) => {
                    if (v.id_sol === sol.id_sol) {
                        return { ...v, etat: etat, date_etat: newTime, reason: txt, dateRespOF: time }
                    } else return v;
                })

                // Si l'OF accepte, met à jour l'état de la formation.
                if (etat === 3) {

                    // Mettre à jour le hook sollicitation
                    setSollicitation({
                        ...sollicitation,
                        id_sol: sol.id_sol,
                        id_formation: sol.id_formation,
                        attributaire: sol.attributaire,
                        dateMailOF: sol.dateMailOF,
                        dateRespOF: time,
                    })

                    // Récupère liste des adresse pour la formation
                    axios({
                        method: 'GET',
                        url: 'sollicitation/lieuExecution?id_sol=' + sol.id_sol,
                        headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
                    }).then((response) => setLieuExecutionList(response.data))

                    // UpdateFotmation et etat de la formation
                    setupdateFormation({
                        ...updateFormation,
                        id_attributaire: sol.attributaire
                    })
                    updateEtatFormation(etat, text, tooltip)
                }

                // ERREUR - ça ne veux pas dire qu'il n'y a plus personne à solliciter
                // else if (newSollForm.filter((v) => v.etat !== 8).length === 0) {
                //     // Il n'y a plus d'OF à contacter
                //     // text = 'Annulée';
                //     // tooltip = 'Aucun OF n\'a répondu favorablement aux sollicitations';
                //     // updateEtatFormation(etat, text, tooltip)
                // }

                setSollicitationList(newSollArray)
            } else {
                setMessageSnackBar('Une erreur inconnue est survenue');
                setSeverity('error');
                setOpenSnackBar(true);
            }
        })

    }

    const handlAddIcop = (icop) => {
        let dateTime = dateTimeFormat(icop, 'ANG');

        axios({
            method: 'put',
            url: 'sollicitation/addIcop',
            data: { id_sol: sollicitation.id_sol, icop: dateTime.date + ' ' + dateTime.time },
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        }).then((response) => {
            console.log(response)
            if (response.status === 200) {
                let newArrIcop = [...icopList];
                newArrIcop.push({ id: response.data.insertId, dateIcop: (dateTime.date + ' ' + dateTime.time).replace(' ', 'T') })
                setIcopList(newArrIcop)
            }
        })
    }

    const handleCancelSollicitation = () => {
        console.log('Annule la sollicitation')
    }

    const handleValideSollicitation = (valideType) => {
        let dateTime = getDateToday();
        let information = '';
        let etat;

        let sol = { ...sollicitation };

        switch (valideType) {
            case 'DT':
                if (sol.dateValidationDT) {
                    etat = 41;
                    information = 'Modifiation DT (' + user.idgasi + ')';
                } else {
                    etat = 4;
                    sol.dateValidationDT = dateTime;
                    information = 'Validation DT (' + user.idgasi + ')';
                }
                break;
            case 'DDO':
                if (sol.dateValidationDDO) {
                    etat = 51;
                    information = 'Modifiation DDO (' + user.idgasi + ')';
                } else {
                    etat = 5;
                    sol.dateValidationDDO = dateTime;
                    information = 'Validation DDO (' + user.idgasi + ')';
                    updateEtatFormation(4, 'Validé DDO', '')
                }
                break;
            default:
                break;
        }

        axios({
            method: 'put',
            url: 'sollicitation/save',
            data: {
                sollicitation: sol,
                reason: information,
                dateTime: dateTime,
                etat: etat,
            },
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        }).then((response) => {

            if (response.status === 200) {
                let newSollArray = sollicitationList.map((v) => {
                    if (v.id_sol === sol.id_sol) {
                        return { ...v, etat: etat, date_etat: dateTime, reason: information }
                    } else return v;
                })
                setSollicitationList(newSollArray)
                setSollicitation(sol)
                setMessageSnackBar('Sollicitation validée.');
                setSeverity('success');
            } else {
                setMessageSnackBar('Une erreur est survenue lors de la validation de la sollicitation.');
                setSeverity('error');
            }
            setOpenSnackBar(true);
        })
    }

    const handleChangeFilter = (k, v) => {
        setFilterValues({ ...filterValues, [k]: v })
    }

    useEffect(() => {
        if (formationList.length > 0) {
            let array = [];
            array = formationList.filter((v) => {

                for (let key in filterValues) {
                    if (filterValues[key] === 'all' || filterValues[key] === '') continue;
                    switch (key) {
                        case 'id_lot':
                            if ((v[key] && v[key].toString()) !== filterValues[key].toString()) return false
                            break;
                        case 'id_attributaire':
                            if ((v[key] && v[key].toString()) !== filterValues[key].toString()) return false
                            break;
                        case 'etat':
                            let value = [];
                            value = filterValues[key];
                            if (value.length > 0) {
                                if (value.indexOf(v[key]) === -1) return false;
                            } else {
                                return false;
                            }
                            break;
                        default: break;
                    }
                }
                return v;
            })
            setFormationListDisplay(array)
        }
    }, [filterValues, formationList])

    const [attributaireLotSelected, setAttributaireLotSelected] = useState('all');
    const [attributaireLotList, setAttributaireLotList] = useState([]);
    const [editingBRS, setEditingBRS] = useState(false)

    const handleToggleEditionBRS = () => {
        setEditionBRS(!editionBRS)
    }

    const handleChangeAttribLotSelected = (id) => {
        setFilterValues({ ...filterValues, id_attributaire: id, etat: id === 'all' ? [1, 2, 3, 4, 5] : [4] })
        setAttributaireLotSelected(id)
    }
    const handleEditionBRS = () => {
        setEditingBRS(true)
        // Récupère les données pour BDD / BRS
        axios({
            method: 'get',
            url: 'sollicitation/findBRS?id_lot=' + filterValues.id_lot + '&attributaire=' + attributaireLotSelected + '&user=' + user.idgasi,
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        }).then((response) => {
            if (response.status === 200) {
                if (response.data.length > 0) {
                    console.log(response)
                    let time = getDateToday();
                    let lot = response.data[0].lot ? response.data[0].lot.split(' - ')[0].replace(' ', '') : 'LOT?';
                    let version = 0;
                    let nb = (response.data[0].nb_brs + 1).toString().padStart(3, '0');
                    let n_brs = `BRS2021 - AFC2019 - ACCORD CADRE - ${lot} - ${nb}`;
                    let filename = `BRS${nb}-${lot}V${version}.xlsx`;

                    const brs = {
                        lot: response.data[0].lot,
                        n_marche: response.data[0].n_marche,
                        remplace: '',
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
                        let dateEntree = v.date_entree_demandee.split('T')[0];
                        let dateFin = v.date_fin.split('T')[0];
                        let dateIcop = v.dateIcop.split('T')[0];
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
                        dateEntree.split('-')[2] + '/' +
                        dateEntree.split('-')[1] + '/' +
                        dateEntree.split('-')[0],
                        dateFin.split('-')[2] + '/' +
                        dateFin.split('-')[1] + '/' +
                        dateFin.split('-')[0],
                            '',
                            '',
                            '',
                        dateIcop.split('-')[2] + '/' +
                        dateIcop.split('-')[1] + '/' +
                        dateIcop.split('-')[0],
                        ]
                    })

                    // INERT BRS dans la BDD + INSERT brs_histo + INERT/UPDATE brs_compteur
                    axios({
                        method: 'put',
                        url: 'brs/create',
                        data: {
                            n_brs: n_brs,
                            filename: filename,
                            id_lot: filterValues.id_lot,
                            id_attributaire: filterValues.id_attributaire,
                            dateTime: time,
                            nb_brs: response.data[0].nb_brs + 1,
                        },
                        headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
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
                                },
                                headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
                            }).then((response) => {
                                console.log(response)
                            })
                            // Créer fichier BRS et Download
                            createBRS(lot, n_brs, filename, brs, attrib, rowsTable)

                            setMessageSnackBar('Données mises à jours. Le téléchargement vas commencer');
                            setSeverity('success');

                            const newFormationList = formationList.map((v) =>
                                array_id_sol.indexOf(v.id_sol) !== -1 ? { ...v, etat: 5, etat_formation: 'BRS Edité' } : v)
                            console.log(newFormationList)
                            setFormationList(newFormationList)

                        } else {
                            setMessageSnackBar('Une erreur est survenue. Réessayer.');
                            setSeverity('error');
                        }

                        setOpenSnackBar(true);
                    })

                } else console.log('Aucune donnée')
            }
        })
    }

    const createBRS = (lot, n_brs, filename, brs, attrib, rowsTable) => {
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
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
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
            } else if (k === 'n_Article' || k === 'etat_formation' || k === 'commune') {
                ordered = ascOrder.ASC
                    ? b[k] > a[k] ? -1 : a[k] > b[k] ? 1 : 0
                    : b[k] > a[k] ? 1 : a[k] > b[k] ? -1 : 0;
            }
            return ordered;
        });
        setFormationListDisplay(newArray)
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
                    <div className={classes.title} >Liste des formations</div>
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
                                            <MenuItem key={'selectOF_EditBRS_' + v.attributaire} value={v.attributaire} >
                                                {v.libelle}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <Button disabled={!editionBRS || editingBRS ||
                                    filterValues.id_lot === 'all' ||
                                    attributaireLotSelected === 'all'}
                                    variant="contained" color="primary" onClick={handleEditionBRS}>Edititer</Button>
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
                    <TableContainer component={Paper}>
                        <Table size="small" className={classes.table} aria-label="simple table">
                            <TableHead>
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
                                {formationList.length > 0 && <Filter
                                    data={formationList}
                                    lotList={lotList}
                                    etatList={etatList}
                                    filterValues={filterValues}
                                    handleChangeFilter={handleChangeFilter}
                                />}
                                {formationList.length > 0
                                    ? formationListDisplay.map((row) => (
                                        <TableRow key={row.id + '_' + row.n_Article}>
                                            <TableCell component="th" scope="row">
                                                {codeToName('lot_' + row.id_lot)}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {row.n_Article}
                                            </TableCell>
                                            <TableCell align="right">{codeToName('fonction_' + row.userFct)}</TableCell>
                                            <TableCell align="right">{row.agence_ref_libelle}</TableCell>
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
                    sollicitationList={sollicitationList}
                    handleResponseSollicitation={handleResponseSollicitation}
                    handlAddIcop={handlAddIcop}
                    icopList={icopList}
                    lieuExecutionList={lieuExecutionList}
                    sollicitation={sollicitation}
                    handleChangeSollicitation={handleChangeSollicitation}
                    handleValideSollicitation={handleValideSollicitation}
                    handleCancelSollicitation={handleCancelSollicitation}
                />}


        </>
    )
}