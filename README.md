# MultiShop Admin

## Project overview

MultiShop Admin is a web dashboard for managing multiple shops and their products. It supports shop and product CRUD workflows, inventory summaries, search, filtering, sorting, pagination, charts, and role-based access to administrative actions.

The frontend is a React Router Framework Mode single-page application. During local development it uses JSON Server as a lightweight mock API.

## Technologies used

- React 19
- React Router 8 in Framework Mode
- TanStack Query for client-side server state
- Axios for HTTP requests and interceptors
- React Hook Form and Zod for form handling and validation
- Tailwind CSS and shadcn/ui-style components for the interface
- Recharts for dashboard visualizations
- Vitest for unit tests
- Vite and TypeScript for development and builds
- JSON Server for the mock API

## Architecture and folder structure

The application is organized around:

- **Application shell and providers:** global HTML layout, error handling, query client, authentication context, and toast notifications.
- **Routes and screens:** URL-to-screen mapping, nested layouts, protected areas, and page-level workflows.
- **Reusable UI:** navigation, tables, forms, charts, feedback states, and shared UI primitives.
- **Data and domain logic:** API access, authentication, response mapping, derived product/shop fields, dashboard calculations, and shared types.

### Route Architecture

Routes are declared in `app/routes.ts` using nested layouts:

```text
/
├── /login                         Public login screen
└── MainLayout                     Authenticated application shell
    ├── /dashboard                 Dashboard and inventory summary
    ├── /shops                     Shop list
    ├── /shops/view/:shopId        Shop details
    ├── /products                  Product list
    ├── /products/view/:productId Product details
    └── AdminLayout                Additional ADMIN-only protection
        ├── /shops/add             Create shop
        ├── /shops/edit/:shopId    Edit shop
        ├── /products/add          Create product
        └── /products/edit/:productId
                                    Edit product
```

`MainLayout` owns the sidebar, top bar, bottom navigation, and authenticated-route redirect behavior. `AdminLayout` adds the role check for create and edit workflows.

### Folder Structure

```text
app/
├── root.tsx                 Global document, providers, and error boundary
├── routes.ts                Route tree and nested layouts
├── user-context.tsx         Current user and authentication context
├── app.css                  Global styles
├── routes/                  Route screens and protected layouts
├── components/              Reusable application components
│   └── ui/                  Shared UI primitives
├── services/                API and authentication service modules
├── lib/                     Axios client, domain utilities, and guards
├── types/                   Shared TypeScript models and constants
└── assets/                  Static application assets
```

## Setup instructions

### Prerequisites

- Node.js 24 or a compatible current LTS release
- npm
- Docker (optional)

### Install dependencies

```bash
npm install
```

## Environment variable requirements

No `.env` file or user-defined environment variables are currently required.

The API URL is selected in `app/types/constants.ts` using Vite's built-in `import.meta.env.DEV` flag:

- Development: `http://localhost:3300`
- Production: `https://mock-api-production-ff48.up.railway.app`

Changing API endpoints currently requires changing the source configuration and rebuilding the application. A future deployment should move these values to environment-specific configuration.

## How to run the mock API

The mock API reads and writes `db.json` using JSON Server. Start it independently with:

```bash
npm run dev:server
```

## How to run the application

### Run frontend and mock API together

```bash
npm run dev
```

This starts both the React Router development server and JSON Server. Open `http://localhost:5173` in a browser.

### Run the frontend only

```bash
npm run dev:client
```

The mock API must already be running for shop, product, and dashboard data to load.

### Build and serve production output

```bash
npm run build
npm start
```

The production server serves the generated `build/` output, normally on port `3000`.

### Docker

```bash
docker build -t multi-shop-admin .
docker run --rm -p 3000:3000 multi-shop-admin
```

The Docker image builds the application and starts the production server. It uses the configured production API URL; it does not start JSON Server inside the container.

## How to run the tests

Run the unit test suite with:

```bash
npm test
```

Run TypeScript and generated React Router type checks with:

```bash
npm run typecheck
```

Create a production build as an additional validation step:

```bash
npm run build
```

## Demo login credentials

The login flow is intentionally local and uses credentials defined in `app/services/auth-service.ts`:

| Role | Email | Password |
| --- | --- | --- |
| Administrator | `admin@gmail.com` | `pass1234` |
| Viewer | `viewer@gmail.com` | `12345678` |

The administrator can access create and edit routes. The viewer can access the regular authenticated application routes but cannot access administrator-only workflows.

## Key technical decisions and trade-offs

- **React Router Framework Mode:** Provides route composition and layouts while keeping the application structure close to the URL hierarchy. The project currently disables SSR and runs as a client-rendered SPA.
- **TanStack Query:** Keeps remote data loading and mutation state out of individual UI components. The trade-off is an additional state-management dependency and the need to define cache invalidation carefully.
- **Axios service layer:** Centralizes the API base URL, authorization header, and `401` handling. The current service layer is simple, but it does not yet provide a generated API client or strongly typed HTTP error model.
- **JSON Server:** Makes the project easy to run without a backend. It is useful for demos and UI development but does not model production persistence, concurrency, validation, or security.
- **Local-storage demo authentication:** Keeps the demo self-contained and easy to test. It is not suitable for real credentials or security-sensitive sessions.
- **Derived data utilities:** Product, shop, and dashboard calculations are kept outside visual components, improving testability and reuse. The trade-off is that callers must remember to use the mapped service results where derived fields are required.

## Assumptions made

- The mock API supports the resource and pagination behavior expected by the services.
- The production mock API remains available at the configured Railway URL.
- The application is primarily used in a modern browser with `localStorage` enabled.
- Demo role checks are sufficient for evaluating the UI workflows.
- The generated `build/` directory is a deployment artifact and is not edited by hand.

## Known limitations

- Authentication is not backed by a real server and demo credentials are present in the client source.
- Tokens are predictable credential strings stored in `localStorage`.
- Authorization is enforced in the frontend only and cannot protect data or API endpoints by itself.
- API URLs are source constants rather than deploy-time environment variables.
- JSON Server does not provide production-grade persistence, authorization, validation, or concurrent-update handling.
- The application depends on the availability of the external production mock API after deployment.

## Incomplete requirements

- Replace demo authentication.
- Stock adjustment not implemented correctly

## Future improvements

- Restructure schema to allow a product to belong to multiple shops with independet the inventory tracking for each shop
- Add a typed backend API and schema validation shared between client and server.
- Move API configuration to environment variables with separate development, staging, and production values.
- Add refreshable, short-lived sessions and centralized permission checks.
- Add optimistic updates and explicit query invalidation for CRUD mutations.
- Add accessible end-to-end tests and visual regression coverage for responsive layouts.

## How authentication and authorization would differ in production

In production, the browser should authenticate against a backend or identity provider rather than validating credentials in the client bundle. A typical flow would be:

1. The user submits credentials to a secure authentication endpoint or an external identity provider.
2. The server validates the credentials and issues a short-lived access token plus a refresh mechanism, preferably using secure, `HttpOnly`, `Secure`, and appropriately scoped cookies.
3. The backend validates the session or token on every protected API request.
4. Authorization is enforced server-side using roles and permissions, including checks for each shop and product mutation.
5. The frontend uses the authenticated user profile only to shape the interface; hiding a button is not treated as a security boundary.
6. Logout revokes or expires the session, and expired sessions redirect the user through the authentication flow.

The frontend can retain a user context and route guards for user experience, but the backend must remain the source of truth for identity, permissions, and access to data.

## Deployment

Build and run the production container with:

```bash
docker build -t multi-shop-admin .
docker run --rm -p 3000:3000 multi-shop-admin
```
