import React, {FC, useState} from "react";
import {FileDocument} from "../db/schemas/fileCollectionType";
import {useFileMutation} from "../db/store/fileMutations";

const FileView:FC<{file:FileDocument}> = ({file }) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [name, setName] = useState<string>(file.name);
  const {mutateAsync} = useFileMutation();

  const handleEditChange = (e:any) => {
    setName(e.target.value);
    file.name =e.target.value;
  };

  const handleEdit = () => {
    setEdit(!edit);
  };

  const handleEditSubmit = async () => {
    await mutateAsync(file);
    handleEdit();
  };
  return (
    <div className="todo" key={file.name}>
        <>
          <input
            type="text"
            value={name}
            name="name"
            onChange={handleEditChange}
          />
          <span>{file.name}</span>{" "}
          <button onClick={handleEdit}  >
            Edit
          </button>
        </>
    </div>
  );
};

export default FileView;
