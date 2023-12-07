import { Avatar, Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

import style from "../pages/dashboard/profile/profile.module.css";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [isValid, setIsValid] = useState(false);
  const [previewUrl, setPreviewUrl] = useState();
  const filePickerRef = useRef();

  const pickImageHandler = () => {
    filePickerRef.current.click(); //Ref will get the connetion to the DOM. we can use current to access the ref obj and then use the DOM click method.
  };

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    }; // this function loads the file once reading/parsing of file is done.
    fileReader.readAsDataURL(file); //reads the file first
  }, [file]);

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;

    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];

      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }

    props.getImage(pickedFile);
    //props.onInput(props.id, pickedFile, fileIsValid);
  };

  return (
    // <div className="form-control">
    //   <input
    //     ref={filePickerRef}
    //     type="file"
    //     id={props.id}
    //     style={{ display: "none" }}
    //     accept=".jpg,.jpeg,.png"
    //     onChange={pickedHandler}
    //   />
    <div className={`${style.userCard} ${style.imageCard}`}>
      <div className={style.userImageHolder}>
        <Avatar sx={{ height: 100, width: 100 }} src={previewUrl} />
        {/* {<PhotoSizeSelectActualIcon className={imageTopCornerButton} />} */}
      </div>

      <div className={style.userTextInfoHolder}>
        {/* <h1>{user.name}</h1> */}
        {/* <p>{user.email}</p> */}
        <div>
          <Button variant="contained" component="label" onClick={pickImageHandler}>
            Select Image
            <input
              ref={filePickerRef}
              hidden
              accept="image/*"
              type="file"
              onChange={pickedHandler}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
