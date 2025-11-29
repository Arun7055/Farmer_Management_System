// db/migrations.js
import { sql } from "../config/db.js";

export const runMigrations = async () => {
    try {

        // 1️⃣ farmers
        await sql`
            CREATE TABLE IF NOT EXISTS farmers (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                phone VARCHAR(20),
                address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // 2️⃣ farmer_groups
        await sql`
            CREATE TABLE IF NOT EXISTS farmer_groups (
                id SERIAL PRIMARY KEY,
                group_name VARCHAR(100) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // 3️⃣ farmer_group_members
        await sql`
            CREATE TABLE IF NOT EXISTS farmer_group_members (
                id SERIAL PRIMARY KEY,
                farmer_id INT REFERENCES farmers(id) ON DELETE CASCADE,
                group_id INT REFERENCES farmer_groups(id) ON DELETE CASCADE,
                joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // 4️⃣ land
        await sql`
            CREATE TABLE IF NOT EXISTS land (
                id SERIAL PRIMARY KEY,
                farmer_id INT REFERENCES farmers(id) ON DELETE SET NULL,
                group_id INT REFERENCES farmer_groups(id) ON DELETE SET NULL,
                area DECIMAL(10,2) NOT NULL,
                location TEXT NOT NULL,
                soil_type VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // 5️⃣ equipment
        await sql`
            CREATE TABLE IF NOT EXISTS equipment (
                id SERIAL PRIMARY KEY,
                farmer_id INT REFERENCES farmers(id) ON DELETE SET NULL,
                group_id INT REFERENCES farmer_groups(id) ON DELETE SET NULL,
                name VARCHAR(100) NOT NULL,
                type VARCHAR(100),
                availability BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // 6️⃣ crops
        await sql`
            CREATE TABLE IF NOT EXISTS crops (
                id SERIAL PRIMARY KEY,
                land_id INT REFERENCES land(id) ON DELETE CASCADE,
                crop_name VARCHAR(100) NOT NULL,
                growth_stage VARCHAR(50),
                expected_yield DECIMAL(10,2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // 7️⃣ customers
        await sql`
            CREATE TABLE IF NOT EXISTS customers (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100),
                phone VARCHAR(20),
                address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // 8️⃣ crop_sales
        await sql`
            CREATE TABLE IF NOT EXISTS crop_sales (
                id SERIAL PRIMARY KEY,
                crop_id INT REFERENCES crops(id) ON DELETE CASCADE,
                customer_id INT REFERENCES customers(id) ON DELETE SET NULL,
                quantity DECIMAL(10,2) NOT NULL,
                price_per_unit DECIMAL(10,2),
                sale_date DATE DEFAULT CURRENT_DATE
            );
        `;

        console.log("✔ Database migrations completed");

    } catch (err) {
        console.error("❌ Migration error:", err);
    }
};
