const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const secretKey = 'b3a3f72ad8a00b91edb28bfcf81f88ac9c46609bbab60d347139db62c5c2673b';

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

// Middleware for decrypting request data
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

// Middleware for encrypting response data
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

module.exports = { decryptRequest, encryptResponse, encrypt, decrypt };
