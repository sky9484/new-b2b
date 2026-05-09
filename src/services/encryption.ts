/**
 * Simulates encryption for data at rest and in transit.
 * In a real production application, use robust implementations like WebCrypto API 
 * or established cryptography libraries (e.g., tweetnacl).
 */
import { Logger } from './logger';

export class EncryptionService {
  static async encrypt(data: string, secretKey: string = 'DEFAULT_AES_KEY_SIMULATION'): Promise<string> {
    try {
      // Simulation of encryption
      const encrypted = Buffer.from(data).toString('base64');
      Logger.debug('Data encrypted successfully');
      return `enc_${encrypted}`;
    } catch (error) {
      Logger.error('Encryption failed', error);
      throw new Error('Encryption failed');
    }
  }

  static async decrypt(encryptedData: string, secretKey: string = 'DEFAULT_AES_KEY_SIMULATION'): Promise<string> {
    try {
      if (!encryptedData.startsWith('enc_')) throw new Error('Invalid encrypted format');
      const base64Data = encryptedData.replace('enc_', '');
      const decrypted = Buffer.from(base64Data, 'base64').toString('utf-8');
      Logger.debug('Data decrypted successfully');
      return decrypted;
    } catch (error) {
      Logger.error('Decryption failed', error);
      throw new Error('Decryption failed');
    }
  }
}
