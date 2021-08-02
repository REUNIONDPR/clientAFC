import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Table from '../../global/table/Table';
import Cookie, { set } from 'js-cookie';
import { UserContext } from '../../../context/user.context';
import ModalCatalogue from './Modal/ModalCatalogue';
import { SocketContext } from '../../../context/socket.context';


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
    const [updateRow, setupdateRow] = useState({});

    const handleCloseModal = () => {
        setOpenModal(false)
    }
    const handleOpenModal = (row) => {
        setupdateRow(row)
        setOpenModal(true)
    }

    const handleCloseSnackbar = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackBar(false);
        setMessageSnackBar('');
    };
    // ----------------------------

    const [lotSelected, setLotSelected] = useState('none');
    const [lotList, setLotList] = useState([]);

    // useEffect(() => () => {  }, [])
    useEffect(() => {
        axios({
            method: 'GET',
            url: '/global/getLot',
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        }).then((response) => { setLotList(response.data) })
    }, [])

    const isMountedRef = useRef(true);
    useEffect(() => {
        if (isMountedRef.current) {
            socket.on('updateRow', (updateDataRow) => {
                setRows(updateDataRow)
                setDisplayRows(updateDataRow)
            })
        }
    }, [socket])

    const handleChangeFilter = (value) => {
        setLotSelected(value);
        // setDisplayRows(rows)
        // if (value !== 'none') {
        //     setDisplayRows(rows.filter((r) => parseInt(r.display_lot) === parseInt(value)))
        // }
    };
    // ----------------------------------

    // useEffect(() => () => { isMountedRef.current = false; })
    useEffect(() => {
        axios({
            method: 'GET',
            url: '/catalogue/findAll',
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        }).then((response) => {
            setRows(response.data)
            setDisplayRows(response.data)
            Object.entries(response.data).map(([key, index]) => (key === '0') ? setColumns(Object.keys(index)) : false)
        });

    }, [user])

    const handleErrorSubmit = () => {
        setMessageSnackBar('Erreur, je n\'ai pas compris votre demande.');
        setSeverity('error');
        setOpenModal(false)
    }

    const handleSubmitClick = (dataRow) => {
        axios({
            method: 'put',
            url: '/catalogue/create',
            data: dataRow,
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), },
        }).then((response) => {
            if (response.status === 200) {
                console.log(response)
                setMessageSnackBar('Enregistrement réussi.');
                setSeverity('success');
                setOpenModal(false)
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
                setMessageSnackBar('Modification enregistré.');
                setSeverity('success');
                setOpenModal(false)
                socket.emit("updateCatalogue", dataRow);
                // updateDataRow(displayRows, dataRow);
            } else {
                setMessageSnackBar('Echec de la modification.');
                setSeverity('error');
            }
            setOpenSnackBar(true);
        })
    }

    const handleDeleteClick = (dataRow) => {
        let newDataRow = rows.filter((v) => v.id !== dataRow.id)
        setOpenModal(false)
        socket.emit("updateCatalogue", newDataRow);

        setRows(newDataRow)
        setDisplayRows(newDataRow)

        axios({
            method: 'put',
            url: '/catalogue/delete',
            data: dataRow,
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), },
        }).then((response) => {
            console.log(dataRow)
            if (response.status === 200) {
                let newDataRow = rows.filter((v) => v.id !== dataRow.id)
                socket.emit("updateCatalogue", newDataRow);
                setMessageSnackBar('Suppression réussi.');
                setSeverity('success');
                setOpenModal(false)
                setRows(newDataRow) // Met à jour le tableau au cas ou la socket ne répond pas.
                setDisplayRows(newDataRow) // Met à jour le tableau au cas ou la socket ne répond pas.
            } else {
                setMessageSnackBar('Echec de la suppréssion.');
                setSeverity('error');
            }
            setOpenSnackBar(true);
        })
    }

    return (
        <>
            <Table columns={columns} rows={rows} propsTableName='Catalogue'
                handleEditSubmitClick={handleEditSubmitClick}
                displayRows={displayRows}
                filter={[{ 'name': 'Lot', 'displayName': 'Tout les lots', 'handleChange': handleChangeFilter, 'data': lotList, valueSelected: lotSelected, varName:'display_lot' }]}
                handleChangeFilter={handleChangeFilter}
                handleCloseSnackbar={handleCloseSnackbar}
                openSnackBar={openSnackBar}
                messageSnackBar={messageSnackBar}
                severity={severity}
                user={user}
                handleOpenModal={handleOpenModal}
            />
            <ModalCatalogue openModal={openModal}
                handleCloseModal={handleCloseModal}
                handleErrorSubmit={handleErrorSubmit}
                handleSubmitClickToParent={handleSubmitClick}
                handleEditSubmitClickToParent={handleEditSubmitClick}
                updateRow={updateRow}
                handleDeleteClick={handleDeleteClick} />

            <div>
                <div>Probleme de filtre + pagination</div>
                <div>ajouter la ligne lors de la création d'une formation</div>
                <div>Add / remove adresse</div>
            </div>
        </>

    )
}

// https://agent.pole-emploi.intra/ihm-synthesemap/synthesesre/v2/
// login?authn=agent&
// idRCI=1410760608