// dbml.ts
import * as schema1 from '../app/schema/schema'
import * as schema2 from '../app/schema/auth-schema'
import { pgGenerate } from 'drizzle-dbml-generator' // Using Postgres for this example

const schema = { ...schema1, ...schema2 }

const out = './misc/schema.dbml'
const relational = true

pgGenerate({ schema, out, relational })
