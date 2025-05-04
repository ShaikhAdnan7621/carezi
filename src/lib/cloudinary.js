import cloudinary from 'cloudinary';
import sharp from 'sharp';

// Configure Cloudinary
cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Convert a file to JPG format and upload it to Cloudinary.
 *
 * @param {Buffer} fileBuffer - The buffer of the file to upload.
 * @param {string} folder - The folder in Cloudinary where the file will be stored.
 * @returns {Promise<string>} - The URL of the uploaded file.
 */

export async function uploadFileToCloudinary(fileBuffer, folder = 'default_folder') {
	try {
		// Convert file to JPG using sharp
		const convertedBuffer = await sharp(fileBuffer)
			.toFormat('jpeg') // Convert to JPEG 
			.toBuffer();

		// Upload to Cloudinary
		const uploadPromise = new Promise((resolve, reject) => {
			const uploadStream = cloudinary.v2.uploader.upload_stream(
				{
					folder, // Folder name in Cloudinary
					resource_type: 'image', // Specify resource type
					format: 'jpg', // Ensure file is uploaded as JPG
				},
				(error, result) => {
					if (error) {
						console.error('Cloudinary upload error:', error);
						reject(error);
					} else {
						resolve(result.secure_url); // Return the uploaded file's URL
					}
				}
			);

			// Pass the converted buffer to the upload stream
			uploadStream.end(convertedBuffer);
		});

		return await uploadPromise;
	} catch (error) {
		console.error('Error uploading file to Cloudinary:', error);
		throw new Error('Failed to upload file');
	}
}
