import {
  addRxPlugin,
  createRxDatabase,
  RxDatabase,
  RxJsonSchema,
} from 'rxdb';

// addRxPlugin(require('rxdb/plugins/server').RxDBServerPlugin);
addRxPlugin(require('pouchdb-adapter-memory'));
// addRxPlugin(require('pouchdb-adapter-http'));


import {
  AppCollections,
  AppStore,
  FileCollection,
  FileCollectionMethods,
  FileDocMethods,
  FileDocument
} from "./schemas/fileCollectionType";

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
    }
  },
  required: ['name']
};

const fileCollectionMethods: FileCollectionMethods = {
  count: async function (this: FileCollection) {
    const allDocs = await this.find().exec();
    return allDocs.length;
  }
};

const fileMethods: FileDocMethods = {
  async download(this: FileDocument, target: string) {
    return target;
  },
  async upload(this: FileDocument) {
    return this;
  }
};



export const createDb = async (adapter:string) => {
  console.log("DatabaseService: creating database..");
  const db: AppStore = await createRxDatabase<AppCollections>({
    name: 'files',
    adapter: adapter,
    password: "passpasspass", // <- password (optional)
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

export async function serveOverHttp(){
  const db = await createDb(
    'memory'
  );

  // await db.server({
  //   path: '/db',
  //   port: 10102,
  //   cors: true
  // });

  // show heroes table in console
  db.files.find().sort('name').$.subscribe((heroDocs:any) => {
    console.log('### got heroes(' + heroDocs.length + '):');
    heroDocs.forEach((doc:any) => console.log(
      doc.name + '  |  ' + doc.color
    ));
  });

}
const syncURL = 'http://localhost:10102/db/files';

export async function createBrowserSynced(){
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



