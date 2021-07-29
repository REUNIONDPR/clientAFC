import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import { SocketContext } from '../../../context/socket.context';
import { IsPermitted } from '../../../utilities/Function';
import axios from "axios";
import Chip from '@material-ui/core/Chip';
import Cookie from "js-cookie";
import { codeToName } from '../../../utilities/Function';
import DisplayName from '../utils/DisplayName';
import CircularProgress from '@material-ui/core/CircularProgress';

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
    adresse: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    wrap: {
        flexWrap: "wrap",
    },
    containerAdresse: {
        width: 650,
    },
    center: {
        textAlign: "center",
    },
    paper: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(1),
            width: theme.spacing(16),
            height: theme.spacing(16),
        },
    },
}));

export default function Row(props) {

    const [row, setRow] = useState(props.row);
    const [showAdresse, setShowAdresse] = useState(false);
    const [dataAdresse, setDataAdresse] = useState([]);
    const classes = useStyles();
    const handleEditClick = props.handleEditClick;
    const isMountedRef = useRef(true);
    const { socket } = useContext(SocketContext);

    const updateDataRow = useCallback((data) => {
        if (row.id === data.id) { setRow(data) }
        console.log(row)
    }, [row])

    useEffect(() => () => { isMountedRef.current = false; }, [])

    useEffect(() => {
        if (isMountedRef.current) {
            socket.on('updateCatalogue2', (data) => {
                console.log(data)
            })
            socket.on('updateCatalogue', updateDataRow)
        }
    }, [socket, updateDataRow])

    const handleShowAdresse = (id_catalogue) => {
        if (!showAdresse) {
            axios({
                method: 'GET',
                url: '/adresse/find?id=' + id_catalogue,
                headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
            }).then((response) => {
                setDataAdresse(response.data)
            });
        }
        setShowAdresse(!showAdresse);
    }
    
    const handleDeleteAdresse = (id_catalogue, id_adresse) => {
        console.log('remove adresse :', id_catalogue, id_adresse)
    }
    const handleAddAdresse = (id_catalogue) => {
        console.log('Add adresse :', id_catalogue)
    }
    return (
        <React.Fragment>
            <StyledTableRow >
                {/* <TableCell>
                    {row.hasOwnProperty('adresse') &&
                            <Tooltip title="Déplier/Replier" aria-label="déplier/replier"><IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton></Tooltip>
                        }
                </TableCell> */}

                {Object.entries(row).filter(([k, v]) => k !== 'id').map(([k, v]) => (
                    props.checkColumnsVisible && (props.checkColumnsVisible.indexOf(k) !== -1 && (
                        k === 'adresse'
                            ? <TableCell className={classes.center} key={row.id.toString() + '_' + k}>
                                <div className={classes.adresse}>
                                    <div>
                                        <IconButton aria-label="expand row" size="small" onClick={() => handleShowAdresse(v)}>
                                            {showAdresse ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton></div>
                                    <div className={classes.adresse}>
                                        {showAdresse && (
                                            dataAdresse.length > 0
                                                ?
                                                <>
                                                    <div className={classes.containerAdresse}>
                                                        {dataAdresse.map((a) => (
                                                            <Chip
                                                                key={props.id_catalogue + '_' + a.id}
                                                                color="secondary"
                                                                label={a.adresse}
                                                                variant="outlined"
                                                                onDelete={() => { handleDeleteAdresse(v, a.id) }}
                                                            />
                                                        ))}
                                                    </div>
                                                    <div>
                                                        <IconButton aria-label="delete" color="secondary" onClick={() => handleAddAdresse(v)}>
                                                            <AddIcon />
                                                        </IconButton>
                                                    </div>
                                                </>
                                                : <CircularProgress size={20} color="secondary" />
                                        )}
                                    </div>
                                </div>
                            </TableCell>
                            : <TableCell key={row.id.toString() + '_' + k} className='nowrap'>{k.includes('display_') ? <DisplayName variable={v} table={k.split('display_')[1]} /> : v}</TableCell>
                    ))
                ))}

                <TableCell align="right">
                    {IsPermitted(props.user, 'catalogue', 'update') &&
                        <Tooltip title="Editer">
                            <IconButton aria-label="Editer" size="small" color="secondary" onClick={() => handleEditClick(row)}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    }
                </TableCell>
            </StyledTableRow>

        </React.Fragment >
    );

}