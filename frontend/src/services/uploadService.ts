import { apiClient } from './api/client';

export class UploadService {
  public static async uploadFile(file: File): Promise<{ fileUrl: string; fileName: string; id: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/api/v1/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    const data = response.data.data;
    // Map response data
    return {
      id: data._id,
      fileName: data.originalName || file.name,
      fileUrl: `/api/v1/uploads/${data._id}` // signed url generator link or standard route downloadUrl
    };
  }

  public static async getFileDetails(id: string): Promise<any> {
    const response = await apiClient.get(`/api/v1/uploads/${id}`);
    return response.data.data;
  }
}

export default UploadService;
