 import { createGzip } from 'zlib';
 import { pipeline } from 'stream' ;
 export const zipFile=(file:File, target:string=`/${file.name}.zipp`)=>{
  const {
    createReadStream,
    createWriteStream
  } = require('fs');
  return new Promise<string>((resolve, reject)=>{
    const zipPath=target;
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

