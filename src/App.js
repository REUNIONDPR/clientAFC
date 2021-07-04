import React, { useContext, useEffect } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import './App.css';
import Main from './component/main/Main';
import Catalogue from './component/main/catalogue/Catalogue';
import { Switch, Route } from 'react-router-dom';
import home from './component/main/sollicitation/Sollicitation';
import PrivateRoute from './hoc/PrivateRoute';
import { UserContext } from './context/user.context';
import Tab from './component/Tab.js';
import openSocket from 'socket.io-client';
import {WordSearch} from './component/SearchGame/SearchGame';
const  socket = openSocket('http://localhost:3000');
import Cookie from 'js-cookie';
import { frFR } from '@material-ui/core/locale';

function App() {

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
  const { user, logUser } = useContext(UserContext);

  useEffect(() => {
    if (!Cookie.get('authToken') && !user.hawOwnProperty('idgasi')) {
      logUser()
    }
  }, [user, logUser]);


  return (

    <div className="App">


      {/* <TestConnectSocket /> */}
      <ThemeProvider theme={theme}>
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



<<<<<<< HEAD
  state = {
    response: '',
    post: '',
    responseToPost: '',
    timestamp: 'no timestamp yet'
  };
  
  componentDidMount() {
    
    socket.on("sms", data => this.setState({ responseToPost: data }));
    subscribeToTimer((err, timestamp) => this.setState({ 
      timestamp 
    }));
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }
  
  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    
    return body;
  };
  
  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch('/api/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    const body = await response.text();
    
    this.setState({ responseToPost: body });
  };
  
render() {
    return (
      
      <div className="App">
        <MuiThemeProvider theme={theme}>
        <Tab />
        <div className="container">
          <p>{this.state.response}</p>
          <form onSubmit={this.handleSubmit}>
            <p>
              <strong>Post to Server:</strong>
            </p>
            <TextField id="standard-basic" label="Standard" type="text"
              value={this.state.post}
              onChange={e => this.setState({ post: e.target.value })} />
            <Button type="submit" variant="contained" color="secondary">
              Envoyer
            </Button>
            <WordSearch/>
          </form>
          <p>{this.state.responseToPost}</p>
          </div>
          <p className="App-intro">
      This is the timer value: {this.state.timestamp}
      </p>
        </MuiThemeProvider>
      </div>
    );
  }
=======
>>>>>>> 52f752b4f285d3c7e6a4039eb5edf1e25f07a5a7
}

export default App;