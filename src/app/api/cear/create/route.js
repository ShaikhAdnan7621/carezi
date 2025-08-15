import { NextResponse } from "next/server";
import { uploadFileToCloudinary } from "@/lib/cloudinary";
import Cear from "@/models/cear/cearmodles";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import { getUserFromCookies } from "@/utils/getUserFromCookies";

export async function POST(request) {
	try {
		// Authenticate user
		const user = await getUserFromCookies(request);
		if (!user) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		console.log("Authenticated user:", user);

		await dbConnect();
		const formData = await request.formData();
		const content = formData.get("content");
		const haveQuestion = formData.get("haveQuestion") === "true";
		const question = formData.get("question");
		const visibility = formData.get("visibility") || "public";
		const isReply = formData.get("isReply") === "true";
		const parentId = formData.get("parentId");

		// Handle parentId
		let parentIdObjectId;
		if (isReply) {
			if (!parentId || !mongoose.Types.ObjectId.isValid(parentId)) {
				return NextResponse.json(
					{ error: "Valid Parent ID is required for replies" },
					{ status: 400 }
				);
			}
			parentIdObjectId = new mongoose.Types.ObjectId(parentId);
		} else {
			parentIdObjectId = new mongoose.Types.ObjectId();
		}

		// Parse JSON fields
		const tags = formData.get("tags") ? JSON.parse(formData.get("tags")) : [];
		const mentions = formData.get("mentions") ? JSON.parse(formData.get("mentions")) : [];

		// Handle file uploads
		const attachments = [];
		const files = formData.getAll("attachments");

		for (const file of files) {
			if (file instanceof File) {
				const buffer = Buffer.from(await file.arrayBuffer());
				const url = await uploadFileToCloudinary(buffer, "cear_uploads");

				attachments.push({
					fileUrl: url,
					fileName: file.name,
					fileType: file.type,
					fileSize: file.size,
					parentId: parentIdObjectId,
				});
			}
		}

		// Create and save Cear post
		const newCear = new Cear({
			content,
			postedBy: new mongoose.Types.ObjectId(user.userId), // Convert userId to ObjectId
			attachment: attachments,
			haveQuestion,
			question: question || undefined,
			isReply,
			parentId: parentIdObjectId,
			tags,
			mentions,
			visibility,
		});

		await newCear.save();

		return NextResponse.json({
			success: true,
			message: "Cear post created successfully",
			data: newCear
		}, { status: 201 });

	} catch (error) {
		console.error("Error:", error.message);
		return NextResponse.json(
			{ error: error.message || "Internal Server Error" },
			{ status: 500 }
		);
	}
}
