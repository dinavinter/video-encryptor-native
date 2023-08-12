import {app} from "electron";
import App = Electron.App;
import {createDb} from "./database";
import {dbConsts} from "./consts";
import { RxDBAttachmentsPlugin } from 'rxdb/plugins/attachments';

const { addRxPlugin } = require('rxdb');
addRxPlugin(require('rxdb/plugins/server').RxDBServerPlugin);
addRxPlugin(require('pouchdb-adapter-memory'));


// export function addDb(app:App){
//
//     return new Promise((reject, resolve)=> {
//
//
//         app.whenReady()
//             .then(attachDb)
//             .then(e=>resolve(dbConsts))
//             .catch(console.log);
//     });
// }

export async function installDatabase() {
    const db = await createDb(
        'memory'
    );

    /**
     * spawn a server
     * which is used as sync-goal by page.js
     */
    console.log('start server');
    await db.server({
        path: dbConsts.path,
        port: dbConsts.port,
        cors: true
    });
    console.log('started server');
    
    return dbConsts;

}
