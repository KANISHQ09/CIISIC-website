export interface StorageProvider {
  upload(filePath: string, fileBuffer: Buffer, mimeType: string): Promise<string>;
  delete(storageKey: string): Promise<void>;
  exists(storageKey: string): Promise<boolean>;
  generateSignedUrl(storageKey: string, expirySeconds?: number): Promise<string>;
}
