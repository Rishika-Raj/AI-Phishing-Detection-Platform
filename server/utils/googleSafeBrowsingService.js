import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export async function checkGoogleSafeBrowsing(targetUrl) {
  const apiKey = process.env.GOOGLE_SAFE_BROWSING_KEY;
  if (!apiKey) {
    return { error: 'Google Safe Browsing API key not configured', isThreat: false };
  }

  try {
    const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;
    const payload = {
      client: {
        clientId: 'ai-phishing-platform',
        clientVersion: '1.0.0'
      },
      threatInfo: {
        threatTypes: [
          'MALWARE',
          'SOCIAL_ENGINEERING',
          'UNWANTED_SOFTWARE',
          'POTENTIALLY_HARMFUL_APPLICATION'
        ],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: [{ url: targetUrl }]
      }
    };

    const response = await axios.post(endpoint, payload, { timeout: 5000 });
    const matches = response.data?.matches || [];

    if (matches.length > 0) {
      return {
        isThreat: true,
        threatTypes: matches.map(m => m.threatType)
      };
    }

    return { isThreat: false, threatTypes: [] };
  } catch (error) {
    return { isThreat: false, error: error.message };
  }
}