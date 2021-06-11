import React, {FC, useEffect, useState} from 'react';
import RxDbContext from './RxDbContext';
import {createDb} from '../database';
import {AppStore} from "../schemas/fileCollectionType";
import {useDbConsts} from "../../consts";

const {
  addRxPlugin
} = require('rxdb');
addRxPlugin(require('pouchdb-adapter-idb'));

interface FilesStoreProviderProps {
  adapter: string | undefined
}


const FilesStoreProvider: FC<FilesStoreProviderProps> = ({children}) => {
  const [db, setDb] = useState<AppStore>();
  const {url} = useDbConsts();
  const blobUrl = (file: { name: string }) => `${url}/${file.name}/blob`;

  useEffect(() => {
    // Notice that RxDB instantiation is asynchronous;
    // until db becomes available consumer hooks that depend
    // on it will still work, absorbing the delay by
    // setting their state to isFetching:true
    const initDB = async () => {
      const syncURL = url;

      const db = await createDb(  // we add a random timestamp in dev-mode to reset the database on each start
        'idb'
      );
      console.log('starting sync with ' + syncURL);
      const syncState = await db.files.sync({
        remote: syncURL,
        direction: {
          pull: true,
          push: true
        },
        options: {
          include_docs: false,
          heartbeat: 1000,
          live: true,
          since: 'now',
        }
      });
      console.dir(syncState);

      setDb(db);
    };
    initDB();
  }, []);

  // Provide RxDB instance; hooks can now be used
  // within the context of the Provider
  return (db ?
      <RxDbContext.Provider value={{db, blobUrl}}>
        {children}
      </RxDbContext.Provider> : <div/>
  );
};

export default FilesStoreProvider;
