import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import { config } from "dotenv";
config();

const {
    BACKEND_HOST,
    BACKEND_PORT,
    BACKEND_PROTOCOL
} = process.env = Object.assign({
    BACKEND_HOST: "127.0.0.1",
    BACKEND_PORT: "8080",
    BACKEND_PROTOCOL: "http"
}, process.env);


const redirect = () => ({
    configureServer(server) {
        server.middlewares.use("/admin", (req, res, next) => {

            res.writeHead(302, {
                Location: 'http://localhost:3001/admin/'
            });

            res.end();

        });
    },
});


// https://vitejs.dev/config/
export default defineConfig({
    base: "/user/",
    plugins: [
        vue(),
        redirect()
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        }
    },
    server: {
        host: "0.0.0.0",
        proxy: {
            "/api": {
                target: `${BACKEND_PROTOCOL}://${BACKEND_HOST}:${BACKEND_PORT}`,
                ws: true,
                xfwd: true
            },
            "/auth": {
                target: `${BACKEND_PROTOCOL}://${BACKEND_HOST}:${BACKEND_PORT}`,
                xfwd: true
            }
        }
    },
    build: {
        outDir: "build",
        emptyOutDir: true
    },
    clearScreen: false
});