'use strict';

const path = require('path');
const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const Keycloak = require('keycloak-connect');

const PORT = 3000;

const app = express();

const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({store: memoryStore}, '../config/keycloak.json');

app.use(session({
  secret: crypto.randomBytes(24).toString('base64'),
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

app.use(keycloak.middleware());

app.get('/api/test', keycloak.protect(), (req, res) => {
  return res.send('SECRET_STUFF');
});

app.get('/api/keycloak.json', (req, res) => {
  return res.sendFile(path.resolve(path.join(__dirname, '../../config/keycloak.json')));
});

app.use(keycloak.middleware({logout: '/'}));
app.listen(PORT);

console.log(`App listening on port: ${PORT}`);
