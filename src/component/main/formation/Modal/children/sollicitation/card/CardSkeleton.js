import { makeStyles } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles((theme) => ({
    blockCenter: {
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'space-between',
    },
    card: {
        width: '45%',
        border: '1px solid #e0e0e0',
        '& > *': {
            margin: theme.spacing(1)
        }
    },
    attrList: {
        display: 'flex',
        alignItems: 'center',
        '& > *': {
            marginLeft: theme.spacing(1)
        }
    },
    cardSollicitation: {
        '& > *': {
            marginTop: theme.spacing(1),
            marginLeft: 'auto',
            marginRight: 'auto',
        }
    },
    fullWidth: {
        width: '100%',
    },
}));
export default function CardSkeleton(props) {
    const classes = useStyles();

    return (
        <div className={classes.blockCenter}>
            <div className={classes.card}>
                {[0, 1, 2].map((v) => (
                    <div key={v} className={classes.attrList} >
                        <Skeleton variant="circle" width={50} height={50} />
                        <div className={classes.fullWidth}>
                            <Skeleton variant="text" />
                            <Skeleton variant="text" />
                        </div>
                    </div>
                ))}
            </div>
            <div className={classes.card}>
                <div className={classes.cardSollicitation} >
                    <Skeleton variant="text" />
                    <Skeleton variant="rect" height={50} />
                    <Skeleton variant="rect" width={100} height={20} />
                </div>
            </div>
        </div >
    )
}