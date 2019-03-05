/* eslint-env node, mocha */
/* eslint-disable import/no-dynamic-require */
const request = require('supertest');
const { expect } = require('chai');
const {
  it,
  before,
  describe,
  afterEach,
} = require('mocha');


const { resolve } = require('path');
const mongoose = require('mongoose');
const debug = require('debug')('tests:contracts:projects');

const { prefix } = require(resolve('config'));

const User = mongoose.model('User');
const Role = mongoose.model('Role');
const IAM = mongoose.model('IAM');

const express = require(resolve('./config/lib/express'));
const roleCache = {};

/**
 * Globals
 */
let app;
const credentials = {
  username: 'username',
  password: 'M3@n.jsI$Aw3$0m3',
};
let agent;

async function createUser(iams = ['users:auth:signin'], name = 'Role-tests') {
  const list = await IAM.find({
    iam: {
      $in: iams,
    },
  });
  if (roleCache[name]) {
    await roleCache[name].remove();
  }
  try {
    roleCache[name] = await new Role({
      name,
      iams: list,
    }).save();
  } catch (e) {
    debug(e);
  }

  const user = await new User({
    name: {
      first: 'Full',
      last: 'Name',
    },
    email: `${credentials.username}@example.com`,
    username: credentials.username,
    password: credentials.password,
    provider: 'local',
    roles: [name],
    validations: [{
      type: 'email',
      validated: true,
    }],
  }).save();

  return user;
}


/**
 * Sections tests
 */
describe('Role tests', () => {
  before(async () => {
    // Get application
    app = await express.init(mongoose.connection.db);
    agent = request.agent(app);
  });
  describe('Create new role', () => {
    it('I am not allowed to create a role if I am not authenticated (error 401)', async () => {
      await agent.post(`${prefix}/roles`).send({}).expect(401);
    });
    it('I am not allowed to create role if I don\'t have the IAM "administration:roles:create"', async () => {
      await createUser([
        'users:auth:signin',
      ]);
      await agent.post('/api/v1/auth/signin').send(credentials).expect(200);
      const data = {
        name: 'new rol',
        title: 'Mon rôle personnalisé',
        description: 'Ce rôle est utilisé pour gérer les contrats',
        iams: [],
      };
      await agent.post(`${prefix}/roles`).send(data).expect(403);
    });
    it('I am allowed to create a role if I have the IAM "administration:roles:create"', async () => {
      await createUser([
        'administration:roles:create',
        'users:auth:signin',
      ]);
      await agent.post('/api/v1/auth/signin').send(credentials).expect(200);
      const data = {
        name: 'new rol',
        title: 'Mon rôle personnalisé',
        description: 'Ce rôle est utilisé pour gérer les contrats',
        iams: [],
      };
      const s = await agent.post(`${prefix}/roles`).send(data).expect(200);
      const {
        title,
        name,
        iams,
      } = s.body;
      title.should.equal(data.title);
      name.should.equal(data.name);
      expect(iams).to.be.an('array');
    });
    it('I am not allowed to create a role  without required attributs (name and iams)', async () => {
      await createUser([
        'administration:roles:create',
        'users:auth:signin',
      ]);
      await agent.post('/api/v1/auth/signin').send(credentials).expect(200);
      const data = {
        name: 'new Rol',
        title: 'Mon rôle personnalisé',
        description: 'Ce rôle est utilisé pour gérer les contrats',
      };
      await agent.post(`${prefix}/roles`).send(data).expect(400);
    });
    it('I am allowed to create a role if already exist"', async () => {
      const u = await createUser([
        'administration:roles:create',
        'users:auth:signin',
      ]);
      await agent.post('/api/v1/auth/signin').send(credentials).expect(200);
      const data = {
        name: u.name, // existign role
        title: 'Mon rôle personnalisé',
        description: 'Ce rôle est utilisé pour gérer les contrats',
        iams: [],
      };
      await agent.post(`${prefix}/roles`).send(data).expect(400);
    });
  });
  describe('Edit  role', () => {
    it('I am not allowed to edit a role if I am not authenticated (error 401)', async () => {
      await agent.post(`${prefix}/roles`).send({}).expect(401);
    });
    it('I am not allowed to edit a role if I dont have the IAM "administration:roles:update"', async () => {
      await createUser([
        'users:auth:signin',
      ]);
      await agent.post('/api/v1/auth/signin').send(credentials).expect(200);
      const r = await new Role({
        name: 'new roles',
        title: 'Mon rôle personnalisé',
        description: 'Ce rôle est utilisé pour gérer les contrats',
        iams: [],
      }).save();

      const data = {
        name: 'new rol',
        title: 'Mon rôle personnalisé',
        description: 'Ce rôle est utilisé pour gérer les contrats',
        iams: [],
      };
      await agent.put(`${prefix}/roles/${r._id}`).send(data).expect(403);
    });
    it('I am allowed to edit a role if I have the IAM "administration:roles:create"', async () => {
      await createUser([
        'administration:roles:update',
        'users:auth:signin',
      ]);
      await agent.post('/api/v1/auth/signin').send(credentials).expect(200);
      const r = new Role({
        name: 'new role',
        title: 'Mon rôle personnalisé',
        description: 'Ce rôle est utilisé pour gérer les contrats',
        iams: [],
      });
      await r.save();
      const data = {
        name: 'new rol update',
        title: 'Mon rôle personnalisé update',
        description: 'Ce rôle est utilisé pour gérer les contrats',
        iams: [],
      };
      await agent.put(`${prefix}/roles/${r._id}`).send(data).expect(200);
    });
    it('I am allowed to edit a role if role ID not exist ', async () => {
      await createUser([
        'administration:roles:update',
        'users:auth:signin',
      ]);

      await agent.post('/api/v1/auth/signin').send(credentials).expect(200);
      const any_id = mongoose.Types.ObjectId();
      const data = {
        name: 'new rol update',
        title: 'Mon rôle personnalisé update',
        description: 'Ce rôle est utilisé pour gérer les contrats',
        iams: [],
      };
      await agent.put(`${prefix}/roles/${any_id}`).send(data).expect(404);
    });
    it('I am allowed to edit a role if role ID invalid ', async () => {
      await createUser([
        'administration:roles:update',
        'users:auth:signin',
      ]);

      await agent.post('/api/v1/auth/signin').send(credentials).expect(200);
      const data = {
        name: 'new rol update',
        title: 'Mon rôle personnalisé update',
        description: 'Ce rôle est utilisé pour gérer les contrats',
        iams: [],
      };
      await agent.put(`${prefix}/roles/00000000`).send(data).expect(400);
    });
  });
  describe(' List role and iams', () => {
    it('I am not allowed to list roles if I am not authenticated (error 401)', async () => {
      await agent.get(`${prefix}/roles`).send({}).expect(401);
    });
    it('I am not allowed to list  roles if I dont have the IAM "administration:roles:list"', async () => {
      await createUser([
        'users:auth:signin',
      ]);
      await agent.post('/api/v1/auth/signin').send(credentials).expect(200);
      await agent.get(`${prefix}/roles`).send().expect(403);
    });
    it('I am allowed to list  roles if I have the IAM "administration:roles:list"', async () => {
      await createUser([
        'administration:roles:list',
        'users:auth:signin',
      ]);
      await agent.post('/api/v1/auth/signin').send(credentials).expect(200);

      await agent.get(`${prefix}/roles`).send().expect(200);
    });
    it('I am allowed to send the list of IAMs (the list of IDs) if role ID exist', async () => {
      await createUser([
        'administration:roles:get',
        'users:auth:signin',
      ]);
      await agent.post('/api/v1/auth/signin').send(credentials).expect(200);
      const r = await new Role({
        name: 'new roles',
        title: 'Mon rôle personnalisé',
        description: 'Ce rôle est utilisé pour gérer les contrats',
        iams: [],
      }).save();

      const res = await agent.get(`${prefix}/roles/${r._id}`).send().expect(200);
      const { iams } = res.body;
      expect(iams).to.be.an('array');
    });
    it('I am not allowed to send the list of IAMs (the list of IDs) if role ID not exist', async () => {
      await createUser([
        'administration:roles:get',
        'users:auth:signin',
      ]);
      await agent.post('/api/v1/auth/signin').send(credentials).expect(200);
      const any_id = mongoose.Types.ObjectId();
      await agent.get(`${prefix}/roles/${any_id}`).send().expect(404);
    });
    it('I am not allowed to send the list of IAMs (the list of IDs) if role ID invalid', async () => {
      await createUser([
        'administration:roles:get',
        'users:auth:signin',
      ]);
      await agent.post('/api/v1/auth/signin').send(credentials).expect(200);
      await agent.get(`${prefix}/roles/0009990909`).send().expect(400);
    });
    it('I am allowed to send the details of each IAM if you send the parameter $expand=iams', async () => {
      await createUser([
        'administration:roles:get',
        'users:auth:signin',
      ]);
      await agent.post('/api/v1/auth/signin').send(credentials).expect(200);
      const r = await new Role({
        name: 'new roles',
        title: 'Mon rôle personnalisé',
        description: 'Ce rôle est utilisé pour gérer les contrats',
        iams: [],
      }).save();

      const res = await agent.get(`${prefix}/roles/${r._id}?$expand=iams`).send().expect(200);
      const { iams } = res.body;
      expect(iams).to.be.an('array');
    });
  });

  afterEach(async () => {
    await Promise.all([
      User.remove(),
    ]);
  });
});
