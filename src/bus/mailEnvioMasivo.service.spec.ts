/**
 * Pruebas unitarias para el servicio MailEnvioMasivo
 */
jest.mock('../config/env', () => ({
  envs: {
    mailenviomasivoconnectionstring: 'FAKE_MASIVO_CONN',
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

import { MailEnvioMasivo } from './mailEnvioMasivo.service';

describe('MailEnvioMasivo', () => {
  let service: MailEnvioMasivo;
  let alertaServiceMock: {
    enviarCorreoMasivos: jest.Mock;
    registrarCorreoEnviadoMasivas: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();

    alertaServiceMock = {
      enviarCorreoMasivos: jest.fn(),
      registrarCorreoEnviadoMasivas: jest.fn(),
    };

    service = new MailEnvioMasivo(alertaServiceMock as any);
  });

  // Getters 
  it('queueName debe ser "mail.envio.masivo"', () => {
    expect(service.queueName).toBe('mail.envio.masivo');
  });

  it('queueConnection debe tomar el valor desde envs.mailenviomasivoconnectionstring', () => {
    expect(service.queueConnection).toBe('FAKE_MASIVO_CONN');
  });

  it('serviceName debe ser "Chat Service Bus"', () => {
    expect(service.serviceName).toBe('Chat Service Bus');
  });

  // processMessage
  it('processMessage: si el contenido es inválido, debe registrar error y no llamar a alertaService', async () => {
    const loggerErrorSpy = jest.spyOn((service as any).logger, 'error');

    await (service as any).processMessage(null);

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      'Mensaje inválido: contenido no encontrado o malformado.',
    );
    expect(alertaServiceMock.enviarCorreoMasivos).not.toHaveBeenCalled();
    expect(alertaServiceMock.registrarCorreoEnviadoMasivas).not.toHaveBeenCalled();
  });

  it('processMessage: si mandarCorreo es false y guardar es false, SOLO envía correos masivos', async () => {
    const message: any = {
      template: 'TPL1',
      resumen: 'Resumen 1',
      receptores: [],
      mandarCorreo: false,
      guardar: false,
    };

    await (service as any).processMessage(message);

    // debe enviar correos
    expect(alertaServiceMock.enviarCorreoMasivos).toHaveBeenCalledTimes(1);
    expect(alertaServiceMock.enviarCorreoMasivos).toHaveBeenCalledWith(message);

    // no debe registrar notificaciones
    expect(alertaServiceMock.registrarCorreoEnviadoMasivas).not.toHaveBeenCalled();
  });

  it('processMessage: si mandarCorreo es false y guardar es true, envía y registra', async () => {
    const message: any = {
      template: 'TPL2',
      resumen: 'Resumen 2',
      receptores: [],
      mandarCorreo: false,
      guardar: true,
    };

    const loggerLogSpy = jest.spyOn((service as any).logger, 'log');

    await (service as any).processMessage(message);

    // Envía correos
    expect(alertaServiceMock.enviarCorreoMasivos).toHaveBeenCalledTimes(1);
    expect(alertaServiceMock.enviarCorreoMasivos).toHaveBeenCalledWith(message);

    // Registra notificaciones
    expect(alertaServiceMock.registrarCorreoEnviadoMasivas).toHaveBeenCalledTimes(1);
    expect(alertaServiceMock.registrarCorreoEnviadoMasivas).toHaveBeenCalledWith(message);

    // Loguea
    expect(loggerLogSpy).toHaveBeenCalledWith(
      `Correo masivo enviado y guardado para plantilla: ${message.template}`,
    );
  });

  it('processMessage: si mandarCorreo es true y guardar es true, NO envía pero SÍ registra', async () => {
    const message: any = {
      template: 'TPL3',
      resumen: 'Resumen 3',
      receptores: [],
      mandarCorreo: true,
      guardar: true,
    };

    const loggerLogSpy = jest.spyOn((service as any).logger, 'log');

    await (service as any).processMessage(message);

    // NO envía correos
    expect(alertaServiceMock.enviarCorreoMasivos).not.toHaveBeenCalled();

    // registra notificaciones
    expect(alertaServiceMock.registrarCorreoEnviadoMasivas).toHaveBeenCalledTimes(1);
    expect(alertaServiceMock.registrarCorreoEnviadoMasivas).toHaveBeenCalledWith(message);

    // Loguea
    expect(loggerLogSpy).toHaveBeenCalledWith(
      `Correo masivo enviado y guardado para plantilla: ${message.template}`,
    );
  });

  it('processMessage: si mandarCorreo es true y guardar es false, NO envía ni guarda', async () => {
    const message: any = {
      template: 'TPL4',
      resumen: 'Resumen 4',
      receptores: [],
      mandarCorreo: true,
      guardar: false,
    };

    await (service as any).processMessage(message);

    expect(alertaServiceMock.enviarCorreoMasivos).not.toHaveBeenCalled();
    expect(alertaServiceMock.registrarCorreoEnviadoMasivas).not.toHaveBeenCalled();
  });
});
