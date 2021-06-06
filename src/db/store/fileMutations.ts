import {FileDocType, FileDocument} from "../schemas/fileCollectionType";
import {useRxDb} from "./useRxDb";

export async function addFile(file: FileDocType): Promise<FileDocument> {
  const db = useRxDb();
  return await db.files.upsert(file);
}

export function useFileMutation() {
  const db = useRxDb();
  return {
    mutateAsync: async (file: File) => await db.files.upsert({
      created: Date.now().toString(),
      size: file.size,
      name: file.name
    })
  };
}
