import Cookie from 'js-cookie';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Route } from 'react-router-dom';

export default function PrivateRoute({ component: Component, ...rest}){
    const history = useHistory();
    
    return(
        <Route
            {...rest}
            render={
                    (props) => Cookie.get('authTokenAFC') 
                            ? <Component {...props} /> 
                            : history.push('/')
                    }
        />
    )
}