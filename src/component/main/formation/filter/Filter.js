import Paper from '@material-ui/core/Paper';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Checkbox from '@material-ui/core/Checkbox';
import InputAdornment from '@material-ui/core/InputAdornment';

const useStyles = makeStyles((theme) => ({
    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

export default function Filter(props) {
    const classes = useStyles();

    return (

        <TableRow>
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
            <TableCell>
            </TableCell>
            <TableCell>
            </TableCell>
            <TableCell>
            </TableCell>
            <TableCell>
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
                            {props.etatList.map((v) => (
                                <MenuItem key={v.id} value={v.id}>
                                    <Checkbox checked={props.filterValues.etat ? props.filterValues.etat.indexOf(v.id) > -1 : false} />
                                    <ListItemText primary={v.libelle} />
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                </FormControl>
            </TableCell>
        </TableRow>
    )
}