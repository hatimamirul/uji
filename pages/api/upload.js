import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: { bodyParser: false }
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new formidable.IncomingForm({
    multiples: true,
    maxFileSize: 2 * 1024 * 1024
  });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) throw err;

      // FORMIDABLE v2 KADANG BUKAN ARRAY
      let fileList = files.file;
      if (!Array.isArray(fileList)) fileList = [fileList];

      const allowed = ["image/jpeg", "image/png", "image/webp"];
      const urls = [];

      for (const file of fileList) {
        if (!allowed.includes(file.mimetype)) {
          throw new Error("Format harus JPG / PNG / WEBP");
        }

        const result = await cloudinary.uploader.upload(file.filepath, {
          folder: "vercel-upload",
          transformation: [
            { width: 800, height: 800, crop: "limit" },
            { quality: "auto", fetch_format: "auto" }
          ]
        });

        fs.unlinkSync(file.filepath);
        urls.push(result.secure_url);
      }

      return res.status(200).json({ success: true, urls });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  });
}
