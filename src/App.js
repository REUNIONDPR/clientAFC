import React, { useContext, useEffect } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import './App.css';
import Main from './component/main/Main';
import Catalogue from './component/main/catalogue/Catalogue';
import { Switch, Route } from 'react-router-dom';
import home from './component/main/sollicitation/Sollicitation';
import PrivateRoute from './hoc/PrivateRoute';
import { UserContext } from './context/user.context';

import NavbarV from './component/global/Navbar/Navbar';
import { makeStyles } from '@material-ui/core/styles';
import Cookie from 'js-cookie';
import { frFR } from '@material-ui/core/locale';

function App() {

  const theme = createMuiTheme({
    palette: {
      primary: {
        light: '#d04081',
        main: '#c51162',
        dark: '#890b44',
        contrastText: '#fff',
      },
      // secondary: {
      //   light: '#8eddae',
      //   main: '#11c574',
      //   dark: '#00aa50',
      //   contrastText: '#fff',
      // },
      secondary: {
        light: '#0795da',
        main: '#0372b2',
        dark: '#005290',
        contrastText: '#fff',
      },
      danger: {
        main: '#f44336',
      },
      white: {
        main: '#c51162',
      },
    },
    overrides: {
      MuiTextField: {
        root: {
          backgroundColor: '#fff',
        },
      },
    },
  }, frFR);

  const drawerWidth = '260px';

  const useStyles = makeStyles((theme) => ({
    drawer: {
      minWidth: drawerWidth,
      backgroundColor: '#fff',
      position: 'relative',
    },
  }));

  const { user, logUser } = useContext(UserContext);
  const classes = useStyles();

  useEffect(() => {
    if (!Cookie.get('authToken') && !user.hasOwnProperty('idgasi')) {
      logUser(Cookie.get('xtidc'))
    }
  }, [user, logUser]);

  return (

    <div className="App">

      {/* <TestConnectSocket /> */}
      <ThemeProvider theme={theme}>

        <div className={classes.drawer}>
          <NavbarV />
        </div>

        <Switch>
          <Main>
            <Route exact path="/" component={home} />
            <Route exact path='/:route' render={() => (<>
              <PrivateRoute path='/catalogue' component={Catalogue} />
              <PrivateRoute path='/home' component={home} /> </>
            )} />
          </Main>
        </Switch>
      </ThemeProvider>

    </div>

  );



}

export default App;