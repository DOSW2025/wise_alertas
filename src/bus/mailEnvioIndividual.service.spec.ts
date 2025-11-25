/**
 * Pruebas unitarias para el servicio MailEnvioIndividual
 */
jest.mock('../config/env', () => ({
  envs: {
    mailenvioindividualconnectionstring: 'FAKE_CONN',
  },
}));

jest.mock('../common/base-bus.service', () => {
  class BaseBusService {
    protected logger = {
      log: jest.fn(),
      error: jest.fn(),
    };

    constructor(..._args: any[]) {}

    // para pruebas no modificamos mensaje
    protected extractMessageContent(message: any) {
      return message;
    }
  }

  return { BaseBusService };
});

import { MailEnvioIndividual } from './mailEnvioIndividual.service';

describe('MailEnvioIndividual', () => {
  let service: MailEnvioIndividual;
  let alertaServiceMock: {
    enviarCorreoIndividual: jest.Mock;
    registrarCorreoEnviado: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();

    alertaServiceMock = {
      enviarCorreoIndividual: jest.fn(),
      registrarCorreoEnviado: jest.fn(),
    };

    // solo recibe alertaService y lo pasa a BaseBusService
    service = new MailEnvioIndividual(alertaServiceMock as any);
  });

  it('queueName debe ser "mail.envio.individual"', () => {
    expect(service.queueName).toBe('mail.envio.individual');
  });

  it('queueConnection debe tomar el valor desde envs.mailenvioindividualconnectionstring', () => {
    expect(service.queueConnection).toBe('FAKE_CONN');
  });

  it('serviceName debe ser "mail.envio.individual"', () => {
    expect(service.serviceName).toBe('mail.envio.individual');
  });

  // processMessage
  it('processMessage: si el contenido es inválido, debe registrar error y no llamar al alertaService', async () => {
    const loggerErrorSpy = jest.spyOn((service as any).logger, 'error');

    await (service as any).processMessage(null);

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      'Mensaje inválido: contenido no encontrado o malformado.',
    );
    expect(alertaServiceMock.enviarCorreoIndividual).not.toHaveBeenCalled();
    expect(alertaServiceMock.registrarCorreoEnviado).not.toHaveBeenCalled();
  });

  it('processMessage: si mandarCorreo es undefined, se pone true y se envía correo (sin guardar)', async () => {
    const message: any = {
      email: 'test@example.com',
      name: 'Test',
      template: 'TPL',
      resumen: 'Resumen',
      guardar: false,
      mandarCorreo: undefined,
    };

    await (service as any).processMessage(message);

    // mandarCorreo se normaliza a true
    expect(message.mandarCorreo).toBe(true);

    // envía correo
    expect(alertaServiceMock.enviarCorreoIndividual).toHaveBeenCalledTimes(1);
    expect(alertaServiceMock.enviarCorreoIndividual).toHaveBeenCalledWith(
      message,
    );

    expect(alertaServiceMock.registrarCorreoEnviado).not.toHaveBeenCalled();
  });

  it('processMessage: si mandarCorreo es true y guardar es true, se envía y se guarda', async () => {
    const message: any = {
      email: 'user@example.com',
      name: 'User',
      template: 'TPL2',
      resumen: 'Resumen 2',
      guardar: true,
      mandarCorreo: true,
    };

    const loggerLogSpy = jest.spyOn((service as any).logger, 'log');

    await (service as any).processMessage(message);

    expect(alertaServiceMock.enviarCorreoIndividual).toHaveBeenCalledTimes(1);
    expect(alertaServiceMock.enviarCorreoIndividual).toHaveBeenCalledWith(
      message,
    );

    // registra notificación
    expect(alertaServiceMock.registrarCorreoEnviado).toHaveBeenCalledTimes(1);
    expect(alertaServiceMock.registrarCorreoEnviado).toHaveBeenCalledWith(
      message,
    );

    // escribe log de guardado
    expect(loggerLogSpy).toHaveBeenCalledWith(
      `Correo enviado y guardado para: ${message.email}`,
    );
  });

  it('processMessage: si mandarCorreo es false pero guardar es true, NO envía correo pero SÍ guarda', async () => {
    const message: any = {
      email: 'no-send@example.com',
      name: 'NoSend',
      template: 'TPL3',
      resumen: 'Resumen 3',
      guardar: true,
      mandarCorreo: false,
    };

    const loggerLogSpy = jest.spyOn((service as any).logger, 'log');

    await (service as any).processMessage(message);

    // no se envía correo
    expect(alertaServiceMock.enviarCorreoIndividual).not.toHaveBeenCalled();

    // pero sí se registra notificación
    expect(alertaServiceMock.registrarCorreoEnviado).toHaveBeenCalledTimes(1);
    expect(alertaServiceMock.registrarCorreoEnviado).toHaveBeenCalledWith(
      message,
    );

    // escribe log
    expect(loggerLogSpy).toHaveBeenCalledWith(
      `Correo enviado y guardado para: ${message.email}`,
    );
  });
});
