const crypto = require("crypto");

const algorithm = process.env.CRYPTO_ALGORITHM;

const secretKey = process.env.CRYPTO_SECRET;
// const algorithm = "aes-256-ctr";

// const secretKey = "1234567812345a7812fF456781234678";

const encrypt = (data) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encryptedData = Buffer.concat([cipher.update(data), cipher.final()]);
  return {
    iv: iv.toString("hex"),
    encryptedData: encryptedData.toString("hex"),
  };
};

const decrypt = (hashAndIv) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(hashAndIv.iv, "hex")
  );
  const decryptedData = Buffer.concat([
    decipher.update(Buffer.from(hashAndIv.encryptedData, "hex")),
    decipher.final(),
  ]);
  return decryptedData.toString();
};

// let encryptedData = encrypt("kennymaccormick@gmail.com");
// // encryptedData.iv = "05a8dd11fd5498b55d3a810f56639d5d";
// encryptedData.encryptedData =
//   "3267fec8b7b28884b9a55352cfa29e32b575286cb44c16c9d4";
// console.log(encryptedData);
// let decryptedData = decrypt(encryptedData);
// console.log(decryptedData);
module.exports = {
  encrypt,
  decrypt,
};
