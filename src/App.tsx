import React from 'react';
import logo from './logo.svg';
import './App.css';
import app from './app.module.scss';
import index from './app.module.less';
function App() {
  console.log("------", app)
  return (
    <div className={app.App}>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
