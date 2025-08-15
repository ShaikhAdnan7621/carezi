import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export function verifyToken(token) {
	if (!token) {
		return null;
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		return decoded;
	} catch (error) {
		console.error("Token verification failed:", error);
		return null;
	}
}

export function generateToken(payload) {
	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}
 