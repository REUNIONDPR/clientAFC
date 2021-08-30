import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
// import { socket } from '../../../context/socket.context';
import Cards from './Card/Cards';
import { UserContext } from '../../../context/user.context';
import Cookie from 'js-cookie';
import Table from '../../global/table/Table';
import ModalSollicitation from './Modal/modalSollicitation';
import { dateFormat } from '../../../utilities/Function';
import './sollicitation.css';
import TableCell from '@material-ui/core/TableCell';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import CheckIcon from '@material-ui/icons/Check';
import Tooltip from '@material-ui/core/Tooltip';
import { IsPermitted } from '../../../utilities/Function';

export default function Sollicitation() {
    const { user } = useContext(UserContext);
    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);
    const [displayRows, setDisplayRows] = useState([]);
    const [selectedCard, setSelectedCard] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [updateRow, setUpdateRow] = useState({})

    const ActionTable = (props) => {
        return (
            <TableCell align="right">
                <div className='cell-flex'>

                    {IsPermitted(user, 'sollicitation', 'delete') &&
                        <Tooltip title="Supprimer">
                            <IconButton aria-label="Editer" size="small" color="inherit" onClick={() => handleClickTest('delete formation')}>
                                <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>}

                    {IsPermitted(user, 'sollicitation', 'update') &&
                        <Tooltip title="Editer">
                            <IconButton aria-label="Editer" size="small" color="primary" onClick={() => handleOpenModal(props.row)}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>}

                    {IsPermitted(user, 'sollicitation', 'validate') &&
                        <Tooltip title="Valider">
                            <IconButton aria-label="Editer" size="small" color="secondary" onClick={() => handleClickTest('valider la formation')}>
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

    const handleCloseModal = () => {
        setOpenModal(false)
    }
    const handleOpenModal = (row) => {
        setUpdateRow(row)
        setOpenModal(true)
    }

    const handleSelectedCard = (index) => {
        setSelectedCard(index)
    }

    // --------------- SnackBar
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [messageSnackBar, setMessageSnackBar] = useState('');
    const [severity, setSeverity] = useState('success');
    const handleCloseSnackbar = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackBar(false);
        setMessageSnackBar('');
    };
    // ----------------------------

    const [nbFilter, setNbFilter] = useState(0);
    const [filterSelected, setFilterSelected] = useState({})

    const handleChangeFilter = (key, value) => {
        console.log(key, value)
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

    const [lotList, setLotList] = useState([]);

    useEffect(() => {

        axios({
            method: 'GET',
            url: '/global/getLot',
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        }).then((response) => { setLotList(response.data) })
    }, [])

    // const handleChangeFilter = (event) => {
    //     setLotSelected(event.target.value);
    //     event.target.value === 'none'
    //         ? setDisplayRows(rows)
    //         : setDisplayRows(rows.filter((r) => {
    //             if (parseInt(r.lot) === parseInt(event.target.value)) { return r; } else { return false; }
    //         }))
    // };

    useEffect(() => {

        axios({
            method: 'GET',
            url: `/formation/findAll?s=${selectedCard}`,
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
        }).then((response) => {
            if (response.data.dateEntree && response.data.dateEntree.includes('T')) {
                console.log(response.data.dateEntree.split('T')[0])
            }
            let data = response.data.map((v) => {
                return {
                    ...v,
                    dateEntree: dateFormat(v.dateEntree),
                    dateIcop: dateFormat(v.dateIcop),
                    dateFin: dateFormat(v.dateFin),
                }
            });
            setRows(data)
            setDisplayRows(data)
            if (columns.length === 0) {
                Object.entries(data).map(([key, index]) => (key === '0') ? setColumns(Object.keys(index)) : false)
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, selectedCard])

    const handleEditSubmitClick = (dataRow) => {
        // Clique sur update formation
    }


    const handleSubmitModalClick = (row) => {
        console.log(row)
        axios({
            method: 'put',
            url: '/formation/create',
            data: row,
            headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), },
        }).then((response) => {
            if (response.status === 200) {
                // let newDataRow = rows.filter((v) => v.id !== dataRow.id)
                // socket.emit("updateCatalogue", newDataRow);
                // setRows(newDataRow)
                // setMessageSnackBar('Suppression réussi.');
                // setSeverity('success');
                // setOpenModal(false)
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
            <Cards selectedCard={selectedCard} handleSelectedCard={handleSelectedCard} />
            <Table columns={columns} rows={rows} propsTableName='Formation'
                handleEditSubmitClick={handleEditSubmitClick}
                displayRows={displayRows}
                filter={[
                    { 'name': 'Lot', 'displayName': 'Tout les lots', 'data': lotList, valueSelected: filterSelected, varName: 'display_lot' }
                ]}
                nbFilter={nbFilter}
                handleChangeFilter={handleChangeFilter}
                handleCloseSnackbar={handleCloseSnackbar}
                openSnackBar={openSnackBar}
                messageSnackBar={messageSnackBar}
                severity={severity}
                user={user}
                handleOpenModal={handleOpenModal}
                action={ActionTable}
            />
            <ModalSollicitation
                openModal={openModal}
                updateRow={updateRow}
                user={user}
                handleSubmitModalClick={handleSubmitModalClick}
                handleCloseModal={handleCloseModal}
            />
            {/* <div >
                <Button variant="contained" onClick={() => console.log('aze')} color="primary">
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
                    <Button type="submit" variant="contained" color="primary">
                        Envoyer
                    </Button>
                </form>


                <form onSubmit={handleSubmitGet}>
                    <TextField label="IDGASI" name="search" type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)} />
                    <Button type="submit" variant="contained" color="primary">
                        Envoyer
                    </Button>
                </form>

                <Tab />

            </div> */}
        </>
    )
}