import {AppStore} from "../schemas/fileCollectionType";
import {useContext, useEffect, useState} from "react";
import RxDbContext from "./RxDbContext";

export function useRxDb(): {
  db: AppStore;
  blobUrl(file: { name: string }): string
} {
  return useContext(RxDbContext);
}


