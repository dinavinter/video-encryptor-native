 import {useEffect, useMemo, useState} from "react";
import {FileDocument} from "../schemas/fileCollectionType";
import {useRxDb} from "./useRxDb";
 import {MangoQuery} from "rxdb/src/types";

export function useCollectionItems( inputQuery?:MangoQuery<FileDocument>) {

  const [items, setItems] = useState<FileDocument[]>([]);
  const {files} = useDbCollection();

  const query= useMemo(()=> files.find(inputQuery),[inputQuery]);
  useEffect(() => {
    const sub =query.$.subscribe(results => {
      console.log('got results: ' + results.length);
      setItems(results);
    });

    return () => {
      sub.unsubscribe();
    };
  },[query])


  return {items: items};
}


 export function useDbCollection() {
   const {db} = useRxDb();
   return {files: db.files};
  }


