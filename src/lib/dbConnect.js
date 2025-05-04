// db connect
import mongoose from 'mongoose';

export default async function db() {
	try {
		await mongoose.connect(process.env.MONGODB_URL);
		const connection = mongoose.connection;

		connection.on("connected", () => {
			console.log("DB connected");
		});
		connection.on("error", (err) => {
			console.log('DB connection err "check"  ', err);
			process.exit();
		});
		connection.on("disconnected", () => {
			console.log("DB disconnected");
		});
	} catch (error) {
		console.log("somethisn want wrong");
		console.log(error);
	}
}