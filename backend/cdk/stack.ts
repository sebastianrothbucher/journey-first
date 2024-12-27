import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaRestApi, UsagePlan } from 'aws-cdk-lib/aws-apigateway'; 
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';

export class CheckConcreteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const checkConcreteFunction = new NodejsFunction(this, 'CheckConcreteFunction', {
      runtime: cdk.aws_lambda.Runtime.NODEJS_LATEST,
      entry: __dirname + '/../lambdas/check-concrete.ts',
      handler: 'index.handler',
      bundling: {
        bundleAwsSDK: false,
        externalModules: [
          "@aws-sdk/*",
        ],
      },
    });

    const httpApi = new LambdaRestApi(this, 'JourneyFirstAPI', {
      handler: checkConcreteFunction,
      proxy: false,
    });
    const checkConcreteIntegration = httpApi.root.addResource('check-concrete');
    checkConcreteIntegration.addMethod('POST', undefined, {
      apiKeyRequired: true,
    });
    checkConcreteIntegration.addCorsPreflight({
      allowOrigins: ['*'],
      allowMethods: ['POST', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization'],
    });

    const usagePlan = new UsagePlan(this, 'UsagePlan', {
      name: 'JourneyFirstUsagePlan',
      quota: {
        limit: 20,
        period: cdk.aws_apigateway.Period.WEEK,
      },
    });
    usagePlan.addApiStage({
      stage: httpApi.deploymentStage,
    });
    const key = httpApi.addApiKey("Key");
    usagePlan.addApiKey(key);

    checkConcreteFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['bedrock:InvokeModel'],
        resources: ['*'],
      })
    );
  }
}