import {dbConsts} from './consts';
import {
    addRxPlugin,
    createRxDatabase, pluginMissing,
    RxDatabase,
    RxJsonSchema,
} from 'rxdb';
import ReactDOMServer from 'react-dom/server';
import { getRxStoragePouch, addPouchPlugin } from 'rxdb/plugins/pouchdb';
import { RxDBAttachmentsPlugin } from 'rxdb/plugins/attachments';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
// import { RxDBServerPlugin } from  'rxdb/plugins/server';
import {RxDBDevModePlugin} from 'rxdb/plugins/dev-mode';
import * as PouchHttpPlugin from 'pouchdb-adapter-http';
import { RxDBReplicationCouchDBPlugin } from 'rxdb/plugins/replication-couchdb';
addRxPlugin(RxDBReplicationCouchDBPlugin);
// import { RxDBReplicationPlugin } from 'rxdb/plugins/replication';
// addRxPlugin(RxDBReplicationPlugin);


addPouchPlugin(PouchHttpPlugin);


addRxPlugin(RxDBAttachmentsPlugin);
addRxPlugin(RxDBUpdatePlugin);

// import {RxDBBackupPlugin} from 'rxdb/plugins/backup';


// addRxPlugin(RxDBBackupPlugin);
// addPouchPlugin(require('pouchdb-adapter-idb'));

// import {RxDBWatchForChangesPlugin} from 'rxdb/plugins/watch-for-changes';
//
// addRxPlugin(RxDBWatchForChangesPlugin);
// addPouchPlugin(require('pouchdb-adapter-idb'));


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
import {zipFile} from "../worker/zipper";

const fileSchema: RxJsonSchema<FileDocument> = {
    title: 'file schema',
    description: 'describes a protected file',
    version: 0,
    keyCompression: true,
    type: 'object',
    primaryKey: "name",

    properties: {
        name: {
            "type": "string",
            "maxLength": 100 // <- the primary key must have set maxLength
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
        },
        error: {
            type: 'object'
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
        name: file.name
        // url: file.path,
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
    const pouchDoc: Partial<FileDocType> = {
        // _id: file.name,
        created: Date.now().toString(),
        size: file.size,
        name: file.name,
        status: 'uploading'


    };
// now write sth on the pouchdb

    const document = await this.upsert(pouchDoc);
    console.log("Pouch Put Response" + JSON.stringify(document, null, 2))
    // const response= await this.findByIds(pouchDoc);
    // console.log("Pouch Get Response" + JSON.stringify(response, null, 2))

    await document.putAttachment({id: 'blob', data: file, type: file.type}, false)
    await document.putAttachment({id: 'zipped', data: file, type: file.type}, false)
    
    zipFile(file).then(async path => {
     const afterZip=  await document.atomicPatch({
            status:'done',
            url:path,
            
        }) 
        console.log(afterZip);

    }).catch((e: Error) => {
        console.log(e); 
        document.atomicPatch({
            status:'error',
            error:e,

        })
    });
    
    return document;
}

function getBlob(this: FileCollection, file: FileDocument): any {
    return file.getAttachment(file.name);
    // return files.findByIds(file.name).then(d=>d.getAttachment("blob"));
}

const fileMethods: FileDocMethods = {
    async download(this: FileDocument, target: string) {
        return target;
    },

    async base64Blob(this: FileDocument) {
        return await this?.getAttachment('blob')?.getStringData();
    },
    async blob(this: FileDocument) {
        return this?.blobAtt()?.getData();
    },
    blobAtt(this: FileDocument) {
        return this?.getAttachment(this.name);
    },

    async upload(this: FileDocument, file: File) {
        // this.url = file.path;
        return this;
    },
    blobUrl(this: FileDocument) {

        return this.blobAtt()?.doc.url;
    },

    getBlob(this: FileDocument) {
        return this?.getAttachment(this.name);

    },
    renderVideo
};


export const createDb = async (adapter: string, syncUrl:string): Promise<RxDatabase<AppCollections>> => {
    console.log("DatabaseService: creating database..");

    if (process.env.NODE_ENV !== "production" && pluginMissing(RxDBDevModePlugin.name)) {
        // await import('rxdb/plugins/dev-mode').then(
        //     module =>
                addRxPlugin(RxDBDevModePlugin);
        // );
    }

    addPouchPlugin(require('pouchdb-adapter-idb'));
    addPouchPlugin(require('pouchdb-adapter-memory'));

    const db = await createRxDatabase<AppCollections>({
        name: dbConsts.name,
        storage: getRxStoragePouch('memory'),
        // password: "passpasspass", // <- password (optional)
        multiInstance: false,
        
    });

    // await db.server({
    //     path: dbConsts.path,
    //     port: dbConsts.port,
    //     // cors: true
    // });

    await db.addCollections({
        files: {
            schema: fileSchema,
            methods: fileMethods,
            statics: fileCollectionMethods
        }
    });
    console.dir(db);

    console.log("DatabaseService: created database");
    console.log(`${syncUrl}/files`);
    const syncState =  db.files.syncCouchDB({
        remote: `${syncUrl}/files`,
        direction: {
            pull: true,
            push: true
        },
        waitForLeadership: false,
        options: {
            live: true
        }

    });
    
    console.dir(syncState);
    // await syncState.awaitInitialReplication();

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

// const syncURL = 'http://localhost:10102/db/files';

// export async function createBrowserSynced() {
//     const db = await createDb(
//         'memory'
//     );
//     console.log('starting sync with ' + syncURL);
//     const syncState = await db.files.sync({
//         remote: syncURL,
//         direction: {
//             pull: true,
//             push: true
//         }
//     });
//     console.dir(syncState);
//
//     return db;
//
// }



