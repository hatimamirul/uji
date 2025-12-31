import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState("");

  async function upload(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", e.target.file.files[0]);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    setImage(data.url);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Upload Gambar ke Cloudinary</h1>
      <form onSubmit={upload}>
        <input type="file" name="file" required />
        <button type="submit">Upload</button>
      </form>
      {image && <img src={image} width="300" />}
    </div>
  );
}
