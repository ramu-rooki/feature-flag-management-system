# Architecture

## Technology Stack
* **Frontend:** React + TypeScript
* **Backend:** Node.js + Express
* **Database:** PostgreSQL (Neon)
* **Authentication:** JWT (JSON Web Tokens)

## Basic Architecture Flow
1. **Client Request:** The user interacts with the React frontend or a client application uses the API to evaluate a feature flag.
2. **Authentication:** The frontend sends a JWT with requests to the backend. The Node.js API verifies the JWT using middleware.
3. **API Processing:** The Express server handles the request, applying business logic.
4. **Database Interaction:** The backend queries or updates the PostgreSQL database (hosted on Neon).
5. **Response:** The backend returns JSON responses to the frontend.
