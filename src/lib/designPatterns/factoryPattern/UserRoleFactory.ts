import { Pool } from 'pg';

export interface IUserRole {
    insertRoleSpecificData(pool: Pool, user_id: number): Promise<void>;
}

export class Customer implements IUserRole {
    async insertRoleSpecificData(pool: Pool, user_id: number): Promise<void> {
        console.log('Customer: Inserting into customers table');
        await pool.query('INSERT INTO customers (user_id) VALUES ($1)', [user_id]);
    }
}

export class Seller implements IUserRole {
    async insertRoleSpecificData(pool: Pool, user_id: number): Promise<void> {
        console.log('Seller: Inserting into sellers table');
        await pool.query('INSERT INTO sellers (user_id) VALUES ($1)', [user_id]);
    }
}

export class Admin implements IUserRole {
    async insertRoleSpecificData(pool: Pool, user_id: number): Promise<void> {
        console.log('Admin: Inserting into admins table');
        await pool.query('INSERT INTO admins (user_id) VALUES ($1)', [user_id]);
    }
}

export class Hybrid implements IUserRole {
    async insertRoleSpecificData(pool: Pool, user_id: number): Promise<void> {
        console.log('Hybrid: Inserting into hybrids tables');
        await pool.query('INSERT INTO hybrids (user_id) VALUES ($1)', [user_id]);
    }
}