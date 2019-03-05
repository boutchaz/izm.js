/* eslint-env node, mocha */
/* eslint-disable import/no-dynamic-require */
const request = require('supertest');
const { resolve } = require('path');
const mongoose = require('mongoose');
const {
  it,
  before,
  describe,
  afterEach,
} = require('mocha');

const express = require(resolve('./config/lib/express'));
const { prefix } = require(resolve('config'));

let app;
let agent;

/**
 * Sections tests
 */
describe('tests', () => {
  before(async () => {
    // Get application
    app = await express.init(mongoose.connection.db);
    agent = request.agent(app);
  });

  describe('Module is up', () => {
    it('The module should respond to the ok request', async () => {
      await agent.get(`${prefix}/{{name}}/ok`).expect(200);
    });
  });

  afterEach(async () => {});
});
