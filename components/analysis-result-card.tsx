import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import type { AnalysisResult, Review } from "@/lib/types";

interface AnalysisResultCardProps {
  result: AnalysisResult;
}

export function AnalysisResultCard({ result }: AnalysisResultCardProps) {
  const getRatingBadge = (rating: string) => {
    const lowerRating = rating.toLowerCase();

    if (
      lowerRating.includes("misleading") ||
      lowerRating.includes("false") ||
      lowerRating.includes("fake")
    ) {
      return (
        <Badge variant="destructive" className="mb-2">
          <XCircle className="w-3 h-3 mr-1" /> {rating}
        </Badge>
      );
    } else if (
      lowerRating.includes("true") ||
      lowerRating.includes("reliable") ||
      lowerRating.includes("accurate") ||
      lowerRating.includes("verified")
    ) {
      return (
        <Badge
          variant="default"
          className="mb-2 bg-green-500 hover:bg-green-600"
        >
          <CheckCircle className="w-3 h-3 mr-1" /> {rating}
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="secondary"
          className="mb-2 bg-yellow-500 text-white hover:bg-yellow-600"
        >
          <AlertTriangle className="w-3 h-3 mr-1" /> {rating}
        </Badge>
      );
    }
  };

  const formatDate = (dateString: string) => {
    if (dateString === "N/A") return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card className="p-4 mt-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <h3 className="font-medium text-sm mb-2">Claim Analysis</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
        {result.claimText}
      </p>

      <div className="space-y-3">
        {result.reviews.map((review: Review, index: number) => (
          <div
            key={index}
            className="border-t pt-3 border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getRatingBadge(review.rating)}
                <span className="text-xs font-medium">{review.publisher}</span>
              </div>
              <span className="text-xs text-slate-500">
                {formatDate(review.reviewDate)}
              </span>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
              {review.summary}
            </p>

            <a
              href={review.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs flex items-center text-blue-500 hover:text-blue-600"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              View full fact-check
            </a>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500">
        Claim date: {formatDate(result.claimDate)}
      </div>
    </Card>
  );
}
