import {useRxData} from 'rxdb-hooks';
import {useEffect, useState} from "react";
import {FileDocument} from "../schemas/fileCollectionType";
import {useRxDb} from "./useRxDb";

export function useCollectionItems() {

  const [items, setItems] = useState<FileDocument[]>([]);
  const db = useRxDb();
  const query=  db.files.find();
  query.$.subscribe(results => {
    console.log('got results: ' + results.length);
    setItems(results);
  });

   useEffect(() => {
    const find = async () => {
      const items = await db.files.find().exec();
      setItems(items);
    };
    find();
  }, []);


  return {items};
}

