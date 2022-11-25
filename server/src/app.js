"use strict";

const path = require("path");
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const express = require("express");
const session = require("express-session");
const Keycloak = require("keycloak-connect");
import * as dotenv from 'dotenv'
dotenv.config()

const PORT = 3000;

const JITSI_SECRET = process.env.JITSI_SECRET || "JITSI_SECRET";
const DEFAULT_ROOM = process.env.DEFAULT_ROOM || "DEFAULT_ROOM";
const JITSI_URL = process.env.JITSI_URL || "JITSI_URL";
const JITSI_SUB = process.env.JITSI_SUB || "JITSI_SUB";

process.on('SIGINT', () => {
  process.exit();
});

const app = express();

const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({store: memoryStore}, "../config/keycloak.json");

app.use(session({
  secret: crypto.randomBytes(24).toString("base64"),
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

const sign = (firstName, lastName, email, avatar, allowedRoom) => {
  return jwt.sign({
    "context": {
      "user": {
        "name": firstName + " " + lastName,
        "email": email,
        "avatar": avatar
      }
    },
    "aud": "jitsi",
    "iss": "jitsi",
    "sub": JITSI_SUB,
    "room": allowedRoom
  }, JITSI_SECRET);
};

app.use('/', express.static('public'));
app.get('/:room', function (req, res) {
  res.sendFile(req.params[0] ? req.params[0] : 'index.html', {root: './public'});
});
app.use(keycloak.middleware());

app.get("/api/config", keycloak.protect(), (req, res) => {
  let avatar;

  if (req.query.avatar) {
    avatar = req.query.avatar;
  }

  const profile = req.kauth.grant.access_token.content;
  return res.send(JSON.stringify({
    token: sign(profile.given_name, profile.family_name, profile.email, avatar, "*"),
    jitsiUrl: JITSI_URL,
    defaultRoom: DEFAULT_ROOM
  }));
});

app.get("/api/invite", keycloak.protect(), (req, res) => {
  return res.send(JSON.stringify({token: sign(req.query.name, "", "", req.query.room)}));
});

app.get("/api/keycloak.json", (req, res) => {
  return res.sendFile(path.resolve(path.join(__dirname, "../../config/keycloak.json")));
});

app.listen(PORT);

console.log(`App listening on port: ${PORT}`);
