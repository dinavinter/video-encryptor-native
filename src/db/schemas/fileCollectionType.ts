import {
  RxCollection, RxDatabase, RxDocument
} from 'rxdb';
import {BlobBuffer} from "rxdb/dist/types/types";
import {RxAttachment} from "rxdb/dist/types/types/rx-attachment";
export declare type UploadFileStatus = 'error' | 'success' | 'done' | 'uploading' | 'removed';

export type FileDocType = {
  name: string;
  size: number;
  created: string;
  url: string;
  status:UploadFileStatus  ;

};

export type FileDocMethods = {
  download: (target: string) => Promise<string>;
  upload: (file: File) => Promise<FileDocType>;
  blob(): Promise<BlobBuffer | undefined>;
  blobAtt(): RxAttachment<FileDocType & FileDocMethods> | null
  base64Blob(): Promise<string | undefined>;
  blobUrl(): string;
  getBlob(): any
  renderVideo():any;


};


export type FileDocument = RxDocument<FileDocType, FileDocMethods>;

// we declare one static ORM-method for the collection
export type FileCollectionMethods = {
  count: () => Promise<number>;
  putVideo(file: File): Promise<FileDocument>
  putFile(file: File): Promise<FileDocument>
  getBlob(this: FileCollection, file: FileDocument): any
}


// and then merge all our types
export type FileCollection = RxCollection<FileDocType, FileDocMethods, FileCollectionMethods>;

export type AppCollections = {
  files: FileCollection

}
export type AppStore = RxDatabase<AppCollections>




