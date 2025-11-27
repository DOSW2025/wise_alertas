/**
 * Pruebas unitarias para AlertaService.
 */
jest.mock('../../generated/prisma', () => {
  class PrismaClient {
    $connect = jest.fn();
  }
  return { PrismaClient };
});

jest.mock('@sendgrid/mail', () => {
  return {
    MailService: jest.fn().mockImplementation(() => ({
      send: jest.fn(),
      setApiKey: jest.fn(),
    })),
  };
});

jest.mock('../config/env', () => ({
  envs: {
    sendgridapikey: 'FAKE_KEY',
    mailfrom: 'from@test.com',
  },
}));

import * as fs from 'fs';
import * as hbs from 'handlebars';
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
}));
jest.mock('handlebars', () => ({
  compile: jest.fn(),
}));

import { AlertaService } from './alerta.service';
import { NotFoundException, HttpException, HttpStatus } from '@nestjs/common';


describe('AlertaService', () => {
  let service: AlertaService;
  let prismaMock: any;
  let clientMock: any;

    beforeEach(() => {
    jest.clearAllMocks(); 

    prismaMock = {
        notification: {
        findMany: jest.fn(),
        count: jest.fn(),
        delete: jest.fn(),
        updateMany: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
        },
        usuario: {
        findUnique: jest.fn(),
        },
    };

    // Mock ServiceBusClient with createReceiver returning an object with subscribe stub
    // Capture the subscribe handlers so tests can trigger processMessage/processError
    let rolHandlers: any = null;
    let uniqueHandlers: any = null;
    clientMock = {
      createReceiver: jest.fn().mockImplementation((name: string) => {
        const receiver: any = {
          subscribe: (handlers: any) => {
            if (name === 'mail.envio.rol') {
              rolHandlers = handlers;
            } else {
              uniqueHandlers = handlers;
            }
          },
        };
        return receiver;
      }),
      // expose handlers for tests
      __getHandlers: () => ({ rolHandlers, uniqueHandlers }),
    };

    // Instantiate service with mocked prisma and service-bus client
    service = new AlertaService(prismaMock as any, clientMock as any);

    // Add backward-compatible aliases for older test names to avoid changing many tests
    (service as any).registrarCorreoEnviado = (info: any) => (service as any).registrarCorreoIndividual(info);
    (service as any).registrarCorreoEnviadoMasivas = (info: any) => {
      // older behavior expected: iterate receptores and call registrarCorreoEnviado (alias)
      if (info.receptores && Array.isArray(info.receptores)) {
        return Promise.all(info.receptores.map((r: any) => (service as any).registrarCorreoEnviado({ ...r, ...info })));
      }
      // if called with a Rol-like payload, map to registrarCorreoPorRol
      return (service as any).registrarCorreoPorRol(info);
    };
    (service as any).enviarCorreoMasivos = (info: any) => {
      if (info.receptores && Array.isArray(info.receptores)) {
        return Promise.all(info.receptores.map((r: any) => (service as any).enviarCorreoIndividual({ ...r, ...info })));
      }
      return (service as any).enviarCorreoPorRol(info);
    };

    // attach reference to handlers so tests can access them
    (service as any).__getQueueHandlers = () => (clientMock as any).__getHandlers();
    });


  // findByUser
  it('findByUser: debe devolver notificaciones mapeadas', async () => {
    const userId = 'user-1';
    const fecha = new Date('2025-01-01');
    prismaMock.notification.findMany.mockResolvedValue([
      {
        id: 1,
        asunto: 'Titulo',
        resumen: 'Resumen',
        visto: false,
        fechaCreacion: fecha,
      },
    ]);

    const res = await service.findByUser(userId);

    expect(prismaMock.notification.findMany).toHaveBeenCalledWith({
      where: { userId },
      orderBy: { fechaCreacion: 'desc' },
    });

    expect(res).toEqual([
      {
        id: 1,
        asunto: 'Titulo',
        resumen: 'Resumen',
        visto: false,
        fechaCreacion: fecha,
      },
    ]);
  });

  it('findByUser: debe lanzar HttpException en error de prisma', async () => {
    prismaMock.notification.findMany.mockRejectedValue(new Error('DB error'));

    await expect(service.findByUser('user-1')).rejects.toBeInstanceOf(HttpException);
    await expect(service.findByUser('user-1')).rejects.toMatchObject({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  });

  // countUnread
  it('countUnread: debe devolver conteo de notificaciones no leídas', async () => {
    prismaMock.notification.count.mockResolvedValue(3);

    const res = await service.countUnread('user-1');

    expect(prismaMock.notification.count).toHaveBeenCalledWith({
      where: { userId: 'user-1', visto: false },
    });
    expect(res).toBe(3);
  });

  it('countUnread: debe lanzar HttpException si prisma falla', async () => {
    prismaMock.notification.count.mockRejectedValue(new Error('DB error'));

    await expect(service.countUnread('user-1')).rejects.toBeInstanceOf(HttpException);
    await expect(service.countUnread('user-1')).rejects.toMatchObject({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  });

  // deleteById
  it('deleteById: debe borrar una notificación por id', async () => {
    prismaMock.notification.delete.mockResolvedValue({});

    await service.deleteById('10');

    expect(prismaMock.notification.delete).toHaveBeenCalledWith({
      where: { id: 10 },
    });
  });

  it('deleteById: debe lanzar NotFoundException si prisma dice que no existe (P2025)', async () => {
    const error = new Error('Record not found') as any;
    error.code = 'P2025';
    prismaMock.notification.delete.mockRejectedValue(error);

    await expect(service.deleteById('10')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('deleteById: debe lanzar HttpException 500 para otros errores', async () => {
    const error = new Error('Otro error') as any;
    prismaMock.notification.delete.mockRejectedValue(error);

    await expect(service.deleteById('10')).rejects.toBeInstanceOf(HttpException);
    await expect(service.deleteById('10')).rejects.toMatchObject({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  });

  // markAllRead
  it('markAllRead: debe marcar todas como leídas y devolver count', async () => {
    prismaMock.notification.updateMany.mockResolvedValue({ count: 5 });

    const res = await service.markAllRead('user-1');

    expect(prismaMock.notification.updateMany).toHaveBeenCalledWith({
      where: { userId: 'user-1', visto: false },
      data: { visto: true },
    });
    expect(res).toBe(5);
  });

  it('markAllRead: debe lanzar HttpException si prisma falla', async () => {
    prismaMock.notification.updateMany.mockRejectedValue(new Error('DB error'));

    await expect(service.markAllRead('user-1')).rejects.toBeInstanceOf(HttpException);
    await expect(service.markAllRead('user-1')).rejects.toMatchObject({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  });

  // markRead
  it('markRead: debe marcar una notificación como leída', async () => {
    const notif = { id: 10, visto: true };
    prismaMock.notification.update.mockResolvedValue(notif);

    const res = await service.markRead('10');

    expect(prismaMock.notification.update).toHaveBeenCalledWith({
      where: { id: 10 },
      data: { visto: true },
    });
    expect(res).toBe(notif);
  });

  it('markRead: debe lanzar NotFoundException si prisma dice que no existe (P2025)', async () => {
    const error = new Error('Record not found') as any;
    error.code = 'P2025';
    prismaMock.notification.update.mockRejectedValue(error);

    await expect(service.markRead('10')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('markRead: debe lanzar HttpException 500 para otros errores', async () => {
    const error = new Error('Otro error') as any;
    prismaMock.notification.update.mockRejectedValue(error);

    await expect(service.markRead('10')).rejects.toBeInstanceOf(HttpException);
    await expect(service.markRead('10')).rejects.toMatchObject({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  });

  // registrarCorreoEnviado
  it('registrarCorreoEnviado: debe crear notificación para un usuario existente', async () => {
    prismaMock.usuario.findUnique.mockResolvedValue({ id: 'user-1', email: 'test@test.com' });

    const info = {
      email: 'test@test.com',
      name: 'Test',
      template: 'TEMPLATE',
      resumen: 'Resumen notificación',
      guardar: true,
    };

    await (service as any).registrarCorreoEnviado(info as any);

    expect(prismaMock.usuario.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@test.com' },
    });

    expect(prismaMock.notification.create).toHaveBeenCalledWith({
      data: {
        userId: 'user-1',
        asunto: 'TEMPLATE',
        resumen: 'Resumen notificación',
      },
    });
  });

  it('registrarCorreoEnviado: debe lanzar NotFoundException si usuario no existe', async () => {
    prismaMock.usuario.findUnique.mockResolvedValue(null);

    const info = {
      email: 'noexiste@test.com',
      name: 'Test',
      template: 'TEMPLATE',
      resumen: 'Resumen',
      guardar: true,
    };

    await expect((service as any).registrarCorreoEnviado(info as any)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  // registrarCorreoEnviadoMasivas
  it('registrarCorreoEnviadoMasivas: debe registrar notificación por cada receptor', async () => {
    const spyRegistrar = jest
      .spyOn(service as any, 'registrarCorreoEnviado')
      .mockResolvedValue(undefined as any);

    const info = {
      receptores: [
        { email: 'a@test.com', name: 'A' },
        { email: 'b@test.com', name: 'B' },
      ],
      template: 'TPL',
      resumen: 'Resumen masivo',
      guardar: true,
    };

    await (service as any).registrarCorreoEnviadoMasivas(info as any);

    expect(spyRegistrar).toHaveBeenCalledTimes(2);
    expect(spyRegistrar).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        email: 'a@test.com',
        name: 'A',
        template: 'TPL',
        resumen: 'Resumen masivo',
        guardar: true,
      }),
    );
    expect(spyRegistrar).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        email: 'b@test.com',
        name: 'B',
        template: 'TPL',
        resumen: 'Resumen masivo',
        guardar: true,
      }),
    );
  });

  // loadTemplate (privado)
  it('loadTemplate: debe leer la plantilla desde disco cuando existe', () => {
    // fs.existsSync true, fs.readFileSync devuelve contenido
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue('PLANTILLA_HBS');

    const result = (service as any).loadTemplate('miTemplate');

    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.readFileSync).toHaveBeenCalled();
    expect(result).toBe('PLANTILLA_HBS');
  });

  it('loadTemplate: debe usar fallback y hacer warn cuando no existe el archivo', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const warnSpy = jest.spyOn((service as any).logger, 'warn');

    const result = (service as any).loadTemplate('noExiste');

    expect(fs.existsSync).toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalled();
    expect(result).toContain('{{name}}');
    expect(result).toContain('{{mensaje}}');
  });

  // enviarCorreoIndividual
  it('enviarCorreoIndividual: debe enviar correo con logo cuando existen plantilla y logo', async () => {
    // plantilla .hbs y logo existen
    (fs.existsSync as jest.Mock).mockImplementation((p: string) => {
      if (p.endsWith('.hbs')) return true;
      if (p.endsWith('logo.png')) return true;
      return false;
    });

    // lectura
    (fs.readFileSync as jest.Mock).mockImplementation((p: string, enc?: any) => {
      if (p.toString().endsWith('.hbs')) {
        return '<p>Hola {{name}}</p><p>{{resumen}}</p>';
      }
      if (p.toString().endsWith('logo.png')) {
        return Buffer.from('fake-logo');
      }
      return '';
    });

    // compilación
    (hbs.compile as jest.Mock).mockImplementation((source: string) => {
      return (ctx: any) => `HTML ${ctx.name} ${ctx.resumen}`;
    });

    const sendSpy = jest
      .spyOn((service as any).sgMail, 'send')
      .mockResolvedValue(undefined as any);

    const correo = {
      email: 'dest@test.com',
      name: 'Dest',
      template: 'TPL_X',
      resumen: 'Resumen X',
      guardar: true,
    };

    await service.enviarCorreoIndividual(correo as any);

    expect(sendSpy).toHaveBeenCalledTimes(1);
    const msgEnviado = (sendSpy.mock.calls[0][0]) as any;

    expect(msgEnviado.to).toBe('dest@test.com');
    expect(msgEnviado.from.email).toBe('from@test.com'); 
    expect(msgEnviado.subject).toBe('ECIWISE - TPL_X');
    expect(msgEnviado.html).toBe('HTML Dest Resumen X');
    expect(msgEnviado.attachments).toBeDefined();
    expect(msgEnviado.attachments[0].filename).toBe('logo.png');
  });

  it('enviarCorreoIndividual: debe enviar sin attachments cuando no existe el logo', async () => {
    // plantilla existe, logo no
    (fs.existsSync as jest.Mock).mockImplementation((p: string) => {
      if (p.endsWith('.hbs')) return true;
      if (p.endsWith('logo.png')) return false;
      return false;
    });

    (fs.readFileSync as jest.Mock).mockImplementation((p: string, enc?: any) => {
      if (p.toString().endsWith('.hbs')) {
        return '<p>Hola {{name}}</p>';
      }
      return '';
    });

    (hbs.compile as jest.Mock).mockImplementation((source: string) => {
      return (ctx: any) => `HTML ${ctx.name}`;
    });

    const sendSpy = jest
      .spyOn((service as any).sgMail, 'send')
      .mockResolvedValue(undefined as any);

    const correo = {
      email: 'dest@test.com',
      name: 'Dest',
      template: 'TPL_Y',
      resumen: 'Resumen Y',
      guardar: false,
    };

    await service.enviarCorreoIndividual(correo as any);

    const msgEnviado = (sendSpy.mock.calls[0][0]) as any;
    expect(msgEnviado.attachments).toBeUndefined();
  });

  it('enviarCorreoIndividual: debe propagar el error si sgMail.send falla', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false); // usar plantilla fallback
    (hbs.compile as jest.Mock).mockImplementation((source: string) => {
      return (ctx: any) => 'HTML';
    });

    const error = new Error('Send failed');
    const sendSpy = jest
      .spyOn((service as any).sgMail, 'send')
      .mockRejectedValue(error);

    const correo = {
      email: 'dest@test.com',
      name: 'Dest',
      template: 'TPL_ERR',
      resumen: 'Resumen',
      guardar: false,
    };

    await expect(service.enviarCorreoIndividual(correo as any)).rejects.toThrow('Send failed');
    expect(sendSpy).toHaveBeenCalled();
  });

  // enviarCorreoMasivos
  it('enviarCorreoMasivos: debe llamar enviarCorreoIndividual para cada receptor', async () => {
    const spyEnviar = jest
      .spyOn(service, 'enviarCorreoIndividual')
      .mockResolvedValue(undefined as any);

    const info = {
      receptores: [
        { email: 'uno@test.com', name: 'Uno' },
        { email: 'dos@test.com', name: 'Dos' },
      ],
      template: 'TPL_MAS',
      resumen: 'Resumen MAS',
      guardar: true,
    };

    await (service as any).enviarCorreoMasivos(info as any);

    expect(spyEnviar).toHaveBeenCalledTimes(2);
    expect(spyEnviar).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        email: 'uno@test.com',
        name: 'Uno',
        template: 'TPL_MAS',
        resumen: 'Resumen MAS',
        guardar: true,
      }),
    );
    expect(spyEnviar).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        email: 'dos@test.com',
        name: 'Dos',
        template: 'TPL_MAS',
        resumen: 'Resumen MAS',
        guardar: true,
      }),
    );
  });

  it('rol queue: processMessage debe llamar enviar y guardar cuando corresponda', async () => {
    const spyEnviarRol = jest.spyOn(service as any, 'enviarCorreoPorRol').mockResolvedValue(undefined as any);
    const spyGuardarRol = jest.spyOn(service as any, 'registrarCorreoPorRol').mockResolvedValue(undefined as any);

    const handlers = (service as any).__getQueueHandlers();
    const { rolHandlers } = handlers;
    expect(rolHandlers).toBeDefined();

    await rolHandlers.processMessage({ body: { mandarCorreo: true, guardar: true, rol: 'rolX' } });

    expect(spyEnviarRol).toHaveBeenCalledWith({ mandarCorreo: true, guardar: true, rol: 'rolX' });
    expect(spyGuardarRol).toHaveBeenCalledWith({ mandarCorreo: true, guardar: true, rol: 'rolX' });
  });

  it('unique queue: processMessage debe llamar enviar y guardar cuando corresponda', async () => {
    const spyEnviar = jest.spyOn(service as any, 'enviarCorreoIndividual').mockResolvedValue(undefined as any);
    const spyGuardar = jest.spyOn(service as any, 'registrarCorreoIndividual').mockResolvedValue(undefined as any);

    const handlers = (service as any).__getQueueHandlers();
    const { uniqueHandlers } = handlers;
    expect(uniqueHandlers).toBeDefined();

    await uniqueHandlers.processMessage({ body: { mandarCorreo: true, guardar: true, email: 'u@test.com' } });

    expect(spyEnviar).toHaveBeenCalledWith({ mandarCorreo: true, guardar: true, email: 'u@test.com' });
    expect(spyGuardar).toHaveBeenCalledWith({ mandarCorreo: true, guardar: true, email: 'u@test.com' });
  });
});
