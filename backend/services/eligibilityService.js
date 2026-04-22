'use strict';

/**
 * Rule-based eligibility checker for Indian government schemes.
 * @param {Object} userProfile - The user's profile data
 * @param {Object} scheme - The scheme to check eligibility against
 * @returns {{ eligible: boolean, score: number, reasons: string[], missingCriteria: string[] }}
 */
function checkEligibility(userProfile, scheme) {
  const reasons = [];
  const missingCriteria = [];
  let score = 0;
  const totalChecks = [];

  const e = scheme.eligibility;

  // --- Age check ---
  if (e.minAge !== null && e.minAge !== undefined) {
    totalChecks.push('minAge');
    if (userProfile.age >= e.minAge) {
      score += 10;
      reasons.push(`Age ${userProfile.age} meets minimum age requirement of ${e.minAge}`);
    } else {
      missingCriteria.push(`Minimum age required: ${e.minAge} years (your age: ${userProfile.age})`);
    }
  }

  if (e.maxAge !== null && e.maxAge !== undefined) {
    totalChecks.push('maxAge');
    if (userProfile.age <= e.maxAge) {
      score += 10;
      reasons.push(`Age ${userProfile.age} is within the maximum age limit of ${e.maxAge}`);
    } else {
      missingCriteria.push(`Maximum age allowed: ${e.maxAge} years (your age: ${userProfile.age})`);
    }
  }

  // --- Gender check ---
  if (e.gender && e.gender !== 'all') {
    totalChecks.push('gender');
    if (userProfile.gender === e.gender) {
      score += 10;
      reasons.push(`Gender matches scheme requirement (${e.gender})`);
    } else {
      missingCriteria.push(`Scheme is for ${e.gender} applicants only`);
    }
  }

  // --- Income check ---
  if (e.maxAnnualIncome !== null && e.maxAnnualIncome !== undefined) {
    totalChecks.push('income');
    if (userProfile.annualIncome <= e.maxAnnualIncome) {
      score += 15;
      reasons.push(`Annual income ₹${userProfile.annualIncome.toLocaleString('en-IN')} is within the limit of ₹${e.maxAnnualIncome.toLocaleString('en-IN')}`);
    } else {
      missingCriteria.push(`Maximum annual income allowed: ₹${e.maxAnnualIncome.toLocaleString('en-IN')} (your income: ₹${userProfile.annualIncome.toLocaleString('en-IN')})`);
    }
  }

  // --- Occupation check ---
  if (e.occupation && !e.occupation.includes('all')) {
    totalChecks.push('occupation');
    const normalizedOccupation = normalizeOccupation(userProfile.occupation);
    if (e.occupation.includes(normalizedOccupation) || e.occupation.includes(userProfile.occupation)) {
      score += 15;
      reasons.push(`Occupation "${userProfile.occupation}" matches scheme requirements`);
    } else {
      missingCriteria.push(`Required occupation: ${e.occupation.join(' or ')} (your occupation: ${userProfile.occupation})`);
    }
  }

  // --- Category check ---
  if (e.category && !e.category.includes('all')) {
    totalChecks.push('category');
    const userCategoryNormalized = userProfile.category ? userProfile.category.toUpperCase() : 'GENERAL';
    const schemeCategoriesNormalized = e.category.map((c) => c.toUpperCase());
    if (schemeCategoriesNormalized.includes(userCategoryNormalized)) {
      score += 10;
      reasons.push(`Category "${userCategoryNormalized}" matches scheme eligibility`);
    } else {
      missingCriteria.push(`Scheme is restricted to: ${e.category.join(', ')} categories (your category: ${userCategoryNormalized})`);
    }
  }

  // --- BPL check ---
  if (e.requiresBPL === true) {
    totalChecks.push('bpl');
    if (userProfile.isBPL === true) {
      score += 15;
      reasons.push('BPL status confirmed — scheme requires BPL household');
    } else {
      missingCriteria.push('Scheme requires Below Poverty Line (BPL) status');
    }
  }

  // --- Disability check ---
  if (e.requiresDisability === true) {
    totalChecks.push('disability');
    if (userProfile.hasDisability === true) {
      score += 10;
      reasons.push('Disability status confirmed — scheme requires disability');
    } else {
      missingCriteria.push('Scheme requires disability status');
    }
  }

  // --- Land ownership check ---
  if (e.requiresLand === true) {
    totalChecks.push('land');
    if (userProfile.hasLand === true) {
      score += 10;
      reasons.push('Land ownership confirmed — scheme requires land ownership');
    } else {
      missingCriteria.push('Scheme requires ownership of agricultural land');
    }
  }

  // --- State check ---
  if (e.states && !e.states.includes('all')) {
    totalChecks.push('state');
    if (e.states.includes(userProfile.state)) {
      score += 5;
      reasons.push(`State "${userProfile.state}" is covered under this scheme`);
    } else {
      missingCriteria.push(`Scheme is only available in: ${e.states.join(', ')} (your state: ${userProfile.state})`);
    }
  }

  // --- Scheme-specific bonus scoring (contextual relevance) ---
  score += computeContextualBonus(userProfile, scheme);

  // Cap score at 100
  score = Math.min(100, Math.max(0, Math.round(score)));

  const eligible = missingCriteria.length === 0;

  // If eligible and no specific positive reasons were generated, add a general one
  if (eligible && reasons.length === 0) {
    reasons.push('You meet all basic eligibility criteria for this scheme');
  }

  return { eligible, score, reasons, missingCriteria };
}

/**
 * Compute contextual bonus points based on how relevant the scheme is to the user.
 */
function computeContextualBonus(userProfile, scheme) {
  let bonus = 0;
  const id = scheme.id;

  switch (id) {
    case 'pm-kisan':
    case 'pm-fasal-bima':
    case 'pm-kisan-maandhan':
      if (userProfile.occupation === 'farmer') bonus += 5;
      if (userProfile.hasLand) bonus += 5;
      break;
    case 'pmay-gramin':
    case 'mgnrega':
    case 'nsap-old-age-pension':
      if (userProfile.isBPL) bonus += 5;
      break;
    case 'ayushman-bharat-pmjay':
    case 'rsby':
      if (userProfile.isBPL || userProfile.annualIncome < 200000) bonus += 5;
      break;
    case 'pm-jan-dhan':
      if (!userProfile.hasBankAccount) bonus += 10;
      break;
    case 'mudra-yojana':
    case 'pmegp':
    case 'startup-india':
      if (userProfile.wantsToStartBusiness || userProfile.hasExistingBusiness) bonus += 5;
      break;
    case 'pm-ujjwala':
      if (userProfile.gender === 'female' && userProfile.isBPL) bonus += 5;
      break;
    case 'beti-bachao-beti-padhao':
    case 'sukanya-samriddhi':
      if (userProfile.numberOfDaughters > 0) bonus += 10;
      break;
    case 'pm-scholarship':
    case 'national-scholarship-sc-st':
    case 'pm-kaushal-vikas':
      if (userProfile.isStudent) bonus += 5;
      break;
    case 'atal-pension-yojana':
    case 'senior-citizen-savings':
      if (userProfile.age >= 40) bonus += 3;
      break;
    case 'pm-matru-vandana':
      if (userProfile.isPregnant) bonus += 10;
      break;
    case 'pm-svanidhi':
      if (userProfile.occupation === 'self-employed') bonus += 5;
      break;
    default:
      break;
  }

  return bonus;
}

/**
 * Normalize occupation string to match scheme occupation keys.
 */
function normalizeOccupation(occupation) {
  if (!occupation) return 'other';
  const map = {
    farmer: 'farmer',
    agriculture: 'farmer',
    'self-employed': 'self-employed',
    selfemployed: 'self-employed',
    business: 'business-owner',
    'business-owner': 'business-owner',
    student: 'student',
    unemployed: 'unemployed',
    salaried: 'salaried',
    'daily-wage': 'daily-wage-worker',
    'daily-wage-worker': 'daily-wage-worker',
    retired: 'retired',
    other: 'other',
  };
  return map[occupation.toLowerCase()] || occupation.toLowerCase();
}

/**
 * Rank all schemes by eligibility score for a given user profile.
 * @param {Object} userProfile
 * @param {Array} allSchemes
 * @returns {Array<{ scheme: Object, eligibilityResult: Object }>} sorted descending by score
 */
function rankSchemes(userProfile, allSchemes) {
  const results = allSchemes.map((scheme) => ({
    scheme,
    eligibilityResult: checkEligibility(userProfile, scheme),
  }));

  results.sort((a, b) => b.eligibilityResult.score - a.eligibilityResult.score);
  return results;
}

module.exports = { checkEligibility, rankSchemes };
