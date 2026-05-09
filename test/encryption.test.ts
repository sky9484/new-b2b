import { describe, it, expect } from 'vitest';
import { EncryptionService } from '../src/services/encryption';

describe('Encryption Service', () => {
  it('should successfully encrypt and decrypt data (simulate transit encryption)', async () => {
    const rawData = "Confidential User Financial Data";
    
    // Encrypt
    const encrypted = await EncryptionService.encrypt(rawData);
    expect(encrypted).not.toEqual(rawData);
    expect(encrypted.startsWith('enc_')).toBeTruthy();
    
    // Decrypt
    const decrypted = await EncryptionService.decrypt(encrypted);
    expect(decrypted).toEqual(rawData);
  });
});
