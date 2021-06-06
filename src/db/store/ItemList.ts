 import {useEffect, useMemo, useState} from "react";
import {FileDocument} from "../schemas/fileCollectionType";
import {useRxDb} from "./useRxDb";

export function useCollectionItems() {

  const [items, setItems] = useState<FileDocument[]>([]);
  const db = useRxDb();

  const query= useMemo(()=> db.files.find(),[]);
  useEffect(() => {
    const sub =query.$.subscribe(results => {
      console.log('got results: ' + results.length);
      setItems(results);
    });

    return () => {
      sub.unsubscribe();
    };
  })


  return {items};
}

