import React, { useContext, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { TextField } from '@material-ui/core';
import axios from 'axios';
// import { socket } from '../../../context/socket.context';
import Tab from '../Tab.js';
import Cards from './Cards';
import { UserContext } from '../../../context/user.context';
import Cookie from 'js-cookie';
import Table from '../../global/table/Table';
import ModalSollicitation from './modalSollicitation';
import { displayName } from '../../../utilities/Function.js';

export default function Sollicitation() {
    const { user } = useContext(UserContext);
    const [idgasi, setIdgasi] = useState('');
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [fonction, setFonction] = useState('');
    const [search, setSearch] = useState('');
    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);
    const [displayRows, setDisplayRows] = useState([]);
    const [selectedCard, setSelectedCard] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    
    const handleCloseModal = () => {
        setOpenModal(false)
    }
    const handleOpenModal = () => {
        setOpenModal(true)
    }

    const handleSelectedCard = (index) => {
        setSelectedCard(index)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('/user/test', {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({ idgasi: idgasi, fonction: fonction, nom: nom, prenom: prenom }),
        })
            .then((response) => console.log(response));

    };

    const handleSubmitGet = (e) => {
        e.preventDefault();

        axios({
            method: 'GET',
            url: `/user/search?d=${search}`,
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
        })
            .then((response) => console.log(response.data));

    };

    // --------------- SnackBar
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [messageSnackBar, setMessageSnackBar] = useState('');
    const [severity, setSeverity] = useState('success');
    const [test, setTest] = useState({libelle:'aze'});
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

    const handleChangeFilter = (event) => {
        setLotSelected(event.target.value);
        event.target.value === 'none'
            ? setDisplayRows(rows)
            : setDisplayRows(rows.filter((r) => {
                if (parseInt(r.lot) === parseInt(event.target.value)) { return r; } else { return false; }
            }))
    };
    useEffect(() => {

        axios({
            method: 'GET',
            url: `/formation/findAll?s=${selectedCard}`,
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        }).then((response) => {
            setRows(response.data)
            setDisplayRows(response.data)
            if (columns.length === 0) {
                Object.entries(response.data).map(([key, index]) => (key === '0') ? setColumns(Object.keys(index)) : false)
            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, selectedCard])

    const handleEditSubmitClick = (dataRow) => {
        // Clique sur update formation
    }

    return (
        <>
            <Cards selectedCard={selectedCard} handleSelectedCard={handleSelectedCard} />
            <Table columns={columns} rows={rows} propsTableName='Formation'
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
            <ModalSollicitation openModal={openModal} handleCloseModal={handleCloseModal}/>
            {/* <div >
                <Button variant="contained" onClick={() => console.log('aze')} color="secondary">
                    send Socket
                </Button>
                <form onSubmit={handleSubmit}>
                    <p>
                        <strong>Post to Server:</strong>
                    </p>
                    <TextField label="IDGASI" name="IDGASI" type="text"
                        value={idgasi}
                        onChange={e => setIdgasi(e.target.value)} />
                    <TextField label="Nom" name="Nom" type="text"
                        value={nom}
                        onChange={e => setNom(e.target.value)} />
                    <TextField label="Prenom" name="Prenom" type="text"
                        value={prenom}
                        onChange={e => setPrenom(e.target.value)} />
                    <TextField label="Fonction" name="Fonction" type="number"
                        value={fonction}
                        onChange={e => setFonction(e.target.value)} />
                    <Button type="submit" variant="contained" color="secondary">
                        Envoyer
                    </Button>
                </form>


                <form onSubmit={handleSubmitGet}>
                    <TextField label="IDGASI" name="search" type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)} />
                    <Button type="submit" variant="contained" color="secondary">
                        Envoyer
                    </Button>
                </form>

                <Tab />

            </div> */}
        </>
    )
}