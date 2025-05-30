
// AWS lambda handler taking a scenario and calling bedrock with it to determine whether the scenario is concrete or vague.
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { BedrockRuntimeClientConfig } from '@aws-sdk/client-bedrock-runtime/dist-types/BedrockRuntimeClient';

const bedrockConfig: BedrockRuntimeClientConfig = {
  region: 'eu-central-1',
};
const bedrockRuntime = new BedrockRuntimeClient(bedrockConfig);

export const CORS_ALLOWED_HOSTS = ['http://localhost:8080', 'https://sebastianrothbucher.github.io'];
export const CORS_ALLOWED_METHODS = ['POST', 'OPTIONS'];
export const CORS_ALLOWED_HEADERS = ['Content-Type', 'Authorization', 'X-API-Key'];

export const handler = async (event: APIGatewayProxyEvent) => {
  const origin = event.headers['Origin'] || event.headers['origin'] || '-'; // Referrer is cased, origin is not (per se)
  const corsHeaders = CORS_ALLOWED_HOSTS.includes(origin) ? {
    'Access-Control-Allow-Origin': origin!,
    'Access-Control-Allow-Methods': CORS_ALLOWED_METHODS.join(','),
    'Access-Control-Allow-Headers': CORS_ALLOWED_HEADERS.join(','),
  } : {};

  const scenario = JSON.parse(event.body!);
  let scenarioText = scenario.scenario?.trim();
  let relaxed = !!scenario.relaxed;
  if (!scenarioText) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'No scenario provided' }),
    } as APIGatewayProxyResult;
  }
  scenarioText = scenarioText.substring(0, 500); // avoid denial of wallet

  const promptMessage = relaxed ? 
    ("Check if the following statement contains 'any' or 'some' or 'whatever' or 'depends' or other indications of dodging an answer or being vague. If that's the case, answer \"vague\" - otherwise answer \"concrete\". Respond with \"concrete\" or \"vague\" plus a reason:\n" + scenarioText) :
    ("Is the following scenario concrete (and substantial) or vague? Respond with \"concrete\" or \"vague\" plus a reason:\n" + scenarioText);
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
      headers: corsHeaders,
      body: JSON.stringify({ concrete: true, details: completion }),
    } as APIGatewayProxyResult;
  } else if (completion.trim().toLowerCase().startsWith('vague')) {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ concrete: false, details: completion }),
    } as APIGatewayProxyResult;
  } else {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Unexpected response from Bedrock', details: completion }),
    } as APIGatewayProxyResult;
  }
};

/*(async () => {
  const res = await handler({
    scenario: 'Peter buys a fishing rod', //'Some guy does something',
  });
  console.log(res);
})();*/
