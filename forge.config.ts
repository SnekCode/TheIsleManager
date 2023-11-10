// require dotenv
require('dotenv').config();
// pull in package.json for version
const package = require('./package.json');

module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'SnekCode',
          name: 'TheIsleManager'
        },
        authToken: process.env.GITHUB_TOKEN,
        // prerelease if package.json version contains -alpha or -beta
        prerelease: package.version.includes('-alpha') || package.version.includes('-beta'),
      }
    }
  ],
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        certificateFile: './certs/certificate.pfx',
        certificatePassword: process.env.CERTIFICATE_PASSWORD
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};
