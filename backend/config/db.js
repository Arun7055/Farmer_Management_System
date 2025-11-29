import {neon} from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config({ path: '/Users/arun/Documents/PERN/.env' });

const {PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT} = process.env;

//console.log({ PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT });

//sql connection
export const sql = neon(
    `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}:/${PGDATABASE}?sslmode=require`
);
