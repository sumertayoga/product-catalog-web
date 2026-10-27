# Product Catalog Web

React frontend for the [Product Catalog API](https://github.com/sumertayoga/product-catalog-api).

## Features

- Register and log in (JWT)
- List, search (name and price range) and page through products
- Add, edit and delete products

## Tech stack

React 19, TypeScript, Vite, React Router, Bootstrap 5.

## Run locally

Requires Node.js 24 and the backend running (see the API README).

1. `git clone https://github.com/sumertayoga/product-catalog-web.git && cd product-catalog-web`
2. `npm ci`
3. `npm run dev`
4. Open http://localhost:5173

The dev server forwards `/api` requests to the backend, so no CORS setup is needed.
By default it targets `http://localhost:5183` (`dotnet run`). If the API runs with Docker Compose,
set `API_PROXY_TARGET=http://localhost:8080` in a `.env` file (see `.env.example`).

## Notes

- The JWT is stored in `localStorage` for simplicity. When the token expires or is rejected, the user is logged out.
- Validation errors from the API are shown on the form.
