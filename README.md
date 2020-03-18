# jitsi-keycloak

## Installation

- `npm install`

## Configuration

### Add an public openid-connect client in your keycloak realm

### Download the `keycloak.json` file for your client

### Replace the following placeholders in `app.js` or pass them as environment variables:

- `JITSI_SECRET` with the shared secret from jitsi `JWT_APP_SECRET`. If you don't have one already run: `node -e "console.log(require('crypto').randomBytes(24).toString('base64'));"` again.
- `DEFAULT_ROOM` with a default room name e.g. `meeting`
- `INVITE_ROOM_PREFIX` with a invite room prefix e.g. `meetingInvite`
- `JITSI_URL` with the url of your jitsi server e.g. `https://meet.example.com`
- `JITSI_SUB` with your jitsi server sub e.g. `meet.example.com`

**Important:** Dashes in the room name are not yet possible with [docker-jitsi-meet](https://github.com/jitsi/docker-jitsi-meet/pull/153)

## Run

- `npm run dev`

## Build with docker

- `docker build -t jitsi-keycloak .`

## Run with docker

- `docker run -it --rm -p 3000:3000 -v $(pwd)/config:/config jitsi-keycloak`

## Run with docker-compose in example directory

- `docker-compose up -d`
