import { Injectable } from "@nestjs/common";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { UploadResultDto } from "./dto/upload-result.dto";

@Injectable()
export class UploadsService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async upload(file: Express.Multer.File, folder: string = "uploads"): Promise<UploadResultDto> {
    const originalName = file.originalname;
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    const extension = originalName.split('.').pop();

    const result = await this.uploadToCloudinary(file, folder, nameWithoutExt, extension);
    
    const response = new UploadResultDto();
    response.publicId = result.public_id;
    response.url = result.url;
    response.secureUrl = result.secure_url;
    response.format = result.format || extension || '';
    response.width = result.width;
    response.height = result.height;
    response.bytes = result.bytes;
    response.resourceType = result.resource_type;
    response.createdAt = result.created_at;
    
    return response;
  }

  async delete(publicId: string) {
    return cloudinary.uploader.destroy(publicId, { resource_type: "auto" as any });
  }

  private uploadToCloudinary(
    file: Express.Multer.File,
    folder: string,
    nameWithoutExt: string,
    extension?: string
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            folder: folder,
            public_id: `${nameWithoutExt}_${Date.now()}`,
            format: extension,
            access_mode: "public",
            type: "upload",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result!);
            }
          }
        )
        .end(file.buffer);
    });
  }
}
