import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Table from '../../global/table/Table';
import Cookie from 'js-cookie';
import { UserContext } from '../../../context/user.context';
import ModalCatalogue from './ModalCatalogue';

export default function Catalogue() {

    const { user } = useContext(UserContext);
    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);
    const [displayRows, setDisplayRows] = useState([])

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
    useEffect(() => {
        axios({
            method: 'GET',
            url: '/global/getLot',
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        }).then((response) => { setLotList(response.data) })
    }, [])

    // useEffect(() => {
    //     setColumns(['#', 'intitule', 'prix', 'nArticle', 'objectif', 'niveau']);
    // }, [])

    const handleChangeFilter = (event) => {
        setLotSelected(event.target.value);
        event.target.value === 'none'
            ? setDisplayRows(rows)
            : setDisplayRows(rows.filter((r) => {
                if (parseInt(r.lot) === parseInt(event.target.value)) { return r; } else { return false; }
            }))
    };
    // ----------------------------------


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

    const handleEditSubmitClick = (dataRow) => {
        axios({
            method: 'put',
            url: '/catalogue/update',
            data: dataRow,
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), },
        }).then((response) => {
            if (response.status === 200) {
                setMessageSnackBar('Mise à jour réussi.');
                setSeverity('success');
                // updateDataRow(displayRows, dataRow);
            } else {
                setMessageSnackBar('Echec de la mise à jour.');
                setSeverity('error');
            }
            setOpenSnackBar(true);
        })
        // console.log(dataRow)
    }

    return (
        <>
            <Table columns={columns} rows={rows} propsTableName='Catalogue'
                handleEditSubmitClick={handleEditSubmitClick}
                displayRows={displayRows}
                filter={[{ 'name': 'Lot', 'displayName': 'Tout les lots', 'handleChange': handleChangeFilter, 'data': lotList, valueSelected: lotSelected }]}
                handleChangeFilter={handleChangeFilter}
                handleCloseSnackbar={handleCloseSnackbar}
                openSnackBar={openSnackBar}
                messageSnackBar={messageSnackBar}
                severity={severity}
                user={user}
                handleOpenModal={handleOpenModal}
            />
            <ModalCatalogue openModal={openModal} handleCloseModal={handleCloseModal} handleEditSubmitClickToParent={handleEditSubmitClick} updateRow={updateRow}/>

            <div>
                <div>Add / remove adresse</div>
                <div>Add / édite Formation</div> 
            </div>
        </>

    )
}

// https://agent.pole-emploi.intra/ihm-synthesemap/synthesesre/v2/
// login?authn=agent&
// idRCI=1410760608