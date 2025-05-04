import mongoose from "mongoose";

const imagePostSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    caption: { type: String },
    postBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users", // Referring to your user model
        required: true,
    },
}, { timestamps: true });

export default mongoose.models?.imageposts || mongoose.model("imageposts", imagePostSchema);	