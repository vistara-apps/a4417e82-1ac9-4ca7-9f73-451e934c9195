import axios from 'axios';

export class IPFSService {
  private static readonly PINATA_API_URL = 'https://api.pinata.cloud';
  private static readonly PINATA_GATEWAY_URL = 'https://gateway.pinata.cloud/ipfs';

  private static getHeaders() {
    return {
      'Authorization': `Bearer ${process.env.PINATA_JWT}`,
      'Content-Type': 'application/json',
    };
  }

  private static getFileHeaders() {
    return {
      'Authorization': `Bearer ${process.env.PINATA_JWT}`,
    };
  }

  /**
   * Upload a file to IPFS via Pinata
   */
  static async uploadFile(file: File, metadata?: {
    name?: string;
    description?: string;
    course?: string;
    professor?: string;
    topic?: string;
  }): Promise<{
    IpfsHash: string;
    PinSize: number;
    Timestamp: string;
    isDuplicate?: boolean;
  }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Add metadata
      const pinataMetadata = {
        name: metadata?.name || file.name,
        keyvalues: {
          description: metadata?.description || '',
          course: metadata?.course || '',
          professor: metadata?.professor || '',
          topic: metadata?.topic || '',
          uploadedAt: new Date().toISOString(),
          fileType: file.type,
          fileSize: file.size.toString(),
        },
      };

      formData.append('pinataMetadata', JSON.stringify(pinataMetadata));

      // Add options
      const pinataOptions = {
        cidVersion: 1,
        wrapWithDirectory: false,
      };

      formData.append('pinataOptions', JSON.stringify(pinataOptions));

      const response = await axios.post(
        `${this.PINATA_API_URL}/pinning/pinFileToIPFS`,
        formData,
        {
          headers: this.getFileHeaders(),
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }
      );

      return response.data;
    } catch (error) {
      console.error('IPFS upload error:', error);
      throw new Error('Failed to upload file to IPFS');
    }
  }

  /**
   * Upload JSON data to IPFS via Pinata
   */
  static async uploadJSON(data: any, metadata?: {
    name?: string;
    description?: string;
  }): Promise<{
    IpfsHash: string;
    PinSize: number;
    Timestamp: string;
    isDuplicate?: boolean;
  }> {
    try {
      const pinataMetadata = {
        name: metadata?.name || 'CampusConnect Data',
        keyvalues: {
          description: metadata?.description || '',
          uploadedAt: new Date().toISOString(),
          dataType: 'json',
        },
      };

      const pinataOptions = {
        cidVersion: 1,
      };

      const requestBody = {
        pinataContent: data,
        pinataMetadata,
        pinataOptions,
      };

      const response = await axios.post(
        `${this.PINATA_API_URL}/pinning/pinJSONToIPFS`,
        requestBody,
        {
          headers: this.getHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      console.error('IPFS JSON upload error:', error);
      throw new Error('Failed to upload JSON to IPFS');
    }
  }

  /**
   * Get file from IPFS via Pinata gateway
   */
  static async getFile(ipfsHash: string): Promise<Blob> {
    try {
      const response = await axios.get(
        `${this.PINATA_GATEWAY_URL}/${ipfsHash}`,
        {
          responseType: 'blob',
        }
      );

      return response.data;
    } catch (error) {
      console.error('IPFS retrieval error:', error);
      throw new Error('Failed to retrieve file from IPFS');
    }
  }

  /**
   * Get JSON data from IPFS via Pinata gateway
   */
  static async getJSON(ipfsHash: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.PINATA_GATEWAY_URL}/${ipfsHash}`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('IPFS JSON retrieval error:', error);
      throw new Error('Failed to retrieve JSON from IPFS');
    }
  }

  /**
   * Get file URL for direct access
   */
  static getFileUrl(ipfsHash: string): string {
    return `${this.PINATA_GATEWAY_URL}/${ipfsHash}`;
  }

  /**
   * List all pinned files
   */
  static async listPinnedFiles(filters?: {
    status?: 'pinned' | 'unpinned';
    pageLimit?: number;
    pageOffset?: number;
    metadata?: Record<string, string>;
  }): Promise<{
    count: number;
    rows: Array<{
      id: string;
      ipfs_pin_hash: string;
      size: number;
      user_id: string;
      date_pinned: string;
      date_unpinned: string | null;
      metadata: {
        name: string;
        keyvalues: Record<string, string>;
      };
      regions: Array<{
        regionId: string;
        currentReplicationCount: number;
        desiredReplicationCount: number;
      }>;
    }>;
  }> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.status) {
        params.append('status', filters.status);
      }
      
      if (filters?.pageLimit) {
        params.append('pageLimit', filters.pageLimit.toString());
      }
      
      if (filters?.pageOffset) {
        params.append('pageOffset', filters.pageOffset.toString());
      }

      if (filters?.metadata) {
        Object.entries(filters.metadata).forEach(([key, value]) => {
          params.append(`metadata[keyvalues][${key}]`, value);
        });
      }

      const response = await axios.get(
        `${this.PINATA_API_URL}/data/pinList?${params.toString()}`,
        {
          headers: this.getHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      console.error('IPFS list error:', error);
      throw new Error('Failed to list pinned files');
    }
  }

  /**
   * Unpin a file from IPFS
   */
  static async unpinFile(ipfsHash: string): Promise<void> {
    try {
      await axios.delete(
        `${this.PINATA_API_URL}/pinning/unpin/${ipfsHash}`,
        {
          headers: this.getHeaders(),
        }
      );
    } catch (error) {
      console.error('IPFS unpin error:', error);
      throw new Error('Failed to unpin file from IPFS');
    }
  }

  /**
   * Test authentication with Pinata
   */
  static async testAuthentication(): Promise<boolean> {
    try {
      const response = await axios.get(
        `${this.PINATA_API_URL}/data/testAuthentication`,
        {
          headers: this.getHeaders(),
        }
      );

      return response.data.message === 'Congratulations! You are communicating with the Pinata API!';
    } catch (error) {
      console.error('Pinata auth test error:', error);
      return false;
    }
  }

  /**
   * Get account usage statistics
   */
  static async getUsage(): Promise<{
    pin_count: number;
    pin_size_total: number;
    pin_size_with_replications_total: number;
  }> {
    try {
      const response = await axios.get(
        `${this.PINATA_API_URL}/data/userPinnedDataTotal`,
        {
          headers: this.getHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      console.error('IPFS usage error:', error);
      throw new Error('Failed to get usage statistics');
    }
  }

  /**
   * Validate file before upload
   */
  static validateFile(file: File): {
    isValid: boolean;
    error?: string;
  } {
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/zip',
      'application/x-zip-compressed',
    ];

    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: 'File size exceeds 10MB limit',
      };
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: 'File type not supported',
      };
    }

    return { isValid: true };
  }
}
