
export function runHeuristicChecks(rawUrl) {
  let score = 0;
  const flags = [];

  let normalizedUrl = rawUrl.trim();
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = `http://${normalizedUrl}`;
  }

  let parsed;
  try {
    parsed = new URL(normalizedUrl);
  } catch {
    return {
      score: 100,
      flags: ['Invalid/Malformed URL format'],
      isMalformed: true
    };
  }

  const hostname = parsed.hostname.toLowerCase();

  // 1. Missing HTTPS protocol
  if (parsed.protocol !== 'https:') {
    score += 20;
    flags.push('Insecure HTTP protocol (No SSL/TLS encryption)');
  }

  // 2. Direct IP used instead of domain name
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Pattern.test(hostname)) {
    score += 35;
    flags.push('Direct IP address used as hostname');
  }

  // 3. Subdomain depth check
  const subdomains = hostname.split('.');
  if (subdomains.length > 3) {
    score += 15;
    flags.push(`Excessive subdomains detected (${subdomains.length - 2} levels)`);
  }

  // 4. URL character length
  if (rawUrl.length > 75) {
    score += 10;
    flags.push('Unusually long URL length');
  }

  // 5. Sensitive credentials / brand impersonation patterns
  const suspiciousKeywords = [
    'paypal', 'bank', 'secure', 'login', 'verify', 
    'update', 'signin', 'wallet', 'free', 'account', 'auth'
  ];
  let matched = 0;
  suspiciousKeywords.forEach(kw => {
    if (hostname.includes(kw)) matched++;
  });

  if (matched >= 2) {
    score += 30;
    flags.push(`Multiple high-risk keywords in domain (${matched} detected)`);
  } else if (matched === 1) {
    score += 10;
    flags.push('High-risk keyword found in domain');
  }

  return { score, flags, isMalformed: false, hostname };
}