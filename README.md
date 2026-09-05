# Welcome to MutliShop Admin

## Project overview

MultiShop is a platform for managing multiple shops and their products.

## Technologies used

- React
- React router (Framework mode)
- Tanstack Query
- React
- Shadcn
- Recharts
- Tailwind
- Vitest
- Zod

## Quick Start (Docker)

### Run locally Using Docker

1. Clone this repo to your machine

```
git clone https://github.com/ezekiel-charo/multi-shop-admin
```

2. Build the development image

```
docker build -t multi-shop-admin -f Dockerfile .
```

3. Run the container

```
docker run -p 3000:3000 multi-shop-admin
```

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```
