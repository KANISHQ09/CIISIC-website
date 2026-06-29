import fs from 'fs-extra';
import path from 'path';
import { StorageProvider } from './StorageProvider';

export class LocalStorageProvider implements StorageProvider {
  private readonly uploadDir: string;

  constructor() {
    this.uploadDir = path.join(__dirname, '../../uploads');
    fs.ensureDirSync(this.uploadDir);
  }

  public async upload(filePath: string, fileBuffer: Buffer, mimeType: string): Promise<string> {
    const fullPath = path.join(this.uploadDir, filePath);
    await fs.ensureDir(path.dirname(fullPath));
    await fs.writeFile(fullPath, fileBuffer);
    return filePath; // Storage key
  }

  public async delete(storageKey: string): Promise<void> {
    const fullPath = path.join(this.uploadDir, storageKey);
    if (await fs.pathExists(fullPath)) {
      await fs.remove(fullPath);
    }
  }

  public async exists(storageKey: string): Promise<boolean> {
    const fullPath = path.join(this.uploadDir, storageKey);
    return fs.pathExists(fullPath);
  }

  public async generateSignedUrl(storageKey: string, expirySeconds = 3600): Promise<string> {
    // In local dev, return local serve route URL
    return `/api/v1/uploads/files/${storageKey}`;
  }
}
