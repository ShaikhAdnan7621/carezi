// src\models\cear\cearmodles.js
import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
	{
		fileUrl: { type: String, required: true },
		fileName: { type: String, required: true },
		fileType: { type: String, required: true },
		fileSize: { type: Number, required: true },
		parentId: { type: mongoose.Schema.Types.ObjectId, required: true },
	},
);

const cearSchema = new mongoose.Schema(
	{
		content: { type: String, required: true },
		
		postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true }, 
		
		attachment: { type: [attachmentSchema], default: [] },
		
		haveQuestion: { type: Boolean, default: false },
		question: { type: String, required: false },
		
		isReply: { type: Boolean, default: false },
		parentId: { type: mongoose.Schema.Types.ObjectId, required: true },

		tags: { type: [String], default: [] },
		mentions: { type: [mongoose.Schema.Types.ObjectId], ref: "users", default: [] }, // user mentions


		visibility: { type: String, enum: ["public", "private", "connections"], default: "public" },
				
		commentsCount: { type: Number, default: 0 },

		isEdited: { type: Boolean, default: false },

		deletedAt: { type: Date, default: null }, 
	},
	{ 
		timestamps: true,
	}
);



export default mongoose.models.Cear || mongoose.model("Cear", cearSchema);
