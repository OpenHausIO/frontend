# Frontend

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Demo
There exsits a public demo: http://demo.open-haus.io<br />
It is deployed with docker and runs the frontend & backend container.<br />
The instance is rested to its default values every 10 Minutes.<br />
No authentication required, full API support.


## Docker image

### Environment variables
| Name             | Default value                    | Description                                          |
| ---------------- | -------------------------------- | ---------------------------------------------------- |
| NODE_ENV         | `production`                     | node.js environment                                  |
| NGINX_HOSTNAME   | `open-haus.lan, open-haus.local` | nginx hostname                                       |
| BACKEND_PROTOCOL | `http`                           | OpenHaus backend http protocol                       |
| BACKEND_HOST     | `127.0.0.1`                      | OpenHaus backend http host                           |
| BACKEND_PORT     | `8080`                           | OpenHaus backend http port                           |
| RESOLVER         | `127.0.0.11`                     | DNS resolver used inside the backend location block. |

> NOTE:<br />
> You can also use the environment variables `BACKEND_PROTOCOL`, `BACKEND_HOST` & `BACKEND_PORT` while you develop local.<br />
> E.g. run `BACKEND_HOST=open-haus.local npm run dev` to use your local hosted backend instead of the loopback address.

### Build the image
```sh
npm run build
npm run build:docker
```

### Start the docker image
```sh
docker run --net=host --rm --name frontend --env BACKEND_HOST=172.17.0.1 openhaus/frontend:latest
```
> The backend runs on the docker host

### Export the Image
```sh
docker save openhaus/frontend:latest | gzip > ./frontend-vX.X.X-docker.tgz
```

## Screenshots
![Dashboard](./docs/img/dashboard.png)
--
![Dashboard-Widgets](./docs/img/dashboard-widgets.png)
--
![Rooms](./docs/img/rooms.png)
--
![Room-Infobar](./docs/img/room-infobar.png)
--
![Endpoints](./docs/img/endpoints.png)
--
![EndpointInfobar](./docs/img/endpoint-infobar.png)
--
![Devices](./docs/img/devices.png)
--
![Devices](./docs/img/settings.png)
<br /><br />
