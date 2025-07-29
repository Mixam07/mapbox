import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { imageDb } from "./initialization";
import { v4 } from "uuid";

const uploadImage = async (image, folder) => {
    const id = v4();

    if(image){
        const imgRef = ref(imageDb, `${folder}/${id}`);

        return await uploadBytes(imgRef, image).then(async (snapshot) => {
            return await getDownloadURL(snapshot.ref).then((url) => {
                return url
            }).catch((error) => {
                return ""
            });
        }).catch((error) => {
            return ""
        });
    }

    return ""
}

export { uploadImage }