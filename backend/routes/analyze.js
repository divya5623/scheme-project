'use strict';

const express = require('express');
const router = express.Router();
const schemes = require('../data/schemes');
const { rankSchemes } = require('../services/eligibilityService');
const { analyzeEligibility } = require('../services/aiService');

/**
 * Sanitize the user profile — remove unexpected fields and apply defaults.
 */
function sanitizeProfile(raw) {
  return {
    age: Number(raw.age) || 25,
    gender: ['male', 'female', 'other'].includes(raw.gender) ? raw.gender : 'other',
    annualIncome: Number(raw.annualIncome) || 0,
    occupation: raw.occupation || 'other',
    category: raw.category && ['general', 'obc', 'sc', 'st'].includes(raw.category.toLowerCase()) ? raw.category.toLowerCase() : 'general',
    state: raw.state || 'Delhi',
    familySize: Number(raw.familySize) || 1,
    hasDisability: Boolean(raw.hasDisability),
    isBPL: Boolean(raw.isBPL),
    isStudent: Boolean(raw.isStudent),
    hasLand: Boolean(raw.hasLand),
    landArea: Number(raw.landArea) || 0,
    hasExistingBusiness: Boolean(raw.hasExistingBusiness),
    wantsToStartBusiness: Boolean(raw.wantsToStartBusiness),
    isPregnant: Boolean(raw.isPregnant),
    hasBankAccount: Boolean(raw.hasBankAccount),
    isMarried: Boolean(raw.isMarried),
    numberOfDaughters: Number(raw.numberOfDaughters) || 0,
  };
}

/**
 * Validate that required fields are present and have sensible values.
 * Returns an array of error messages (empty if valid).
 */
function validateProfile(profile) {
  const errors = [];
  if (profile.age < 0 || profile.age > 120) {
    errors.push('age must be between 0 and 120');
  }
  if (profile.annualIncome < 0) {
    errors.push('annualIncome must be a non-negative number');
  }
  if (profile.familySize < 1 || profile.familySize > 50) {
    errors.push('familySize must be between 1 and 50');
  }
  return errors;
}

// POST /api/analyze
router.post('/', async (req, res, next) => {
  try {
    const rawProfile = req.body;
    if (!rawProfile || typeof rawProfile !== 'object') {
      return res.status(400).json({ success: false, message: 'Request body must be a JSON object with user profile data' });
    }

    const userProfile = sanitizeProfile(rawProfile);
    const validationErrors = validateProfile(userProfile);
    if (validationErrors.length > 0) {
      return res.status(400).json({ success: false, message: 'Invalid profile data', errors: validationErrors });
    }

    // Rank all schemes by eligibility score
    const ranked = rankSchemes(userProfile, schemes);

    const eligibleSchemes = ranked.filter((r) => r.eligibilityResult.eligible);
    const ineligibleSchemes = ranked.filter((r) => !r.eligibilityResult.eligible);

    // Run AI (or fallback) analysis
    const aiAnalysis = await analyzeEligibility(userProfile, eligibleSchemes, ineligibleSchemes);

    res.json({
      success: true,
      userProfile,
      eligibleSchemes,
      ineligibleSchemes: ineligibleSchemes.slice(0, 5), // top 5 near-misses
      aiAnalysis,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
