import { generateApi } from 'swagger-typescript-api';
import path from 'path';
import fs from 'fs';

const SWAGGER_URL = 'http://localhost:3000/api-json';
const OUTPUT_DIR = path.resolve(__dirname, '../../front-transporte/src/api');
const OUTPUT_FILE = 'backend.api.ts';

// Crear directorio si no existe
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * ===========================================================
 *  Helpers (opcionales)
 * ===========================================================
 */
const HELPER_TYPES = `
/**
 * ==============================================================================
 *  UTILITARIOS DE TIPOS PARA FRONTEND
 * ==============================================================================
 */

/**
 * Extrae el tipo de respuesta (data) de un método de la API
 * @example ApiResponse<"clientes", "findAll"> → PaginatedClienteResultDto
 */
export type ApiResponse<
  Module extends keyof Api<unknown>,
  Method extends keyof Api<unknown>[Module]
> = Api<unknown>[Module][Method] extends (...args: any) => Promise<{ data: infer Data }>
  ? Data
  : never;

/**
 * Extrae todos los argumentos de un método de la API
 */
type ApiArgs<
  Module extends keyof Api<unknown>,
  Method extends keyof Api<unknown>[Module]
> = Parameters<
  Api<unknown>[Module][Method] extends (...args: any) => any ? Api<unknown>[Module][Method] : never
>;

/**
 * Extrae el tipo del body (data) de un método de la API
 * Busca el parámetro que se llama "data" en la firma del método
 * @example ApiBody<"clientes", "create"> → ClienteCreateDto
 * @example ApiBody<"clientes", "update"> → ClienteUpdateDto
 */
export type ApiBody<
  Module extends keyof Api<unknown>,
  Method extends keyof Api<unknown>[Module]
> = Required<ApiArgs<Module, Method>> extends [any, any, any, ...any[]]
  ? ApiArgs<Module, Method>[1]
  : Required<ApiArgs<Module, Method>> extends [any, any, ...any[]]
    ? ApiArgs<Module, Method>[0]
    : never;

/**
 * Extrae el tipo de los query params de un método de la API
 * Busca el parámetro que se llama "query" en la firma del método
 * @example ApiQuery<"clientes", "findAll"> → { page?: number, limit?: number, search?: string, ... }
 */
export type ApiQuery<
  Module extends keyof Api<unknown>,
  Method extends keyof Api<unknown>[Module]
> = ApiArgs<Module, Method> extends [infer Query, ...any[]]
  ? Query
  : never;

/**
 * Extrae el tipo de un parámetro específico (path param) de un método de la API
 * @example ApiParam<"clientes", "update", "id"> → number
 * @example ApiParam<"vehiculos", "findOne", "id"> → number
 */
export type ApiParam<
  Module extends keyof Api<unknown>,
  Method extends keyof Api<unknown>[Module],
  ParamName extends ApiArgs<Module, Method> extends [infer Arg1, ...any[]]
    ? keyof Arg1
    : never
> = ApiArgs<Module, Method> extends [infer Arg1, ...any[]]
  ? ParamName extends keyof Arg1
    ? Arg1[ParamName]
    : never
  : never;

/**
 * Extrae el tipo de un campo específico de la respuesta de un método de la API
 * @example ApiField<"usuarios", "findOne", "roles"> → UsuarioResultDtoRolesEnum[]
 * @example ApiField<"vehiculos", "findOne", "estado"> → VehiculoResultDtoEstadoEnum
 */
export type ApiField<
  Module extends keyof Api<unknown>,
  Method extends keyof Api<unknown>[Module],
  FieldName extends keyof ApiResponse<Module, Method>
> = ApiResponse<Module, Method>[FieldName];
`;

function cleanMethodNames(content: string): string {
  const blockRegex = /(?<indent>\n\s+)(?<tag>[a-zA-Z0-9_]+)\s*=\s*\{(?<body>[\s\S]*?)\k<indent>\};/g;

  return content.replace(blockRegex, (match, indent, tag, body) => {
    console.log(` -> Procesando módulo detectado: "${tag}"`);

    const methodRegex = new RegExp(`(\\s+)${tag}([A-Z][a-zA-Z0-9_]*)(:\\s*\\()`, 'g');

    const cleanBody = body.replace(methodRegex, (mMatch: string, mIndent: string, suffix: string, mRest: string) => {
      const newName = suffix.charAt(0).toLowerCase() + suffix.slice(1);
      return `${mIndent}${newName}${mRest}`;
    });

    return `${indent}${tag} = {${cleanBody}${indent}};`;
  });
}

async function generate(): Promise<void> {
  console.log('🚀 Generando tipos y cliente API desde Swagger...');

  try {
    await generateApi({
      fileName: OUTPUT_FILE,
      output: OUTPUT_DIR,
      url: SWAGGER_URL,

      generateClient: true,
      httpClientType: 'fetch',

      generateRouteTypes: true,
      generateResponses: true,

      extractRequestParams: true,
      extractRequestBody: true,
      extractEnums: false,
      extractResponseBody: true,
      extractResponseError: true,

      unwrapResponseData: false,
      singleHttpClient: true,
      cleanOutput: false,
      enumNamesAsValues: false,
      generateUnionEnums: false,

      moduleNameFirstTag: true,
      moduleNameIndex: 0,

      hooks: {
        onFormatRouteName: (routeInfo, templateRouteName) => {
          const tag = routeInfo.tags?.[0];

          if (tag && routeInfo.operationId) {
            const parts = routeInfo.operationId.split('_');
            const method = parts.length > 1 ? parts[parts.length - 1] : routeInfo.operationId;
            return tag.toLowerCase() + method.charAt(0).toUpperCase() + method.slice(1);
          }

          return templateRouteName;
        },
      },
    });

    const outputPath = path.resolve(OUTPUT_DIR, OUTPUT_FILE);

    if (fs.existsSync(outputPath)) {
      let content = fs.readFileSync(outputPath, 'utf8');
      content = cleanMethodNames(content);
      content += HELPER_TYPES;

      fs.writeFileSync(outputPath, content, 'utf8');
      console.log(`\n✨ Generación completada exitosamente!`);
      console.log(`📁 Archivo procesado guardado en: ${outputPath}`);
    } else {
      console.error('❌ Error: No se encontró el archivo generado para procesar.');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Error generando tipos:', errorMessage);
    process.exit(1);
  }
}

generate();
