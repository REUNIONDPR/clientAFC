import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Table from './Table/Table';
import Cookie from 'js-cookie';
import { UserContext } from '../../../context/user.context';
import ModalCatalogue from './Modal/ModalCatalogue';
import ModalAdresse from './Modal/ModalAdresse';
import { SocketContext } from '../../../context/socket.context';
import TableCell from '@material-ui/core/TableCell';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { IsPermitted } from '../../../utilities/Function';

export default function Catalogue() {

    const { user } = useContext(UserContext);
    const { socket } = useContext(SocketContext);

    const columns = [
        'lot',
        'n_Article',
        'intitule_form_marche',
        'intitule_form_base_article',
        'priorite',
        'of',
        'formacode',
        'niveau_form',
        'ojectif_form',
        'nb_heure_socle',
        'nb_heure_ent',
        'nb_heure_appui',
        'nb_heure_soutien',
        'prixTrancheA',
        'prixTrancheB',
        'adresse',
        'action',
    ]

    const [rows, setRows] = useState([]) // Resultat de la requete
    const [displayRows, setDisplayRows] = useState([]) // Copie de rows pour immutabilité
    const [adresseHabilited, setAdresseHabilited] = useState(false)

    // Faire une habilitation globale
    useEffect(() => {
        if (user.fonction) {
            setAdresseHabilited(IsPermitted(user, 'adresse', 'delete'))
        }
    }, [user]);

    // --------------- SnackBar
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [messageSnackBar, setMessageSnackBar] = useState('');
    const [severity, setSeverity] = useState('success');

    const ActionTable = (props) => {
        return (
            <TableCell align="right">
                <div className='cell-flex'>
                    {IsPermitted(user, 'catalogue', 'update') &&
                        <Tooltip title="Editer">
                            <IconButton aria-label="Editer" color="secondary" onClick={() => handleOpenModalCatalogue(props.row)}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>}
                </div>
            </TableCell>
        )
    }
    //------------------- SnackBar
    const handleCloseSnackbar = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackBar(false);
        setMessageSnackBar('');
    };


    // const isMountedRef = useRef(true);
    useEffect(() => {
        // if (isMountedRef.current) {
        socket.on('updateRow', (updateDataRow) => {
            setRows(updateDataRow)
        })
        // }
    }, [socket])

    // ---------------------------------- Action sur les filtres
    const [nbFilter, setNbFilter] = useState(0);
    const [filterSelected, setFilterSelected] = useState({})

    const handleChangeFilter = (key, value) => {
        setFilterSelected({ ...filterSelected, [key]: value })
    };

    useEffect(() => {
        setNbFilter(Object.entries(filterSelected).filter(([k, v]) => v !== 'none' && v !== 'all').length)
        let myFilter = Object.entries(filterSelected)[0]
        let result = [];
        if (myFilter) {
            // eslint-disable-next-line array-callback-return
            result = rows.filter((row) => {
                for (let i = 0; i < myFilter.length; i++) {
                    if (myFilter[i + 1] !== 'none') {
                        if (row[myFilter[i]] === myFilter[i + 1]) {
                            return row;
                        } else {
                            i++
                        }
                    } else {
                        i++
                        return row;
                    }
                }
            })
        } else {
            result = rows;
        }
        setDisplayRows(result)
    }, [filterSelected, rows])

    const [lotList, setLotList] = useState([]);

    useEffect(() => {

        // ---------------------------------- GET LOT POUR LES SELECTS (Filtres)
        axios({
            method: 'GET',
            url: '/global/getLot',
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        }).then((response) => {
            setLotList(response.data)
        })

        // ---------------------------------- GET CATALOGUE POUR LE TABLEAU
        axios({
            method: 'GET',
            url: '/catalogue/findAll',
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        }).then((response) => {

            let data = response.data.map((v) => {
                let adr = [];
                if (v.adresse) {
                    if (v.adresse.includes('|')) {
                        let array_adresse = v.adresse.split('|');
                        for (let i = 0; i < array_adresse.length; i++) {
                            let addr_ville = array_adresse[i].split(':')[1].split(' - ')
                            adr.push({ id: array_adresse[i].split(':')[0], adresse: addr_ville[0], commune: addr_ville[1] })
                        }
                    } else {
                        let addr_ville = v.adresse.split(':')[1].split(' - ')
                        adr.push({ id: v.adresse.split(':')[0], adresse: addr_ville[0], commune: addr_ville[1] })
                    }
                }
                // else adr.push({ id: '', adresse: 'null' })
                v.adresse = adr;
                return v;
            })
            setRows(data)
        });

    }, [])


    // ---------------------------------- MODAL CATALOGUE
    const [openModalCatalogue, setOpenModalCatalogue] = useState(false);
    const [updateRowCatalogue, setUpdateRowCatalogue] = useState({})

    const resetUpdatedRowCatalogue = () => {
        setUpdateRowCatalogue({
            id: '',
            id_lot: 'all',
            id_of_cata: '',
            adresse: [],
            list_of: [],
            n_Article: '',
            intitule_form_marche: '',
            intitule_form_base_article: '',
            formacode: '',
            niveau_form: 'all',
            objectif_form: 'all',
            nb_heure_socle: 0,
            nb_heure_ent: 0,
            nb_heure_appui: 0,
            nb_heure_soutien: 0,
            prixTrancheA: 0,
            prixTrancheB: 0,
        })
    }
    // const [OfList, setOfList] = useState([]);
    const handleOpenModalCatalogue = (row) => {
        if (row.id && row.id !== '') {
            axios({
                method: 'GET',
                url: 'catalogue/of?id_cata=' + row.id,
                headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
            }).then((response) => {
                setUpdateRowCatalogue({ ...row, list_of: response.data })
            });
        } else {
            resetUpdatedRowCatalogue();
        }
        setOpenModalCatalogue(true)
    }

    const handleChangeUpdateRow = (k, v) => {
        setUpdateRowCatalogue({ ...updateRowCatalogue, [k]: v })
    }

    const [deleteClick, setDeleteClick] = useState(false)
    const handleHideDeleteIcon = () => {
        setDeleteClick(false)
    }

    const handleShowDeleteIcon = () => {
        setDeleteClick(true)
    }

    const handleCloseModalCatalogue = () => {
        resetUpdatedRowCatalogue();
        setOpenModalCatalogue(false)
        handleHideDeleteIcon()
    }

    // ---------------------------------- Erreur validation modal
    const handleErrorSubmit = () => {
        setMessageSnackBar('Erreur, je n\'ai pas compris votre demande.');
        setSeverity('error');
        setOpenModalCatalogue(false)
        handleHideDeleteIcon()
    }

    // ---------------------------------- Quand changement sur la ligne, met à jour le tableau avec la nouvelle ligne
    const updateRowsTableAfterPutAxios = (newRow, field = 'none') => {
        if (field === 'adresse') {
            return rows.map((v, i) => {
                if (v.id === newRow.id && v.id_of_cata === newRow.id_of_cata) {
                    Object.keys(v).map((k) => v[k] = newRow[k])
                    return v = newRow;
                } else return v;
            })
        } else
            return rows.map((v, i) => {
                if (v.id === newRow.id) {
                    Object.keys(v).map((k) => (k === 'adresse' || k === 'id_of_cata') ? v[k] : v[k] = newRow[k])
                    return v;
                } else return v;
            })
    }

    // ---------------------------------- Créer une formation du Catalogue
    const handleSubmitClickCatalogue = (dataRow) => {
        axios({
            method: 'put',
            url: '/catalogue/create',
            data: dataRow,
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), },
        }).then((response) => {
            if (response.status === 200) {
                let newDataRow = [...rows];

                dataRow.id = response.data.insertId;
                dataRow.adresse = '';
                dataRow.priorite = '';
                dataRow.list_of = [];
                dataRow.of = '';
                dataRow.lot = dataRow.id_lot;

                newDataRow.unshift(dataRow);
                socket.emit("updateCatalogue", newDataRow);
                setRows(newDataRow)
                setMessageSnackBar('Enregistrement réussi.');
                setSeverity('success');
                setOpenModalCatalogue(false)
                handleHideDeleteIcon()
                // updateDataRow(displayRows, dataRow);
            } else {
                setMessageSnackBar('Echec de l\'enregistrement.');
                setSeverity('error');
            }
            setOpenSnackBar(true);
        })
    }

    // ---------------------------------- Edit une formation du Catalogue
    const handleEditSubmitClickCatalogue = (updatedRow, listOf) => {

        let updatedRowFromCata = { ...updatedRow }
        updateOf(updatedRowFromCata, listOf);

        axios({
            method: 'put',
            url: '/catalogue/update',
            data: updatedRowFromCata,
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), },
        }).then((response) => {
            if (response.status === 200) {
                let newDataRow = updateRowsTableAfterPutAxios(updatedRowFromCata)
                setRows(newDataRow)
                setDisplayRows(newDataRow)
                socket.emit("updateCatalogue", newDataRow);
                setMessageSnackBar('Modification enregistré.');
                setSeverity('success');
                handleHideDeleteIcon()
                // updateDataRow(displayRows, updatedRowFromCata);
            } else {
                setMessageSnackBar('Echec de la modification.');
                setSeverity('error');
            }
            setOpenSnackBar(true);
        })
        setOpenModalCatalogue(false)
    }

    const handleSaveNewOf = (updatedRowFromCata, rowOF) => {
        // Ajouter un ligne au tableau avec attribut of / priorite

        console.log(updatedRowFromCata, rowOF)
        // Ajoute un OF à la formation si il y a un 'new' comme id
        axios({
            method: 'put',
            url: '/catalogue/add_of',
            data: { priorite: rowOF.priorite, id_attr: rowOF.id_attr, id_cata: updatedRowFromCata.id },
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), },
        }).then((response) => {
            console.log(response)
            if (response.status !== 200) {

                // Ajoute nouvelle ligne au tableau catalogue
                let indexToAddNewRow = rows.findIndex((v) => v.id === updatedRowFromCata.id) + 1
                updatedRowFromCata.list_of.push({ ...rowOF, id: response.data.insertId })
                let newDataRow = [...rows];
                newDataRow.splice((indexToAddNewRow > rows.length) ? rows.length : indexToAddNewRow, 0, {
                    ...updatedRowFromCata,
                    of: rowOF.libelle,
                    list_of: newDataRow.listOf.map((x) => x.id === rowOF.id ? { ...x, [x.id]: response.data.insertId } : x),
                    id_of_cata: response.data.insertId,
                    priorite: rowOF.priorite,
                })
                setRows(newDataRow)
                setDisplayRows(newDataRow)
            }
        })
    }
    const updateOf = (updatedRowFromCata, listOf) => {
        // Update OF à la formation
        let updating = false;
        updatedRowFromCata.list_of.map((v) => {
            let of = listOf.find((x) => x.id === v.id)
            if (!updating) updating = parseInt(of.priorite) !== parseInt(v.priorite)
            return updating;
        })
        if (updating) {
            let arrayOFUpdate = listOf.filter((v) => !v.id.toString().includes('new_'))
                .map((v) => v = { ...v, id_cata: updatedRowFromCata.id });
            arrayOFUpdate.map((v) =>
                axios({
                    method: 'put',
                    url: '/catalogue/update_of',
                    data: v,
                    headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), },
                }).then((response) => {
                    if (response.status !== 200) {
                        console.log(response)
                    }
                })
            )
        }
    }

    // ---------------------------------- Delete une formation du Catalogue
    const handleDeleteClickCatalogue = (dataRow) => {
        axios({
            method: 'put',
            url: '/catalogue/delete',
            data: dataRow,
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), },
        }).then((response) => {
            if (response.status === 200) {
                let newDataRow = rows.filter((v) => v.id !== dataRow.id)
                socket.emit("updateCatalogue", newDataRow);
                setRows(newDataRow)
                setMessageSnackBar('Suppression réussi.');
                setSeverity('success');
                setOpenModalCatalogue(false)
                handleHideDeleteIcon()
                // setRows(newDataRow) // Met à jour le tableau au cas ou la socket ne répond pas.
                // setDisplayRows(newDataRow) // Met à jour le tableau au cas ou la socket ne répond pas.
            } else {
                setMessageSnackBar('Echec de la suppréssion.');
                setSeverity('error');
            }
            setOpenSnackBar(true);
        })
    }

    // ---------------------------------- Delete un OF d'une formation
    const handleDeleteOf = (id, id_cata) => {
        axios({
            method: 'put',
            url: '/catalogue/delete_of',
            data: { id: id },
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), },
        }).then((response) => {
            if (response.status === 200) {

                // Supprime la ligne du tableau - Si il reste qu'une ligne, reset les champs of, list_of et priorite
                let newDataRow = [];
                for (let i = 0; i < rows.length; i++) {
                    if (rows[i].id === id_cata) {
                        if (rows.filter((v) => v.id === id_cata).length === 1) {
                            let newRow = [...rows[i]];
                            newRow.of = '';
                            newRow.priorite = '';
                            newRow.list_of = [];
                            newDataRow.push(newRow)
                        } else if (rows[i].id_of_cata !== id) newDataRow.push(rows[i])
                    } else newDataRow.push(rows[i]);
                }
                setRows(newDataRow)

                // Supprimer la ligne du modal
                let newListOf = updateRowCatalogue.list_of.filter((v) => v.id !== id)
                setUpdateRowCatalogue({ ...updateRowCatalogue, list_of: newListOf })

                setMessageSnackBar('Suppression de l\'OF réussi.');
                setSeverity('success');

            } else {
                setMessageSnackBar('Echec de la suppréssion de l\'OF.');
                setSeverity('error');
            }
            setOpenSnackBar(true);
        })
    }
    // ---------------------------------- MODAL ADRESSE
    const [openModalAdresse, setOpenModalAdresse] = useState(false)
    const [updateRowAdresse, setUpdateRowAdresse] = useState({})
    const handleShowModalAdresse = (row) => {
        setUpdateRowAdresse(row)
        setOpenModalAdresse(true)
    }

    const handleCloseModalAdresse = () => {
        setUpdateRowAdresse({
            id: '',
            id_lot: 'all',
            id_of_cata: '',
            adresse: [],
            list_of: [],
            n_Article: '',
            intitule_form_marche: '',
            intitule_form_base_article: '',
            formacode: '',
            niveau_form: 'all',
            objectif_form: 'all',
            nb_heure_socle: 0,
            nb_heure_ent: 0,
            nb_heure_appui: 0,
            nb_heure_soutien: 0,
            prixTrancheA: 0,
            prixTrancheB: 0,
        });
        setOpenModalAdresse(false)
    }

    // ---------------------------------- Ajouter une adresse
    const handleAddAdresse = (updatedRow, adresse) => {
        axios({
            method: 'put',
            url: '/attributaire/addAdresse',
            data: { id_catalogue_attributaire: updatedRow.id_of_cata, id_adresse: adresse.id },
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), },
        }).then((response) => {
            if (response.status === 200) {

                updatedRow.adresse.push(adresse)
                let newDataRow = updateRowsTableAfterPutAxios(updatedRow, 'adresse')

                setRows(newDataRow)
                setDisplayRows(newDataRow)

                socket.emit("updateAdresse", newDataRow);
                setMessageSnackBar('Modification enregistré.');
                setSeverity('success');
                // updateDataRow(displayRows, dataRow);
            } else {
                setMessageSnackBar('Echec de la modification.');
                setSeverity('error');
            }
            setOpenSnackBar(true);
        })
    }

    // ---------------------------------- Supprimer une adresse
    const handleDeleteAdresse = (updatedRow, adresse) => {
        axios({
            method: 'put',
            url: '/attributaire/deleteAdresse',
            data: { id_catalogue_attributaire: updatedRow.id_of_cata, id_adresse: adresse.id },
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), },
        }).then((response) => {
            if (response.status === 200) {

                let newAdresse = updatedRow.adresse.filter((v) => v.id !== adresse.id)
                updatedRow.adresse = newAdresse
                let newDataRow = updateRowsTableAfterPutAxios(updatedRow, 'adresse')

                setRows(newDataRow)
                setDisplayRows(newDataRow)

                socket.emit("updateAdresse", newDataRow);
                setMessageSnackBar('Supprimé avec succès.');
                setSeverity('success');
                // updateDataRow(displayRows, dataRow);
            } else {
                setMessageSnackBar('Echec de la suppréssion.');
                setSeverity('error');
            }
            setOpenSnackBar(true);
        })
    }

    // ---------------------------------- Créer une adresse
    const handleCreateAdresse = (updatedRow, adresse, ville) => {
        axios({
            method: 'put',
            url: '/adresse/create',
            data: { adresse: adresse.adresse, commune: ville.id, actif: 1 },
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), },
        }).then((response) => {
            if (response.status === 200) {
                let objAdresse = { id: response.data.insertId, adresse: adresse.adresse, commune: ville.commune }
                handleAddAdresse(updatedRow, objAdresse)
            } else {
                setMessageSnackBar('Erreur lors de la création de l\'adresse.');
                setSeverity('error');
                setOpenSnackBar(true);
            }
        })

    }

    return (
        <>
            <Table columns={columns} propsTableName='Catalogue'
                handleEditSubmitClick={handleEditSubmitClickCatalogue}
                displayRows={displayRows} // row
                filter={[{ 'name': 'Lot', 'displayName': 'Tout les lots', 'handleChange': handleChangeFilter, 'data': lotList, valueSelected: filterSelected, varName: 'id_lot' }]}
                nbFilter={nbFilter}
                handleChangeFilter={handleChangeFilter}
                handleCloseSnackbar={handleCloseSnackbar}
                openSnackBar={openSnackBar}
                messageSnackBar={messageSnackBar}
                severity={severity}
                user={user}
                adresseHabilited={adresseHabilited}
                handleOpenModalAdresse={handleShowModalAdresse}
                handleOpenModal={() => handleOpenModalCatalogue(updateRowCatalogue)}
                action={ActionTable}
                handleDeleteAdresse={handleDeleteAdresse}
            />
            {openModalCatalogue &&
                updateRowCatalogue.id !== undefined &&
                <ModalCatalogue openModal={openModalCatalogue}
                    handleCloseModal={handleCloseModalCatalogue}
                    handleErrorSubmit={handleErrorSubmit}
                    handleSubmitClickToParent={handleSubmitClickCatalogue}
                    handleChangeUpdateRow={handleChangeUpdateRow}
                    handleEditSubmitClickToParent={handleEditSubmitClickCatalogue}
                    updateRow={updateRowCatalogue}
                    handleDeleteClick={handleDeleteClickCatalogue}
                    handleHideDeleteIcon={handleHideDeleteIcon}
                    handleShowDeleteIcon={handleShowDeleteIcon}
                    handleSaveNewOf={handleSaveNewOf}
                    deleteClick={deleteClick}
                    handleDeleteOf={handleDeleteOf}
                    user={user}
                />
            }
            {updateRowAdresse.id !== undefined &&
                <ModalAdresse
                    openModal={openModalAdresse}
                    handleCloseModal={handleCloseModalAdresse}
                    updateRow={updateRowAdresse}
                    handleAddAdresse={handleAddAdresse}
                    handleCreateAdresse={handleCreateAdresse}
                />
            }
        </>

    )
}

// https://agent.pole-emploi.intra/ihm-synthesemap/synthesesre/v2/
// login?authn=agent&
// idRCI=1410760608