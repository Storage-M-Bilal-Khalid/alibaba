// app/api/user-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import SessionManager from '@/lib/designPatterns/singleton/Session-manager';
import Database from '@/lib/postgresSqlDbConnection';
import { Pool } from 'pg';


// Utility function to validate session token from the database
async function getSessionFromDb(sessionToken: string) {
    try {
        const pool: Pool = Database();
        const result = await pool.query('SELECT * FROM sessions WHERE session_token = $1', [sessionToken]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error("Database error (getSessionFromDb):", error);
        return null;
    }
}

// Utility function to invalidate previous sessions for a user
async function invalidatePreviousSession(userId: number) {
    try {
        const pool: Pool = Database();
        await pool.query('DELETE FROM sessions WHERE user_id = $1', [userId]);
    } catch (error) {
        console.error("Database error (invalidatePreviousSession):", error);
    }
}

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const sessionDataCookie = cookieStore.get('session-token')?.value;
        const parsedData = JSON.parse(sessionDataCookie as string);
        const sessionToken = parsedData.sessionToken || null;

        console.log('Extracted Session Token:', sessionToken);

        if (!sessionToken) {
            return NextResponse.json({ error: 'Session token missing' }, { status: 400 });
        }

        const sessionData = await getSessionFromDb(sessionToken);
        if (!sessionData) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
        }

        await invalidatePreviousSession(sessionData.user_id);

        const pool: Pool = Database();
        await pool.query('DELETE FROM sessions WHERE session_token = $1', [sessionToken]);

        const response = NextResponse.json({ message: 'Signed out successfully' }, { status: 200 });
        response.cookies.set('session-token', '', { path: '/', maxAge: 0 });

        return response;
    } catch (error) {
        console.error('Error in POST /api/dashboard:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    //     {
    //     const sessionDataCookie = req.cookies.get('session-token')?.value;

    //       const parsedData = JSON.parse(sessionDataCookie as string);

    //        const sessionToken = parsedData.sessionToken || null;

    //       console.log('Extracted Session Token: from dashboard route GET', sessionToken);

    //     if (!sessionToken) {
    //       return NextResponse.json({ error: 'Session token missing' }, { status: 401 });
    //     }

    //     const sessionData = await getSessionFromDb(sessionToken);
    //     if (!sessionData) {
    //       return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    //     }

    //     const pool = await Database.getInstance();
    //     const userResult = await pool.request()
    //       .input('user_id', sql.Int, sessionData.user_id)
    //       .query('SELECT userName FROM users WHERE user_id = @user_id');

    //     const user = userResult.recordset[0];
    //     if (!user) {
    //       return NextResponse.json({ error: 'User not found' }, { status: 404 });
    //     }

    //     const roleResult = await pool.request()
    //       .input('role_id', sql.Int, user.role_id)
    //       .query('SELECT role_name FROM user_roles WHERE role_id = @role_id');

    //     const role = roleResult.recordset[0]?.role_name || 'Unknown';


    //     const userForResponse = {
    //       user_id: user.user_id,
    //       email: user.email,
    //       userName: user.userName,
    //       role,
    //     };

    //     return NextResponse.json(userForResponse, { status: 200 });
    //   }
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('session-token');

        if (!sessionCookie) {
            return NextResponse.json({ isAuthenticated: false, message: 'No session token' }, { status: 401 });
        }

        const { sessionToken, userId } = JSON.parse(sessionCookie.value);

        const sessionManager = SessionManager.getInstance();
        const isValid = await sessionManager.validateSession(sessionToken, userId);

        console.log(sessionToken);
        console.log(userId)

        if (!isValid) {
            return NextResponse.json({ isAuthenticated: false, message: 'Invalid session' }, { status: 401 });
        }

        // Fetch user role from DB for robust validation and latest data
        const pool: Pool = Database();
        const userResult = await pool.query(
            `SELECT u.user_id,u.email,u.username, ur.role_name
             FROM users u
             JOIN user_roles ur ON u.role_id = ur.role_id
             WHERE u.user_id = $1`,
            [userId]
        );

        if (userResult.rows.length === 0) {
            return NextResponse.json({ isAuthenticated: false, message: 'User not found' }, { status: 404 });
        }

        const userRole = userResult.rows[0].role_name;

        console.log(userRole)

        let specificId,specificQueryResult,specificIdQuery,stripeAccountId
        
        switch(userRole){
            case 'seller':
                specificIdQuery = 'select seller_id,stripe_account_id from sellers where user_id = $1';
                specificQueryResult = await pool.query(specificIdQuery,[userId]);
                specificId = specificQueryResult.rows[0].seller_id;
                stripeAccountId = specificQueryResult.rows[0].stripe_account_id;
                break;
            case 'hybrid':
                specificIdQuery = 'select hybrid_id,stripe_account_id from hybrids where user_id = $1';
                specificQueryResult = await pool.query(specificIdQuery,[userId]);
                specificId = specificQueryResult.rows[0].hybrid_id;
                stripeAccountId = specificQueryResult.rows[0].stripe_account_id;
                break;
            case 'customer':
                specificIdQuery = 'select customer_id from customers where user_id = $1';
                specificQueryResult = await pool.query(specificIdQuery,[userId]);
                specificId = specificQueryResult.rows[0].customer_id;
                break;
            case 'admin':
                specificIdQuery = 'select admin_id from admins where user_id = $1';
                specificQueryResult = await pool.query(specificIdQuery,[userId]);
                specificId = specificQueryResult.rows[0].admin_id;
                break;
            case 'owner':
                specificIdQuery = 'select owner_id from owners where user_id = $1';
                specificQueryResult = await pool.query(specificIdQuery,[userId]);
                specificId = specificQueryResult.rows[0].owner_id;
                break;
            default:
                console.log(`No userRole found`);
        }


        const userEmail = userResult.rows[0].email;
        const userName = userResult.rows[0].username;


        return NextResponse.json({ isAuthenticated: true, userRole, userId, specificId, userEmail,userName,sessionToken,stripeAccountId }, { status: 200 });

    } catch (error: any) {
        console.error('API Error fetching user session:', error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}