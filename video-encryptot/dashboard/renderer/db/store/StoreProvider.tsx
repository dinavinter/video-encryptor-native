import React, {FC, PropsWithChildren, useEffect, useState} from 'react';
import RxDbContext from './RxDbContext';
import {createDb} from '../database';
import {AppStore} from "../schemas/fileCollectionType";
import {useDbConsts} from "../consts";
import {useVar, useVariables} from "../../store/useVarStore";


type FilesStoreProviderProps = PropsWithChildren< {
  adapter: string | undefined
}>;

export const FilesStoreProvider: FC<FilesStoreProviderProps> = ({children, adapter}) => {
  const [db, setDb] = useState<AppStore>();
  const [dbPath, setDbPath] = useState<string>();
  const [blobUrl, setBlobUrl] = useState<(file: { name: string })=>string>((file: { name: string })=> `${dbPath}/${file?.name}/blob`);
  const {url} = useDbConsts();
  const {getVar} = useVariables();
 
  useEffect(() => {
    // Notice that RxDB instantiation is asynchronous;
    // until db becomes available consumer hooks that depend
    // on it will still work, absorbing the delay by
    // setting their state to isFetching:true
    const initDB = async () => {
      const path = await getVar('db.url');
      setDbPath(path);
      setBlobUrl((file: { name: string }) => `${path}/files/${file.name}/blob`);
      const db = await createDb(  // we add a random timestamp in dev-mode to reset the database on each start
        adapter,
          path
      );
      console.log('starting sync with ' + path);
     /* const syncState = await db.files.syncCouchDB({
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
      console.dir(syncState);*/

      setDb(db);
    };
    initDB();
  }, []);

  // Provide RxDB instance; hooks can now be used
  // within the context of the Provider
  return (db ?
      <RxDbContext.Provider value={{db, blobUrl: (file: { name: string }) => `${dbPath}/files/${file.name}/blob`, dbPath}}>
        {children}
      </RxDbContext.Provider> : <div/>
  );
};

export default FilesStoreProvider;
