const multer = require("./multer");

// module.exports = (uploadTo, fileSize, types) => {
//   return multer(uploadTo, fileSize, (req, file, cb) => {
//     let allowedFormats = [];
//     if (typeof types === "object") {
//       if (types.hasOwnProperty("type")) {
//         switch (types.type) {
//           case "img":
//           case "imgs":
//           case "image":
//           case "images":
//             allowedFormats = [
//               "image/apng",
//               "image/avif",
//               "image/gif",
//               "image/jpeg",
//               "image/png",
//               "image/svg+xml",
//               "image/webp",
//             ];
//             break;
//           case "video":
//           case "videos":
//           case "vid":
//           case "vids":
//             allowedFormats = [
//               "video/x-flv",
//               "video/mp4",
//               "application/x-mpegURL",
//               "video/MP2T",
//               "video/3gpp",
//               "video/quicktime",
//               "video/x-msvideo",
//               "video/x-ms-wmv",
//               "video/x-matroska",
//               "video/mpeg",
//             ];
//             break;
//           case "audio":
//           case "audios":
//           case "music":
//           case "musics":
//           case "sound":
//           case "sounds":
//             allowedFormats = [
//               "audio/x-wav",
//               "audio/x-aiff",
//               "audio/mpeg",
//               "audio/mp3",
//               "application/ogg",
//               "audio/midi",
//               "audio/x-midi",
//             ];
//             break;
//           case "document":
//           case "documents":
//           case "doc":
//           case "docs":
//             allowedFormats = [
//               "application/pdf",
//               "application/vnd.ms-powerpoint",
//               "application/vnd.openxmlformats-officedocument.presentationml.presentation",
//               "text/plain",
//               "application/vnd.ms-excel",
//               "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//               "application/msword",
//               "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//             ];
//             break;
//           case "custom":
//             if (
//               types.hasOwnProperty("customFormats") &&
//               Array.isArray(types.customFormats)
//             ) {
//               allowedFormats = types.customFormats;
//             } else {
//               cb(
//                 new Error(
//                   "missing customFormats or customFormats is not an array"
//                 )
//               );
//               return;
//             }
//             break;
//         }
//         cb(null, allowedFormats.includes(file.mimetype));
//         return;
//       }
//     }
//   });
// };

const allowedTypes = {
  img: "img",
  vid: "vid",
  sound: "sound",
  doc: "doc",
  custom: "custom",
  any: "any",
};

const filterFileType = (file, cb, typeOptions = allowedTypes.any) => {
  try {
    if (typeof typeOptions !== "object") {
      throw new Error("typeOptions is not an object");
    }
    if (!typeOptions.hasOwnProperty("type")) {
      throw new Error("missing type property");
    }
    if (typeof typeOptions.type !== "string") {
      throw new Error("type should be string");
    }
    let allowedFormats = [];
    switch (typeOptions.type) {
      case allowedTypes.img:
        allowedFormats = [
          "image/apng",
          "image/avif",
          "image/gif",
          "image/jpeg",
          "image/png",
          "image/svg+xml",
          "image/webp",
        ];
        break;
      case allowedTypes.vid:
        allowedFormats = [
          "video/x-flv",
          "video/mp4",
          "application/x-mpegURL",
          "video/MP2T",
          "video/3gpp",
          "video/quicktime",
          "video/x-msvideo",
          "video/x-ms-wmv",
          "video/x-matroska",
          "video/mpeg",
        ];
        break;
      case allowedTypes.sound:
        allowedFormats = [
          "audio/x-wav",
          "audio/x-aiff",
          "audio/mpeg",
          "audio/mp3",
          "application/ogg",
          "audio/midi",
          "audio/x-midi",
        ];
        break;
      case allowedTypes.doc:
        allowedFormats = [
          "application/pdf",
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "text/plain",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        break;
      case allowedTypes.custom:
        if (!typeOptions.hasOwnProperty("customFormats")) {
          throw new Error("customFormats is missing");
        }
        if (!Array.isArray(typeOptions.customFormats)) {
          throw new Error("customFormats should be an array");
        }
        allowedFormats = typeOptions.customFormats;
        break;
      case allowedTypes.any:
        cb(null, true);
        return;
      default:
        throw new Error("please choose the correct type from allowedTypes");
    }
    cb(null, allowedFormats.includes(file.mimetype));
  } catch (err) {
    cb(err);
  }
};

module.exports = {
  allowedTypes,
  createMulter: (uploadTo, fileSize, typeOptions) => {
    return multer(uploadTo, fileSize, (req, file, cb) => {
      filterFileType(file, cb, typeOptions);
    });
  },
};
