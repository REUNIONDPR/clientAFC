import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Cookie from 'js-cookie';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '20%',
        paddingTop: theme.spacing(5),
    },
    avatar: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoAvatar: {
        height: 60,
        textAlign: 'center',
        '& > *': {
            margin: theme.spacing(2),
        },
    },
}));



export default function LoginPage(props) {
    const classes = useStyles();
    const [xtidc, setXtidc] = useState('')
    const [count, setCount] = useState(15)

    const useInterval = (callback, delay) => {
        const savedCallback = useRef();

        // Remember the latest function.
        useEffect(() => {
            savedCallback.current = callback;
        }, [callback]);

        // Set up the interval.
        useEffect(() => {
            function tick() {
                savedCallback.current();
            }
            if (delay !== null) {
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        }, [delay]);
    }

    useInterval(() => {
        Cookie.get('xtidc') && window.location.reload()
        count > 0 && setCount(count - 1)
    }, 1000);

    const handleCheckIDGASI = () => {
        if (xtidc !== '') {
            const idgasi = xtidc.toUpperCase()
            axios({
                method: 'get',
                url: 'auth/search?id=' + idgasi,
            }).then((response) => {
                if (response.status === 200) {
                    if (!Cookie.get('xtidc')) Cookie.set('xtidc', idgasi)
                    props.logUser(Cookie.get('xtidc'))
                }
            })
        }
    }

    return (
        <Card className={classes.root}>
            <div className={classes.avatar}>
                <svg height="100px" viewBox="0 0 22 22" width="100px" fill="primary">
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path fill="#c51162" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path></svg>

            </div>

            <CardContent className={classes.infoAvatar}>
                <div>
                    <TextField type="text" error={xtidc === '' && count === 0} size="small" label="IDGASI" variant="outlined" value={xtidc}
                        onChange={(e) => setXtidc(e.target.value)} />
                </div>
                <Button disabled={count > 0} variant="contained" color="primary" onClick={handleCheckIDGASI}>
                    Se connecter {count > 0 && <span> ({count}) </span>}
                </Button>
                <div>{count > 0 ? 'Tentative de connection...' : 'Veillez vous connecter'}</div>
            </CardContent>
        </Card>
    );
}
