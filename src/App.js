import React, { useContext, useEffect, useState } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import './App.css';
import Main from './component/main/Main';
import Catalogue from './component/main/catalogue/Catalogue';
import { Switch, Route } from 'react-router-dom';
import home from './component/main/formation/Formation';
import PrivateRoute from './hoc/PrivateRoute';
import { UserContext } from './context/user.context';
import Admin from './component/main/admin/Admin';
import NavbarV from './component/global/Navbar/Navbar';
import { makeStyles } from '@material-ui/core/styles';
import Cookie from 'js-cookie';
import { frFR } from '@material-ui/core/locale';
import Juridique from './component/main/juridique/Juridique';
import Brs from './component/main/brs/Brs';

function App() {

  const theme = createMuiTheme({
    palette: {
      primary: {
        light: '#d04081',
        main: '#c51162',
        dark: '#890b44',
        contrastText: '#fff',
        hover: '#1ee92e',
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
      spinnerBtnContained: {
        main: '#fff',
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
  const [isUser, setIsUser] = useState(false)

  useEffect(() => {
    if (!Cookie.get('authTokenAFC') && !user.hasOwnProperty('idgasi')) {
      
      if (Cookie.get('xtidc') !== undefined) {
        setIsUser(true)
        logUser(Cookie.get('xtidc'))
      } else {
        window.open("http://accueil.pole-emploi.intra:8501/portail/index.jspz?id=237#", "intra")
        
        // console.log('cookie existe pas')

        Cookie.set("xtidc", 'IRLE5360');
        setIsUser(true)
        logUser(Cookie.get('xtidc'))

      }
    } else setIsUser(true)
  }, [user, logUser]);

  return (

    <div className="App">

      {/* <TestConnectSocket /> */}
      <ThemeProvider theme={theme}>
        {isUser ?
          <>
            <div className={classes.drawer}>
              <NavbarV />
            </div>

            <Switch>
              <Main>
                <Route exact path="/" component={home} />
                <Route exact path='/:route' render={() => (<>
                  <PrivateRoute path='/catalogue' component={Catalogue} />
                  <PrivateRoute path='/admin' component={Admin} />
                  <PrivateRoute path='/bdd' component={Juridique} />
                  <PrivateRoute path='/brs' component={Brs} />
                  <PrivateRoute path='/formation' component={home} /> </>
                )} />
              </Main>
            </Switch>
          </>
          : <p>Non reconnu : <a href="http://accueil.pole-emploi.intra:8501/portail/index.jspz?id=237#" target="_blank" rel="noreferrer">Redirection</a></p>
        }
      </ThemeProvider>

    </div>

  );



}

export default App;