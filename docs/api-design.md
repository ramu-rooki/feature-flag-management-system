# API Design

## Authentication
* `POST /auth/signup` - Register a new user and organization
* `POST /auth/login` - Authenticate a user and return a JWT

## Organizations
* `POST /organizations` - Create a new organization
* `GET /organizations` - Get organization details

## Feature Flags
* `POST /feature-flags` - Create a new feature flag
* `GET /feature-flags` - List all feature flags for the organization
* `PUT /feature-flags/:id` - Update an existing feature flag
* `DELETE /feature-flags/:id` - Delete a feature flag

## SDK / Client Evaluation
* `GET /feature-flags/check` - Check if a specific feature flag is enabled
