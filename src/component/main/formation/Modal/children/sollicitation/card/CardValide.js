import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import { useState } from 'react';
import { getDateTime } from '../../../../../../../utilities/Function';
import Button from '@material-ui/core/Button';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { IsPermitted } from '../../../../../../../utilities/Function';
import Stepper from '../../../Stepper';

const useStyles = makeStyles((theme) => ({
    blockIcop: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing(2)
    },
    blockLieu: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    lieuSelect: {
        width: '70%',
    },
    listWidth: {
        width: 220,
        maxHeight: 70,
        overflowY: 'scroll',
        border: '1px solid #bdbdbd',
    },
    radiobtn: {
        '& > .MuiRadio-root': {
            padding: 0,
        }
    },
    block: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
    },
    blockTitle: {
        display: 'flex',
        padding: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
        '& > svg': {
            color: 'green',
        }
    },
}));

export default function CardValide(props) {
    const classes = useStyles();
    const [dateicop, setDateIcop] = useState('');

    const handleChangeDateicop = (e) => {
        setDateIcop(e.target.value)
    }

    const isDisabled = !IsPermitted(props.user, 'sollicitation', 'updateDT')

    return (
        <>
            <Stepper step={props.stepper === 6
                ? 1
                : props.stepper === 7
                    ? 1
                    : props.stepper === 8
                        ? 2
                        : props.stepper === 9
                            ? 3
                            : 0} />
            <div className={classes.blockIcop}>
                <form>
                    <TextField
                        id="dateIcop"
                        size="small"
                        disabled={isDisabled}
                        value={dateicop}
                        onChange={handleChangeDateicop}
                        variant="outlined"
                        label="Date d'icop"
                        type="date"
                        InputLabelProps={{
                            shrink: true,
                        }} />
                </form>

                <Button disabled={isDisabled || dateicop === ''} onClick={() => { props.handlAddIcop(dateicop); setDateIcop('') }} variant="contained" color="secondary"
                    endIcon={<ArrowForwardIcon />}>
                    Ajouter
                </Button>

                <List dense className={`${classes.listWidth} scrollBar-personnalize`}>
                    <RadioGroup row aria-label="responseOF" name="responseOF" value={props.sollicitation.id_dateIcop} >
                        {(props.icopList && props.icopList.length > 0)
                            ? props.icopList.map((v) => (
                                <ListItem disabled={isDisabled}
                                    key={props.updateFormation.id + '_' + v.id} dense button
                                    onClick={() => props.handleChangeSollicitation('id_dateIcop', v.id)}>
                                    <ListItemIcon>
                                        <FormControlLabel className={classes.radiobtn}
                                            value={v.id}
                                            control={<Radio color="secondary" />}
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={getDateTime(v.dateIcop).date} />
                                </ListItem>
                            ))
                            : <ListItem> Ajouter une date </ListItem>
                        }

                    </RadioGroup>
                </List>
            </div>
            <div className={classes.blockLieu}>
                <FormControl size="small" variant="outlined" disabled={isDisabled} className={classes.lieuSelect}>
                    <InputLabel>Lieu d'execution</InputLabel>
                    {props.lieuExecutionList &&
                        <Select
                            value={props.sollicitation.lieu_execution ? props.sollicitation.lieu_execution : 'all'}
                            onChange={(e) => props.handleChangeSollicitation(e.target.name, e.target.value)}
                            fullWidth
                            name='lieu_execution'
                            label="Lieu d'execution"
                        >
                            <MenuItem value="all">
                                <em>Choisir</em>
                            </MenuItem>
                            {props.lieuExecutionList.map((v) => (
                                <MenuItem key={v.id + '_' + v.adresse} value={v.id}>{v.adresse}</MenuItem>
                            ))}
                        </Select>
                    }
                </FormControl>
                <Button disabled={
                    !props.sollicitation.lieu_execution ||
                    props.sollicitation.id_dateIcop === '' ||
                    props.sollicitation.dateValidationDT === '' ||
                    isDisabled} onClick={() => props.handleValideSollicitation('DT')} variant="contained" color="secondary" >
                    Modifier
                </Button>
                <Button disabled={
                    !props.sollicitation.lieu_execution ||
                    props.sollicitation.id_dateIcop === '' ||
                    props.sollicitation.dateValidationDT !== '' ||
                    isDisabled} onClick={() => props.handleValideSollicitation('DT')} variant="contained" color="secondary" >
                    Valider
                </Button>
                
            </div>
        </>
    )
}