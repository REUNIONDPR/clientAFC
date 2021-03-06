import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import UserContextProvider from './context/user.context';
import { BrowserRouter } from 'react-router-dom';
import SocketContextProvider from './context/socket.context';
// import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <BrowserRouter>
    <div>


      <SocketContextProvider>
      <UserContextProvider>
        <App />
      </UserContextProvider>
      </SocketContextProvider>
      
    </div>

  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
