# jitsi-keycloak

## Installation

- `npm install`

## Configuration

### Keycloak

- Add a public openid-connect client in your keycloak realm
- Download the `keycloak.json` file for your client and put it in the config directory.

### Jitsi

- Set `ENABLE_AUTH=1`, `AUTH_TYPE=jwt` and `JWT_APP_ID=jitsi` in your jitsi environment
- Set `JWT_APP_SECRET` to a random string (e.g. `node -e "console.log(require('crypto').randomBytes(24).toString('base64'));"`)
- To enable an automatic redirect from jitsi to login set the url of this container`TOKEN_AUTH_URL=https://auth.example.com/{room}`

### Replace the following placeholders in `app.js` or pass them as environment variables:

- `JITSI_SECRET` with the shared secret from jitsi `JWT_APP_SECRET`.
- `DEFAULT_ROOM` with a default room name e.g. `meeting`
- `JITSI_URL` with the url of your jitsi server e.g. `https://meet.example.com`
- `JITSI_SUB` with your jitsi server sub e.g. `meet.example.com`

## Run

- `npm run dev`

## Build with docker

- `docker build -t jitsi-keycloak .`

## Run with docker

- `docker run -it --rm -p 3000:3000 -v $(pwd)/config:/config jitsi-keycloak`

## Run with docker-compose in example directory

- `docker-compose up -d`
