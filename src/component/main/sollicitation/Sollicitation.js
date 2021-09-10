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
import ModalCreateSol from './Modal/ModalCreateSol';
import { codeToName, dateFormat, calculDateFin } from '../../../utilities/Function';
import SnackBar from '../../global/SnackBar/SnackBar';
import './sollicitation.css';
import { IsPermitted } from '../../../utilities/Function';
import IconButton from '@material-ui/core/IconButton';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grow from '@material-ui/core/Grow';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
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
    const [styleOptionsList, setStyleOptionsList] = useState({});
    const [openModalCreateSol, setOpenModalCreateSol] = useState(false)
    const [updateFormation, setupdateFormation] = useState({
        id: '',
        id_lot: 'all',
        id_cata: 'all',
        intitule: '',
        idgasi: user.idgasi,
        userFct: '',
        dt: '',
        statut: 1,
        agence_ref: 'all',
        dispositif: 1,
        n_Article: '',
        nbarticle: 0,
        nb_place: '',
        adresse: '',
        commune: '',
        id_commune: 'all',
        date_creation: getDateToday(),
        date_entree: '',
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
            console.log('&é"&é"&é"&é"&éeazdeazdazdazdazdaz')
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

            // si formation déjà créer, récupère la liste des attr 
            if (formation.id !== '') {
                let sql = `id_cata=${formation.id_cata}&id_formation=${formation.id}`
                axios({
                    method: 'GET',
                    url: '/formation/findAttributaires?' + sql,
                    headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
                }).then((response) => setAttributaireList(response.data));
            }
        }

        setOpenModalCreateSol(true);
    }

    const handleChangeFormation = (k, v) => {
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
            case 'date_entree':
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
    };

    // const [displayRows, setDisplayRows] = useState([]);
    // const [openModal, setOpenModal] = useState(false);
    // const [updateRow, setUpdateRow] = useState({})

    // const ActionTable = (props) => {
    //     return (
    //         <TableCell align="right">
    //             <div className='cell-flex'>

    //                 {IsPermitted(user, 'sollicitation', 'delete') &&
    //                     <Tooltip title="Supprimer">
    //                         <IconButton aria-label="Editer" size="small" color="inherit" onClick={() => handleClickTest('delete formation')}>
    //                             <DeleteOutlineIcon fontSize="small" />
    //                         </IconButton>
    //                     </Tooltip>}

    //                 {IsPermitted(user, 'sollicitation', 'update') &&
    //                     <Tooltip title="Editer">
    //                         <IconButton aria-label="Editer" size="small" color="primary" onClick={() => handleOpenModal(props.row)}>
    //                             <EditIcon fontSize="small" />
    //                         </IconButton>
    //                     </Tooltip>}

    //                 {IsPermitted(user, 'sollicitation', 'validate') &&
    //                     <Tooltip title="Valider">
    //                         <IconButton aria-label="Editer" size="small" color="secondary" onClick={() => handleClickTest('valider la formation')}>
    //                             <CheckIcon fontSize="small" />
    //                         </IconButton>
    //                     </Tooltip>}
    //             </div>
    //         </TableCell>
    //     )
    // }

    // const handleClickTest = (e) => {
    //     console.log(e)
    // }

    // const handleCloseModal = () => {
    //     setOpenModal(false)
    // }
    // const handleOpenModal = (row) => {
    //     setUpdateRow(row)
    //     setOpenModal(true)
    // }

    // // --------------- SnackBar
    // const [openSnackBar, setOpenSnackBar] = useState(false);
    // const [messageSnackBar, setMessageSnackBar] = useState('');
    // const [severity, setSeverity] = useState('success');
    // const handleCloseSnackbar = (reason) => {
    //     if (reason === 'clickaway') {
    //         return;
    //     }
    //     setOpenSnackBar(false);
    //     setMessageSnackBar('');
    // };
    // // ----------------------------

    // const [nbFilter, setNbFilter] = useState(0);
    // const [filterSelected, setFilterSelected] = useState({})

    // const handleChangeFilter = (key, value) => {
    //     console.log(key, value)
    //     setFilterSelected({ ...filterSelected, [key]: value })
    //     value !== 'none' ? setNbFilter(nbFilter + 1) : nbFilter > 0 ? setNbFilter(nbFilter - 1) : setNbFilter(0)
    // };

    // useEffect(() => {
    //     let myFilter = Object.entries(filterSelected)[0]
    //     let result = [];
    //     if (myFilter) {
    //         // eslint-disable-next-line array-callback-return
    //         result = rows.filter((row) => {
    //             for (let i = 0; i < myFilter.length; i++) {
    //                 if (myFilter[i + 1] !== 'none') {
    //                     if (row[myFilter[i]] === myFilter[i + 1]) {
    //                         return row;
    //                     } else {
    //                         i++
    //                     }
    //                 } else {
    //                     i++
    //                     return row;
    //                 }
    //             }
    //         })
    //     } else {
    //         result = rows;
    //     }
    //     setDisplayRows(result)
    // }, [filterSelected, rows])

    // const [lotList, setLotList] = useState([]);

    // useEffect(() => {

    //     axios({
    //         method: 'GET',
    //         url: '/global/getLot',
    //         headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
    //     }).then((response) => { setLotList(response.data) })
    // }, [])

    // // const handleChangeFilter = (event) => {
    // //     setLotSelected(event.target.value);
    // //     event.target.value === 'none'
    // //         ? setDisplayRows(rows)
    // //         : setDisplayRows(rows.filter((r) => {
    // //             if (parseInt(r.lot) === parseInt(event.target.value)) { return r; } else { return false; }
    // //         }))
    // // };

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
                    date_entree: v.date_entree ? dateFormat(v.date_entree, 'ANG') : '',
                    date_fin: v.date_fin ? dateFormat(v.date_fin, 'ANG') : '',
                };
            });
            setFormationList(formList);
        });
    }, []);

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
                handleCloseModal();
            } else {
                handleCloseModal();
                setMessageSnackBar('Erreur lors de la création de la foramtion');
                setSeverity('error');
            }
            setOpenSnackBar(true);
        });
    };

    const handleOpenMoreOption = (e, id) => {
        openMoreOptions === '' && setStyleOptionsList({ top: e.clientY + 20 });
        setOpenMoreOptions(openMoreOptions === id ? '' : id);
    };

    const handleSendMailOF = () => {
        console.log('sendmail', openMoreOptions)
    }

    const handleCancelFormation = () => {
        console.log('Annuler ?', openMoreOptions)
    }

    const handleCloseModal = () => {
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
            statut: 1,
            agence_ref: 'all',
            dispositif: 1,
            n_Article: '',
            nbarticle: 0,
            nb_place: '',
            adresse: '',
            commune: '',
            id_commune: 'all',
            date_creation: getDateToday(),
            date_entree: '',
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
    const handleCreateSollicitation = () => {
        console.log('create sol')
        axios({
            method: 'POST',
            url: '/mail/sendSollicitationOF',
            data: updateFormation,
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        }).then((response) => console.log(response))
    }

    const handleClickAway = () => {
        setOpenMoreOptions('');
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
                                            <TableCell align="right">{dateFormat(row.date_entree)}</TableCell>
                                            <TableCell align="right">{dateFormat(row.date_fin)}</TableCell>
                                            <TableCell align="right">
                                                <IconButton size="small" aria-label="Editer" color="secondary" onClick={(e) => handleOpenMoreOption(e, row.id)}>
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
            {/* <ClickAwayListener onClickAway={handleClickAway}> */}
            <Grow in={(openMoreOptions !== '')} component={Paper} style={styleOptionsList}>
                <List dense={true} className={classes.listOptions}>
                    {moreOptionsList.indexOf('show') > -1 &&
                        <ListItem button dense onClick={handleShowFormation}>
                            <ListItemText primary='Voir plus' />
                        </ListItem>}

                    {moreOptionsList.indexOf('contact') > -1 &&
                        <ListItem button dense onClick={handleSendMailOF}>
                            <ListItemText primary='Voir les contacts' />
                        </ListItem>}

                    {moreOptionsList.indexOf('cancel') > -1 &&
                        <ListItem button dense onClick={handleCancelFormation}>
                            <ListItemText primary='Annuler la formation' />
                        </ListItem>}

                </List>
            </Grow >
            {/* </ClickAwayListener> */}
            {openModalCreateSol &&
                <ModalCreateSol
                    openModal={openModalCreateSol}
                    handleCloseModal={handleCloseModal}
                    lotList={lotList}
                    dispositifList={dispositifList}
                    agence_refList={agence_refList}
                    catalogueList={catalogueList}
                    communeList={communeList}
                    handleChangeFormation={handleChangeFormation}
                    handleSaveFormation={handleSaveFormation}
                    updateFormation={updateFormation}
                    attributaireList={attributaireList}
                    handleCreateSollicitation={handleCreateSollicitation}
                    user={user}
                />}


        </>
    )
}