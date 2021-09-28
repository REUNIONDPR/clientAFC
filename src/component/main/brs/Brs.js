import { Paper, TableRow } from "@material-ui/core"
import axios from "axios"
import { useEffect, useState } from "react"
import Cookie from "js-cookie";
import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import InputAdornment from '@material-ui/core/InputAdornment';
import SaveIcon from '@material-ui/icons/Save';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));

export default function Brs(props) {
    const classes = useStyles();

    const [BrsList, setBrsList] = useState([]);
    const [sollicitationList, setSollicitationList] = useState([]);
    const [open, setOpen] = useState(0);
    const [loading, setLoading] = useState(0);
    const [nConv, setNConv] = useState('');

    useEffect(() => {
        axios({
            method: 'get',
            url: 'brs/findAll',
            headers: { Authorization: 'Bearer ' + Cookie.get('authTokenAFC'), }
        }).then((response) => setBrsList(response.data))
    }, [])


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

    const handleSaveConv = (e) => {
        console.log(nConv)
        setNConv('')
    }
    // console.log(sollicitationList)

    return (
        <Paper>

            <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        Liste des BRS
                    </ListSubheader>
                }
                className={classes.root}
            >
                {BrsList.map((b) => (
                    <div key={b.filename}>

                        <ListItem>
                            <ListItemText primary={b.n_brs} />
                            <IconButton onClick={() => downloadBRS(b.id, b.libelle.split('-')[0].replaceAll(' ', ''), b.filename)}>
                                <InboxIcon />
                            </IconButton>
                            <IconButton onClick={() => { open !== b.id && setLoading(b.id); handleOpenBRS(b.id) }} >
                                {loading === b.id ? <CircularProgress size={20} /> : open === b.id ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
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
                                                <TableCell>{v.nConv}</TableCell>
                                            </TableRow>
                                        )}
                                </TableBody>
                            </Table>
                        </Collapse>
                        <Divider />
                    </div>

                ))}
            </List>

        </Paper>
    )
}