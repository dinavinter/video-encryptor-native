import React from "react";

type PresentationalProps = {
  dragging: boolean;
  file: File | null;
  onSelectFileClick: () => void;
  onDrag: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragStart: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
};

export const FileUploaderPresentationalComponent: React.SFC<
  PresentationalProps
  > = props => {
  const {
    dragging,
    file,
    onSelectFileClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDragEnter,
    onDragLeave,
    onDrop
  } = props;

  let uploaderClasses = "file-uploader";
  if (dragging) {
    uploaderClasses += " file-uploader--dragging";
  }

  const fileName = file ? file.name : "No File Uploaded!";

  return (
    <div
      className={uploaderClasses}
      onDrag={onDrag}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="file-uploader__contents">
        <span className="file-uploader__file-name">{fileName}</span>
        <span>Drag & Drop File</span>
        <span>or</span>
        <span onClick={onSelectFileClick}>
          Select File
        </span>
      </div>
      {props.children}
    </div>
  );
};
