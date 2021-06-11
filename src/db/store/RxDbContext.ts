import {AppStore} from "../schemas/fileCollectionType";
import {createContext} from "react";

 type RxDbContext = {
  db: AppStore;
  blobUrl(file: {name:string}):string

}


 // @ts-ignore
const RxDbContext = createContext<RxDbContext>();
export default RxDbContext;
