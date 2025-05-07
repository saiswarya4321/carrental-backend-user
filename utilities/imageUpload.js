const cloudinary=require("../config/cloudinaryConfig")

// const uploadToCloudinary=(filepath)=>{
//     return new Promise((resolve,reject)=>{
//         cloudinary.uploader.upload(
//             filepath,
//             {
//                 folder:'products'
//             },
//             (error,result)=>{
//                 if(error) return reject(error)
//                     resolve(result.secure_url)
//             }
//         )
//     })
// }


// module.exports=uploadToCloudinary


const uploadToCloudinary = async (localFilePath) => {
    try {
        const result = await cloudinary.uploader.upload(localFilePath, {
            folder: "car-rentals", // optional: to organize uploads
        });
        return result.secure_url; // you probably only care about the URL
    } catch (error) {
        throw error;
    }
};

module.exports = uploadToCloudinary;