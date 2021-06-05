import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import icon from '../assets/icon.svg';
import './App.global.css';
import FileSelect from "./components/FileSelect";
import FilesStoreProvider from "./db/store/StoreProvider";
import Consumer from "./components/Gallery";

const Hello = () => {
  return (
    <div>
      <div className="Hello">
        <img width="200px" alt="icon" src={icon}/>
      </div>
      <h1>electron-react-boilerplate</h1>
      <div className="Hello">

             <span role="img" aria-label="books">
              📚
            </span>
        <FilesStoreProvider>
          <FileSelect/>
          <Consumer />
        </FilesStoreProvider>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello}/>
        <Route path="/gallery" component={Hello}/>
      </Switch>
    </Router>
  );
}
