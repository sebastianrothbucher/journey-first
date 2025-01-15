
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
  let scenarioText = scenario.scenario?.trim();
  if (!scenarioText) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No scenario provided' }),
    };
  }
  scenarioText = scenarioText.substring(0, 400); // avoid denial of wallet

  const promptMessage = "Is the following scenario concrete (and substantial) or vague? Respond with \"concrete\" or \"vague\" plus a reason:\n" + scenarioText;
  // old const prompt = "\n\nHuman: " + promptMessage + "\n\nAssistant: "

  const command = new InvokeModelCommand({
    modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      // old prompt,
      messages: [{
        role: 'user',
        content: [{ type: 'text', text: promptMessage }],
      }],
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 300,
    }),
  });

  const response = await bedrockRuntime.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  const completion = responseBody.content[0].text; // old responseBody.completion;

  if (completion.trim().toLowerCase().startsWith('concrete')) {
    return {
      statusCode: 200,
      body: JSON.stringify({ concrete: true, details: completion }),
    };
  } else if (completion.trim().toLowerCase().startsWith('vague')) {
    return {
      statusCode: 200,
      body: JSON.stringify({ concrete: false, details: completion }),
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
