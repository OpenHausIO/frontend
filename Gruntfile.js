const cp = require("child_process");
const pkg = require("./package.json");
const path = require("path");

const PATH_DIST = path.resolve(process.cwd(), "dist");
const PATH_BUILD = path.resolve(process.cwd(), "build");

process.env = Object.assign({
    NODE_ENV: "production"
}, process.env);

module.exports = (grunt) => {

    // Project configuration.
    grunt.initConfig({
        pkg,
        env: {
            options: {
                //Shared Options Hash
            },
            prod: {
                NODE_ENV: "production",
            }
        },
        /*
        compress: {
            main: {
                options: {
                    archive: `frontend-v${pkg.version}.tgz`
                },
                files: [{
                    expand: true,
                    src: "**",
                    cwd: "dist/"
                }]
            }
        }
        */
    });

    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-env");

    grunt.registerTask("build:docker", () => {

        let buildArgs = [
            `--build-arg version=${pkg.version}`,
            `--build-arg buildDate=${Date.now()}`,
        ].join(" ");

        cp.execSync(`docker build . -t openhaus/${pkg.name}:${pkg.version} ${buildArgs}`, {
            env: process.env,
            stdio: "inherit"
        });

        cp.execSync(`docker tag openhaus/${pkg.name}:${pkg.version} openhaus/${pkg.name}:latest`, {
            env: process.env,
            stdio: "inherit"
        });

    });

    grunt.registerTask("compress", () => {
        cp.execSync(`cd ${PATH_BUILD} && tar -czvf ${path.join(PATH_DIST, `${pkg.name}-v${pkg.version}.tgz`)} *`, {
            env: process.env,
            stdio: "inherit"
        });
    });

    grunt.registerTask("release", () => {
        [
            `mkdir -p ${PATH_BUILD}`,
            `mkdir -p ${PATH_DIST}`,
            `rm -rf ${PATH_BUILD}/*`,
            `rm -rf ${PATH_DIST}/*`,
            "npm run build",
            "npm run build:docker",
            `docker save openhaus/${pkg.name}:latest | gzip > ${path.join(PATH_DIST, `${pkg.name}-v${pkg.version}-docker.tgz`)}`,
            "grunt compress"
        ].forEach((cmd) => {
            cp.execSync(cmd, {
                env: process.env,
                stdio: "inherit"
            });
        });
    });

    grunt.registerTask("publish", () => {
        [
            `docker push openhaus/${pkg.name}:${pkg.version}`,
            `docker push openhaus/${pkg.name}:latest`
        ].forEach((cmd) => {
            cp.execSync(cmd, {
                env: process.env,
                stdio: "inherit"
            });
        });

    });

};