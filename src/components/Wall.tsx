import {Upload, UploadProps, Button } from 'antd';
import { PlusOutlined, UploadOutlined, LoadingOutlined  } from '@ant-design/icons';
import React, {FC, useState} from "react";
import DPlayer from "react-dplayer";
import {useRxDb} from "../db/store/useRxDb";
import {FileDocument} from "../db/schemas/fileCollectionType";
import {RcFile} from "antd/lib/upload/interface";



type WallProps= Partial<UploadProps>;


const Video:FC<{file?:FileDocument}> =(props)=>{
  const {file}=props;
  const {blobUrl}= useRxDb();
  return file && <DPlayer
    options={{
      video:{url: blobUrl(file)}
    }}
  />
}

const PicturesWall:FC<WallProps>=(props )=> {
  const [loading, setLoading] = useState<RcFile[]>([]);

  const handleChange = (info) => {

    // setFileList(f => [...f, ...info.fileList]);
      setLoading(info.fileList.filter(file=>file.status === 'uploading'));


    // setFileList(
    //   files => [ ...files, ...info.fileList.filter(_nFile=>!files.find(_eFile=>_eFile.name == _nFile.name)) ]);
  };

    return (
      <>
        <Upload
          showUploadList={true}

          {...props}
          onChange={handleChange}
        >
          {/*{fileList.length >= 8 ? null : uploadButton}*/}
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
          { loading.map(file=> <div> <span>{file.name}</span> <LoadingOutlined  /> </div>)}

        </Upload>
      </>
    );

}


export default PicturesWall
