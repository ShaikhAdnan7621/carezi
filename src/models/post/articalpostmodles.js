// src\models\post\articalpostmodles.js

import mongoose from "mongoose";

const articlePostSchema = new mongoose.Schema({
	title: { type: String, required: true },
	content: { type: String, required: true },
	postBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users", // Referring to your user model
		required: true,
	},
}, { timestamps: true });

export default mongoose.models?.articleposts || mongoose.model("articleposts", articlePostSchema);