# Node.js Task Manager

This is a Node.js-based Todo List app that includes both server and client components. The server is built with Express and TypeORM, while the client is built with React and TypeScript.

## Project Structure

```
.
├── client/
│   ├── public/
│   │   ├── (static html)
│   ├── src/
│   │   ├── (components)
│   │   ├── api/
│   │   │   └── (client-side API handlers)
│   │   └── models/
│   │       └── (client-side data models)
├── server/
│   ├── src/
│   │   ├── constants.ts
│   │   ├── controllers/
│   │   ├── models/
│   │   │   ├── (data models)
│   │   └── routes/
│   │       └── (API Routes)
```

## Getting Started

Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:

   `git clone https://github.com/jlukenoff/nodejs-task-manager.git`

   `cd nodejs-task-manager`

2. Install the dependencies:

   `npm install`

Building the Project

To build both the server and client components, run:

`npm run build`

Running the Project

To start the server, run:

`npm start`

The server will start on http://localhost:3000.

Development

For development, you can run the client and server separately:

- To start the client in development mode:

  npm run dev:client

- To start the server in development mode:

  npm run dev:server

Running Tests

To run the tests, use:

npm test

License

This project is licensed under the ISC License.
