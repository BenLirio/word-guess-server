# word-guess-server

A Serverless Framework project with TypeScript.

## Installation

```bash
npm install
```

## Local Development

Start the offline server:

```bash
npm run dev
```

## Testing

Run tests:

```bash
npm test
```

## Deployment

Deploy to AWS:

```bash
# Deploy to dev stage
npm run deploy

# Deploy to production stage
npm run deploy:prod
```

## Project Structure

- `/src`: Source code
  - `/handlers`: Lambda function handlers
  - `/services`: Business logic
  - `/models`: Data models
  - `/utils`: Utility functions
  - `/tests`: Test files
- `serverless.yml`: Serverless Framework service configuration
- `tsconfig.json`: TypeScript configuration
- `webpack.config.js`: Webpack configuration
- `jest.config.js`: Jest configuration
