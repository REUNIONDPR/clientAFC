
import Typography from '@material-ui/core/Typography';
import FilterListIcon from '@material-ui/icons/FilterList';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useState } from 'react';

import { IsPermitted } from '../../../utilities/Function';

const useToolbarStyles = makeStyles({
    title: {
        flex: '1 1 100%',
    },
    formControl: {
        color: 'white',
    },
});

export default function ToolbarPersonnalize(props) {

    const classes = useToolbarStyles();
    const [openFilter, setOpenFilter] = useState(false)
    const handleCreateRow = props.handleCreateRow;
    // ----------------- Filtres
    const handleChangeFilter = props.handleChangeFilter;
    const filters = props.filter;

    return (
        <Toolbar className='secondary-color'>
            {openFilter ? (<>

                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    {
                        Object.values(filters).map((filter, key) => (
                            <FormControl variant="outlined" className='toolbar-select' key={key.toString()}>
                                <InputLabel id="demo-simple-select-outlined-label">{filter.name}</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    value={filter.valueSelected}
                                    onChange={handleChangeFilter}
                                    label={filter.name}
                                >
                                    <MenuItem value="none">{filter.displayName}</MenuItem>
                                    {
                                        filter.data.map((v) => (
                                            <MenuItem key={v.value.toString()} value={v.value}>{v.libelle}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        ))}
                </Typography>

                <Tooltip title="Fermer">
                    <IconButton aria-label="fermer" color='inherit' onClick={() => setOpenFilter(!openFilter)}>
                        <CloseIcon />
                    </IconButton>
                </Tooltip>
            </>) : (<>
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    {props.propsTableName}
                </Typography>

                {IsPermitted(props.user, 'catalogue', 'create') &&
                <Tooltip title="Ajouter">
                    <IconButton aria-label="Ajouter" color='inherit' onClick={handleCreateRow}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>}

                <Tooltip title="Filtre">
                    <IconButton aria-label="filtre" color='inherit' onClick={() => setOpenFilter(!openFilter)}>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            </>)}
        </Toolbar >
    )
}