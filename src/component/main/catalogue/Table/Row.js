import React from "react";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import { codeToName } from '../../../../utilities/Function';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';

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
        <div className={classes.adresse} >
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

                {props.columns && props.columns.map((col) => (
                    props.checkColumnsVisible && (props.checkColumnsVisible.indexOf(col) !== -1 && (
                        col === 'adresse'
                            ? <TableCell className={classes.center} key={row.id.toString() + '_' + col}>
                                <div className={classes.adresseCell}>
                                    <div className={classes.adresseBlock}>
                                        {row[col] && row[col].map((a) => (
                                            <DivAdress
                                                adresseHabilited={props.adresseHabilited}
                                                key={row.id + '_' + a.id}
                                                label={a.adresse + ' - ' + a.commune}
                                                id={a.id}
                                                handleDeleteAdresse={() => { props.handleDeleteAdresse(row, { id: a.id, adresse: a.adresse, commune: a.commune }) }} />
                                        ))}
                                    </div>
                                    {props.adresseHabilited &&
                                        <Tooltip classes={{ tooltip: classes.tooltip }} title="Ajouter une adresse">
                                            <IconButton aria-label="Ajouter" color="primary" onClick={() => props.handleOpenModalAdresse(row)}>
                                                <AddIcon />
                                            </IconButton>
                                        </Tooltip>}
                                </div>
                            </TableCell>
                            : col === 'lot' ||  col === 'objectif_form' ||  col === 'niveau_form'
                                ? <TableCell key={row.id.toString() + '_' + col} className='nowrap'>{codeToName(col + '_' + row[col])}</TableCell>
                                : <TableCell key={row.id.toString() + '_' + col} className='nowrap'>{row[col]}</TableCell>
                    ))
              ))}

            {/* {Object.entries(row).filter(([k, v]) => k !== 'id').map(([k, v]) => (
                props.checkColumnsVisible && (props.checkColumnsVisible.indexOf(k) !== -1 && (
                    k === 'adresse'
                        ? <TableCell className={classes.center} key={row.id.toString() + '_' + k}>
                            <div className={classes.adresseCell}>
                                <div className={classes.adresseBlock}>
                                    {v && v.map((a) => (
                                        <DivAdress
                                            adresseHabilited={props.adresseHabilited}
                                            key={row.id + '_' + a.id}
                                            label={a.adresse + ' - ' + a.commune}
                                            id={a.id}
                                            handleDeleteAdresse={() => { props.handleDeleteAdresse(row, { id: a.id, adresse: a.adresse, commune: a.commune }) }} />
                                    ))}
                                </div>
                                {props.adresseHabilited &&
                                    <Tooltip classes={{ tooltip: classes.tooltip }} title="Ajouter une adresse">
                                        <IconButton aria-label="Ajouter" color="primary" onClick={() => props.handleOpenModalAdresse(row)}>
                                            <AddIcon />
                                        </IconButton>
                                    </Tooltip>}
                            </div>
                        </TableCell>
                        : <TableCell key={row.id.toString() + '_' + k} className='nowrap'>{k.includes('display_') ? codeToName(k.split('display_')[1] + '_' + v) : v}</TableCell>
                ))
            ))} */}
            {/* {(row.priorite === 1 || !row.priorite) && <ActionTable row={row} /> } */}
            <ActionTable row={row} /> 
            </StyledTableRow>
        </React.Fragment >
    );

}