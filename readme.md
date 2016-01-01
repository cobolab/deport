# Deport

Deport is a small module to help installing global module dependencies while installing modules.
Not sure how useful it is, but I create this since my project require global modules installed,
and I won't to ask the users to install the required global modules manually.

## Usage

You only need to add `preinstall` script and `cliDependencies` to your `package.json` file.

The `preinstall` script should contains `npm install -g deport && deport` to ensure the deport installed, and then run the deport.
The `cliDependencies` should be an array.

**Example**

```json
{
  "name": "node-module",
  "version": "1.0.0",
  "scripts": {
    "preinstall": "npm install -g deport && deport"
  },
  "cliDependencies": [ "pm2", "forever", "sails" ]
}
```

When you run `npm install` on your project, the npm will install and run the deport before installing the dependencies and devDependencies.