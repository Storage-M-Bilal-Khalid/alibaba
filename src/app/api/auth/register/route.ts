import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { Pool } from 'pg';
import Database from '@/lib/postgresSqlDbConnection';
import { RoleFactory } from '@/lib/designPatterns/factoryPattern/RoleFactory';
// import { Resend } from 'resend';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

// const resend = new Resend(process.env.RESEND_API_KEY);

const signUpSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8).max(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8}$/),
    confirmPassword: z.string(),
    role: z.enum(['customer', 'seller', 'admin','hybrid']),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

const generateVerificationCode = () => {
    return crypto.randomInt(100000, 999999).toString();
};

const hashVerificationCode = async (code: string) => {
    const saltRounds = 10;
    const hashedCode = await bcrypt.hash(code, saltRounds);
    return hashedCode;
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, password, role } = signUpSchema.parse(body);

        const pool: Pool = await Database();

        const emailCheckResult = await pool.query(
            'SELECT email FROM users WHERE email = $1',
            [email]
        );

        if (emailCheckResult.rows.length > 0) {
            return NextResponse.json({ message: 'Email address is already taken.' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const roleResult = await pool.query(
            'SELECT role_id FROM user_roles WHERE role_name = $1',
            [role]
        );

        if (roleResult.rows.length === 0) {
            return NextResponse.json({ message: 'Role not found.' }, { status: 400 });
        }
        const role_id = roleResult.rows[0].role_id;
        console.log("Role ID:", role_id);

        const code = generateVerificationCode();
        const verificationCode = await hashVerificationCode(code);
        const codeTimestamp = new Date();
        const codeExpiration = new Date(codeTimestamp.getTime() + 60 * 1000);

        const insertUserResult = await pool.query(
            `INSERT INTO users (email, password, role_id, created_at, verification_code, code_timestamp, code_expiration, userName)
             VALUES($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING user_id, email, role_id`,
            [email, hashedPassword, role_id, new Date(), verificationCode, codeTimestamp, codeExpiration, name]
        );

        const user_id = insertUserResult.rows[0].user_id;
        const insertedEmail = insertUserResult.rows[0].email;
        const insertedRoleId = insertUserResult.rows[0].role_id;

        const stripeAccountIdPlaceHolder = 'placeholder'

        const userRoleInstance = RoleFactory.createRole(role);
        console.log(user_id, " and ", role_id)
        await userRoleInstance.insertRoleSpecificData(pool, user_id);

        if (role_id === 3) {
            const additionalQueryResult = await pool.query(
                'UPDATE SELLERS SET stripe_account_id = $1 WHERE user_id = $2',
                [stripeAccountIdPlaceHolder, user_id]
            );
            console.log("Additional Query Result for role 3:", additionalQueryResult.rowCount);
        }

        // try {
        //     const emailResult = await resend.emails.send({
        //         from: 'Cloudmart <onboarding@resend.dev>',
        //         to: [email],
        //         subject: 'Verify Your Email Address',
        //         html: `
        //         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #f9f9f9;">
        //             <h2 style="color: #333;">Welcome to Cloudmart A Digital Marketplace!</h2>
        //                     <p style="font-size: 16px; color: #555;">
        //                                 To complete your sign-up, please use the verification code below:
        //                     </p>
        //                     <div style="text-align: center; margin: 30px 0;">
        //                         <span style="display: inline-block; font-size: 24px; font-weight: bold; padding: 10px 20px; background-color: #4f46e5; color: white; border-radius: 8px;">
        //                         ${code}
        //                         </span>
        //                     </div>
        //                     <p style="font-size: 14px; color: #777;">
        //                         This code will expire in 10 minutes. If you didn’t request this, please ignore this email.
        //                     </p>
        //                     <p style="font-size: 14px; color: #777;">Thanks,<br>The Digital Marketplace Team</p>
        //         </div>
        //     `,
        //     });
        //     console.log("Email sent", emailResult);

        // } catch (error: any) {
        //     console.error('Error sending verification email:', error);
        //     return NextResponse.json({ error: 'Failed to send verification email. Account created, but please request a new verification code.' }, { status: 500 });
        // }

        return NextResponse.json(
            { message: 'User created successfully. Verification email sent', user: { email: insertedEmail, role_id: insertedRoleId, user_id: user_id } },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Sign Up Error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Validation error', errors: "Enter correct data" }, { status: 400 });
        }
        return NextResponse.json(
            { message: 'Internal server error', error: error.message || 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}