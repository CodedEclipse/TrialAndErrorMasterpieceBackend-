
const secretKey = 'b3a3f72ad8a00b91edb28bfcf81f88ac9c46609bbab60d347139db62c5c2673b';
/*
const crypto = require('crypto');
const algorithm = 'aes-256-cbc'; 
const sec_key = 123
const key = crypto.createHash('sha256').update(secretKey).digest();

function encrypt(text) {
  // Ensure that the text is a string before encrypting
  if (typeof text !== 'string') {
    text = JSON.stringify(text); // Serialize if it's an object
  }
  
  // Generate a random IV for each encryption
  const iv = crypto.randomBytes(16);
  let cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Return both the encrypted text and IV
  return { encrypted, iv: iv.toString('hex') };
}

function decrypt(encryptedText, iv) {
  // Convert IV from hex to Buffer
  iv = Buffer.from(iv, 'hex');
  let decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

Middleware for decrypting request data
const decryptRequest = (req, res, next) => {
  if (req.body && req.body.encrypted && req.body.iv) {
    try {
      // Decrypt the data using the provided IV
      req.body = JSON.parse(decrypt(req.body.encrypted, req.body.iv));
      next();
    } catch (err) {
      res.status(400).send({ error: 'Invalid encrypted data' });
    }
  } else {
    next();
  }
};

Middleware for encrypting response data
const encryptResponse = (req, res, next) => {
  const originalSend = res.send;
  res.send = function (data) {
    // Ensure the data is serialized to a string before encryption
    const { encrypted, iv } = encrypt(JSON.stringify(data)); // Make sure to stringify the data
    
    // Return the encrypted data and IV in the response
    res.set('Content-Type', 'application/json');
    originalSend.call(res, JSON.stringify({ encrypted, iv }));
  };
  next();
};
*/
const EncryptData = (data) => {
  // If data is an object (JSON), convert it to a string first
  if (typeof data === 'object') {
    data = JSON.stringify(data);
  }
  let encrypted = '';
  // XOR encryption with secretKey
  for (let i = 0; i < data.length; i++) {
    encrypted += String.fromCharCode(data.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length));
  }
  // Base64 encode the encrypted string and return
  return btoa(encrypted);
};

const DecryptData = (encryptedData) => {
  encryptedData = atob(encryptedData);
  let decryptedData = '';
  for (let i = 0; i < encryptedData.length; i++) {
    decryptedData += String.fromCharCode(encryptedData.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length));
  }
  return JSON.parse(decryptedData);
};

const decryptRequestData = (req, res, next) => {  
  if (req.body && req.body.encrypted) {
  console.log('4788441');

    try {
      req.body = DecryptData(req.body.encrypted);
      next();
    } catch (err) {
      res.status(400).send({ error: 'Invalid encrypted data' });
    }
  } else {
  console.log('qwstfrhyuij');
  console.log('req.body ',req.body , typeof req.body  );
  console.log('req.method ',req.method , typeof req.method  );

    if((req.method=='POST' && typeof req.body=='object') || req.method=='GET'){
      console.log('qwstfrhyuij/////');
      next();
    }else{
      console.log('qwstfrhyuij787455');
      res.status(400).send({ status: false, code: 400, message: 'Bad Request!.', result: null });
    }
  }
};

const encryptResponseData = (req, res, next) => {
  const originalSend = res.send;
  res.send = function (data) {
    const encryptedData = EncryptData(data);
    res.set('Content-Type', 'application/json');
    originalSend.call(res, JSON.stringify({ encrypted: encryptedData }));
  };
  next();
};


module.exports = {  EncryptData, DecryptData, decryptRequestData,encryptResponseData };
