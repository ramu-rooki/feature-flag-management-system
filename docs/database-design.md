# Database Design

## Tables

### 1. organizations
* `id` (UUID, Primary Key)
* `name` (String, Not Null)
* `created_at` (Timestamp)
* `updated_at` (Timestamp)

### 2. users
* `id` (UUID, Primary Key)
* `organization_id` (UUID, Foreign Key -> organizations.id)
* `name` (String, Not Null)
* `email` (String, Unique, Not Null)
* `password_hash` (String, Not Null)
* `role` (String, e.g., 'admin', 'member')
* `created_at` (Timestamp)
* `updated_at` (Timestamp)

### 3. feature_flags
* `id` (UUID, Primary Key)
* `organization_id` (UUID, Foreign Key -> organizations.id)
* `name` (String, Not Null)
* `key` (String, Unique within organization)
* `description` (Text)
* `is_enabled` (Boolean, Default: false)
* `created_at` (Timestamp)
* `updated_at` (Timestamp)
