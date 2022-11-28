# jitsi-keycloak

![Build Status](https://img.shields.io/github/workflow/status/d3473r/jitsi-keycloak/Docker%20Image%20CI)
![Latest Version](https://img.shields.io/github/v/tag/d3473r/jitsi-keycloak?label=Latest%20Version)
![Docker Pulls](https://img.shields.io/docker/pulls/d3473r/jitsi-keycloak)
![Docker Image Size (tag)](https://img.shields.io/docker/image-size/d3473r/jitsi-keycloak/latest)

## Installation

- `npm install`

## Configuration

### Keycloak

- Add a public openid-connect client in your keycloak realm
- Download the `keycloak.json` file for your client and put it in the config directory.
- Allow this app from keycloak (`jitsi-keycloak` running on https://auth.meet.example.com):
  <img width="301" alt="keycloak" src="https://user-images.githubusercontent.com/10356892/120615016-20b79380-c458-11eb-86cf-a70864319aae.png">

- If you want to have an avatar displayed in jitsi you can add an avatar custom attribute in keycloak to your desired users:
  <img width="828" alt="avatar" src="https://user-images.githubusercontent.com/10356892/120669103-6e9bbe00-c48f-11eb-888e-c4da3011f8ea.png">




### Jitsi

- Set `ENABLE_AUTH=1`, `AUTH_TYPE=jwt` and `JWT_APP_ID=jitsi` in your jitsi environment
- Set `JWT_APP_SECRET` to a random string (e.g. `node -e "console.log(require('crypto').randomBytes(24).toString('base64'));"`)
- To enable an automatic redirect from jitsi to login set the url of this container`TOKEN_AUTH_URL=https://auth.example.com/{room}`

### Replace the following placeholders in `app.js` or pass them as environment variables:

- `JITSI_SECRET` with the shared secret from jitsi `JWT_APP_SECRET`.
- `DEFAULT_ROOM` with a default room name e.g. `meeting`
- `JITSI_URL` with the url of your jitsi server e.g. `https://meet.example.com`

## Run

- `npm run dev`

## Build with docker

- `docker build -t jitsi-keycloak .`

## Run with docker

- `docker run -it --rm -p 3000:3000 -v $(pwd)/config:/config jitsi-keycloak`

## Run with docker-compose in example directory

- `docker-compose up -d`
