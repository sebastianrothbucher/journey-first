import { mockClient } from 'aws-sdk-client-mock';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { handler } from './check-concrete';

const bedrockMock = mockClient(BedrockRuntimeClient);
bedrockMock.on(InvokeModelCommand).resolves({
  body: (new TextEncoder()).encode(JSON.stringify({
    completion: 'vague, b/c it is BS',
    stop_reason: 'stop',
    stop: '!',
  })),
} as any);

describe('bedrock', () => {
  it('should call bedrock and handle result', async () => {
    const response = await handler({body: JSON.stringify({scenario: 'what is the meaning of life?'})} as any);
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatch(/"concrete":\s*false.*"details":\s*"vague, b\/c it is BS/);
  });
});
