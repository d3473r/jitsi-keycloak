# jitsi-keycloak

## Installation

- `npm install`


## Configuration

### Replace the following placeholders in `app.js`:

- `SESSION_SECRET` with a random string (`node -e "console.log(require('crypto').randomBytes(24).toString('base64'));"`)
- `JITSI_SECRET` with the shared secret from jitsi `JWT_APP_SECRET`. If you don't have one already run: `node -e "console.log(require('crypto').randomBytes(24).toString('base64'));"` again.
- `DEFAULT_ROOM` with a default room name e.g. `meeting`
- `JITSI_URL` with the url of your jitsi server e.g. `https://meet.example.com`
- `JITSI_SUB` with your jitsi server sub e.g. `meet.example.com`

## Run

- `npm start`

## Build

- `docker build -t jitsi-keycloak .`