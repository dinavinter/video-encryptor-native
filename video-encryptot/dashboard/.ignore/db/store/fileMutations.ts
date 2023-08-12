import {FileCollection, FileDocType, FileDocument} from "../schemas/fileCollectionType";
import {useRxDb} from "./useRxDb";
import {UploadRequestOption as RcCustomRequestOptions} from "rc-upload/lib/interface";
import {RcFile} from "antd/lib/upload/interface";
import {useDbCollection} from "./ItemList";

export async function addFile(file: FileDocType): Promise<FileDocument> {
  const db = useRxDb();
  return await db.files.upsert(file);
}

export function useFileMutation() {
  const db = useRxDb();
  const {files} = useDbCollection();
  return {
    uploadAsync: async (file: File) => {
      const fileDoc = await db.files.upsert({
        created: Date.now().toString(),
        size: file.size,
        name: file.name
      });

      // let blob=await base64ArrayBuffer(file);
      await fileDoc.putAttachment({
        id: "blob",
        data: file,
        type: "base64"
      });

    },

     mutateAsync: async (file: FileDocType) => {
      return await db.files.upsert(file);
    },
    uploadBlob: uploadBlob,
    putFile:putFile(files)
  }

}


export function uploadBlob(options: RcCustomRequestOptions) {
  const {onProgress, onError, onSuccess, data, filename, file, withCredentials, action, headers} = options;
  var formData = new FormData();
  formData.append('file', file, filename);
  let xhr = new XMLHttpRequest();
  xhr.open('PUT', action, true);
  xhr.onload = function () {
    // do something to response
    console.log(this.responseText);
    onSuccess && onSuccess(this.responseText, this);
  };

  xhr.onerror = function (ev) {
    // do something to response
    console.log(this.responseText);
    onError && onError(ev, this.responseText);
  };
  xhr.onprogress = (ev: ProgressEvent) => {
    onProgress && onProgress({...ev, percent: (ev.loaded / ev.total)});
  }


  xhr.send(formData);

}

export function putFile(files:FileCollection) {
  return async (options: RcCustomRequestOptions)=>  {
    const {onProgress, onError, onSuccess, data, filename, file , withCredentials, action, headers} = options;
    const rcFile=file as RcFile;
    if(!rcFile)
      throw "not rc file";
    try  {
      const response= await files.putFile(rcFile)
      onProgress && onProgress({loaded: rcFile.size,total: rcFile.size, percent:1 })
      onSuccess &&  onSuccess( response, null)
    }
    catch (e) {
      console .error(e);
      onError &&  onError( {
        name:filename,
        message:e.message,
        stack:e.stack,
        status: e.status
      }, e)

    }
  }
}

async  function   putVideoAsync(files:FileCollection , file:File){

}

export function uploadBlobXhr(options: RcCustomRequestOptions) {
  const {onProgress, onError, onSuccess, data, filename, file, withCredentials, action, headers} = options;
  var formData = new FormData();
  formData.append('file', file, filename);
  let xhr = new XMLHttpRequest();
  xhr.open('PUT', action, true);
  xhr.onload = function () {
    // do something to response
    console.log(this.responseText);
    onSuccess && onSuccess(this.responseText, this);
  };

  xhr.onerror = function (ev) {
    // do something to response
    console.log(this.responseText);
    onError && onError(ev, this.responseText);
  };
  xhr.onprogress = (ev: ProgressEvent) => {
    onProgress && onProgress({...ev, percent: (ev.loaded / ev.total)});
  }


  xhr.send(formData);

}

const fileToBlob = (file: File): Promise<string | ArrayBuffer | null> => {
  const fileReader = new FileReader();
  return new Promise<string | ArrayBuffer | null>(
    (resolve) => {
      fileReader.onloadend = function (e) {

        const blob = fileReader.result;
        resolve(blob);
        const view = new Uint8Array(buffer);

        console.log('here is a blob', blob);
        console.log('its size is', blob.size);
        console.log('its type is', blob.type);
      };
      fileReader.readAsArrayBuffer(file);
    }
  );

}
