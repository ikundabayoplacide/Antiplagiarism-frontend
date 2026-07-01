export interface MockStudent {
  id: string;
  name: string;
  email: string;
  department: string;
  submissionsCount: number;
  joinedDate: string;
}

export interface MatchedDoc {
  source: string;
  similarity: number;
  matchedText: string;
}

export interface MockProject {
  id: string;
  title: string;
  studentName: string;
  studentId: string;
  dateSubmitted: string;
  similarityPercent: number;
  status: "Low" | "Medium" | "High";
  uploadedDate: string;
  wordCount: number;
  matchedDocs: MatchedDoc[];
}

export interface LecturerStats {
  supervisedStudents: number;
  supervisedStudentsTrend: string;
  totalProjects: number;
  totalProjectsTrend: string;
  reportsGenerated: number;
  reportsGeneratedTrend: string;
  highSimilarityProjects: number;
  highSimilarityProjectsTrend: string;
}

export const MOCK_STUDENTS: MockStudent[] = [
  { id: "std-1", name: "Sarah Jenkins", email: "s.jenkins@university.edu", department: "Computer Science", submissionsCount: 3, joinedDate: "2026-02-10" },
  { id: "std-2", name: "David Miller", email: "d.miller@university.edu", department: "Information Technology", submissionsCount: 2, joinedDate: "2026-02-15" },
  { id: "std-3", name: "Aisha Patel", email: "a.patel@university.edu", department: "Computer Science", submissionsCount: 4, joinedDate: "2026-01-20" },
  { id: "std-4", name: "Marcus Thompson", email: "m.thompson@university.edu", department: "Software Engineering", submissionsCount: 2, joinedDate: "2026-03-01" },
  { id: "std-5", name: "Elena Rostova", email: "e.rostova@university.edu", department: "Computer Science", submissionsCount: 3, joinedDate: "2026-02-05" },
  { id: "std-6", name: "Liam O'Connor", email: "l.oconnor@university.edu", department: "Information Technology", submissionsCount: 1, joinedDate: "2026-03-12" },
];

export const MOCK_PROJECTS: MockProject[] = [
  {
    id: "proj-1",
    title: "Optimizing Neural Network Architectures for Edge Devices",
    studentName: "Sarah Jenkins",
    studentId: "std-1",
    dateSubmitted: "2026-06-18",
    similarityPercent: 12,
    status: "Low",
    uploadedDate: "2026-06-18",
    wordCount: 8450,
    matchedDocs: [
      { source: "IEEE Journal of Edge Computing, 2024", similarity: 5, matchedText: "efficient deployment of convolution filters on memory-constrained microcontroller units is critical..." },
      { source: "GitHub Repository: TinyML-Optimization-Kit", similarity: 4, matchedText: "quantization-aware training using integer arithmetic representation of float32 weights..." }
    ]
  },
  {
    id: "proj-2",
    title: "Blockchain-Based Smart Contracts for Decentralized Identity Management",
    studentName: "David Miller",
    studentId: "std-2",
    dateSubmitted: "2026-06-16",
    similarityPercent: 68,
    status: "High",
    uploadedDate: "2026-06-16",
    wordCount: 12100,
    matchedDocs: [
      { source: "ACM Transactions on Privacy and Security, Vol. 18", similarity: 35, matchedText: "decentralized identity frameworks leverage cryptographic keys to issue self-sovereign attestations without relying on third-party identity providers..." },
      { source: "ArXiv Preprint: Self-Sovereign Identity on Ethereum", similarity: 25, matchedText: "ERC-725 standard enables proxy contracts that represent identities controlled by key pairs or multisig algorithms..." },
      { source: "Blockchain Developer Handbook, 2023", similarity: 8, matchedText: "gas optimization techniques in Solidity require avoiding storage operations inside tight loop iterations..." }
    ]
  },
  {
    id: "proj-3",
    title: "Real-time Object Detection in Low-Light Autonomous Driving Scenarios",
    studentName: "Aisha Patel",
    studentId: "std-3",
    dateSubmitted: "2026-06-14",
    similarityPercent: 42,
    status: "Medium",
    uploadedDate: "2026-06-14",
    wordCount: 9350,
    matchedDocs: [
      { source: "Computer Vision and Pattern Recognition (CVPR) 2025", similarity: 22, matchedText: "enhancing visibility in low-light environments using dual-attention feature fusion networks before feeding images to standard object detectors..." },
      { source: "MDPI Sensors Journal: Sensor Fusion in AVs", similarity: 15, matchedText: "thermal cameras provide supplementary infrared heat maps that mitigate illumination drops in urban tunnel systems..." },
      { source: "GitHub: low-light-detector-repo", similarity: 5, matchedText: "learning rate scheduled with cosine annealing starting from 1e-4 down to 1e-6 over 100 epochs..." }
    ]
  },
  {
    id: "proj-4",
    title: "Comparative Study of SQL vs. NoSQL Databases in High-Throughput Web Applications",
    studentName: "Marcus Thompson",
    studentId: "std-4",
    dateSubmitted: "2026-06-12",
    similarityPercent: 8,
    status: "Low",
    uploadedDate: "2026-06-12",
    wordCount: 6200,
    matchedDocs: [
      { source: "Database Systems Architecture, 5th Edition", similarity: 5, matchedText: "ACID transactions guarantee consistency at the cost of horizontal scaling bottlenecks in distributed multi-node clusters..." }
    ]
  },
  {
    id: "proj-5",
    title: "An Analysis of Natural Language Processing Models for Emotion Recognition",
    studentName: "Elena Rostova",
    studentId: "std-5",
    dateSubmitted: "2026-06-10",
    similarityPercent: 57,
    status: "High",
    uploadedDate: "2026-06-10",
    wordCount: 11400,
    matchedDocs: [
      { source: "Journal of Sentiment Analysis, 2024", similarity: 30, matchedText: "contextual embeddings derived from transformer decoders exhibit high sensitivity to sarcasm and double negations in casual web logs..." },
      { source: "ACL Conference Proceedings: Emotion Extraction", similarity: 20, matchedText: "we fine-tune a pre-trained encoder model on the GoEmotions dataset with a multi-label classification loss layer..." },
      { source: "Medium Article: Guide to HuggingFace Sentiment Models", similarity: 7, matchedText: "simply load pipeline('sentiment-analysis') from the transformers library to get zero-shot predictions..." }
    ]
  },
  {
    id: "proj-6",
    title: "Secure Data Aggregation Protocols for IoT-enabled Smart Grids",
    studentName: "Liam O'Connor",
    studentId: "std-6",
    dateSubmitted: "2026-06-08",
    similarityPercent: 18,
    status: "Low",
    uploadedDate: "2026-06-08",
    wordCount: 7900,
    matchedDocs: [
      { source: "IEEE Transactions on Smart Grid, 2023", similarity: 10, matchedText: "homomorphic encryption schemes enable aggregators to sum energy usage profiles without decrypting individual smart meter readings..." },
      { source: "Journal of Network Security, Vol. 9", similarity: 8, matchedText: "elliptic curve diffie-hellman key exchange establishes ephemeral shared keys with minimal computational overhead..." }
    ]
  },
  {
    id: "proj-7",
    title: "A Deep Learning Approach to Predictive Maintenance in Industrial Robots",
    studentName: "Sarah Jenkins",
    studentId: "std-1",
    dateSubmitted: "2026-05-22",
    similarityPercent: 15,
    status: "Low",
    uploadedDate: "2026-05-22",
    wordCount: 10200,
    matchedDocs: [
      { source: "Robotics and Computer-Integrated Manufacturing, 2024", similarity: 12, matchedText: "vibration analysis via fast Fourier transform (FFT) reveals anomaly peaks prior to physical gear breakdown..." }
    ]
  },
  {
    id: "proj-8",
    title: "A Blockchain Architecture for Supply Chain Transparency in Agriculture",
    studentName: "David Miller",
    studentId: "std-2",
    dateSubmitted: "2026-05-15",
    similarityPercent: 34,
    status: "Medium",
    uploadedDate: "2026-05-15",
    wordCount: 9800,
    matchedDocs: [
      { source: "Journal of Food Engineering: Traceability System", similarity: 20, matchedText: "QR code mapping linked with smart contract events logs temperature anomalies across transit routes..." },
      { source: "Blockchain Applications for Supply Chains", similarity: 14, matchedText: "hyperledger fabric provides private channels that safeguard wholesale price lists from public scrutiny..." }
    ]
  }
];

export const MOCK_STATS: LecturerStats = {
  supervisedStudents: 6,
  supervisedStudentsTrend: "+1 new this month",
  totalProjects: 8,
  totalProjectsTrend: "+2 submitted this week",
  reportsGenerated: 8,
  reportsGeneratedTrend: "100% submission coverage",
  highSimilarityProjects: 2,
  highSimilarityProjectsTrend: "25% of active projects",
};

export const MONTHLY_SUBMISSIONS_DATA = [
  { month: "Jan", submissions: 3 },
  { month: "Feb", submissions: 5 },
  { month: "Mar", submissions: 8 },
  { month: "Apr", submissions: 12 },
  { month: "May", submissions: 15 },
  { month: "Jun", submissions: 18 },
];

export const PLAGIARISM_LEVEL_DISTRIBUTION = [
  { name: "Low (0-20%)", value: 4, color: "#10b981" },     // Emerald 500
  { name: "Medium (21-49%)", value: 2, color: "#f59e0b" },  // Amber 500
  { name: "High (50%+)", value: 2, color: "#ef4444" },      // Red 500
];

export const SIMILARITY_TRENDS_DATA = [
  { month: "Jan", avgSimilarity: 18 },
  { month: "Feb", avgSimilarity: 25 },
  { month: "Mar", avgSimilarity: 22 },
  { month: "Apr", avgSimilarity: 30 },
  { month: "May", avgSimilarity: 28 },
  { month: "Jun", avgSimilarity: 32 },
];

export const LECTURER_NOTIFICATIONS = [
  { id: "n-1", title: "New Project Submission", message: "Sarah Jenkins submitted 'Optimizing Neural Network Architectures'", time: "2 hours ago", read: false },
  { id: "n-2", title: "Plagiarism Alert (High Similarity)", message: "Elena Rostova's project flagged at 57% similarity", time: "1 day ago", read: false },
  { id: "n-3", title: "Report Download Complete", message: "PDF Summary for Blockchain ID project is ready", time: "3 days ago", read: true },
];
