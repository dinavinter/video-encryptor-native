import {dbConsts} from "./consts";
import { getRxStoragePouch, addPouchPlugin } from 'rxdb/plugins/pouchdb';
import {createRxDatabase, addRxPlugin} from "rxdb";
import * as MemoryAdapter from 'pouchdb-adapter-memory';

import { RxDBServerPlugin } from 'rxdb/plugins/server';
import {fileSchema} from "./schemas/filesSchema";
import { RxDBAttachmentsPlugin } from 'rxdb/plugins/attachments';
addRxPlugin(RxDBAttachmentsPlugin);

addRxPlugin(RxDBServerPlugin);
addPouchPlugin(MemoryAdapter);

async function  createDb() {
    addPouchPlugin(require('pouchdb-adapter-node-websql'));

   return  await createRxDatabase({
        name: dbConsts.name,
        storage: getRxStoragePouch('websql') // the name of your adapter
    });

// // or use a specific folder to store the data
//     const database = await createRxDatabase({
//         name: '/root/user/project/mydatabase',
//         storage: getRxStoragePouch('websql') // the name of your adapter
//     });
}
export async function installDatabase() {
   

    /**
     * spawn a server
     * which is used as sync-goal by page.js
     */
    const db = await createDb();
    await db.addCollections({
        files: {
              schema: fileSchema
        }
    });


    console.log('start server');
   const server= await db.server({
        path: dbConsts.path,
        port: dbConsts.port,
       startServer: true, // (optional), start express server

       cors: true
    });
    console.log('started server at ' + server.server.url);
    console.log(server.server);
    return dbConsts;

}
