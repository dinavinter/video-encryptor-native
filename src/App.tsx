import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import FileSelect from "./components/FileSelect";
import FilesStoreProvider from "./db/store/StoreProvider";
import {Layout} from 'antd';


const Hello = () => {
  return (
    <div>
      <FilesStoreProvider>
        {/*<PicturesWall/>*/}
        <FileSelect />
        {/*<Layout>*/}
        {/*  <Header><FileSelect/> </Header>*/}
        {/* </Layout>*/}
        {/*    <Content>*/}
        {/*      <Consumer/>*/}
        {/*    </Content>*/}

        {/*  </Layout>*/}
        {/*</Layout>*/}
      </FilesStoreProvider>
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
