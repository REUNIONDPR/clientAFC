import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    stepper: {
        padding: 0,
    },
    button: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

function getSteps() {
    return ['Validée DT', 'Validée DDO', 'BRS édité', 'Conventionné'];
}

export default function HorizontalLinearStepper(props) {
    const classes = useStyles();
    const activeStep = props.step;
    const steps = getSteps();

    return (
        <div className={classes.root}>
            <Stepper activeStep={activeStep} className={classes.stepper}>
                {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    
                    if (index === activeStep) {
                        labelProps.optional = <Typography variant="caption">En cours</Typography>;
                    }
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
        </div>
    );
}
