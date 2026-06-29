import { StorageProvider } from './StorageProvider';
import { LocalStorageProvider } from './LocalStorageProvider';
import { S3StorageProvider } from './S3StorageProvider';

export class StorageFactory {
  public static getProvider(): StorageProvider {
    const provider = process.env.STORAGE_PROVIDER || 'LOCAL';

    if (provider === 'S3') {
      return new S3StorageProvider();
    }

    return new LocalStorageProvider();
  }
}
export default StorageFactory;
