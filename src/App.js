import React, { useContext, useEffect } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import './App.css';
import Main from './component/main/Main';
import Catalogue from './component/main/catalogue/Catalogue';
import { Switch, Route, Redirect } from 'react-router-dom';
import home from './component/main/sollicitation/Sollicitation';
import PrivateRoute from './hoc/PrivateRoute';
import TestConnectSocket from './component/global/TestConnectSocket';
import { UserContext } from './context/user.context';
import Cookie from 'js-cookie';

function App(){

  const theme = createMuiTheme({
    palette: {
      primary: {
        light: '#4dabf5',
        main: '#2196f3',
        dark: '#1769aa',
        contrastText: '#fff',
      },
      secondary: {
        light: '#d04081',
        main: '#c51162',
        dark: '#890b44',
        contrastText: '#fff',
      },
    },

  });
  const { user, logUser } = useContext(UserContext);
  
  useEffect(() => {
    if(!Cookie.get('authToken') && !user.hawOwnProperty('idgasi')){
      logUser()
    }
  }, []);
  

  return (

      <div className="App">


          {/* <TestConnectSocket /> */}
        <MuiThemeProvider theme={theme}>
          <Switch>
            <Main>
              <Route exact path="/" component={home} />
              <Route exact path='/:route' render={() => (<>
                  <PrivateRoute path='/catalogue' component={Catalogue} />
                  <PrivateRoute path='/home' component={home} /> </>
              )} />
            </Main>
          </Switch>
        </MuiThemeProvider>
      
    </div>

  );
  


}

export default App;