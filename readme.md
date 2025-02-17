# SAML Test Service Provider

This is a test SAML Service Provider application that accepts SAML assertions via an HTTP POST and displays the decoded, pretty-printed XML.

## Files in this Repository

- **app.js**: The main application file that sets up the Express server and handles SAML responses.
- **package.json**: Contains metadata about the app and its dependencies.
- **Procfile**: Tells Heroku how to start the application.
- **.gitignore**: Specifies files and directories to ignore (like `node_modules`).

## Running Locally

If you ever need to run this locally (for testing purposes), follow these steps:

1. **Install Node.js**: [Download and install Node.js](https://nodejs.org/).
2. **Install Dependencies**:  
   ```bash
   npm install
