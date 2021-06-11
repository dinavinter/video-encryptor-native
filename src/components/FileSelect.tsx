import React, {CSSProperties, FC, useEffect, useMemo, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {useFileMutation} from '../db/store/fileMutations'
import {fileToData, toZipBlob} from "../worker/handleFiles";
import FileSaver from "file-saver";
import {StageFiles} from './upload-files'

const baseStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const activeStyle: CSSProperties = {
  borderColor: '#2196f3'
};

const acceptStyle: CSSProperties = {
  borderColor: '#00e676'
};

const rejectStyle: CSSProperties = {
  borderColor: '#ff1744'
};


function FileSelect() {

  const {addAsync} = useFileMutation();

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    inputRef
  } = useDropzone({
    onDrop: () => {
      const file = inputRef?.current?.files?.item(0);
      if (file)
        addAsync(file).then(async doc => {
          const buffer = base64ArrayBuffer(await fileToArrayBuffer(file));
          console.log(buffer);
          // const blobBuffer = new Blob([buffer], {
          //   type: 'binary'
          // })
          const blob = new Blob([new Uint8Array(buffer, 0, buffer.length)]);
          console.log(blob);

          await doc.putAttachment({
            id: file.path,
            data: buffer as string,
            type: 'base64'
          })
        });
      // fileToData(file)
      //   .then(data=>FileSaver.saveAs(data, file.name));


    }
  });


  const style = useMemo<CSSProperties>(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isDragActive,
    isDragReject,
    isDragAccept
  ]);

  return (
    <div className="container">
      <div {...getRootProps({style})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
    </div>
  );
}

// export default FileSelect;


import {Upload, message, Button} from 'antd';
import {LoadingOutlined, PlusOutlined, StarOutlined, UploadOutlined} from '@ant-design/icons';
import {RcFile, UploadChangeParam, UploadFile} from "antd/lib/upload/interface";
import {base64ArrayBuffer, fileToArrayBuffer} from "../worker/utils";
import {useDbConsts} from "../consts";
import {UploadRequestOption as RcCustomRequestOptions} from "rc-upload/lib/interface";
import {useCollectionItems, useDbCollection, useFilesCollection} from "../db/store/ItemList";
import PicturesWall from './Wall';
import {FileDocument} from "../db/schemas/fileCollectionType";
import {useRxDb} from "../db/store/useRxDb";

interface BlobArray extends Blob {
}

declare var BlobArray: {
  prototype: BlobArray;
  new(blobParts?: BlobPart[], options?: BlobPropertyBag): Blob;
};

const css = `
  /* tile uploaded pictures */
.upload-list-inline .ant-upload-list-item {
  float: left;
  width: 200px;
  margin-right: 8px;
}

.upload-list-inline [class*='-upload-list-rtl'] .ant-upload-list-item {
  float: right;
}  `;



const FileUpload = () => {
  const {files} = useDbCollection();
  const {blobUrl} = useRxDb();
  const {items} = useCollectionItems();
  const {putFile} = useFileMutation();
  const [loading, setLoading] = useState<RcFile>();
  const defaultFileList: Array<UploadFile<FileDocument>> = [...items.map(toUploadFile)];

  const [fileList, setFileList] = useState<Array<UploadFile<FileDocument>>>(defaultFileList);

  const action = (file: {name:string}) => blobUrl(file);

  function toUploadFile(x: FileDocument ) {
    return {
      uid: x.name,
      name: x.name,
      status: x.status || "done",
      response: x,
      size: x.size,
      url: blobUrl(x),

    }
  }
  const handleChange = (info) => {

    // setFileList(f => [...f, ...info.fileList]);
    if (info.file.status === 'uploading') {
      setLoading(info.file);
      return;
    }
    if (info.file.status === 'done') {
      setLoading(undefined);
    }

    // setFileList(
    //   files => [ ...files, ...info.fileList.filter(_nFile=>!files.find(_eFile=>_eFile.name == _nFile.name)) ]);
  };




  useEffect(() => {

    const files: Array<UploadFile<FileDocument>>  = items.map(toUploadFile);
    console.log('defaultFileList: ' + files.length);
    console.log('fileList: ' + fileList.length);

    setFileList(
      f => [ ...files]);

  }, [items])


  async function onDownload(file: UploadFile<FileDocument>): Promise<any> {
    return FileSaver.saveAs( await   file.response?.getBlob() , file.name);
  }
  async function onRemove(file: UploadFile<FileDocument>):Promise<void | boolean> {
     await files.findOne(file.name).remove();
  }
  return (<PicturesWall customRequest={putFile}
    // beforeUpload={putAsync}
                        action={action}
                        name={'file'}
                        fileList={fileList}
                        onDownload={onDownload}
                        onRemove={onRemove}
                        // onChange={handleChange}
                        className="upload-list-inline"
                        showUploadList= {{
                          showDownloadIcon: true,
                          showRemoveIcon: true,
                          showPreviewIcon:true,
                        }}


  />);



}
export default FileUpload;
