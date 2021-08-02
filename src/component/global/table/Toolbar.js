
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
import ListRoundedIcon from '@material-ui/icons/ListRounded';
import { useState } from 'react';
import { codeToName } from '../../../utilities/Function';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

import { IsPermitted } from '../../../utilities/Function';

const useToolbarStyles = makeStyles({
    toolbarFilter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    toolbarTitle: {
        maxWidth: '70%',
        overflow: 'hidden',
    },
    toolbarIcon: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    formControl: {
        color: 'white',
    },
});

export default function ToolbarPersonnalize(props) {

    const classes = useToolbarStyles();
    const [openFilter, setOpenFilter] = useState(false)
    const [openListCol, setOpenListCol] = useState(false);
    // ----------------- Filtres
    const filters = props.filters;

    return (
        <Toolbar className='secondary-color-gradient'>
            <div className={classes.toolbarFilter} >
                <div className={classes.toolbarTitle}>
                    {openFilter
                        ? <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                            {
                                Object.values(filters).map((filter, key) => (
                                    <FormControl variant="outlined" className='toolbar-select' key={key.toString()}>
                                        <InputLabel id="demo-simple-select-outlined-label">{filter.name}</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-outlined-label"
                                            value={filter.valueSelected}
                                            onChange={(event) => props.handleChangeFilter(filter.varName, event.target.value)}
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
                        : <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                            {props.propsTableName}
                        </Typography>
                    }
                </div>

                <div className={classes.toolbarIcon}>
                    {openFilter
                        ? <Tooltip title="Fermer">
                            <IconButton aria-label="fermer" color='inherit' onClick={() => setOpenFilter(!openFilter)}>
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                        :
                        <Tooltip title="Filtre">
                            <IconButton aria-label="filtre" color='inherit' onClick={() => setOpenFilter(!openFilter)}>
                                <FilterListIcon />
                            </IconButton>
                        </Tooltip>}

                    {
                        IsPermitted(props.user, 'catalogue', 'create') &&
                        <Tooltip title="Créer">
                            <IconButton aria-label="Créer" color='inherit' onClick={() => props.btnAddAction()}>
                                <AddIcon />
                            </IconButton>
                        </Tooltip>
                    }

                    <div style={{ position: 'relative' }}>

                        {openListCol
                            ? <Tooltip title="Fermer">
                                <IconButton aria-label="fermer" color='inherit' onClick={() => setOpenListCol(!openListCol)}>
                                    <CloseIcon />
                                </IconButton>
                            </Tooltip>
                            : <Tooltip title="Colonnes"><IconButton aria-label="delete" color="inherit" onClick={() => setOpenListCol(!openListCol)}>
                                <ListRoundedIcon />
                            </IconButton></Tooltip>}
                        {openListCol &&
                            <List dense={true} className='listColumn'>
                                <ListItem key={'check_all'} dense button onClick={(props.handleCheckAll)}>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={props.checkAll}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': 'check_all' }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText id='check_all' primary={props.checkAll ? 'Tout décocher' : 'Tout cocher'} />
                                </ListItem>

                                {props.columns.map((value) => {
                                    const labelId = `checkbox-list-label-${codeToName(value)}`;

                                    return (
                                        <ListItem key={value} role={undefined} dense button onClick={props.handleToggle(value)}>
                                            <ListItemIcon>
                                                <Checkbox
                                                    edge="start"
                                                    checked={props.checkColumnsVisible.indexOf(value) !== -1}
                                                    tabIndex={-1}
                                                    disableRipple
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText id={labelId} primary={`${value.includes('display_') ? codeToName(value.split('display_')[1]) : codeToName(value)}`} />
                                        </ListItem>
                                    );
                                })}
                            </List>
                        }
                    </div>

                </div>





            </div>
        </Toolbar >
    )
}