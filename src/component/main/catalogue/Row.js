import React, { useCallback, useContext, useEffect, useState } from "react";
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Tooltip from '@material-ui/core/Tooltip';

import { SocketContext } from '../../../context/socket.context';

import TextField from '@material-ui/core/TextField';

import { IsPermitted } from '../../../utilities/Function';

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

export default function Row(props) {
    
    const [ row, setRow ] = useState(props.row);
    const [ open, setOpen ] = useState(false);
    const [ dataRow, setDataRow ] = useState({
        id:row.id,
        n_Article:row.n_Article,
        lot:row.lot,
        intitule_form_marche:row.intitule_form_marche,
        formacode:row.formacode,
        niveau_form:row.niveau_form,
        objectif_form:row.objectif_form,
        nb_heure_socle:row.nb_heure_socle,
        nb_heure_ent:row.nb_heure_ent,
        nb_heure_appui:row.nb_heure_appui,
        nb_heure_soutien:row.nb_heure_soutien,
        prixTrancheA:row.prixTrancheA,
        prixTrancheB:row.prixTrancheB,
    })

    // const [valueArticle, setValueArticle] = useState(row.n_Article);
    // const [valueLot, setValueLot] = useState(row.lot);
    // const [valueIntitule, setValueIntitule] = useState(row.intitule_form_marche);
    // const [valueHeureEnt, setValueHeureEnt] = useState(row.nb_heure_ent);
    // const [valueHeureAppui, setValueHeureAppui] = useState(row.nb_heure_appui);
    // const [valueHeureSoutien, setValueHeureSoutien] = useState(row.nb_heure_soutien);
    // const [valuePrixTA, setValuePrixTA] = useState(row.prixTrancheA);
    // const [valuePrixTB, setValuePrixTB] = useState(row.prixTrancheB);

    const handleEditClick = props.handleEditClick;
    const handleExitEditClick = props.handleExitEditClick;
    const handleEditSubmitClickToParent = props.handleEditSubmitClick;
    
    
    const handleEditSubmitClick = () => {
        // let dataRow = {
        //     id: row.id,
        //     lot: valueLot,
        //     n_Article: valueArticle,
        //     intitule_form_marche: valueIntitule,
        //     nb_heure_soutien: valueHeureSoutien,
        //     nb_heure_ent: valueHeureEnt,
        //     nb_heure_appui: valueHeureAppui,
        //     prixTrancheA: valuePrixTA,
        //     prixTrancheB: valuePrixTB,
        // }

        handleEditSubmitClickToParent(dataRow)
    }

    const editing = props.editingRow;
    const { socket } = useContext(SocketContext);

    const updateDataRow = useCallback((data) => {
        if(row.id === data.id){ setRow(data) }
    }, [row])

    useEffect(() => {
        socket.on('updateCatalogue2', (data) => {
            console.log(data)
        })
        socket.on('updateCatalogue', updateDataRow)
    },[socket, updateDataRow])

    if (editing === row.id) {
        return (
            <React.Fragment>
                <StyledTableRow >
                    <TableCell>
                    </TableCell>
                    <TableCell component="th"  scope="row" className='nowrap'>
                        <TextField
                            label="Lot"
                            fullWidth
                            margin='dense'
                            value={dataRow.lot}
                            variant="outlined"
                            size="small"
                            onChange={(e) => (setDataRow({...dataRow, lot:e.target.value}))}
                        />
                    </TableCell>

                    <TableCell component="th" scope="row" className='nowrap mw-100'>
                        <TextField
                            label="N° Article"
                            fullWidth
                            margin='dense'
                            value={dataRow.n_Article}
                            variant="outlined"
                            size="small"
                            onChange={(e) => (setDataRow({...dataRow, n_Article:e.target.value}))}
                        />
                    </TableCell>
                    <TableCell component="th" scope="row"  className='nowrap'>
                        <TextField
                            label="Intitulé"
                            fullWidth
                            margin='dense'
                            value={dataRow.intitule_form_marche}
                            variant="outlined"
                            size="small"
                            onChange={(e) => (setDataRow({...dataRow, intitule_form_marche:e.target.value}))}
                        />
                    </TableCell>

                    
                    <TableCell className='nowrap'>
                        <TextField
                            label="Formacode"
                            fullWidth
                            margin='dense'
                            value={dataRow.formacode}
                            variant="outlined"
                            size="small"
                            onChange={(e) => (setDataRow({...dataRow, formacode:e.target.value}))}
                        />
                    </TableCell>
                    <TableCell className='nowrap'>
                        <TextField
                            label="Niveau"
                            fullWidth
                            margin='dense'
                            value={dataRow.niveau_form}
                            variant="outlined"
                            size="small"
                            onChange={(e) => (setDataRow({...dataRow, niveau_form:e.target.value}))}
                        />
                    </TableCell>
                    <TableCell className='nowrap'>
                        <TextField
                            label="Objectif"
                            fullWidth
                            margin='dense'
                            value={dataRow.objectif_form}
                            variant="outlined"
                            size="small"
                            onChange={(e) => (setDataRow({...dataRow, objectif_form:e.target.value}))}
                        />
                    </TableCell>
                    <TableCell className='nowrap'>
                        <TextField
                            label="Heure socle"
                            fullWidth
                            margin='dense'
                            value={dataRow.nb_heure_socle}
                            variant="outlined"
                            size="small"
                            onChange={(e) => (setDataRow({...dataRow, nb_heure_socle:e.target.value}))}
                        />
                    </TableCell>
                    <TableCell align="right">
                        <TextField
                            label="Heure Ent"
                            fullWidth
                            margin='dense'
                            value={dataRow.nb_heure_ent}
                            variant="outlined"
                            size="small"
                            type="number"
                            onChange={(e) => (setDataRow({...dataRow, nb_heure_ent:e.target.value}))}
                        />
                    </TableCell>
                    <TableCell align="right">
                        <TextField
                            label="Heure appui recherche"
                            fullWidth
                            margin='dense'
                            value={dataRow.nb_heure_appui}
                            variant="outlined"
                            size="small"
                            type="number"
                            onChange={(e) => (setDataRow({...dataRow, nb_heure_appui:e.target.value}))}
                        />
                    </TableCell>
                    <TableCell align="right">
                        <TextField
                            label="Heure soutien"
                            fullWidth
                            margin='dense'
                            value={dataRow.nb_heure_soutien}
                            variant="outlined"
                            size="small"
                            onChange={(e) => (setDataRow({...dataRow, nb_heure_soutien:e.target.value.replace('.', ',')}))}
                        />
                    </TableCell>
                    <TableCell align="right">
                        <TextField
                            label="Prix < 6 pers"
                            fullWidth
                            margin='dense'
                            value={dataRow.prixTrancheA}
                            variant="outlined"
                            size="small"
                            onChange={(e) => (setDataRow({...dataRow, prixTrancheA:e.target.value.replace(',', '.')}))}
                        />
                    </TableCell>
                    <TableCell align="right">
                        <TextField
                            label="pris > 6 pers"
                            fullWidth
                            margin='dense'
                            value={dataRow.prixTrancheB}
                            variant="outlined"
                            size="small"
                            onChange={(e) => (setDataRow({...dataRow, prixTrancheB:e.target.value.replace(',', '.')}))}
                        />
                    </TableCell>
                    <TableCell align="right">
                        <Box display="flex">
                            <Tooltip title="Annuler">
                                <IconButton aria-label="Annuler" onClick={handleExitEditClick}>
                                    <ClearIcon fontSize='small' />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Enregistrer">
                                <IconButton aria-label="Enregistrer" color='secondary' onClick={handleEditSubmitClick}>
                                    <SaveIcon fontSize='small' />
                                </IconButton>
                            </Tooltip>

                        </Box>
                    </TableCell>
                </StyledTableRow>

            </React.Fragment>
        );
    } else {
        // Pour ajouter un tableau collapsé il faut ajouter une entrée à l'objet Row
        // nommé history = [{key:value, key2:value2},{...}, ...]
        return (
            <React.Fragment>
                <StyledTableRow >
                    <TableCell>
                        {row.hasOwnProperty('history') &&
                            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                        }
                    </TableCell>
                    <TableCell component="th" scope="row" className='nowrap'>
                        {row.lot}
                    </TableCell>
                    <TableCell component="th" scope="row" className='nowrap'>
                        {row.n_Article}
                    </TableCell>
                    <TableCell className='nowrap'>{row.intitule_form_marche}</TableCell>
                    <TableCell className='nowrap'>{row.formacode}</TableCell>
                    <TableCell className='nowrap'>{row.niveau_form}</TableCell>
                    <TableCell align="right">{row.objectif_form}</TableCell>
                    <TableCell align="right">{row.nb_heure_socle}</TableCell>
                    <TableCell align="right">{row.nb_heure_ent}</TableCell>
                    <TableCell align="right">{row.nb_heure_appui}</TableCell>
                    <TableCell align="right">{row.nb_heure_soutien}</TableCell>
                    <TableCell align="right">{row.prixTrancheA}</TableCell>
                    <TableCell align="right">{row.prixTrancheB}</TableCell>
                    <TableCell align="right">
                        
                        {IsPermitted(props.user, 'catalogue', 'update') &&
                        <Tooltip title="Editer"><IconButton aria-label="Editer" color="secondary" onClick={handleEditClick}> <EditIcon fontSize="small" /></IconButton></Tooltip>
                        }

                    </TableCell>
                </StyledTableRow>
                {row.hasOwnProperty('history') &&
                    <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                            <Collapse in={open} timeout="auto" unmountOnExit>
                                <Box margin={1}>

                                    <Table size="small" aria-label="purchases">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Customer</TableCell>
                                                <TableCell align="right">Amount</TableCell>
                                                <TableCell align="right">Total price ($)</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {row.history.map((historyRow) => (
                                                <TableRow key={historyRow.date}>
                                                    <TableCell component="th" scope="row">
                                                        {historyRow.date}
                                                    </TableCell>
                                                    <TableCell>{historyRow.customerId}</TableCell>
                                                    <TableCell align="right">{historyRow.amount}</TableCell>
                                                    <TableCell align="right">
                                                        {Math.round(historyRow.amount * row.price * 100) / 100}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Box>
                            </Collapse>
                        </TableCell>
                    </TableRow>
                }
            </React.Fragment>
        );
    }
}