import { app,ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';

import MenuBuilder from './menu';
import {installDatabase} from "./db/installer";


const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}


(async () => {
  await app.whenReady();

  try {
    const db= await installDatabase();
    global.varsForWindow ={};
    global.varsForWindow['db.url'] = db.url;
    mainProcessVars['db.url'] = db.url;

  }
catch (e) {
  console.log(e);
  throw e;
}
  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();


  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
   }
})();

app.on('window-all-closed', () => {
  app.quit();
});


const mainProcessVars = {
  db: {}
}

ipcMain.handle('variable-request', (event, key) => {
  return mainProcessVars[key];
});


 