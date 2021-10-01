import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';

const useStyles = makeStyles((theme) => ({
    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    minW: {
        minWidth: 100,
    },
}));

export default function Filter(props) {
    const classes = useStyles();
    const [contactList, setContactList] = useState([]);
    const [contactSelected, setContactSelected] = useState('all')
    const [apeList, setApeList] = useState([]);
    const [apeSelected, setApeSelected] = useState('all');
    const [dispositifList, setDispositifList] = useState([]);
    const [dispoSelected, setDispoSelected] = useState('all');   

    useEffect(() => {
        axios({
            method: 'get',
            url: 'global/findAll?table=fonction',
            headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
        }).then((response) => setContactList(response.data.filter((v) => v.id === 1 || v.id === 2)))

        axios({
            method: 'get',
            url: 'global/findAll?table=ape',
            headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
        }).then((response) => setApeList(response.data))

        axios({
            method: 'get',
            url: 'global/findAll?table=dispositif',
            headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
        }).then((response) => setDispositifList(response.data))
    }, [])

    return (

        <TableRow>
            {/* LOT */}
            <TableCell>
                <FormControl size="small" variant="outlined" className={classes.formControl} >
                    <InputLabel id="demo-simple-select-outlined-label" className={classes.select_orange}>Lot</InputLabel>
                    <Select
                        name='id_lot'
                        value={props.filterValues.id_lot ? props.filterValues.id_lot : 'all'}
                        // onChange={(e) => props.handleChangeSelect(props.column.key, e.target.value)}
                        onChange={(e) => props.handleChangeFilter(e.target.name, e.target.value)}
                        label='Lot' >
                        <MenuItem value="all"><em>Tous</em></MenuItem>
                        {props.lotList.map((v) => (
                            <MenuItem key={v.id} value={v.id} >
                                {v.libelle}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </TableCell>
            {/* N ARTICLE */}
            <TableCell>
                <TextField className={classes.minW}
                    size="small"
                    name="n_Article"
                    variant="outlined"
                    label="N° Article"
                    type="text"
                    onChange={(e) => props.handleChangeFilter(e.target.name, e.target.value)}
                />
            </TableCell>
            {/* CONTACT */}
            <TableCell>
                <FormControl size="small" variant="outlined">
                    <InputLabel>Contact</InputLabel>
                    {contactList.length > 0 &&
                        <Select
                            onChange={(e) => { setContactSelected(e.target.value); props.handleChangeFilter(e.target.name, e.target.value) }}
                            fullWidth
                            value={contactSelected}
                            name='userFct'
                            label='Contact'
                        >
                            <MenuItem value="all">
                                <em>Choisir</em>
                            </MenuItem>
                            {contactList.map((v) => (
                                <MenuItem key={v.id + '_' + v.fonction} value={v.id}>{v.fonction}</MenuItem>
                            ))}
                        </Select>
                    }
                </FormControl>
            </TableCell>
            {/* Agence REF */}
            <TableCell>
                <FormControl size="small" variant="outlined">
                    <InputLabel>APE</InputLabel>
                    {apeList.length > 0 &&
                        <Select
                            onChange={(e) => { setApeSelected(e.target.value); props.handleChangeFilter(e.target.name, e.target.value) }}
                            fullWidth
                            value={apeSelected}
                            name='agence_ref'
                            label='APE'
                        >
                            <MenuItem value="all">
                                <em>Choisir</em>
                            </MenuItem>
                            {apeList.map((v) => (
                                <MenuItem key={v.id + '_' + v.libelle_ape} value={v.id}>{v.libelle_ape}</MenuItem>
                            ))}
                        </Select>
                    }
                </FormControl>
            </TableCell>
            {/* dispositif */}
            <TableCell>
                <FormControl size="small" variant="outlined">
                    <InputLabel>APE</InputLabel>
                    {dispositifList.length > 0 &&
                        <Select
                            onChange={(e) => { setDispoSelected(e.target.value); props.handleChangeFilter(e.target.name, e.target.value) }}
                            fullWidth
                            value={dispoSelected}
                            name='dispositif'
                            label='Dispositif'
                        >
                            <MenuItem value="all">
                                <em>Choisir</em>
                            </MenuItem>
                            {dispositifList.map((v) => (
                                <MenuItem key={v.id + '_' + v.libelle} value={v.id}>{v.libelle}</MenuItem>
                            ))}
                        </Select>
                    }
                </FormControl>
            </TableCell>
            <TableCell>
            </TableCell>
            <TableCell align="right">

                <FormControl size="small" variant="outlined" disabled={props.disabled} className={classes.formControl}>
                    <div className={classes.flex}>
                        <InputLabel id={"select-outlined-label" + props.column} >Etat</InputLabel>
                        <Select className={classes.selectField}
                            multiple
                            typea='multi'
                            name='etat'
                            id={`${props.column}-checkbox`}
                            value={props.filterValues.etat ? props.filterValues.etat : []}
                            onChange={(e) => props.handleChangeFilter(e.target.name, e.target.value)}
                            input={<OutlinedInput label='Etat' />}
                            renderValue={(selected) => selected.length + ' Choisi(s)'}
                        >
                            {/* <MenuItem key="null" value="null">
                                <Checkbox checked={props.filterValues.etat ? props.filterValues.etat.indexOf('null') > -1 : false} />
                                <ListItemText primary="En cours d'élaboration" />
                            </MenuItem> */}
                            {props.etatList.map((v) => (
                                <MenuItem key={v.id} value={v.id}>
                                    <Checkbox checked={props.filterValues.etat ? props.filterValues.etat.indexOf(v.id) > -1 : false} />
                                    <ListItemText primary={v.etat} />
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                </FormControl>
            </TableCell>
            <TableCell>
            </TableCell>
            <TableCell>
            </TableCell>
            <TableCell>
            </TableCell>
        </TableRow>
    )
}