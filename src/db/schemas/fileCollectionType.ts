import {
  RxCollection, RxDatabase,
  RxDocument,
} from 'rxdb';

export type FileDocType = {
  name: string;
  size: number;
  created: Date ;

};

export type FileDocMethods = {
  download : (target:string ) => Promise<string>;
  upload : ( ) => Promise<FileDocType>;
};

 export type FileDocument = FileDocType & FileDocMethods;

// we declare one static ORM-method for the collection
export type FileCollectionMethods = {
  count: () => Promise<number>;
}

// and then merge all our types
export type FileCollection = RxCollection<FileDocType, FileDocMethods, FileCollectionMethods>;

export type AppCollections = {
  files: FileCollection
}
export type AppStore = RxDatabase<AppCollections>;



