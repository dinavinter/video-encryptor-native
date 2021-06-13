 import { createGzip } from 'zlib';
 import { pipeline } from 'stream' ;
 export const zipFile=(file:File)=>{
  const {
    createReadStream,
    createWriteStream
  } = require('fs');
  return new Promise<string>((resolve, reject)=>{
    const zipPath=`/${file.name}`;
    const gzip = createGzip();
    const source = createReadStream(file.path);
    const destination = createWriteStream(zipPath);

    pipeline(source, gzip, destination, (err) => {

      if (err) {
        console.error('An error occurred:', err);
        reject(err);
      }
      resolve(zipPath)
    });

  })

}

