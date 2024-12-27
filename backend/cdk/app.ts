import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CheckConcreteStack } from './stack';

const app = new cdk.App();
new CheckConcreteStack(app, 'CheckConcreteStack', {
  env: {
    region: 'eu-central-1',
  },
});

app.synth();
