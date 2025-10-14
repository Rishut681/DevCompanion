import express from 'express';
import snapshotsRouter from './snapshots.js';
import analyzeRouter from './analyze.js';

const router = express.Router();

// Mount routes
router.use('/snapshots', snapshotsRouter);
router.use('/analyze', analyzeRouter);

export default router;
