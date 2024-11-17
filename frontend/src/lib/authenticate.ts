"use server";

import { signIn } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect";
import { AuthFormData, AuthState, SignupFormData } from "@/types/auth";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

export const authenticate = async (
    prevState: AuthState | null,
    formData: AuthFormData
): Promise<{ message: string; error?: string }> => {
    try {
        const result = await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            redirect: false, // Important: Set this to false to handle redirects manually
        });

        if (!result) {
            return { message: "error", error: "Authentication failed" };
        }

        if (result.error) {
            return { message: "error", error: result.error };
        }

        // Successfully authenticated
        return { message: "success" };
    } catch (error: unknown) {
        if (isRedirectError(error)) {
            throw error;
        }

        console.error("Authentication error:", error);

        if (error instanceof Error) {
            return {
                message: "error",
                error: error.message.includes("credentials") ?
                    "Invalid credentials" :
                    "An unexpected error occurred"
            };
        }

        return { message: "error", error: "An unexpected error occurred" };
    }
};

export const signup = async (
    prevState: null,
    formData: SignupFormData
): Promise<{ message: string; error?: string }> => {
    const { name, email, password, imageSrc } = formData;

    try {
        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL is not defined");
        }

        const sql = neon(process.env.DATABASE_URL);

        // Check if user already exists
        const existingUser = await sql`
            SELECT email FROM users WHERE email = ${email} LIMIT 1
        `;

        if (existingUser.length > 0) {
            return {
                message: "error",
                error: "An account with this email already exists. Please login."
            };
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert the user into the database
        await sql`
            INSERT INTO users (name, email, password, image, authType)
            VALUES (${name}, ${email}, ${hashedPassword}, ${imageSrc || null}, 'credentials')
        `;

        return { message: "success" };
    } catch (err: unknown) {
        console.error("Signup error:", err);

        if (err instanceof Error && err.message.includes("UniqueViolation")) {
            return {
                message: "error",
                error: "An account with this email already exists. Please login."
            };
        }

        return {
            message: "error",
            error: "An unexpected error occurred"
        };
    }
};