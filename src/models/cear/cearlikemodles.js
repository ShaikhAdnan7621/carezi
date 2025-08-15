import mongoose from "mongoose";

const cearLikeSchema = new mongoose.Schema(
	{
		cearId: { type: mongoose.Schema.Types.ObjectId, ref: "Cear", required: true },
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
	},
	{ timestamps: true }
);

cearLikeSchema.index({ cearId: 1, userId: 1 }, { unique: true });

export default mongoose.models.CearLike || mongoose.model("CearLike", cearLikeSchema);

