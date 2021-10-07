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
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

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

    const isDisabled = !(IsPermitted(props.user, 'sollicitation', 'updateDT')) ||
        props.user.fonction !== props.updateFormation.userFct ||
        props.updateFormation.etat > 15

    return (
        <>
            <Stepper steps={[
                { libelle: 'Validée DT', date: props.sollicitation.date_ValidationDT },
                { libelle: 'Validée DDO', date: props.sollicitation.date_ValidationDDO },
                { libelle: 'BRS édité', date: props.sollicitation.date_EditBRS },
                { libelle: 'Conventionné', date: props.sollicitation.date_nConv },
            ]}
                /*
                6: Validation DT
                7: Modification DDO
                8: Validation DDO
                9: BRS Edité
                10: Modification en cours
                11: Attente de re validation
                12: Conventionné
                */
                step={(props.stepper === 6 || props.stepper === 7 || props.stepper === 10)
                    ? 1
                    : (props.stepper === 8)
                        ? 2
                        : props.stepper === 9
                            ? 3
                            : props.stepper === 12
                                ? 4
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
                        InputProps={{ inputProps: { max: props.updateFormation.date_entree_demandee } }}
                        InputLabelProps={{ shrink: true }} />
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

                {(props.sollicitation.etat === 9 || props.sollicitation.etat === 12)
                    ? props.sollicitation.date_ValidationDT
                        ? <Button startIcon={<ErrorOutlineIcon />}
                            disabled={
                                (props.sollicitation.lieu_execution === null || props.sollicitation.lieu_execution === 'all' || props.sollicitation.lieu_execution === null) ||
                                props.sollicitation.id_dateIcop === null ||
                                (props.sollicitation.date_ValidationDT === '' || props.sollicitation.date_ValidationDT === null) ||
                                isDisabled} onClick={() => props.handleValideSollicitation('DT')} variant="contained" color="secondary" >
                            Modifier
                        </Button>
                        : <Button startIcon={<ErrorOutlineIcon />}
                            disabled={
                                props.sollicitation.lieu_execution === null || props.sollicitation.lieu_execution === 'all' ||
                                props.sollicitation.id_dateIcop === null ||
                                (props.sollicitation.date_ValidationDT !== '' && props.sollicitation.date_ValidationDT !== null) ||
                                isDisabled} onClick={() => props.handleValideSollicitation('DT')} variant="contained" color="secondary" >
                            Valider
                        </Button>
                    : props.sollicitation.date_ValidationDT
                        ? <Button disabled={
                            (props.sollicitation.lieu_execution === null || props.sollicitation.lieu_execution === 'all' || props.sollicitation.lieu_execution === null) ||
                            props.sollicitation.id_dateIcop === null ||
                            (props.sollicitation.date_ValidationDT === '' || props.sollicitation.date_ValidationDT === null) ||
                            isDisabled} onClick={() => props.handleValideSollicitation('DT')} variant="contained" color="secondary" >
                            Modifier
                        </Button>
                        : <Button disabled={
                            (props.sollicitation.lieu_execution === null || props.sollicitation.lieu_execution === 'all') ||
                            props.sollicitation.id_dateIcop === null ||
                            isDisabled} onClick={() => props.handleValideSollicitation('DT')} variant="contained" color="secondary" >
                            Valider
                        </Button>
                }

            </div>
        </>
    )
}