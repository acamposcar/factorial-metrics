import { defineConfig } from 'cypress'
const { GitHubSocialLogin } = require('cypress-social-logins').plugins

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // on('task', {
      //   GitHubSocialLogin: GitHubSocialLogin
      // })
    },
    supportFile: false,
    baseUrl: 'http://localhost:3000',
    chromeWebSecurity: false
  }
})
