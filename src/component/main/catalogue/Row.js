import React, { useState } from "react";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import AddIcon from '@material-ui/icons/Add';
import axios from "axios";
import Chip from '@material-ui/core/Chip';
import Cookie from "js-cookie";
import { codeToName } from '../../../utilities/Function';
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
    const ActionTable = props.action;
    const row = props.row;
    const [showAdresse, setShowAdresse] = useState(false);
    const [dataAdresse, setDataAdresse] = useState([]);
    const [dataAdresseReceive, setDataAdresseReceive] = useState(false)
    const classes = useStyles();
    
    const handleShowAdresse = (id_catalogue) => {
        if (!showAdresse) {
            axios({
                method: 'GET',
                url: '/adresse/find?id=' + id_catalogue,
                headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
            }).then((response) => {
                console.log(response.data)
                setDataAdresseReceive(true)
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
                                            dataAdresseReceive
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
                            : <TableCell key={row.id.toString() + '_' + k} className='nowrap'>{k.includes('display_') ? codeToName(k.split('display_')[1]+'_'+v): v}</TableCell>
                    ))
                ))}
                <ActionTable row={row}/>
            </StyledTableRow>

        </React.Fragment >
    );

}