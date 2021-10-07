import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

// export const user = 'IRLE5360';
export const UserContext = React.createContext();

const UserContextProvider = (props) => {
    const [user, setUser] = useState({});

    useEffect(() => {
        if (Cookies.get('authTokenAFC') && !user.idgasi) {
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
                Authorization: 'Bearer ' + Cookies.get('authTokenAFC')
            }
        })
            .then((res) => { setUser(res.data); })
    };

    const deleteUser = () => {
        setUser({
            idgasi: '',
            nom: '',
            mail: '',
            fonction: '',
            token: '',
            flash: '',
        })
    };

    const logUser = (idgasi) => {
        
        fetch('/auth/logUser', {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({ idgasi: idgasi, password: idgasi }),
        })
            .then((res) => res.json())
            .then((res) => {
                
                if (res.hasOwnProperty('user')) {
                    const token = res.token;
                    // const idgasi= res.user.idgasi;
                    setUser({
                        idgasi: res.user.idgasi,
                        nom: res.user.nom,
                        mail: res.user.mail,
                        fonction: res.user.fonction,
                        token: true,
                        flash: res.flash
                    });

                    Cookies.set('authTokenAFC', token, { expires: 360 });
                    // Cookies.set('idgasi', idgasi, { expires: 360 });
                } else {
                    setUser({ idgasi: '', flash:res.flash, token: false });
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
