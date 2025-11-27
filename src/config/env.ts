import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  MAIL_FROM: string;
  SENDGRID_API_KEY: string;
  SERVICE_BUS_CONNECTION_STRING_UN_MAIL: string;
  SERVICE_BUS_CONNECTION_STRING_ROL: string;
  SERVICE_BUS_CONNECTION_STRING: string;
}
const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    MAIL_FROM: joi.string().email().required(),
    SENDGRID_API_KEY: joi.string().required(),
    SERVICE_BUS_CONNECTION_STRING_UN_MAIL: joi.string().required(),
    SERVICE_BUS_CONNECTION_STRING_ROL: joi.string().required(),
    SERVICE_BUS_CONNECTION_STRING: joi.string().required(),
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
  mailenvioindividualconnectionstring: envVars.SERVICE_BUS_CONNECTION_STRING_UN_MAIL,
  mailenviorolconnectionstring: envVars.SERVICE_BUS_CONNECTION_STRING_ROL,
  serviceBusConnectionString: envVars.SERVICE_BUS_CONNECTION_STRING,
};
