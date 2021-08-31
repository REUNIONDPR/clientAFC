import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

// export const user = 'IRLE5360';
export const UserContext = React.createContext();

const UserContextProvider = (props) => {
    const [user, setUser] = useState({});

    useEffect(() => {
        if (Cookies.get('authToken') && !user.idgasi) {
            getUser()
        }
        
    }, [user.idgasi]);

    // useEffect(() => {
    //     setUser({idgasi:'IRLE5360'});
    // },[]);

    const getUser = () => {
        console.log('Attenpting to get user')
        axios({
            method: 'get',
            url: '/auth/profile',
            headers: {
                Authorization: 'Bearer ' + Cookies.get('authToken')
            }
        })
        .then((res) => {console.log(res.data);})
    };

    const deleteUser = () => {
        setUser({})
    };

    const logUser = (user) => {
        fetch('/auth/logUser', {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(user),
        })
        .then((res) => res.json())
        .then((res) => {
            console.log(res)
            if (res.hasOwnProperty('user')) {
                const token = res.token;
                // const idgasi= res.user.idgasi;
                setUser({
                    idgasi: res.user.idgasi,
                    nom: res.user.nom,
                    mail: res.user.email,
                    fonction: res.user.moderateur,
                    token: true,
                    flash: res.flash
                });

                Cookies.set('authToken', token, { expires: 360 });
                // Cookies.set('idgasi', idgasi, { expires: 360 });
            } else {
                setUser({ flash: res.flash, token: false });
            }
        });

    }

    return (
        <UserContext.Provider value={{ user, getUser, logUser, deleteUser }}>
            {props.children}
        </UserContext.Provider>
    )
};

export default UserContextProvider 
