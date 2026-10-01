export interface NavItem {
  label: string;
  href: string;
}

export const NAV_LINKS: NavItem[] = [
  { label: "Home", href: "#hero" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "What We Check", href: "#checks" },
  { label: "Security Tips", href: "#tips" },
];

export interface WhyUsFeature {
  number: string;
  title: string;
  description: string;
  tag: string;
}

export const WHY_US_FEATURES: WhyUsFeature[] = [
  {
    number: "01",
    title: "Risk Detection",
    description:
      "Suspicious indicators across structure, language, and reputation are synthesized into a consolidated risk assessment score.",
    tag: "Signal Synthesis",
  },
  {
    number: "02",
    title: "URL Analysis",
    description:
      "Syntactic domain parsing, HTTPS validation, keyword pattern spotting, and known blacklist verification.",
    tag: "Structural Parsing",
  },
  {
    number: "03",
    title: "Email Analysis",
    description:
      "Inspection of urgent wording, fake security notifications, coercive language, and deceptive credential prompts.",
    tag: "Content Heuristics",
  },
  {
    number: "04",
    title: "Scan History",
    description:
      "Planned capability to review, search, and audit previously analyzed targets and threat assessments.",
    tag: "Auditable Archive",
  },
];

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  focus: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: "01",
    title: "Submit",
    description:
      "Provide a target URL, raw email content, or suspicious message text through the analysis console.",
    focus: "Input Normalization",
  },
  {
    step: "02",
    title: "Analyze",
    description:
      "The engine inspects structural parameters, keyword patterns, and reputation indicators.",
    focus: "Multi-Rule Parsing",
  },
  {
    step: "03",
    title: "Assess Risk",
    description:
      "Detected signals are weighted to compute an overall risk score and classify the threat tier.",
    focus: "Weighted Scoring",
  },
  {
    step: "04",
    title: "Take Action",
    description:
      "Review specific warning indicators and clear procedural recommendations before proceeding.",
    focus: "Defensive Guidance",
  },
];

export interface CheckVector {
  id: string;
  name: string;
  description: string;
  marker: string;
}

export const CHECK_VECTORS: CheckVector[] = [
  {
    id: "https",
    name: "HTTPS Usage",
    description: "Evaluates protocol security and identifies missing or degraded transmission encryption.",
    marker: "RFC Protocol Check",
  },
  {
    id: "keywords",
    name: "Suspicious Keywords",
    description: "Scans for known phishing phrases such as 'verify login', 'immediate suspension', or 'reset password'.",
    marker: "Lexical Matching",
  },
  {
    id: "domain",
    name: "Domain Structure",
    description: "Identifies deceptive subdomains, character substitutions, and misleading path structures.",
    marker: "Syntax Parsing",
  },
  {
    id: "blacklists",
    name: "Blacklisted URLs",
    description: "Cross-checks targets against documented security blacklists and reported malicious links.",
    marker: "Reputation Index",
  },
  {
    id: "reputation",
    name: "URL Reputation",
    description: "Evaluates historical safety standing and reported abuse records through security services.",
    marker: "Service Queries",
  },
  {
    id: "email-language",
    name: "Suspicious Language",
    description: "Detects artificial urgency, threatening repercussions, and fabricated administrative demands.",
    marker: "Pattern Heuristics",
  },
  {
    id: "links",
    name: "Suspicious Links",
    description: "Examines mismatch between anchor text and destination URLs, including shortened redirects.",
    marker: "Anchor Verification",
  },
  {
    id: "credentials",
    name: "Credential Requests",
    description: "Identifies deceptive prompts requesting passwords, PINs, OTP codes, or financial account details.",
    marker: "Harvesting Flags",
  },
];

export interface SecurityLayer {
  number: string;
  title: string;
  summary: string;
  points: string[];
}

export const SECURITY_LAYERS: SecurityLayer[] = [
  {
    number: "01",
    title: "Rule-Based Detection",
    summary:
      "Deterministic structural evaluation inspecting syntax anomalies, protocol mismatches, and deceptive format patterns.",
    points: [
      "Strict RFC URL parsing and path segmentation",
      "Protocol verification and port anomaly detection",
      "Deceptive domain formatting and excessive subdomain depth",
    ],
  },
  {
    number: "02",
    title: "Keyword Analysis",
    summary:
      "Targeted lexical evaluation identifying coercive phishing terminology, spoofed corporate signatures, and urgent calls to action.",
    points: [
      "High-risk authentication keyword matching",
      "Financial coercion and false deadline phrasing",
      "Impersonated executive and support communication templates",
    ],
  },
  {
    number: "03",
    title: "URL Reputation",
    summary:
      "Verification against known malicious destination databases and community-reported threat registries.",
    points: [
      "Known phishing database cross-referencing",
      "Previously reported scam landing page registries",
      "Suspicious domain naming trends",
    ],
  },
  {
    number: "04",
    title: "Security APIs",
    summary:
      "Planned integration with security intelligence endpoints to enhance local detection rules with verified external telemetry.",
    points: [
      "External threat rating verification",
      "Real-time URL category validation",
      "Standardized security provider response aggregation",
    ],
  },
];

export interface SecurityTip {
  number: string;
  title: string;
  subtitle: string;
  body: string;
  rule: string;
}

export const SECURITY_TIPS: SecurityTip[] = [
  {
    number: "01",
    title: "Verify Before You Click",
    subtitle: "Inspect Destination URLs Carefully",
    body: "Phishing links frequently mimic trusted services by altering a single character or hiding a malicious destination behind convincing link text. Always check the actual target destination before navigating.",
    rule: "RULE: Check the root domain carefully before clicking.",
  },
  {
    number: "02",
    title: "Never Hand Over Credentials",
    subtitle: "Guard Passwords & Verification Codes",
    body: "Legitimate organizations rarely request passwords, two-factor authentication tokens, or full payment card numbers via unsolicited email or SMS. Treat any sudden authentication demand as high risk.",
    rule: "RULE: Never submit credentials on unverified third-party pages.",
  },
  {
    number: "03",
    title: "Slow Down Urgent Requests",
    subtitle: "Recognize Pressure Tactics",
    body: "Phishers rely on panic—claiming your account will be deleted within 24 hours or an unauthorized purchase was completed. Take a breath and independently verify through official bookmarks or apps.",
    rule: "RULE: Panic and extreme urgency are hallmarks of social engineering.",
  },
];
