import {dbConsts} from '../consts';
import {
  addRxPlugin,
  createRxDatabase,
  RxDatabase,
  RxJsonSchema,
} from 'rxdb';
import {RxDBAttachmentsPlugin} from 'rxdb/plugins/attachments';
import {RxDBBackupPlugin} from 'rxdb/plugins/backup';
import ReactDOMServer from 'react-dom/server';

// addRxPlugin(require('rxdb/plugins/server').RxDBServerPlugin);
addRxPlugin(require('pouchdb-adapter-http'));
// addRxPlugin(require('pouchdb-adapter-http'));
addRxPlugin(require('pouchdb-adapter-memory'));
addRxPlugin(RxDBAttachmentsPlugin);
addRxPlugin(RxDBBackupPlugin);
import {RxDBWatchForChangesPlugin} from 'rxdb/plugins/watch-for-changes';

addRxPlugin(RxDBWatchForChangesPlugin);


import {
  AppCollections,
  AppStore,
  FileCollection,
  FileCollectionMethods,
  FileDocMethods, FileDocType,
  FileDocument
} from "./schemas/fileCollectionType";
import {RxAttachment} from "rxdb/dist/types/types/rx-attachment";
import React, {ReactDOM} from "react";
import {DPlayer} from 'react-dplayer'
import {PouchWriteError} from "rxdb/src/types";

const fileSchema: RxJsonSchema<FileDocument> = {
  title: 'file schema',
  description: 'describes a protected file',
  version: 0,
  keyCompression: true,
  type: 'object',
  properties: {
    name: {
      type: 'string',
      primary: true
    },
    size: {
      type: 'number'
    },
    created: {
      type: 'string'
    },
    url: {
      type: 'string'
    },
    status: {
      type: 'string'
    }
  },
  attachments: {},
  required: ['name']
};

function renderVideo(this: FileDocument) {
  return ReactDOMServer.renderToString(React.createElement(DPlayer, {options: {video: {url: this.url}}}));


}

// function renderVideo(this: FileDocument) {
//    return React.createElement(DPlayer, {options:{video: {url: this.url} }});
//
//
// }

const fileCollectionMethods: FileCollectionMethods = {
  count: async function (this: FileCollection) {
    const allDocs = await this.find().exec();
    return allDocs.length;
  },
  putVideo,
  putFile,
  getBlob
};


async function putVideo(this: FileCollection, file: File): Promise<FileDocument> {
  const doc = this.newDocument({
    created: Date.now().toString(),
    size: file.size,
    name: file.name,
    url: file.path,
  });
  await doc.putAttachment({
    id: "blob",
    data: file,
    type: file.type
  });

  await doc.save();
  return doc;
}


async function putFile(this: FileCollection, file: File) {
  // you can now call this once and then do writes on the pouchdb
  this.watchForChanges();
  const pouchDoc = {
    _id: file.name,
    created: Date.now().toString(),
    size: file.size,
    name: file.name,
    url: file.path,
    _attachments: {
      'blob': {
        content_type: file.type,
        data: file
      }
    },

  };
// now write sth on the pouchdb

  const res = await this.pouch.put(pouchDoc).catch(async (err: PouchWriteError) => {
    if (err.status === 409) {
      const exist = await this.pouch.get(pouchDoc._id);
      pouchDoc._rev = exist._rev;
      return await this.pouch.put(pouchDoc);

    }
  });
  console.log("Pouch Put Response" + JSON.stringify(res, null, 2))
  const response= await this.pouch.get(pouchDoc._id);
  console.log("Pouch Get Response" + JSON.stringify(response, null, 2))

  // const doc = this.newDocument();
  // await doc.putAttachment({
  //   id: "blob",
  //   data: file,
  //   type: file.type
  // });
  //
  // await doc.save();
  // return doc;
}

function getBlob(this: FileCollection, file: FileDocument): any {
  return this.pouch.getAttachment(file.name, "blob");
  // return files.findByIds(file.name).then(d=>d.getAttachment("blob"));
}

const fileMethods: FileDocMethods = {
  async download(this: FileDocument, target: string) {
    return target;
  },

  async base64Blob(this: FileDocument) {
    return this?.getAttachment('blob')?.getStringData();
  },
  async blob(this: FileDocument) {
    return this?.blobAtt()?.getData();
  },
  blobAtt(this: FileDocument) {
    return this?.getAttachment('blob');
  },
  async upload(this: FileDocument, file: File) {
    this.url = file.path;
    return this;
  },
  async blobUrl(this: FileDocument) {

    return this.blobAtt()?.doc.url;
  },

  getBlob(this: FileDocument) {
    return this.collection.pouch.getAttachment(this.name, "blob");

  },
  renderVideo
};


export const createDb = async (adapter: string): Promise<RxDatabase<AppCollections>> => {
  console.log("DatabaseService: creating database..");
  const db = await createRxDatabase<AppCollections>({
    name: dbConsts.name,
    adapter: adapter,
    // password: "passpasspass", // <- password (optional)
    multiInstance: false,
  });


  await db.addCollections({
    files: {
      schema: fileSchema,
      methods: fileMethods,
      statics: fileCollectionMethods
    }
  });
  console.dir(db);

  console.log("DatabaseService: created database");

  return db;
};

export async function serveOverHttp() {
  const db = await createDb(
    'memory'
  );

  // await db.server({
  //   path: '/db',
  //   port: 10102,
  //   cors: true
  // });

  // show heroes table in console
  db.files.find().sort('name').$.subscribe((heroDocs: any) => {
    console.log('### got heroes(' + heroDocs.length + '):');
    heroDocs.forEach((doc: any) => console.log(
      doc.name + '  |  ' + doc.color
    ));
  });

}

const syncURL = 'http://localhost:10102/db/files';

export async function createBrowserSynced() {
  const db = await createDb(
    'memory'
  );
  console.log('starting sync with ' + syncURL);
  const syncState = await db.files.sync({
    remote: syncURL,
    direction: {
      pull: true,
      push: true
    }
  });
  console.dir(syncState);

  return db;

}



