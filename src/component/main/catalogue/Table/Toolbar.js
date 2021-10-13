
import Typography from '@material-ui/core/Typography';
import FilterListIcon from '@material-ui/icons/FilterList';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import ListRoundedIcon from '@material-ui/icons/ListRounded';
import { useState } from 'react';
import { codeToName } from '../../../../utilities/Function';
import Badge from '@material-ui/core/Badge';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Grow from '@material-ui/core/Grow';
import { IsPermitted } from '../../../../utilities/Function';

const useToolbarStyles = makeStyles({
    toolbarFilter: {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    toolbarTitle: {
        maxWidth: '70%',
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
    const [openListCol, setOpenListCol] = useState(false);

    return (
        <Toolbar className='primary-color-gradient'>
            <div className={classes.toolbarFilter} >
                <div className={classes.toolbarTitle}>
                    <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                        {props.propsTableName}
                    </Typography>
                </div>

                <div className={classes.toolbarIcon}>

                    {props.nbFilter > 0
                        ? <Tooltip title={'Effacer tout les filtres'}>
                            <IconButton aria-label="filtre" color='primary' onClick={props.handleCleanFilter}>
                                <Badge badgeContent={props.nbFilter} color="secondary"><FilterListIcon /></Badge>
                            </IconButton>
                        </Tooltip>
                        : <Tooltip title={'Aucun filtre'}>
                            <IconButton aria-label="filtre" color='primary' >
                                <FilterListIcon />
                            </IconButton>
                        </Tooltip> }

                    {IsPermitted(props.user, 'catalogue', 'create') &&
                        <Tooltip title="Créer">
                            <IconButton aria-label="Créer" color='primary' onClick={() => props.btnAddAction()}>
                                <AddIcon />
                            </IconButton>
                        </Tooltip> }

                    <div style={{ position: 'relative' }}>

                        {openListCol
                            ? <Tooltip title="Fermer">
                                <IconButton aria-label="fermer" color='primary' onClick={() => setOpenListCol(!openListCol)}>
                                    <CloseIcon />
                                </IconButton>
                            </Tooltip>
                            : <Tooltip title="Colonnes"><IconButton aria-label="delete" color="primary" onClick={() => setOpenListCol(!openListCol)}>
                                <ListRoundedIcon />
                            </IconButton></Tooltip>}
                        <Grow in={openListCol}>
                            <List dense={true} className={'scrollBar-personnalize listColumn'}>
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
                                    <ListItemText id='check_all' secondary={props.checkAll ? 'Tout décocher' : 'Tout cocher'} />
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
                                            <ListItemText id={labelId} secondary={`${value.includes('display_') ? codeToName(value.split('display_')[1]) : codeToName(value)}`} />
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </Grow>
                    </div>

                </div>





            </div>
        </Toolbar >
    )
}