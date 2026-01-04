import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob";
import { StorageResultDto } from "./dto/storage-result.dto";

@Injectable()
export class StorageService {
  private containerName: string;
  private blobServiceClient: BlobServiceClient;

  constructor() {
    // 1. Conexión a Azure
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    this.containerName = process.env.AZURE_CONTAINER_NAME || "storage";

    if (!connectionString) {
      throw new Error("Azure Storage Connection String is missing");
    }

    this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  }

  async upload(file: Express.Multer.File, folder: string = "storage"): Promise<StorageResultDto> {
    try {
      // 2. Preparar el nombre del archivo (Igual que tu lógica anterior)
      const originalName = file.originalname;
      const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
      const extension = originalName.split('.').pop() || '';
      // Azure usa "carpetas" virtuales con slashes /. Ej: storage/mi-imagen_123123.jpg
      const filename = `${nameWithoutExt}_${Date.now()}.${extension}`;
      const blobPath = folder ? `${folder}/${filename}` : filename;

      // 3. Obtener el cliente del contenedor y del blob
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      
      // Crea el contenedor si no existe (opcional, pero seguro)
      await containerClient.createIfNotExists({ access: 'blob' });

      const blockBlobClient = containerClient.getBlockBlobClient(blobPath);

      // 4. Subir el archivo (Buffer)
      await blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: { blobContentType: file.mimetype },
      });

      // 5. Mapear respuesta a TU DTO existente
      const response = new StorageResultDto();
      
      // En Azure, el publicId será la ruta del archivo (ej: images/foto_123.jpg)
      response.publicId = blobPath; 
      
      // Azure devuelve la URL completa
      response.url = blockBlobClient.url; 
      response.secureUrl = blockBlobClient.url; // Azure siempre es HTTPS por defecto
      
      response.format = extension;
      
      // Azure NO procesa imágenes, así que no devuelve width/height. 
      // Los dejamos en 0 para respetar el DTO sin romper tipos.
      response.width = 0; 
      response.height = 0;
      
      response.bytes = file.size; // Usamos el tamaño del archivo original
      response.resourceType = this.getResourceType(file.mimetype);
      response.createdAt = new Date().toISOString();

      return response;

    } catch (error) {
      console.error("Error subiendo a Azure:", error);
      throw new InternalServerErrorException("Error al subir archivo a Azure Storage");
    }
  }

  async delete(publicId: string) {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(publicId);
      
      // deleteIfExists no lanza error si el archivo no existe, devuelve un booleano
      return await blockBlobClient.deleteIfExists();
    } catch (error) {
      throw new InternalServerErrorException("Error eliminando archivo de Azure");
    }
  }

  // Helper simple para llenar el resourceType
  private getResourceType(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    return 'raw';
  }
}