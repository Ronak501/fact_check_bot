export interface Review {
  publisher: string;
  rating: string;
  reviewDate: string;
  summary: string;
  url: string;
}

export interface AnalysisResult {
  claimDate: string;
  claimText: string;
  reviews: Review[];
}

export interface Message {
  id: string;
  role: string;
  content: string;
  analysisResult?: AnalysisResult;
}
