import React, {CSSProperties, FC, useEffect, useMemo, useState} from 'react';
import {useFileMutation} from '../db/store/fileMutations'
import FileSaver from "file-saver";



function download (url, name, opts={}) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', url)
  xhr.responseType = 'blob'
  xhr.onload = function () {
    FileSaver.saveAs(xhr.response, name, opts)
  }
  xhr.onerror = function () {
    console.error('could not download file')
  }
  xhr.send()
}

import {Upload, message, Button} from 'antd';
import {LoadingOutlined, PlusOutlined, StarOutlined, UploadOutlined} from '@ant-design/icons';
import {RcFile, UploadChangeParam, UploadFile} from "antd/lib/upload/interface";
 import {useCollectionItems, useDbCollection} from "../db/store/ItemList";
import PicturesWall from './Wall';
import {FileDocument} from "../db/schemas/fileCollectionType";
import {useRxDb} from "../db/store/useRxDb";
 

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
      // url: blobUrl(x),
      url: x.url

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
    const blob = await file.response.getAttachment('blob').getData();
    console.log(file);
    return download(file.url , file.name);
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
                        // className="upload-list-inline"
                        showUploadList= {{
                          showDownloadIcon: true,
                          showRemoveIcon: true,
                          showPreviewIcon:true,
                        }}


  />);



}
export default FileUpload;
