import React from "react";
import {useCollectionItems} from "../db/store/ItemList";

 const Consumer = () => {
  const { items  } = useCollectionItems();


   if (!items) {
     return <div>'collection is empty'</div>;
   }
  return (
    <ul>
      {items.map((file:any) => (
        <li key={file.name}>{file.name}</li>
      ))}
    </ul>
  );
};

export default Consumer;
