-- put gis and pgvector into a different schema, so not to pollute the public schema
CREATE SCHEMA IF NOT EXISTS extensions;

CREATE EXTENSION IF NOT EXISTS postgis SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS vector SCHEMA extensions;

SET search_path TO public, extensions;

-- hardcoded database name asking for trouble
ALTER DATABASE airsoft SET search_path TO public, extensions;