import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import { getDateTime } from '../../../../utilities/Function';

const useStyles = makeStyles((theme) => ({
    stepper: {
        padding: theme.spacing(2),
    },
    button: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

export default function HorizontalLinearStepper(props) {
    const classes = useStyles();
    const activeStep = props.step;
    const steps = props.steps;

    return (
        <div className={classes.root}>
            <Stepper activeStep={activeStep} className={classes.stepper}>
                {steps.map((v, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    let date = '';
                    if (index === activeStep) {
                        labelProps.optional = <Typography variant="caption">En cours</Typography>;
                    }else{
                        date = v.date && getDateTime(v.date).date
                        labelProps.optional = <Typography variant="caption">{date}</Typography>;
                    }
                    return (
                        <Step key={v.libelle} {...stepProps}>
                            <StepLabel {...labelProps}>{v.libelle}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
        </div>
    );
}
