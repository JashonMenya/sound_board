// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Serve everything in the project folder
app.use(express.static(__dirname));

// List audio files from /audio_files
app.get("/api/sounds", (req, res) => {
  const dir = path.join(__dirname, "audio_files");
  fs.readdir(dir, (err, files) => {
    if (err) return res.status(500).json({ error: "Unable to read audio_files" });

    // filter to common audio extensions
    const whitelist = new Set([".mp3", ".wav", ".ogg", ".m4a", ".aac"]);
    const sounds = files
      .filter(f => whitelist.has(path.extname(f).toLowerCase()))
      .map(f => ({
        file: `audio_files/${f}`,
        label: f.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ")
      }));

    res.json(sounds);
  });
});

app.listen(PORT, () => {
  console.log(`Soundboard running on http://localhost:${PORT}`);
});
