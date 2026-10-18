# Recipe API

This repository is a small TypeScript and Express API example. It exposes a
recipe endpoint, returns a sample Chicken Alfredo recipe, and includes a Jest
integration test that exercises the endpoint over HTTP.

## What the project does

- Starts an Express server on port `3000`.
- Enables CORS and parses JSON request bodies.
- Handles `GET /recipes/:id`.
- Returns a JSON response containing a message and recipe data. The requested
  path ID is returned as the recipe ID; the remaining fields are hard-coded
  sample data.
- Defines a GitHub Actions workflow that installs npm dependencies and runs
  Webpack on pushes and pull requests targeting `main`.

This is a demo API, not a complete recipe service: it does not use a database
or provide endpoints to create, update, or delete recipes.

## Example request

Start the server, then request a recipe:

```sh
curl http://localhost:3000/recipes/1
```

The response is JSON with this general shape:

```json
{
  "message": "Recipe Found",
  "data": {
    "id": "1",
    "title": "Chicken Alfredo Pasta",
    "ingredients": ["..."],
    "cookingTime": 30,
    "instructions": ["..."],
    "image": "https://www.budgetbytes.com/wp-content/uploads/2022/07/Chicken-Alfredo-bowl.jpg"
  }
}
```

## Requirements

- Node.js
- npm

## Install and run

Install dependencies:

```sh
npm ci
```

Start the TypeScript API:

```sh
npm start
```

The server listens on port `3000`.

## Tests and build

Run the Jest integration tests:

```sh
npm test
```

The test requests `GET /recipes/1` and checks that the response includes
recipe data.

The package also defines a TypeScript build script:

```sh
npm run build
```

## GitHub Actions

The CI workflow is `.github/workflows/webpack.yml`. It runs on pushes and pull
requests targeting `main` for Node.js 22 and 24. It installs the locked
dependencies with `npm ci`, type-checks the TypeScript source with
`npx tsc --noEmit`, and runs the Jest tests.

The earlier workflow failed because it ran `npx webpack` without a Webpack
configuration or a declared Webpack CLI. In CI, Webpack prompted to install
`webpack-cli`, but the runner cannot answer interactive prompts. The updated
workflow runs the checks this API actually uses instead.

The CodeQL workflow (`.github/workflows/codeql.yml`) scans JavaScript and
TypeScript on pushes and pull requests to `main`, weekly, and when manually
started. Pull requests use a checklist for design and security reviews. On a
published GitHub release, CI starts the API and measures 30 requests to
`GET /recipes/1`; the measured p95 response latency must be under 2 seconds.
This is an API latency check, not a browser page-load measurement.
