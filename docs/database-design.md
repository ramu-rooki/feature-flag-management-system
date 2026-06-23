# Database Design (Phase 2B)

## ER Diagram
```mermaid
erDiagram
    Organization ||--o{ User : "has many"
    Organization ||--o{ FeatureFlag : "has many"

    Organization {
        String id PK "UUID"
        String name "Unique"
        DateTime created_at
    }

    User {
        String id PK "UUID"
        String organization_id FK "Nullable for SUPER_ADMIN"
        String name
        String email "Unique"
        String password_hash
        Role role "SUPER_ADMIN, ORG_ADMIN, END_USER"
        DateTime created_at
    }

    FeatureFlag {
        String id PK "UUID"
        String organization_id FK
        String feature_key
        Boolean is_enabled
        DateTime created_at
        DateTime updated_at
    }
```

## Relationships
* **1 Organization → Many Users**: A user typically belongs to an organization, except `SUPER_ADMIN`s which are system-level and do not require an organization constraint.
* **1 Organization → Many Feature Flags**: Feature flags belong entirely to one organization.

## Constraints
* **Unique Email**: `users.email` is globally unique.
* **Unique Organization Name**: `organizations.name` is globally unique.
* **Unique Feature Key per Organization**: A composite unique index `@@unique([organizationId, featureKey])` ensures `feature_key` is unique within an organization, but can be reused across different organizations.
