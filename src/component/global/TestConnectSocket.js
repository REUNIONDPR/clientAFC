import React, { useContext, useEffect, useState } from "react";
import SnackBar from './SnackBar/SnackBar';
import {SocketContext} from '../../context/socket.context';

export default function Test() {
    const [openSnackBar,    setOpenSnackBar   ] = useState(false);
    const [messageSnackBar, setMessageSnackBar] = useState('');
    const [severity, setSeverity] = useState('success');
    const { socket } = useContext(SocketContext);

    const handleClose = (reason) => {
        if (reason === 'clickaway') {
        return;
        }
        setOpenSnackBar(false);
        setMessageSnackBar('');
    };
    
    useEffect(() => {
        socket.on('etatConnection', (data) => {
            console.log(data)
            setOpenSnackBar(true);
            setMessageSnackBar(data.message);
            setSeverity(data.severity);
        })
      }, [socket])

    return (
        <SnackBar 
            open={openSnackBar} 
            message={messageSnackBar} 
            handleClose={handleClose} 
            severity={severity}
        />
        
    );
}