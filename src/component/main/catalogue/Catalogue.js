import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Table from '../../global/table/Table';
import Cookie from 'js-cookie';
import { UserContext } from '../../../context/user.context';
import ModalCatalogue from './Modal/ModalCatalogue';
import { SocketContext } from '../../../context/socket.context';

import TableCell from '@material-ui/core/TableCell';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import Tooltip from '@material-ui/core/Tooltip';
import { IsPermitted } from '../../../utilities/Function';

export default function Catalogue() {

    const { user } = useContext(UserContext);
    const { socket } = useContext(SocketContext);
    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]) // Resultat de la requete
    const [displayRows, setDisplayRows] = useState([]) // Copie de rows pour immutabilité

    // --------------- SnackBar
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [messageSnackBar, setMessageSnackBar] = useState('');
    const [severity, setSeverity] = useState('success');
    const [openModal, setOpenModal] = useState(false);
    const [updateRow, setupdateRow] = useState({
        id: '',
        id_lot: 'all',
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

    const ActionTable = (props) => {
        return (
            <TableCell align="right">
                <div className='cell-flex'>

                    {IsPermitted(user, 'sollicitation', 'update') &&
                        <Tooltip title="Editer">
                            <IconButton aria-label="Editer" size="small" color="secondary" onClick={() => handleOpenModal(props.row)}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>}

                    {IsPermitted(user, 'sollicitation', 'validate') &&
                        <Tooltip title="Valider">
                            <IconButton aria-label="Editer" size="small" color="primary" onClick={() => handleClickTest('valider la formation')}>
                                <CheckIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>}
                </div>
            </TableCell>
        )
    }

    const handleClickTest = (e) => {
        console.log(e)
    }

    //----------------------- Modal
    const handleOpenModal = (row) => {
        setupdateRow(row)
        setOpenModal(true)
    }

    const handleChangeUpdateRow = (k, v) => {
        setupdateRow({ ...updateRow, [k]: v })
    }

    const [deleteClick, setDeleteClick] = useState(false)
    const handleHideDeleteIcon = () => {
        setDeleteClick(false)
    }
    const handleShowDeleteIcon = () => {
        setDeleteClick(true)
    }

    const handleCloseModal = () => {
        setupdateRow({
            id: '',
            id_lot: 'all',
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
        setOpenModal(false)
        handleHideDeleteIcon()
    }

    //------------------- SnackBar
    const handleCloseSnackbar = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackBar(false);
        setMessageSnackBar('');
    };
    // ----------------------------
    // useEffect(() => {
    //     console.log(displayRows)
    // }, [displayRows])

    const [filterSelected, setFilterSelected] = useState({})
    const [nbFilter, setNbFilter] = useState(0);
    const [lotList, setLotList] = useState([]);

    useEffect(() => {
        axios({
            method: 'GET',
            url: '/global/getLot',
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        }).then((response) => { setLotList(response.data) })
    }, [])

    // const isMountedRef = useRef(true);
    useEffect(() => {
        // if (isMountedRef.current) {
        socket.on('updateRow', (updateDataRow) => {
            setRows(updateDataRow)
        })
        // }
    }, [socket])

    const handleChangeFilter = (key, value) => {
        setFilterSelected({ ...filterSelected, [key]: value })
        value !== 'none' ? setNbFilter(nbFilter + 1) : nbFilter > 0 ? setNbFilter(nbFilter - 1) : setNbFilter(0)
    };

    useEffect(() => {
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

    // ---------------------------------- CRUD
    useEffect(() => {
        axios({
            method: 'GET',
            url: '/catalogue/findAll',
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        }).then((response) => {
            setRows(response.data)
            Object.entries(response.data).map(([key, index]) => (key === '0') ? setColumns(Object.keys(index)) : false)
        });

    }, [user])

    const handleErrorSubmit = () => {
        setMessageSnackBar('Erreur, je n\'ai pas compris votre demande.');
        setSeverity('error');
        setOpenModal(false)
        handleHideDeleteIcon()
    }

    const handleSubmitClick = (dataRow) => {
        axios({
            method: 'put',
            url: '/catalogue/create',
            data: dataRow,
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), },
        }).then((response) => {
            if (response.status === 200) {
                let newDataRow = rows;
                console.log(rows, dataRow);
                dataRow.id = response.data.insertId;
                dataRow.adresse = '';
                newDataRow.unshift(dataRow);
                socket.emit("updateCatalogue", newDataRow);
                setRows(newDataRow)
                setMessageSnackBar('Enregistrement réussi.');
                setSeverity('success');
                setOpenModal(false)
                handleHideDeleteIcon()
                // updateDataRow(displayRows, dataRow);
            } else {
                setMessageSnackBar('Echec de l\'enregistrement.');
                setSeverity('error');
            }
            setOpenSnackBar(true);
        })
    }

    const handleEditSubmitClick = (dataRow) => {
        axios({
            method: 'put',
            url: '/catalogue/update',
            data: dataRow,
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), },
        }).then((response) => {
            if (response.status === 200) {
                let newDataRow = rows.map((v, i) => {
                    if (v.id === dataRow.id) {
                        Object.keys(v).map((k) => {
                            return v[k] = dataRow[k]
                        })
                        return v = dataRow;
                    } else return v;
                })
                setRows(newDataRow)
                setDisplayRows(newDataRow)
                socket.emit("updateCatalogue", newDataRow);
                setMessageSnackBar('Modification enregistré.');
                setSeverity('success');
                setOpenModal(false)
                handleHideDeleteIcon()
                // updateDataRow(displayRows, dataRow);
            } else {
                setMessageSnackBar('Echec de la modification.');
                setSeverity('error');
            }
            setOpenSnackBar(true);
        })
    }

    const handleDeleteClick = (dataRow) => {
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
                setOpenModal(false)
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

    return (
        <>
            <Table columns={columns} propsTableName='Catalogue'
                handleEditSubmitClick={handleEditSubmitClick}
                displayRows={displayRows} // row
                filter={[{ 'name': 'Lot', 'displayName': 'Tout les lots', 'handleChange': handleChangeFilter, 'data': lotList, valueSelected: filterSelected, varName: 'id_lot' }]}
                nbFilter={nbFilter}
                handleChangeFilter={handleChangeFilter}
                handleCloseSnackbar={handleCloseSnackbar}
                openSnackBar={openSnackBar}
                messageSnackBar={messageSnackBar}
                severity={severity}
                user={user}
                handleOpenModal={() => handleOpenModal(updateRow)}
                action={ActionTable}
            />
            {updateRow &&
                <ModalCatalogue openModal={openModal}
                    handleCloseModal={handleCloseModal}
                    handleErrorSubmit={handleErrorSubmit}
                    handleSubmitClickToParent={handleSubmitClick}
                    handleChangeUpdateRow={handleChangeUpdateRow}
                    handleEditSubmitClickToParent={handleEditSubmitClick}
                    updateRow={updateRow}
                    handleDeleteClick={handleDeleteClick}
                    handleHideDeleteIcon={handleHideDeleteIcon}
                    handleShowDeleteIcon={handleShowDeleteIcon}
                    deleteClick={deleteClick}
                    user={user} />
            }
            <div>
                <div>Add / remove adresse</div>
                <div>Supprimer une formation</div>
            </div>
        </>

    )
}

// https://agent.pole-emploi.intra/ihm-synthesemap/synthesesre/v2/
// login?authn=agent&
// idRCI=1410760608