import React, {FC, useEffect, useState} from 'react';
import RxDbContext from './RxDbContext';
import {createDb} from '../database';
import {AppStore} from "../schemas/fileCollectionType";


interface FilesStoreProviderProps {
  adapter:string |undefined
}


const FilesStoreProvider: FC<FilesStoreProviderProps> = ({children}) => {
  const [db, setDb] = useState<AppStore>();

  useEffect(() => {
    // Notice that RxDB instantiation is asynchronous;
    // until db becomes available consumer hooks that depend
    // on it will still work, absorbing the delay by
    // setting their state to isFetching:true
    const initDB = async () => {
      const _db = await createDb('memory');
      setDb(_db);
    };
    initDB();
  }, []);

  // Provide RxDB instance; hooks can now be used
  // within the context of the Provider
  return (db ?
    <RxDbContext.Provider  value={{db}}>
       {children}
    </RxDbContext.Provider> : <div/>
  );
};

export default FilesStoreProvider;
