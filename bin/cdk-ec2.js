#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { CDKEC2Stack } = require('../lib/cdk-ec2-stack');

const app = new cdk.App();
new CDKEC2Stack(app, 'CDK-EC2-Stack');
