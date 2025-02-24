import express from "express";
import Song from "../models/Song.js";

const router = express.Router();

// Create a new song
router.post("/", async (req, res) => {
  try {
    const { title, artist, album, genre } = req.body;
    const song = new Song({ title, artist, album, genre });
    await song.save();
    res.status(201).json(song);
  } catch (error) {
    res.status(500).json({ message: "Error adding song", error });
  }
});

// Get all songs
router.get("/", async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching songs", error });
  }
});

// Get a single song by ID
router.get("/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });
    res.json(song);
  } catch (error) {
    res.status(500).json({ message: "Error fetching song", error });
  }
});

// Update a song
router.put("/:id", async (req, res) => {
  try {
    const { title, artist, album, genre } = req.body;
    const song = await Song.findByIdAndUpdate(req.params.id, { title, artist, album, genre }, { new: true });
    if (!song) return res.status(404).json({ message: "Song not found" });
    res.json(song);
  } catch (error) {
    res.status(500).json({ message: "Error updating song", error });
  }
});

// Delete a song
router.delete("/:id", async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });
    res.json({ message: "Song deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting song", error });
  }
});

export default router;
