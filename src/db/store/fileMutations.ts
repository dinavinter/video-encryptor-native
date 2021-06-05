import { FileDocType, FileDocument} from "../schemas/fileCollectionType";
import {useRxDb} from "./useRxDb";

export async function addFile(file:FileDocType):Promise<FileDocument> {
  const db =  useRxDb();
   return await db.files.upsert(file);
}
