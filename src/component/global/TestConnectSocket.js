import React, { useState } from "react";
import SnackBar from './SnackBar/SnackBar';
import {socket} from '../../context/socket.context';

export default function Test() {
    const [openSnackBar,    setOpenSnackBar   ] = useState(false);
    const [messageSnackBar, setMessageSnackBar] = useState('');
    const [severity, setSeverity] = useState('success');
    
    const handleClose = (reason) => {
        if (reason === 'clickaway') {
        return;
        }
        setOpenSnackBar(false);
        setMessageSnackBar('');
    };

    // Etat de la connection de socket
    socket.on('etatConnection', (data) => {
        setOpenSnackBar(true);
        setMessageSnackBar(data.message);
        setSeverity(data.severity);
    })

    return (
        <SnackBar 
            open={openSnackBar} 
            message={messageSnackBar} 
            handleClose={handleClose} 
            severity={severity}
        />
        
    );
}