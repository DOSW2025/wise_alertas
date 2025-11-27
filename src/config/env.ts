import 'dotenv/config';
import * as joi from 'joi';

/** Tipado de variables de entorno esperadas */
interface EnvVars {
  PORT: number;
  MAIL_FROM: string;
  SENDGRID_API_KEY: string;
  SERVICE_BUS_CONNECTION_STRING: string;
}

/** Esquema de validación de env */
const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    MAIL_FROM: joi.string().email().required(),
    SENDGRID_API_KEY: joi.string().required(),
  })
  .unknown(true);
const result = envsSchema.validate(process.env);
if (result.error) {
  throw new Error(`Config validation error: ${result.error.message}`);
}
const envVars = result.value as EnvVars;
/** Exporta envs normalizadas para uso interno */
export const envs = {
  port: envVars.PORT,
  mailfrom: envVars.MAIL_FROM,
  sendgridapikey: envVars.SENDGRID_API_KEY,
  serviceBusConnectionString: envVars.SERVICE_BUS_CONNECTION_STRING,
};
