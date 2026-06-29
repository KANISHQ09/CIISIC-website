import { StorageProvider } from './StorageProvider';

export class S3StorageProvider implements StorageProvider {
  public async upload(filePath: string, fileBuffer: Buffer, mimeType: string): Promise<string> {
    // Stub implementation returning remote S3 bucket Key
    return `s3://ciisic-bucket/${filePath}`;
  }

  public async delete(storageKey: string): Promise<void> {
    // Stub operation
  }

  public async exists(storageKey: string): Promise<boolean> {
    return true;
  }

  public async generateSignedUrl(storageKey: string, expirySeconds = 3600): Promise<string> {
    return `https://s3.amazonaws.com/ciisic-bucket/${storageKey}?signature=stub`;
  }
}
