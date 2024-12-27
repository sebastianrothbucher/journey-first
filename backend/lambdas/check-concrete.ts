
// AWS lambda handler taking a scenario and calling bedrock with it to determine whether the scenario is concrete or vague.
import { APIGatewayProxyEvent } from 'aws-lambda';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { BedrockRuntimeClientConfig } from '@aws-sdk/client-bedrock-runtime/dist-types/BedrockRuntimeClient';

const bedrockConfig: BedrockRuntimeClientConfig = {
  region: 'eu-central-1',
};
const bedrockRuntime = new BedrockRuntimeClient(bedrockConfig);

export const handler = async (event: APIGatewayProxyEvent) => {
  const scenario = JSON.parse(event.body!);
  const prompt = "\n\nHuman: Is the following scenario concrete (and substantial) or vague? Respond with \"concrete\" or \"vague\" plus a reason:\n" + scenario.scenario + "\n\nAssistant: "

  const command = new InvokeModelCommand({
    modelId: 'anthropic.claude-v2',
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      prompt,
      max_tokens_to_sample: 300,
    }),
  });

  const response = await bedrockRuntime.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  const completion = responseBody.completion.trim().toLowerCase();

  if (completion.startsWith('concrete')) {
    return {
      statusCode: 200,
      body: JSON.stringify({ concrete: true, details: responseBody.completion }),
    };
  } else if (completion.startsWith('vague')) {
    return {
      statusCode: 200,
      body: JSON.stringify({ concrete: false, details: responseBody.completion }),
    };
  } else {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unexpected response from Bedrock' }),
    };
  }
};

/*(async () => {
  const res = await handler({
    body: JSON.stringify({
      scenario: 'Peter buys a fishing rod', //'Some guy does something',
    }),
  } as any);
  console.log(res);
})();*/
