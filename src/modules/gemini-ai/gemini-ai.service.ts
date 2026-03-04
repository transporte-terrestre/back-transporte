import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class GeminiAiService {
  private readonly genAI: GoogleGenerativeAI;
  private readonly logger = new Logger(GeminiAiService.name);

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      this.logger.warn('GEMINI_API_KEY no configurado en el archivo .env');
    }
    this.genAI = new GoogleGenerativeAI(apiKey || '');
  }

  async extractDniData(imageUrl: string): Promise<{ dni: string; nombres: string; apellidos: string } | null> {
    try {
      // Descargar imagen usando fetch nativo (Node 20+)
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Error al descargar la imagen: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const imageData = Buffer.from(arrayBuffer).toString('base64');
      const mimeType = response.headers.get('content-type') || 'image/jpeg';

      const model = this.genAI.getGenerativeModel({
        model: 'gemini-3.1-flash-image-preview',
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      const prompt = `Analiza la imagen de este Documento Nacional de Identidad (DNI) y extrae:
      - dni: El número de 8 dígitos.
      - nombres: Los nombres del ciudadano.
      - apellidos: Los apellidos del ciudadano.
      
      Devuelve un objeto JSON con las llaves: dni, nombres, apellidos.`;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: imageData,
            mimeType: mimeType,
          },
        },
      ]);

      const text = result.response.text().trim();

      if (!text || text === 'null') return null;

      try {
        const parsed = JSON.parse(text);
        if (parsed.dni && parsed.nombres) {
          return {
            dni: String(parsed.dni).replace(/\D/g, ''), // Solo dígitos
            nombres: String(parsed.nombres).toUpperCase().trim(),
            apellidos: String(parsed.apellidos || '')
              .toUpperCase()
              .trim(),
          };
        }
      } catch (e) {
        this.logger.error(`Error parseando JSON de Gemini JSON MODE: ${text}`);
      }

      return null;
    } catch (error) {
      this.logger.error(`Error extrayendo datos del DNI en ${imageUrl}: ${error.message}`);
      return null;
    }
  }
}
