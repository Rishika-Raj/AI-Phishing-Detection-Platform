import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export async function checkVirusTotal(targetUrl) {
  const apiKey = process.env.VIRUSTOTAL_API_KEY;
  if (!apiKey) {
    return { error: 'VirusTotal API key not configured', maliciousCount: 0 };
  }

  try {
    const urlId = Buffer.from(targetUrl)
      .toString('base64')
      .replace(/=/g, '');

    const response = await axios.get(`https://www.virustotal.com/api/v3/urls/${urlId}`, {
      headers: { 'x-apikey': apiKey },
      timeout: 5000
    });

    const stats = response.data?.data?.attributes?.last_analysis_stats || {};
    const maliciousCount = (stats.malicious || 0) + (stats.suspicious || 0);

    return {
      scanned: true,
      maliciousCount,
      totalEngines: Object.values(stats).reduce((a, b) => a + b, 0),
      stats
    };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { scanned: false, maliciousCount: 0, message: 'URL not previously indexed by VirusTotal' };
    }
    return { scanned: false, maliciousCount: 0, error: error.message };
  }
}