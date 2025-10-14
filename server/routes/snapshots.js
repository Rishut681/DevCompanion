import express from "express";
import CodeSnapshot from "../models/CodeSnapshot.js";
import { validateSnapshotPayload } from "../utils/validateSnapshot.js";

const router = express.Router();

/**
 * Endpoints:
 * - POST   /api/snapshots         -> save snapshot (returns snapshot)
 * - GET    /api/snapshots/:id     -> retrieve snapshot by id
 * - GET    /api/snapshots         -> query: ?latest=true  OR ?file=<path or filename>
 *
 * The POST endpoint supports auto-incrementing version for the same file+path.
 */

// POST /api/snapshots
router.post("/", async (req, res) => {
  try {
    const payload = req.body;
    const { valid, errors } = validateSnapshotPayload(payload);
    if (!valid) {
      return res.status(400).json({ ok: false, errors });
    }

    const {
      filename,
      path,
      content,
      language,
      commitMessage,
      tags = [],
      userId = null,
      analysis = {},
    } = payload;

    // Find the highest existing version for this file+path
    const latest = await CodeSnapshot.findOne({ filename, path })
      .sort({ version: -1 })
      .lean();

    const nextVersion = latest ? latest.version + 1 : 1;

    const snapshot = new CodeSnapshot({
      filename,
      path,
      content,
      language,
      version: nextVersion,
      commitMessage: commitMessage || `Auto-save v${nextVersion}`,
      analysis,
      tags,
      userId,
    });

    const saved = await snapshot.save();
    return res.status(201).json({ ok: true, snapshot: saved });
  } catch (err) {
    console.error("POST /api/snapshots error", err);
    return res.status(500).json({ ok: false, error: "internal_error" });
  }
});

// GET /api/snapshots/:id
router.get("/:id", async (req, res) => {
  try {
    const doc = await CodeSnapshot.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ ok: false, error: "not_found" });
    return res.json({ ok: true, snapshot: doc });
  } catch (err) {
    console.error("GET /api/snapshots/:id error", err);
    return res.status(500).json({ ok: false, error: "internal_error" });
  }
});

// GET /api/snapshots
router.get("/", async (req, res) => {
  try {
    const { latest, file } = req.query;

    if (latest === "true" || latest === true) {
      // Return the most recently created snapshot overall
      const doc = await CodeSnapshot.findOne().sort({ createdAt: -1 }).lean();
      if (!doc) return res.status(404).json({ ok: false, error: "no_snapshots" });
      return res.json({ ok: true, snapshot: doc });
    }

    if (file) {
      // Try matching path or filename
      const docs = await CodeSnapshot.find({
        $or: [{ path: file }, { filename: file }],
      })
        .sort({ version: -1 })
        .lean();

      return res.json({ ok: true, snapshots: docs });
    }

    // Default: return 50 most recent snapshots
    const docs = await CodeSnapshot.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    return res.json({ ok: true, snapshots: docs });
  } catch (err) {
    console.error("GET /api/snapshots error", err);
    return res.status(500).json({ ok: false, error: "internal_error" });
  }
});

export default router;
