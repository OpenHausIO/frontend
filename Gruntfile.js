const pkg = require("./package.json");

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
        compress: {
            main: {
                options: {
                    archive: `frontend-v${pkg.version}.tgz`
                },
                files: [{
                    expand: true,
                    src: "**/*",
                    cwd: "dist/"
                }]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-env");

};