import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { CheckConcreteStack } from './stack';

test('Snapshot Test', () => {
  const app = new App();
  const stack = new CheckConcreteStack(app, 'test');
  expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
});