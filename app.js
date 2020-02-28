'use strict';

const PORT = 8080;
const HOST = '0.0.0.0';

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const Keycloak = require('keycloak-connect');

const JITSI_SECRET = process.env.JITSI_SECRET || "JITSI_SECRET";
const DEFAULT_ROOM = process.env.DEFAULT_ROOM || "DEFAULT_ROOM";
const JITSI_URL = process.env.JITSI_URL || "JITSI_URL";
const JITSI_SUB = process.env.JITSI_SUB || "JITSI_SUB";

const app = express();

app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'main.hbs',
    relativeTo: __dirname
}));
app.set('view engine', 'hbs');

const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({store: memoryStore}, 'config/keycloak.json');

app.use(session({
    secret: crypto.randomBytes(24).toString('base64'),
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));

app.use(keycloak.middleware());

app.get('/', keycloak.protect(), function (req, res) {
    const content = req.kauth.grant.access_token.content;
    const jitsiSecret = JITSI_SECRET;

    res.render('home', {
        showTitle: true,
        given_name: content.given_name,
        family_name: content.family_name,
        email: content.email,
        default_room: DEFAULT_ROOM,
        jitsiUrl: JITSI_URL,

        helpers: {
            jwt: function () {
                return jwt.sign({
                    "context": {
                        "user": {
                            "name": content.given_name + " " + content.family_name,
                            "email": content.email
                        }
                    },
                    "aud": "jitsi",
                    "iss": "jitsi",
                    "sub": JITSI_SUB,
                    "room": "*"
                }, jitsiSecret);
            }
        }
    });
});

app.get('/invite', keycloak.protect(), function (req, res) {
    const invite_name = req.query['invite_name'];
    const jitsiSecret = JITSI_SECRET;
    const room = crypto.randomBytes(24).toString('hex');

    const token = jwt.sign({
        "context": {
            "user": {
                "name": invite_name
            }
        },
        "aud": "jitsi",
        "iss": "jitsi",
        "sub": JITSI_SUB,
        "room": room
    }, jitsiSecret);

    res.render('invite', {
        room: room,

        helpers: {
            invite_link: function () {
                return `${JITSI_URL}${room}?jwt=${token}`
            }
        }
    });
});

app.use(keycloak.middleware({logout: '/'}));

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
