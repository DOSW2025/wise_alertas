import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  MAIL_FROM: string;
  SENDGRID_API_KEY: string;
  SERVICE_BUS_CONNECTION_STRING: string;
  AUTH_SERVICE_BUS_CONNECTION_STRING: string;
  CHAT_SERVICE_BUS_CONNECTION_STRING: string;
  DATABASE_URL?: string;
  DIRECT_URL?: string;
}
const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    MAIL_FROM: joi.string().email().required(),
    SENDGRID_API_KEY: joi.string().required(),
    SERVICE_BUS_CONNECTION_STRING: joi.string().required(),
    AUTH_SERVICE_BUS_CONNECTION_STRING: joi.string().required(),
    CHAT_SERVICE_BUS_CONNECTION_STRING: joi.string().required(),
    DATABASE_URL: joi.string().uri().optional(),
    DIRECT_URL: joi.string().uri().optional(),
  })
  .unknown(true);
const result = envsSchema.validate(process.env);
if (result.error) {
  throw new Error(`Config validation error: ${result.error.message}`);
}
const envVars = result.value as EnvVars;

export const envs = {
  port: envVars.PORT,
  mailfrom: envVars.MAIL_FROM,
  sendgridapikey: envVars.SENDGRID_API_KEY,
  servicebusconnectionstring: envVars.SERVICE_BUS_CONNECTION_STRING,
  authservicebusconnectionstring: envVars.AUTH_SERVICE_BUS_CONNECTION_STRING,
  chatservicebusconnectionstring: envVars.CHAT_SERVICE_BUS_CONNECTION_STRING,
  databaseurl: envVars.DATABASE_URL,
  directurl: envVars.DIRECT_URL,
};
