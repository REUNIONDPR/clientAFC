import React from "react";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import { codeToName } from '../../../../utilities/Function';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import Chip from '@material-ui/core/Chip';

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);


const useStyles = makeStyles((theme) => ({
    adresseBlock: {
        display: "flex",
        alignItems: "center",
    },
    adresseCell: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    adresse: {
        width: '200px',
        textAlign: 'left',
        padding: '0 10px 0 10px',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        }
    },
    clickable: {
        cursor: 'pointer',
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
    tooltip: {
        fontSize: '12px',
        maxWidth: 'none'
    },
    stickyCell: {
        position: 'absolute',
        height: 80,
    }
}));

export function DivAdress(props) {
    const classes = useStyles();

    return (
        <div key={props.id} className={classes.adresse} >
            <span>{props.label}</span>
            {props.adresseHabilited &&
                <Tooltip classes={{ tooltip: classes.tooltip }} title="Supprimer l'adresse">
                    <IconButton aria-label="delete" color="primary" onClick={props.handleDeleteAdresse}>
                        <DeleteIcon color='action' />
                    </IconButton>
                </Tooltip>}
        </div>
    )
}

export default function Row(props) {
    const ActionTable = props.action;
    const row = props.row;
    const classes = useStyles();
    
    return (
        <React.Fragment>
            <StyledTableRow >

            <ActionTable row={row} />
                {props.columns && props.columns.map((col, i) => (
                    props.checkColumnsVisible && (props.checkColumnsVisible.indexOf(col) !== -1 && (
                        col === 'adresse'
                            ? <TableCell className={classes.center} key={row.id.toString() + '_' + col + '_' + i}>
                                <div className={classes.adresseCell}>
                                    <div className={classes.adresseBlock}>
                                        {row[col] && row[col].map((a) => (
                                            <DivAdress
                                                key={row.id + '_' + a.id}
                                                adresseHabilited={props.adresseHabilited}
                                                id={row.id + '_' + a.id}
                                                label={a.adresse + ' - ' + a.commune}
                                                handleDeleteAdresse={() => { props.handleDeleteAdresse(row, { id: a.id, adresse: a.adresse, commune: a.commune }) }} />
                                        ))}
                                    </div>
                                    {(props.adresseHabilited && row.id_of_cata && row.id_of_cata_commune) && 
                                        <Tooltip classes={{ tooltip: classes.tooltip }} title="Ajouter une adresse">
                                            <IconButton aria-label="Ajouter" color="primary" onClick={() => props.handleOpenModalAdresse(row)}>
                                                <AddIcon />
                                            </IconButton>
                                        </Tooltip>}
                                </div>
                            </TableCell>
                            :
                            col === 'commune'
                                ? <TableCell className={classes.center} key={row.id.toString() + '_' + col}>
                                    {row[col] && row[col] !== '' && row[col].split('|') &&
                                        row[col].split('|').map((c) => (
                                            <Chip
                                                key={'chip_row_' + row.id_of_cata + c.split(':')[0]}
                                                label={c.split(':')[1]}
                                                color="secondary"
                                                variant="outlined"
                                            />))
                                    }
                                </TableCell>
                                : col === 'lot' || col === 'objectif_form' || col === 'niveau_form'
                                    ? <TableCell key={row.id.toString() + '_' + col} className='nowrap'>{codeToName(col + '_' + row[col])}</TableCell>
                                    : <TableCell key={row.id.toString() + '_' + col} className='nowrap'>{row[col]}</TableCell>
                    ))
                ))}
            </StyledTableRow>
        </React.Fragment >
    );

}