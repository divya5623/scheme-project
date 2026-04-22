'use strict';

const express = require('express');
const router = express.Router();
const schemes = require('../data/schemes');

// GET /api/schemes — return all schemes with optional filters
router.get('/', (req, res) => {
  const { category, occupation, state } = req.query;
  let result = schemes;

  if (category) {
    const cat = category.toUpperCase();
    result = result.filter((s) => s.eligibility.category.includes('all') || s.eligibility.category.map((c) => c.toUpperCase()).includes(cat));
  }

  if (occupation) {
    const occ = occupation.toLowerCase();
    result = result.filter((s) => s.eligibility.occupation.includes('all') || s.eligibility.occupation.includes(occ));
  }

  if (state) {
    result = result.filter((s) => s.eligibility.states.includes('all') || s.eligibility.states.includes(state));
  }

  res.json({ success: true, count: result.length, data: result });
});

// GET /api/schemes/:id — return a single scheme
router.get('/:id', (req, res) => {
  const scheme = schemes.find((s) => s.id === req.params.id);
  if (!scheme) {
    return res.status(404).json({ success: false, message: `Scheme with id "${req.params.id}" not found` });
  }
  res.json({ success: true, data: scheme });
});

module.exports = router;
