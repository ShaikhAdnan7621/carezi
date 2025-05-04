// src\models\post\questionpostmodles.js

import mongoose from "mongoose";

const questionPostSchema = new mongoose.Schema({
	question: { type: String, required: true },
	correctAnswer: { type: String, required: true },
	postBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users", // Referring to your user model
		required: true,
	},
	answers:{
		type: [
			{
				answer: { type: String, required: true },
				userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
			},
		],
		default: [],
	}
}, { timestamps: true });



export default mongoose.models?.questionPosts || mongoose.model("questionPosts", questionPostSchema);
