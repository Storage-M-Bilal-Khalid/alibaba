import { Pool } from 'pg';

let pool: Pool | null = null;

// export default function Database() {
//     if (!pool) {
//         pool = new Pool({ 
//             host: 'localhost',
//             port: 5432,
//             user: 'postgres',
//             password: 'bilalkhalid',
//             database: 'alibaba_ecommerce',
//         });
//         console.log("✅ PostgreSQL pool created");
//     }
//     return pool;
// };




export default function Database() {
    if (!pool) {
        pool = new Pool({ 
            host: 'aws-0-us-east-2.pooler.supabase.com',
            port: 6543,
            user: 'postgres.pzuodyywfwkdmxkuynjg',
            password: 'P9EMRWsz4VtcDCzq',
            database: 'postgres', // The default database for Supabase is 'postgres'
        });
        console.log("✅ PostgreSQL pool created");
    }
    return pool;
};














































// host:
// aws-0-us-east-2.pooler.supabase.com

// port:
// 6543

// database:
// postgres

// user:
// postgres.pzuodyywfwkdmxkuynjg

// pool_mode:
// transaction

















// export default function Database() {
//     if (!pool) {
//         pool = new Pool({ 
//             host: 'db.pzuodyywfwkdmxkuynjg.supabase.co',
//             port: 6543,
//             user: 'postgres',
//             password: 'P9EMRWsz4VtcDCzq',
//             database: 'postgres', // The default database for Supabase is 'postgres'
//         });
//         console.log("✅ PostgreSQL pool created");
//     }
//     return pool;
// };