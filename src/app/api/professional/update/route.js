import { NextResponse } from "next/server";
import Professional from "@/models/professionalmodles";
import dbConnect from "@/lib/dbConnect";

export async function PUT(request) {
	try {
		await dbConnect();

		console.log("professional update route hitted here");
		const body = await request.json();
		const { ProfessionalId, data } = body;
		console.log("data", data);
		const professional = await Professional.findById(ProfessionalId);
		if (!professional) {
			return NextResponse.json(
				{ error: "Professional not found" },
				{ status: 404 }
			);
		}

		const newprofessional = { ...professional._doc, ...data };
		const updatedProfessional = await Professional.findByIdAndUpdate(
			ProfessionalId,
			newprofessional,
			{ new: true }
		);
		console.log("data updated success fully...\n", updatedProfessional)
		return NextResponse.json(
			{ message: "Professional updated successfully", professional: updatedProfessional },
			{ status: 200 }
		);

	} catch (error) {
		console.log(error.message);
		return NextResponse.json(
			{ error: "Failed to update professional data" },
			{ status: 500 }
		);
	}
}