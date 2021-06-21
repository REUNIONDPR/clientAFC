import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import logo from './logo.svg';
import { TextField } from '@material-ui/core';
import './App.css';
// import { subscribeToTimer } from './api';
import Tab from './component/Tab.js';
import openSocket from 'socket.io-client';

const  socket = openSocket('http://localhost:3000');


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
function subscribeToTimer(cb) {
  // socket.on('timer', timestamp => cb(null, timestamp));
  socket.on("FromAPI", timestamp => cb(null, timestamp));
  socket.emit('subscribeToTimer', 1000);
//   socket.on('timer', timestamp => cb(null, timestamp));
//   socket.emit('subscribeToTimer', 1000);
}
class App extends Component {
  

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
}
export default App;