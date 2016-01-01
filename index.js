#! /usr/bin/env node

'use strict';

var exec = require('child_process').spawnSync,
    path = require('path');

// Deport Class
class Deport {
    /**
     * Deport Constructor
     *
     * @param config (object) - An object from package.json
     */
    constructor ( config ) {
        this.config = config;
    }

    /**
     * Deport Initializer
     * This function will check does the config is valid and contains "cliDependencies" list before preparing the install.
     *
     * @returns {Deport}
     */
    init () {
        // Ensure the config is valid and the "cliDependencies" is an array.
        if ( this.config && Array.isArray(this.config.cliDependencies) ) {
            // Iterate each dependencies to install it.
            for ( let dep of this.config.cliDependencies ) {
                // Call the installer.
                this.install(dep);
            }
        }

        return this;
    }

    /**
     * Deport Installer
     * This function will check does the required global module is exist or not.
     * If not exist, then install it.
     *
     * @param name (string) - String module name, can contains version (e.g: sails@latest).
     * @returns {Deport}
     */
    install ( name ) {
        console.log(`Checking global module: "${name}"...`);

        // Check does the module is already installed.
        let exist = this.check(name);

        // Install the module if not installed.
        if ( !exist ) {
            console.log(` [i] Installing global module: "${name}"`);

            // Use spawnSync to install the global module, and convert the stdout to string as an output.
            let output = exec('npm', [ 'install', '-g', name ], {
                cwd : process.cwd(),
                env : process.env
            })
                .stdout
                .toString();

            // Print the spawn output.
            console.log('');
            console.log(output.toString());
        }

        console.log(`Global module "${name}" installed.\r\n`);

        return this;
    }

    /**
     * Global Module Checker
     * This function will check does the module is already installed globally or not.
     *
     * @param name (string) - String module name, can contains version. (e.g: sails@latest).
     * @returns {boolean}
     */
    check ( name ) {
        // Use spawnSync to check the module availability, and convert the stdout to string as an output.
        let exist = exec('which', [ name ], {
            cwd : process.cwd(),
            env : process.env
        })
            .stdout
            .toString();

        // If the result is not an empty string, then it's exist.
        if ( exist ) {
            console.log(` [i] Module "${name}" is already exist.`);

            return true;
        }
        else {
            console.log(` [i] Module "${name}" is not installed.`);

            return false;
        }
    }
}

// Creating package information holder.
var pkg;

try {
    // Getting the package information.
    pkg = require(path.resolve(process.cwd(), 'package.json'));
}
catch ( err ) {
    console.log('The current folder does not contains "package.json" file! Install skipped.');
}

if ( pkg ) {
    // Initializing the installer.
    new Deport(pkg).init();
}

// Exporting the class.
module.exports = Deport;