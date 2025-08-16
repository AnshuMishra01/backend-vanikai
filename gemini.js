



async function geminiPrompt(fetch, url, prompt) {
  const body = { contents: [{ parts: [{ text: prompt }] }] };
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await response.json();
  if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
    return data.candidates[0].content.parts[0].text;
  }
  if (data?.error) {
    console.error('Gemini API error:', data.error);
    return `Gemini API error: ${data.error.message || JSON.stringify(data.error)}`;
  }
  return 'No analysis generated.';
}

async function getGeminiAnalysis(userInput, type) {
  const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;

  if (type === 'mvp') {
    // ...existing MVP logic...
    const summaryPrompt = `You are a startup analyst. Given this idea: "${userInput.idea}", write a concise, one-sentence summary for a pitch deck. Do not invent details.`;
    const summary = await geminiPrompt(fetch, url, summaryPrompt);
  const marketPrompt = `You are a startup analyst. Using real, recent (last 3-4 years) data from sources like Statista, what is the market opportunity and size for this idea: "${userInput.idea}"? If no data is available, provide a realistic estimate or industry context, and clearly state when you are estimating. Cite your sources if possible.`;
    const market = await geminiPrompt(fetch, url, marketPrompt);
  const featuresPrompt = `You are a startup analyst. Given this MVP vision: "${userInput.mvpVision}", list only the most essential MVP features to test the core value. If you must estimate, clearly state so.`;
    const features = await geminiPrompt(fetch, url, featuresPrompt);
  const risksPrompt = `You are a startup analyst. Based on this input: "${userInput.assumptions}", list the main assumptions and associated risks. If you must estimate, clearly state so.`;
    const risks = await geminiPrompt(fetch, url, risksPrompt);
  const competitorPrompt = `You are a startup analyst. Based on this idea: "${userInput.idea}", list real, current direct and indirect competitors (if any), using only verifiable information. If no competitors are found, provide a realistic industry context or estimate, and clearly state so. Cite sources if possible.`;
    const competitors = await geminiPrompt(fetch, url, competitorPrompt);
    return [
      '### Startup Analysis: MVP Market Analysis',
      '---',
      '**1. Concise Summary of the Idea**', summary,
      '\n---\n**2. Market Opportunity and Size**', market,
      '\n---\n**3. Key MVP Features to Focus On**', features,
      '\n---\n**4. Main Assumptions and Risks**', risks,
      '\n---\n**5. Short Competitor Summary**', competitors
    ].join('\n\n');
  }
  if (type === 'market') {
    // Market Details & Product-Market Fit
  const overviewPrompt = `You are a startup analyst. Using real, recent (last 3-4 years) data from sources like Statista, provide a market overview and key trends for this market: "${userInput.marketDescription}". If no data is available, provide a realistic estimate or industry context, and clearly state when you are estimating. Cite your sources if possible.`;
    const overview = await geminiPrompt(fetch, url, overviewPrompt);
  const pmfPrompt = `You are a startup analyst. Given this approach to product-market fit: "${userInput.pmfApproach}", provide a realistic, actionable PMF strategy. If you must estimate, clearly state so.`;
    const pmf = await geminiPrompt(fetch, url, pmfPrompt);
  const launchPrompt = `You are a startup analyst. Given this launch plan: "${userInput.launchPlan}", recommend a launch region/city and justify with real, recent data if possible. If no data is available, provide a realistic estimate or industry context, and clearly state when you are estimating. Cite your sources if possible.`;
    const launch = await geminiPrompt(fetch, url, launchPrompt);
  const metricsPrompt = `You are a startup analyst. What are the most important metrics to track for this market and MVP? Base your answer on real, recent startup best practices. If you must estimate, clearly state so.`;
    const metrics = await geminiPrompt(fetch, url, metricsPrompt);
    return [
      '### Startup Analysis: Market Details & Product-Market Fit',
      '---',
      '**1. Market Overview and Trends**', overview,
      '\n---\n**2. Product-Market Fit Strategy**', pmf,
      '\n---\n**3. Recommended Launch Region and Why**', launch,
      '\n---\n**4. Key Metrics to Track**', metrics
    ].join('\n\n');
  }
  if (type === 'competitive') {
    // Competitive Analysis
  const competitorsPrompt = `You are a startup analyst. Based on this input: "${userInput.competitors}", list real, current MVP-stage competitors (if any), using only verifiable information. If no competitors are found, DO NOT say 'No analysis generated.' Instead, provide a realistic industry context, estimate, or explain why data is unavailable, and clearly state so. Cite sources if possible.`;
    const competitors = await geminiPrompt(fetch, url, competitorsPrompt);
  const swotPrompt = `You are a startup analyst. Based on this input: "${userInput.strengthsWeaknesses} ${userInput.opportunitiesThreats}", provide a realistic SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) for this startup. If you must estimate, clearly state so. Never say 'No analysis generated.'`;
    const swot = await geminiPrompt(fetch, url, swotPrompt);
  const diffPrompt = `You are a startup analyst. Based on this input: "${userInput.differentiation}", suggest realistic ways to differentiate the MVP from existing solutions. If you must estimate, clearly state so. Never say 'No analysis generated.'`;
    const diff = await geminiPrompt(fetch, url, diffPrompt);
    return [
      '### Startup Analysis: Competitive Analysis',
      '---',
      '**1. MVP-Stage Competitors**', competitors,
      '\n---\n**2. SWOT Analysis**', swot,
      '\n---\n**3. Suggestions for Differentiation**', diff
    ].join('\n\n');
  }
  return 'Analysis for this type is not yet implemented.';
}

module.exports = { getGeminiAnalysis };
