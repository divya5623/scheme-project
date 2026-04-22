'use strict';

const OpenAI = require('openai');

let openaiClient = null;

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    return null;
  }
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

/**
 * Build the prompt string for the OpenAI API.
 */
function buildPrompt(userProfile, eligibleSchemes, ineligibleSchemes) {
  const profileSummary = `
User Profile:
- Age: ${userProfile.age} years
- Gender: ${userProfile.gender}
- Annual Income: ₹${(userProfile.annualIncome || 0).toLocaleString('en-IN')}
- Occupation: ${userProfile.occupation}
- Caste Category: ${userProfile.category}
- State: ${userProfile.state}
- Family Size: ${userProfile.familySize}
- BPL Status: ${userProfile.isBPL ? 'Yes' : 'No'}
- Has Disability: ${userProfile.hasDisability ? 'Yes' : 'No'}
- Is Student: ${userProfile.isStudent ? 'Yes' : 'No'}
- Has Land: ${userProfile.hasLand ? `Yes (${userProfile.landArea || 'unknown'} acres)` : 'No'}
- Has Existing Business: ${userProfile.hasExistingBusiness ? 'Yes' : 'No'}
- Wants to Start Business: ${userProfile.wantsToStartBusiness ? 'Yes' : 'No'}
- Is Pregnant: ${userProfile.isPregnant ? 'Yes' : 'No'}
- Has Bank Account: ${userProfile.hasBankAccount ? 'Yes' : 'No'}
- Is Married: ${userProfile.isMarried ? 'Yes' : 'No'}
- Number of Daughters: ${userProfile.numberOfDaughters || 0}
`.trim();

  const eligibleList = eligibleSchemes
    .slice(0, 10)
    .map((s, i) => `${i + 1}. ${s.scheme.name} (ID: ${s.scheme.id}) — Score: ${s.eligibilityResult.score}/100\n   ${s.scheme.description.split('.')[0]}.`)
    .join('\n');

  const ineligibleList = ineligibleSchemes
    .slice(0, 5)
    .map((s, i) => `${i + 1}. ${s.scheme.name} (ID: ${s.scheme.id}) — Missing: ${s.eligibilityResult.missingCriteria.slice(0, 2).join('; ')}`)
    .join('\n');

  return `You are an expert advisor on Indian government welfare schemes. Analyze the following user profile and their scheme eligibility results, then provide personalized recommendations.

${profileSummary}

ELIGIBLE SCHEMES (${eligibleSchemes.length} total, showing top 10):
${eligibleList || 'None'}

NEAR-MISS INELIGIBLE SCHEMES (top 5):
${ineligibleList || 'None'}

Please provide a response in the following EXACT JSON format (no markdown, no extra text):
{
  "summary": "A 3-4 sentence overview of the user's eligibility situation, highlighting their most important opportunities",
  "topRecommendations": [
    {
      "schemeId": "scheme-id-here",
      "explanation": "Why this scheme is particularly beneficial for this user (2-3 sentences)",
      "priority": "high/medium/low",
      "applicationTip": "Specific actionable tip for applying to this scheme"
    }
  ],
  "alternatives": [
    {
      "schemeId": "scheme-id-here",
      "reason": "Why the user doesn't qualify currently",
      "suggestion": "What the user can do to become eligible or what alternative to pursue"
    }
  ],
  "generalAdvice": "2-3 sentences of general advice for maximizing benefit from government schemes",
  "nextSteps": ["Step 1 action", "Step 2 action", "Step 3 action", "Step 4 action", "Step 5 action"]
}

Provide top 3-5 recommendations and 2-3 alternatives. Be specific and practical.`;
}

/**
 * Generate a rule-based fallback analysis without AI.
 */
function generateFallbackAnalysis(userProfile, eligibleSchemes, ineligibleSchemes) {
  const topSchemes = eligibleSchemes.slice(0, 5);
  const nearMisses = ineligibleSchemes.slice(0, 3);

  const schemeCount = eligibleSchemes.length;
  const topSchemeNames = topSchemes.map((s) => s.scheme.shortName || s.scheme.name).join(', ');

  let summary = `Based on your profile, you are eligible for ${schemeCount} government scheme${schemeCount !== 1 ? 's' : ''}. `;
  if (schemeCount > 0) {
    summary += `Your top opportunities include ${topSchemeNames}. `;
    if (userProfile.isBPL) {
      summary += 'As a BPL household, you have access to several targeted welfare programs. ';
    }
    if (userProfile.occupation === 'farmer') {
      summary += 'As a farmer, multiple agricultural support schemes are available to you. ';
    }
  } else {
    summary += 'Review the near-miss schemes below to understand steps needed to become eligible. ';
  }

  const topRecommendations = topSchemes.slice(0, 4).map((s) => {
    let priority = 'medium';
    if (s.eligibilityResult.score >= 80) priority = 'high';
    if (s.eligibilityResult.score < 60) priority = 'low';
    return {
      schemeId: s.scheme.id,
      explanation: `You qualify for ${s.scheme.name} with a match score of ${s.eligibilityResult.score}/100. ${s.scheme.benefits[0]}. ${s.eligibilityResult.reasons[0] || ''}`,
      priority,
      applicationTip: s.scheme.applicationProcess[0]
        ? `Start by: ${s.scheme.applicationProcess[0].description}`
        : `Visit the official portal at ${s.scheme.officialLink} to begin your application.`,
    };
  });

  const alternatives = nearMisses.map((s) => ({
    schemeId: s.scheme.id,
    reason: s.eligibilityResult.missingCriteria[0] || 'Does not meet all eligibility criteria',
    suggestion: `To qualify for ${s.scheme.shortName || s.scheme.name}, address: ${s.eligibilityResult.missingCriteria.slice(0, 2).join(' and ')}.`,
  }));

  let generalAdvice = 'Ensure all your documents (Aadhaar, bank account, income certificate) are up to date for smooth application processing. ';
  generalAdvice += 'Apply for multiple schemes simultaneously where possible to maximize benefits. ';
  generalAdvice += 'Visit your nearest Common Service Centre (CSC) or Gram Panchayat for free application assistance.';

  const nextSteps = [
    'Gather all required documents: Aadhaar Card, bank passbook, and income/caste certificates',
    topSchemes[0] ? `Apply for ${topSchemes[0].scheme.name} first (highest priority scheme)` : 'Review eligibility criteria for available schemes',
    'Visit your nearest Common Service Centre (CSC) for application help',
    'Enroll in PM Jan Dhan Yojana if you don\'t have a bank account yet',
    'Check scheme status regularly on the respective official portals',
  ];

  return { summary, topRecommendations, alternatives, generalAdvice, nextSteps };
}

/**
 * Analyze eligibility using OpenAI, with fallback to rule-based analysis.
 * @param {Object} userProfile
 * @param {Array} eligibleSchemes
 * @param {Array} ineligibleSchemes
 * @returns {Promise<{ summary, topRecommendations, alternatives, generalAdvice, nextSteps }>}
 */
async function analyzeEligibility(userProfile, eligibleSchemes, ineligibleSchemes) {
  const client = getOpenAIClient();

  if (!client) {
    return generateFallbackAnalysis(userProfile, eligibleSchemes, ineligibleSchemes);
  }

  const prompt = buildPrompt(userProfile, eligibleSchemes, ineligibleSchemes);

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert on Indian government welfare schemes. Always respond with valid JSON only, no markdown formatting or extra text.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 1500,
    });

    const rawContent = response.choices[0]?.message?.content?.trim();
    if (!rawContent) {
      throw new Error('Empty response from OpenAI');
    }

    const parsed = JSON.parse(rawContent);

    // Validate required fields
    if (!parsed.summary || !Array.isArray(parsed.topRecommendations) || !Array.isArray(parsed.nextSteps)) {
      throw new Error('Invalid response structure from OpenAI');
    }

    return parsed;
  } catch (err) {
    console.error('OpenAI analysis failed, falling back to rule-based analysis:', err.message);
    return generateFallbackAnalysis(userProfile, eligibleSchemes, ineligibleSchemes);
  }
}

module.exports = { analyzeEligibility };
