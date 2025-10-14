/**
 * Minimal server bootstrap for Step 0.
 * This is a health-check server; full APIs added in later steps.
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV || 'development' });
});

/**
 * Snapshot endpoint contract (not implemented yet) described below for future steps:
 * - POST /api/snapshots  -> save snapshot
 * - GET  /api/snapshots/:id -> get by id
 * - GET  /api/snapshots?latest=true -> get latest snapshot
 * - GET  /api/snapshots?file=<filename> -> list versions for a file
 */

app.listen(PORT, () => {
  console.log(`DevCompanion server listening on http://localhost:${PORT}`);
});
