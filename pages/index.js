import { useState } from "react";
import Head from "next/head";

export default function Home() {
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function upload(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setImage("");

    const formData = new FormData();
    formData.append("file", e.target.file.files[0]);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setImage(data.url);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Upload Gambar Cloudinary</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ padding: 40 }}>
        <h1>Upload Gambar</h1>

        <form onSubmit={upload}>
          <input type="file" name="file" required />
          <br /><br />
          <button disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {image && (
          <>
            <p>Hasil:</p>
            <img src={image} width="300" />
          </>
        )}
      </div>
    </>
  );
}
