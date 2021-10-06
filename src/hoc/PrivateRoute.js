import Cookie from 'js-cookie';
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { UserContext } from '../context/user.context';
import { IsPermitted } from '../utilities/Function';
import Unauthorized from '../component/global/error/Unauthorized';

export default function PrivateRoute({ component: Component, ...rest}){
    const history = useHistory();
    const { user } = useContext(UserContext); 
    
    const isPermit = rest.path === undefined ? true : IsPermitted(user,rest.path.slice(1), 'view');
    
    return(
        <Route
            {...rest}
            render={
                    (props) => Cookie.get('authTokenAFC') 
                            ? isPermit ? <Component {...props} /> : <Unauthorized />
                            : history.push('/')
                    }
        />
    )
}