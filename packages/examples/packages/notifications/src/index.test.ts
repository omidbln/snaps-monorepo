import { expect } from '@jest/globals';
import { installSnap } from '@metamask/snaps-jest';
import { NotificationType } from '@metamask/snaps-sdk';

describe('onRpcRequest', () => {
  it('throws an error if the requested method does not exist', async () => {
    const { request, close } = await installSnap();

    const response = await request({
      method: 'foo',
    });

    expect(response).toRespondWithError({
      code: -32601,
      message: 'The method does not exist / is not available.',
      stack: expect.any(String),
      data: {
        method: 'foo',
        cause: null,
      },
    });

    await close();
  });

  describe('inApp', () => {
    it('sends an in-app notification', async () => {
      const { request, close } = await installSnap();

      const response = await request({
        method: 'inApp',
        origin: 'Jest',
      });

      expect(response).toRespondWith(null);
      expect(response).toSendNotification(
        'Hello from within MetaMask!',
        NotificationType.InApp,
      );

      await close();
    });
  });

  describe('native', () => {
    it('sends a native notification', async () => {
      const { request, close } = await installSnap();

      const response = await request({
        method: 'native',
        origin: 'Jest',
      });

      expect(response).toRespondWith(null);
      expect(response).toSendNotification(
        'Hello, Jest, from the browser!',
        NotificationType.Native,
      );

      await close();
    });
  });
});
