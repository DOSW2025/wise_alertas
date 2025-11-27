import { Test, TestingModule } from '@nestjs/testing';
import { MailEnvioRol } from './mailEnvioRol.service';
import { AlertaService } from '../alerta/alerta.service';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Pruebas unitarias para el servicio MailEnvioRol
 */
jest.mock('../config/env', () => ({
  envs: {
    mailenviorolconnectionstring: 'Endpoint=sb://fake-connection-string/',
  },
}));

describe('MailEnvioRol', () => {
  let service: MailEnvioRol;
  let alertaServiceMock: {
    enviarCorreoIndividual: jest.Mock;
    registrarCorreoEnviado: jest.Mock;
  };
  let prismaMock: {
    usuario: {
      findMany: jest.Mock;
    };
  };

  beforeEach(async () => {
    alertaServiceMock = {
      enviarCorreoIndividual: jest.fn(),
      registrarCorreoEnviado: jest.fn(),
    };

    prismaMock = {
      usuario: {
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailEnvioRol,
        { provide: AlertaService, useValue: alertaServiceMock },
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<MailEnvioRol>(MailEnvioRol);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debe devolver el queueName correcto', () => {
    expect(service.queueName).toBe('mail.envio.rol');
  });

  it('debe devolver el serviceName correcto', () => {
    expect(service.serviceName).toBe('Notification Service Bus');
  });

  it('debe devolver el queueConnection correcto desde envs', () => {
    expect(service.queueConnection).toBe('Endpoint=sb://fake-connection-string/');
  });

  it('debe buscar usuarios por rol y enviar + guardar correos cuando mandarCorreo = false y guardar = true', async () => {
    const messageContent = {
      rol: 'ADMIN',
      template: 'plantilla-test',
      resumen: 'resumen-test',
      guardar: true,
      mandarCorreo: false,
    };

    // Mock de extractMessageContent (viene de BaseBusService)
    jest
      .spyOn<any, any>(service as any, 'extractMessageContent')
      .mockReturnValue(messageContent);

    const usuarios = [
      {
        id: 1,
        email: 'user1@test.com',
        nombre: 'Juan',
        apellido: 'Pérez',
      },
      {
        id: 2,
        email: 'user2@test.com',
        nombre: 'Ana',
        apellido: 'López',
      },
    ];

    prismaMock.usuario.findMany.mockResolvedValue(usuarios);

    await (service as any).processMessage({ dummy: true });

    expect(prismaMock.usuario.findMany).toHaveBeenCalledWith({
      where: {
        rol: { nombre: 'ADMIN' },
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
      },
    });

    expect(alertaServiceMock.enviarCorreoIndividual).toHaveBeenCalledTimes(2);
    expect(alertaServiceMock.enviarCorreoIndividual).toHaveBeenNthCalledWith(1, {
      email: 'user1@test.com',
      name: 'Juan Pérez',
      template: 'plantilla-test',
      resumen: 'resumen-test',
      guardar: true,
    });
    expect(alertaServiceMock.enviarCorreoIndividual).toHaveBeenNthCalledWith(2, {
      email: 'user2@test.com',
      name: 'Ana López',
      template: 'plantilla-test',
      resumen: 'resumen-test',
      guardar: true,
    });

    expect(alertaServiceMock.registrarCorreoEnviado).toHaveBeenCalledTimes(2);
  });

  it('no debe enviar correos cuando mandarCorreo = true, pero sí guardar si guardar = true', async () => {
    const messageContent = {
      rol: 'USER',
      template: 'plantilla-2',
      resumen: 'otro resumen',
      guardar: true,
      mandarCorreo: true,
    };

    jest
      .spyOn<any, any>(service as any, 'extractMessageContent')
      .mockReturnValue(messageContent);

    const usuarios = [
      {
        id: 3,
        email: 'user3@test.com',
        nombre: 'Carlos',
        apellido: 'Gómez',
      },
    ];

    prismaMock.usuario.findMany.mockResolvedValue(usuarios);

    await (service as any).processMessage({});

    expect(alertaServiceMock.enviarCorreoIndividual).not.toHaveBeenCalled();
    expect(alertaServiceMock.registrarCorreoEnviado).toHaveBeenCalledTimes(1);
    expect(alertaServiceMock.registrarCorreoEnviado).toHaveBeenCalledWith({
      email: 'user3@test.com',
      name: 'Carlos Gómez',
      template: 'plantilla-2',
      resumen: 'otro resumen',
      guardar: true,
    });
  });

  it('no debe guardar cuando guardar = false', async () => {
    const messageContent = {
      rol: 'USER',
      template: 'plantilla-3',
      resumen: 'resumen-3',
      guardar: false,
      mandarCorreo: false,
    };

    jest
      .spyOn<any, any>(service as any, 'extractMessageContent')
      .mockReturnValue(messageContent);

    const usuarios = [
      {
        id: 4,
        email: 'user4@test.com',
        nombre: 'Lucía',
        apellido: 'Ramírez',
      },
    ];

    prismaMock.usuario.findMany.mockResolvedValue(usuarios);

    await (service as any).processMessage({});

    expect(alertaServiceMock.enviarCorreoIndividual).toHaveBeenCalledTimes(1);
    expect(alertaServiceMock.enviarCorreoIndividual).toHaveBeenCalledWith({
      email: 'user4@test.com',
      name: 'Lucía Ramírez',
      template: 'plantilla-3',
      resumen: 'resumen-3',
      guardar: false,
    });

    expect(alertaServiceMock.registrarCorreoEnviado).not.toHaveBeenCalled();
  });
});
