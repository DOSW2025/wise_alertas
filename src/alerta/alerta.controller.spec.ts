/**
 * Pruebas para verificar el comportamiento del controlador de alertas.
 */

jest.mock('../config/env', () => ({
  envs: {
    port: 3000,
    mailfrom: 'from@test.com',
    sendgridapikey: 'FAKE_KEY',
    mailenvioindividualconnectionstring: 'FAKE_CONN',
    mailenviorolconnectionstring: 'FAKE_CONN',
    mailenviomasivoconnectionstring: 'FAKE_CONN',
  },
}));

import { AlertaController } from './alerta.controller';
import { AlertaService } from './alerta.service';

describe('AlertaController', () => {
  let controller: AlertaController;
  let service: jest.Mocked<AlertaService>;

  beforeEach(() => {
    service = {
      countUnread: jest.fn(),
      markAllRead: jest.fn(),
      markRead: jest.fn(),
      deleteById: jest.fn(),
      findByUser: jest.fn(),
    } as any;

    controller = new AlertaController(service);
  });

  // unreadCount
  it('unreadCount: debe devolver Count con número de no leídas', async () => {
    service.countUnread.mockResolvedValue(5);

    const result = await controller.unreadCount('123');

    expect(service.countUnread).toHaveBeenCalledWith('123');
    expect(result).toEqual({ Count: 5 });
  });

  // markAllRead
  it('markAllRead: debe devolver mensaje y cantidad', async () => {
    service.markAllRead.mockResolvedValue(7);

    const result = await controller.markAllRead('456');

    expect(service.markAllRead).toHaveBeenCalledWith('456');
    expect(result).toEqual({
      mensaje: 'Notificaciones marcadas como leídas',
      cantidad: 7,
    });
  });

  // markRead
  it('markRead: debe llamar servicio y retornar mensaje', async () => {
    service.markRead.mockResolvedValue(undefined);

    const result = await controller.markRead('10');

    expect(service.markRead).toHaveBeenCalledWith('10');
    expect(result).toEqual({
      mensaje: 'Notificación marcada como leída',
      id: '10',
    });
  });

  // delete
  it('delete: debe llamar deleteById y retornar mensaje', async () => {
    service.deleteById.mockResolvedValue(undefined);

    const result = await controller.delete('88');

    expect(service.deleteById).toHaveBeenCalledWith('88');
    expect(result).toEqual({
      mensaje: 'Notificación eliminada',
      id: '88',
    });
  });

  // getByUser
  it('getByUser: debe devolver lista de notificaciones', async () => {
    const notifs = [
      { id: 1, asunto: 'A', resumen: 'R', visto: false, fechaCreacion: new Date() },
    ];

    service.findByUser.mockResolvedValue(notifs);

    const result = await controller.getByUser('999');

    expect(service.findByUser).toHaveBeenCalledWith('999');
    expect(result).toBe(notifs); 
  });
});
