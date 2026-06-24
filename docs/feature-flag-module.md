# Feature Flag Management Module

## Architecture Explanation
The Feature Flag Management Module is built to handle the lifecycle of feature flags for each tenant (Organization). It maintains strict Multi-Tenant boundaries by inheriting the Clean Architecture pattern from earlier phases.

- **Routes**: Endpoints are strictly protected. No user other than an `ORG_ADMIN` can execute operations.
- **Controller**: Enforces JWT parsing to obtain the trusted `organizationId`. Never relies on user-supplied tenant IDs.
- **Service Layer**: Houses the business logic, explicitly checking for duplicate feature keys *only* within the boundary of the `organizationId`. It enables identical keys across different organizations without conflicts.
- **Repository Layer**: Provides an isolated abstraction to the database. All read, update, and delete queries append `organizationId: string` to the `WHERE` clause.
- **Validation**: Enforces strict patterns on the `featureKey` format to ensure consistency and reliability when flags are queried.

## Security Explanation
**Tenant Isolation (Multi-Tenancy):**
The highest risk in a SaaS platform is cross-tenant data leakage. The `organizationId` is derived exclusively from the authenticated user's token (`req.user.organizationId`). Every interaction with the database explicitly demands the `organizationId`. 
For instance, an ORG_ADMIN in `Org A` attempting to update `Flag ID 123` (which belongs to `Org B`) will invoke `updateFeatureFlag(id, orgA)`. The repository will execute `WHERE id = 123 AND organizationId = Org A`, which yields 0 records, thereby treating the flag as non-existent (404) for `Org A`.

## API Documentation

### Create Feature Flag
`POST /api/feature-flags`
**Body**: `{ "featureKey": "string", "enabled": boolean }`
**Security**: ORG_ADMIN

### Get All Feature Flags
`GET /api/feature-flags`
**Security**: ORG_ADMIN

### Get Feature Flag By ID
`GET /api/feature-flags/:id`
**Security**: ORG_ADMIN

### Update Feature Flag
`PUT /api/feature-flags/:id`
**Body**: `{ "featureKey": "string", "enabled": boolean }`
**Security**: ORG_ADMIN

### Delete Feature Flag
`DELETE /api/feature-flags/:id`
**Security**: ORG_ADMIN

### Toggle Feature Flag
`PATCH /api/feature-flags/:id/toggle`
**Security**: ORG_ADMIN

## Testing Guide
A comprehensive Postman collection `FeatureFlag-Postman.json` is provided in the `backend/` directory to simulate various scenarios, including duplicate creation and cross-tenant access attempts.
