import mongoose from "mongoose";

const textPostSchema = new mongoose.Schema({
	content: { type: String },
	postBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users",
		required: true,
	},
}, { timestamps: true }
)

export default mongoose.models?.textposts || mongoose.model("textposts", textPostSchema)
