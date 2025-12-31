import { useState } from "react";
import Head from "next/head";

export default function Home() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function upload(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setImages([]);

    const formData = new FormData();
    for (const file of e.target.file.files) {
      formData.append("file", file);
    }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setImages(data.urls);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Multiple Upload Cloudinary</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ padding: 40 }}>
        <h1>Upload Banyak Gambar</h1>

        <form onSubmit={upload}>
          <input type="file" name="file" multiple required />
          <br /><br />
          <button disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {images.length > 0 && (
          <>
            <h3>Hasil Upload:</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: 10
              }}
            >
              {images.map((img, i) => (
                <img key={i} src={img} style={{ width: "100%" }} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
