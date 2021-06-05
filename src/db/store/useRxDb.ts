import {AppStore} from "../schemas/fileCollectionType";
import {useContext, useEffect, useState} from "react";
import RxDbContext from "./RxDbContext";

export function useRxDb(): AppStore{
  const {db} = useContext(RxDbContext);
  return db;
}


