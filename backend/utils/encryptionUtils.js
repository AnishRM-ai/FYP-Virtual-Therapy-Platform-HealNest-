const crypto = require('crypto');

const algorithm = 'aes-256-gcm'; // Modern authenticated encryption
const secretKey = process.env.NOTES_SECRET_KEY || '32charactersecretkey12345678901234';
const saltLength = 16; // For key derivation
const ivLength = 12; // Standard for GCM
const tagLength = 16; // GCM auth tag length

/**
 * Encrypts text using AES-256-GCM
 */
const encrypt = (text) => {
  if (!text) return null;
  
  try {
    // Generate random salt and derive key
    const salt = crypto.randomBytes(saltLength);
    const key = crypto.pbkdf2Sync(secretKey, salt, 10000, 32, 'sha256');
    
    // Generate random IV
    const iv = crypto.randomBytes(ivLength);
    
    // Create cipher
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    
    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Get auth tag
    const authTag = cipher.getAuthTag();
    
    // Format: salt:iv:authTag:encryptedData
    return `${salt.toString('hex')}:${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypts text using AES-256-GCM
 */
const decrypt = (encryptedText) => {
  if (!encryptedText) return null;
  
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 4) {
      throw new Error('Invalid encrypted format');
    }
    
    // Extract components
    const salt = Buffer.from(parts[0], 'hex');
    const iv = Buffer.from(parts[1], 'hex');
    const authTag = Buffer.from(parts[2], 'hex');
    const encryptedData = parts[3];
    
    // Derive key
    const key = crypto.pbkdf2Sync(secretKey, salt, 10000, 32, 'sha256');
    
    // Create decipher
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);
    
    // Decrypt
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

module.exports = { encrypt, decrypt };