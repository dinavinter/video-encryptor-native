import {createContext, useContext} from "react";
import {ipcRenderer} from "electron";
import React, {FC, PropsWithChildren, useEffect, useState} from 'react';
import RxDbContext from "../db/store/RxDbContext";

type VarStore = {
    [key: string]: any,
    set(key, value): void
}


// @ts-ignore
export const VarContext = createContext<VarStore>({});


type VarProviderProps = PropsWithChildren<{}>;

export const VarStoreProvider: FC<VarProviderProps> = ({children}) => {
    const [store, setStore] = useState<VarStore>();

    const setVar = (key, value) => {
        setStore({...store, ...{['key']: value}})

    }
    const getAsync = (key) => {
        return  ipcRenderer.invoke('variable-request', key);
    }


    // useEffect(() => {
    //     setStore({...store, ...varsFromMainScript})
    //
    // }, [varsFromMainScript]);
    return (
        <VarContext.Provider value={{...store, set: setVar, getVar: getAsync}}>
            {children}
        </VarContext.Provider>
    );
};


export function useVar(key:string){
    return useContext(VarContext)[key];

}


export function useVariables( ){
    return useContext(VarContext);

}
