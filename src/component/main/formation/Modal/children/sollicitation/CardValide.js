import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import { useState } from 'react';
import { dateTimeFormat } from '../../../../../../utilities/Function';
import Button from '@material-ui/core/Button';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    blockIcop: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    listWidth: {
        width: 220,
        maxHeight: 120,
        overflowY: 'scroll',
        border: '1px solid #bdbdbd',
    },
    radiobtn: {
        '& > .MuiRadio-root':{
            padding: 0,
        }
    },

}));

export default function CardValide(props) {
    const classes = useStyles();

    const [icopSelected, setIcopSelected] = useState('');
    const [dateicop, setDateIcop] = useState('');

    const handleChangeDateicop = (e) => {
        setDateIcop(e.target.value)
    }
    const handleToggle = (value) => () => {
        console.log(value)
        setIcopSelected(value)
    };

    return (
        <>
            <p>Sollicitation validé</p>
            <div className={classes.blockIcop}>
                <form>
                    <TextField
                        id="dateIcop"
                        size="small"
                        value={dateicop}
                        onChange={handleChangeDateicop}
                        variant="outlined"
                        label="Date d'icop"
                        type="date"
                        InputLabelProps={{
                            shrink: true,
                        }} />
                </form>

                <Button onClick={() => props.handlAddIcop(dateicop)} variant="contained" color="secondary"
                    endIcon={<ArrowForwardIcon />}>
                    Ajouter
                </Button>

                <List dense className={`${classes.listWidth} scrollBar-personnalize`}>
                    <RadioGroup row aria-label="responseOF" name="responseOF" value={icopSelected} >
                        {props.updateFormation.arrayIcop
                            ? props.updateFormation.arrayIcop.map((value) => (
                                <ListItem
                                    key={props.updateFormation.id + '_' + dateTimeFormat(value).date} dense button
                                    onClick={handleToggle(dateTimeFormat(value).date)}>
                                    <ListItemIcon>
                                        <FormControlLabel className={classes.radiobtn}
                                            value={dateTimeFormat(value).date}
                                            control={<Radio color="secondary" />}
                                        />
                                    </ListItemIcon>
                                    <ListItemText id={'labelId'} primary={dateTimeFormat(value).date} />
                                </ListItem>
                            ))
                            : <ListItem> Ajouter une date </ListItem>
                        }

                    </RadioGroup>
                </List>
            </div>
            <p>Saisie des date ICOP + lieu execution</p>
        </>
    )
}