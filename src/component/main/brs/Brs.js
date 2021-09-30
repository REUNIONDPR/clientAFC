import { TableRow } from "@material-ui/core"
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import Cookie from "js-cookie";
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import SaveIcon from '@material-ui/icons/Save';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Tooltip from '@material-ui/core/Tooltip';
import { getDateToday } from "../../../utilities/Function";
import { UserContext } from '../../../context/user.context';
import SnackBar from '../../global/SnackBar/SnackBar';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        // backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing(4),
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
    titleFiltre: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
    },
    listItem: {
        backgroundColor: theme.palette.background.paper,
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    tooltip: {
        fontSize: '15px',
        maxWidth: 'none',
    },
}));

export default function Brs() {
    const classes = useStyles();

    const { user } = useContext(UserContext);
    const [BrsList, setBrsList] = useState([]);
    const [displayBrsList, setDisplayBrsList] = useState([]);
    const [sollicitationList, setSollicitationList] = useState([]);
    const [open, setOpen] = useState(0);
    const [loading, setLoading] = useState(0);
    const [lotList, setLotList] = useState([]);
    const [filterValues, setFilterValues] = useState({ id_lot: 'all' });

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
        axios({
            method: 'get',
            url: 'brs/findAll',
            headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
        }).then((response) => setBrsList(response.data))

        axios({
            method: 'GET',
            url: 'global/findAll?table=lot',
            headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
        }).then((response) => setLotList(response.data));
    }, [])

    useEffect(() => {
        if (BrsList.length > 0) {
            let array = [];
            array = BrsList.filter((v) => {

                for (let key in filterValues) {
                    if (filterValues[key] === 'all' || filterValues[key] === '') continue;
                    switch (key) {
                        case 'id_lot':
                            if ((v[key] && v[key].toString()) !== filterValues[key].toString()) return false
                            break;
                        default: break;
                    }
                }
                return v;
            })
            setDisplayBrsList(array)
        }
    }, [filterValues, BrsList])

    // useEffect(() => {
    //     setSollicitationList([])
    // }, [open])

    const handleOpenBRS = (id) => {
        if (open !== id) {
            axios({
                method: 'get',
                url: 'brs/findSollicitation?id=' + id,
                headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
            }).then((response) => setSollicitationList(response.data)).then(() => setLoading(0))

            setOpen(id)
        } else {
            setOpen(0)
        }
    };

    const downloadBRS = (id, lot, filename) => {
        axios({
            method: 'put',
            responseType: "blob",
            url: 'BRS/downlaod',
            data: {
                lot: lot,
                id: id,
                filename: filename,
            },
            headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
        }).then((response) => {
            if (response.status === 200) {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `${filename}`);
                document.body.appendChild(link);
                link.click();
            }
        }).catch((error) => { console.log(error); });
    }

    const handleChangeFilter = (k, v) => {
        setFilterValues({ ...filterValues, [k]: v })
    }

    const handleChangeNConv = (id, nConv) => {
        setSollicitationList([...sollicitationList.map((v) => v.id_formation === id ? { ...v, nConv_tmp: nConv } : v)])
    }

    const handleSaveConv = (id) => {
        const dateTime = getDateToday();
        const sollicitation = sollicitationList.find((v) => v.id_formation === id);

        if (sollicitation.nConv_tmp && sollicitation.nConv_tmp !== '') {
            axios({
                method: 'put',
                url: 'formation/conventionnement',
                data: { ...sollicitation, nConv: sollicitation.nConv_tmp, date_nConv: dateTime, user: user.idgasi },
                headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
            }).then((response) => {
                if(response.status === 200){
                    setSollicitationList([...sollicitationList.map((v) =>
                        v.id_formation === id ? { ...sollicitation, nConv: sollicitation.nConv_tmp } : v)]);
                    setMessageSnackBar('N° conventionnement enregistré!');
                    setSeverity('success');
                }else{
                    setMessageSnackBar('Erreur d\'enregistrement du N° conventionnement.');
                    setSeverity('error');
                }
                setOpenSnackBar(true);
            })
        }
    }


    // console.log(sollicitationList)

    return (
        <>
            <SnackBar
                open={openSnackBar}
                message={messageSnackBar}
                severity={severity}
                handleClose={handleCloseSnackbar}
            />

            <div className={classes.categorieTitle} >
                <div className={classes.title} >Liste des BRS</div>
            </div>
            <div className={classes.titleFiltre} >

                <FormControl size="small" variant="outlined" className={classes.formControl} >
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
            </div>
            <List
                component={"nav"}
                aria-labelledby="nested-list-subheader"
                className={classes.root}
            >
                {displayBrsList.length > 0
                    ? displayBrsList.map((b) => (
                        <div key={b.filename} className={classes.listItem}>

                            <ListItem>
                                <ListItemText primary={b.n_brs} />
                                <Tooltip title="Télécharger le BRS" aria-label="cancel" classes={{ tooltip: classes.tooltip }}>
                                    <IconButton color="primary" onClick={() => downloadBRS(b.id, b.libelle.split('-')[0].replaceAll(' ', ''), b.filename)}>
                                        <InboxIcon />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title={open === b.id ? "Fermer" : "Ouvrir"} aria-label="cancel" classes={{ tooltip: classes.tooltip }}>
                                    <IconButton color="secondary" onClick={() => { open !== b.id && setLoading(b.id); handleOpenBRS(b.id) }} >
                                        {loading === b.id ? <CircularProgress size={20} /> : open === b.id ? <ExpandLess /> : <ExpandMore />}
                                    </IconButton>
                                </Tooltip>

                            </ListItem>
                            <Collapse in={open === b.id} timeout="auto" unmountOnExit>
                                <Table>
                                    <TableBody>
                                        {loading === b.id
                                            ? <TableRow key={b.id} className={classes.nested}>
                                                <TableCell>Chargement ...</TableCell>
                                            </TableRow>

                                            : sollicitationList.map((v) =>
                                                <TableRow key={v.id_formation} className={classes.nested}>
                                                    <TableCell>{v.n_Article}</TableCell>
                                                    <TableCell>{v.intitule_form_marche}</TableCell>
                                                    <TableCell>
                                                        <TextField disabled={v.nConv !== null} type="text" size="small"
                                                            label="Conventionnement" variant="outlined"
                                                            value={v.nConv ? v.nConv : v.nConv_tmp ? v.nConv_tmp : ''}
                                                            onChange={(e) => handleChangeNConv(v.id_formation, e.target.value)} />

                                                        {!v.nConv && <Tooltip title="Enregistrer" aria-label="cancel" classes={{ tooltip: classes.tooltip }}>
                                                            <IconButton color="primary" onClick={() => handleSaveConv(v.id_formation)}>
                                                                <SaveIcon />
                                                            </IconButton>
                                                        </Tooltip>}

                                                    </TableCell>
                                                </TableRow>
                                            )}
                                    </TableBody>
                                </Table>
                            </Collapse>
                            <Divider />
                        </div>))
                    : <ListItem className={classes.listItem}>
                        <ListItemText primary='Aucun BRS' />
                        <IconButton disabled={true} >
                            <InboxIcon />
                        </IconButton>
                        <IconButton disabled={true} >
                            <ExpandMore />
                        </IconButton>
                    </ListItem>

                }
            </List>

        </>
    )
}