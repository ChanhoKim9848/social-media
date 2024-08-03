import { useState } from "react";
import useShowToast from "./useShowToast";

// the function that used to preview the image updated on profile
const usePreviewImg = () => {
  // get image url
  const [imgUrl, setImgUrl] = useState(null);

  const showToast = useShowToast();
  //   change image to the file that is found from local
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // checks if the file is image type
    if (file && file.type.startsWith("image/")) {
      
      // read the file
      const reader = new FileReader();

      // return set img url to the file
      reader.onloadend = () => {
        setImgUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // set img to null if the file is not image type
      showToast("Invalid file type", "Please select an image file", "error");
      setImgUrl(null);
    }
  };
  return { handleImageChange, imgUrl };
};

export default usePreviewImg;
