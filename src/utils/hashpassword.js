import bcrypt from 'bcrypt';

const SALT_ROUNDS = process.env.SALT_ROUND;

/**
 * Hashes a password using bcrypt
 * @param {string} password - The plain text password to hash
 * @returns {Promise<string>} - The hashed password
 */
export const hashPassword = async (password) => {
	try {
		if (!password || typeof password !== 'string') {
			throw new Error('Invalid password provided');
		}
		const salt = await bcrypt.genSalt(SALT_ROUNDS);
		return await bcrypt.hash(password, salt);
	} catch (error) {
		console.error('Password hashing error:', error);
		throw new Error('Failed to hash password');
	}
};



/**
 * Compares a plain text password with a hashed password
 * @param {string} password - The plain text password to compare
 * @param {string} hashedPassword - The hashed password to compare against
 * @returns {Promise<boolean>} - True if the passwords match, false otherwise
 */
export const comparePassword = async (password, hashedPassword) => {
	try {
		if (!password || typeof password !== 'string') {
			throw new Error('Invalid password provided');
		}
		if (!hashedPassword || typeof hashedPassword !== 'string') {
			throw new Error('Invalid hashed password provided');
		}

		return await bcrypt.compare(password, hashedPassword);
	} catch (error) {
		console.error('Password comparison error:', error);
		throw new Error('Failed to compare passwords');
	}
};
