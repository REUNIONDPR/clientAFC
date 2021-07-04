import React, {createContext} from 'react';
import socketio from "socket.io-client";
import { SOCKET_URL } from "../config";

export const SocketContext = createContext();

const SocketContextProvider = (props) => {

    const socket = socketio.connect(SOCKET_URL)

    return (
        <SocketContext.Provider value={{ socket }}>
            {props.children}
        </SocketContext.Provider>
    )
}

export default SocketContextProvider