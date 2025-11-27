/**
 * Pruebas unitarias para la configuración de entorno
 */
// src/config/env.spec.ts
import * as path from 'path';

describe('config/env.ts', () => {
  const ORIGINAL_ENV = process.env;

  const loadEnvModule = () => require(path.join(__dirname, './env'));

  beforeEach(() => {
    jest.resetModules();
    process.env = {} as NodeJS.ProcessEnv;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('debería cargar correctamente cuando TODAS las variables requeridas están definidas', () => {
    process.env.PORT = '3000';
    process.env.MAIL_FROM = 'test@example.com';
    process.env.SENDGRID_API_KEY = 'SG_KEY';

    const { envs } = loadEnvModule();

    expect(envs.port).toBe(3000);
    expect(envs.mailfrom).toBe('test@example.com');
    expect(envs.sendgridapikey).toBe('SG_KEY');
    expect(envs.serviceBusConnectionString).toBeUndefined();
  });

  it('debería exponer SERVICE_BUS_CONNECTION_STRING aunque no esté en el esquema (unknown)', () => {
    process.env.PORT = '4000';
    process.env.MAIL_FROM = 'otro@example.com';
    process.env.SENDGRID_API_KEY = 'OTRA_KEY';
    process.env.SERVICE_BUS_CONNECTION_STRING = 'Endpoint=sb://fake-conn/';

    const { envs } = loadEnvModule();

    expect(envs.port).toBe(4000);
    expect(envs.mailfrom).toBe('otro@example.com');
    expect(envs.sendgridapikey).toBe('OTRA_KEY');
    expect(envs.serviceBusConnectionString).toBe('Endpoint=sb://fake-conn/');
  });


  it('debería lanzar error cuando MAIL_FROM no es un email válido', () => {
    process.env.PORT = '3000';
    process.env.MAIL_FROM = 'no-es-un-email';
    process.env.SENDGRID_API_KEY = 'SG_KEY';

    let error: any;
    try {
      loadEnvModule();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain('Config validation error');
    expect(error.message).toContain('MAIL_FROM');
    expect(error.message).toContain('valid email');
  });
});
