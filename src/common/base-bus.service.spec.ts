/**
 * Pruebas unitarias para el servicio BaseBusService
 */
jest.mock('../config/env', () => ({
  envs: {
    port: 3000,
    mailfrom: 'from@test.com',
    sendgridapikey: 'FAKE_KEY',
    mailenvioindividualconnectionstring: 'FAKE_CONN_INDIVIDUAL',
    mailenviorolconnectionstring: 'FAKE_CONN_ROL',
    mailenviomasivoconnectionstring: 'FAKE_CONN_MASIVO',
  },
}));

import { BaseBusService } from './base-bus.service';

const completeMessageMock = jest.fn();
const abandonMessageMock = jest.fn();
const deadLetterMock = jest.fn();

const receiverMock = {
  completeMessage: completeMessageMock,
  abandonMessage: abandonMessageMock,
  deadLetterMessage: deadLetterMock,
};

const loggerMock = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
};

// clase falsa que extiende BaseBusService
class TestBus extends BaseBusService {
  get serviceName() { return 'TestBus'; }
  get queueName() { return 'test.queue'; }
  get queueConnection() { return 'fake-conn'; }

  // processMessage controlado para forzar exito o error
  processMessageImpl = jest.fn();

  protected async processMessage(msg: any): Promise<void> {
    return this.processMessageImpl(msg);
  }
}

describe('BaseBusService', () => {
  let service: TestBus;
  let message: any;

  beforeEach(() => {
    jest.clearAllMocks();

    service = new TestBus({} as any); // ignora alertaService
    (service as any).receiver = receiverMock;
    (service as any).logger = loggerMock;

    message = {
      messageId: '123',
      body: { x: 1 },
      deliveryCount: 0,
    };
  });

  // extractMessageContent
  it('extractMessageContent: devuelve body directo cuando no hay anidación', () => {
    const res = (service as any).extractMessageContent(message);
    expect(res).toEqual({ x: 1 });
    expect(loggerMock.debug).toHaveBeenCalled();
  });

  it('extractMessageContent: detecta estructura anidada', () => {
    const msg2 = { body: { body: { y: 2 } } };
    const res = (service as any).extractMessageContent(msg2);

    expect(res).toEqual({ y: 2 });
    expect(loggerMock.debug).toHaveBeenCalled();
  });

  // safeStringify
  it('safeStringify: serializa correctamente un objeto normal', () => {
    const obj = { a: 1 };
    const res = (service as any).safeStringify(obj);
    expect(res).toBe(JSON.stringify(obj, null, 2));
  });

  it('safeStringify: maneja referencias circulares', () => {
    const obj: any = { a: 1 };
    obj.self = obj;

    const res = (service as any).safeStringify(obj);

    expect(res).toContain('"self": "[Circular]"');
  });

  // handleMessage success
  it('handleMessage: si processMessage NO lanza error → completeMessage', async () => {
    service.processMessageImpl.mockResolvedValue(undefined);

    await (service as any).handleMessage(message);

    expect(completeMessageMock).toHaveBeenCalledWith(message);
    expect(abandonMessageMock).not.toHaveBeenCalled();
    expect(deadLetterMock).not.toHaveBeenCalled();
  });

  // handleMessage error con reintento (< maxDelivery)
  it('handleMessage: si processMessage lanza error y deliveryCount < max → abandonMessage', async () => {
    service.processMessageImpl.mockRejectedValue(new Error('ERR'));
    message.deliveryCount = 1;

    await (service as any).handleMessage(message);

    expect(abandonMessageMock).toHaveBeenCalledWith(message);
    expect(deadLetterMock).not.toHaveBeenCalled();
  });

  // handleMessage error con deadLetter (>= maxDelivery)
  it('handleMessage: si deliveryCount >= max → deadLetterMessage', async () => {
    service.processMessageImpl.mockRejectedValue(new Error('ERR'));
    message.deliveryCount = 3;

    await (service as any).handleMessage(message);

    expect(deadLetterMock).toHaveBeenCalledWith(
      message,
      expect.objectContaining({
        deadLetterReason: 'MaxDeliveryExceeded',
      }),
    );
  });

  // handleMessage error y deadLetter también falla
  it('handleMessage: si deadLetter falla → abandonMessage', async () => {
    service.processMessageImpl.mockRejectedValue(new Error('ERR'));
    deadLetterMock.mockRejectedValue(new Error('DLQ FAIL'));
    message.deliveryCount = 3;

    await (service as any).handleMessage(message);

    expect(abandonMessageMock).toHaveBeenCalledWith(message);
  });
});
