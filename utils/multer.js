import multer from "multer";

// const storage = multer.diskStorage({
//     filename: (req, file, cb) => {
//         if(file.fieldname == "cv"){
//             const {name, age} = req.body;
//             cb(null, name + "_" + age + "_cv_" + file.originalname);
//         }else{
//             cb(null, Date.now() + "_" + file.originalname)
//         }
//     },
//     destination: (req, file, cb) => {
//         if(file.fieldname == "photo"){
//             cb(null, "public/photos");
//         }
//     }
// })

// export const userPhotosMulter = multer({ storage }).array("users", 10);

// export default storage;

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + Math.round(Math.random() * 10000) + "_" + file.fieldname
    );
  },
});

// multer for brand logo
export const brandLogo = multer({ storage }).single("logo");
export const categoryPhoto = multer({ storage }).single("photo");
