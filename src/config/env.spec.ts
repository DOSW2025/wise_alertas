/**
 * Pruebas unitarias para la configuración de entorno
 */
import * as path from 'path';

describe('config/env.ts', () => {
  
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); 
    // Start each test with an empty env to avoid interference from the running system
    process.env = {} as NodeJS.ProcessEnv;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV; 
  });

  const loadEnv = () => require('./env'); 

  it('debería cargar correctamente cuando TODAS las variables están definidas', () => {
    process.env.PORT = '3000';
    process.env.MAIL_FROM = 'test@example.com';
    process.env.SENDGRID_API_KEY = 'SG_KEY';
    process.env.SERVICE_BUS_CONNECTION_STRING_UN_MAIL = 'conn1';
    process.env.SERVICE_BUS_CONNECTION_STRING_ROL = 'conn2';
    process.env.SERVICE_BUS_CONNECTION_STRING_MASIVO = 'conn3';

    const { envs } = loadEnv();
    // debug
    // eslint-disable-next-line no-console
    console.log('DEBUG envs export:', envs);

    expect(envs.port).toBe(3000);
    expect(envs.mailfrom).toBe('test@example.com');
    expect(envs.sendgridapikey).toBe('SG_KEY');
    expect(envs.mailenvioindividualconnectionstring).toBe('conn1');
    expect(envs.mailenviorolconnectionstring).toBe('conn2');
    expect(envs.mailenviomasivoconnectionstring).toBe('conn3');
  });

  it('debería lanzar error si falta PORT', () => {
    delete process.env.PORT;
    process.env.MAIL_FROM = 'test@example.com';
    process.env.SENDGRID_API_KEY = 'SG_KEY';
    process.env.SERVICE_BUS_CONNECTION_STRING_UN_MAIL = 'conn1';
    process.env.SERVICE_BUS_CONNECTION_STRING_ROL = 'conn2';
    process.env.SERVICE_BUS_CONNECTION_STRING_MASIVO = 'conn3';

    // debug: print PORT presence
    // eslint-disable-next-line no-console
    console.log('DEBUG env before loadEnv PORT=', process.env.PORT);
    expect(() => loadEnv()).toThrow(/Config validation error/);
  });

  it('debería lanzar error si MAIL_FROM no es un email', () => {
    process.env.PORT = '3000';
    process.env.MAIL_FROM = 'NO-EMAIL';
    process.env.SENDGRID_API_KEY = 'SG_KEY';
    process.env.SERVICE_BUS_CONNECTION_STRING_UN_MAIL = 'conn1';
    process.env.SERVICE_BUS_CONNECTION_STRING_ROL = 'conn2';
    process.env.SERVICE_BUS_CONNECTION_STRING_MASIVO = 'conn3';

    expect(() => loadEnv()).toThrow(/Config validation error/);
  });

});
