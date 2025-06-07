"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Bot,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

interface Review {
  publisher: string;
  rating: string;
  reviewDate: string;
  summary: string;
  url: string;
}

interface AnalysisResult {
  claimDate: string;
  claimText: string;
  reviews: Review[];
}

interface Message {
  id: string;
  role: string;
  content: string;
  analysisResult?: AnalysisResult;
}

export default function NewsAnalyzerChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setInput("");

    try {
      // Call your backend API
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/analysis/`, {
        message: input,
      });

      // Extract the analysis result from the response
      const analysisResult = response.data.results[0];

      // Create a readable summary from the analysis result
      let summary = "";
      if (analysisResult.reviews && analysisResult.reviews.length > 0) {
        const review = analysisResult.reviews[0];
        summary = `This claim has been rated as "${review.rating}" by ${review.publisher}.\n\n${review.summary}`;
      } else {
        summary =
          "I've analyzed this claim but couldn't find specific fact-checks.";
      }

      // Add assistant message with analysis result
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: summary,
        analysisResult: analysisResult,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error analyzing message:", error);

      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content:
          "Sorry, I couldn't analyze that message. Please make sure the backend server is running on localhost:8000.",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getMessageIcon = (role: string) => {
    return role === "user" ? (
      <User className="w-5 h-5" />
    ) : (
      <Bot className="w-5 h-5" />
    );
  };

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
    } else if (
      lowerRating.includes("caution") ||
      lowerRating.includes("unclear") ||
      lowerRating.includes("partial") ||
      lowerRating.includes("mixed")
    ) {
      return (
        <Badge
          variant="secondary"
          className="mb-2 bg-yellow-500 text-white hover:bg-yellow-600"
        >
          <AlertTriangle className="w-3 h-3 mr-1" /> {rating}
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="mb-2">
        {rating}
      </Badge>
    );
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
    <div className="container mx-auto max-w-4xl h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center py-6 border-b bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              News Analyzer AI
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Analyze news for misinformation and get AI-powered insights
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <Bot className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-2">
                Welcome to News Analyzer AI
              </h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Share a news article, headline, or claim and I'll help you
                analyze it for accuracy and potential misinformation.
              </p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                <Card className="p-4 text-left">
                  <h4 className="font-medium mb-2">Example Questions:</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>• "Is this news article reliable?"</li>
                    <li>• "Analyze this headline for bias"</li>
                    <li>• "Check this claim for accuracy"</li>
                  </ul>
                </Card>
                <Card className="p-4 text-left">
                  <h4 className="font-medium mb-2">I can help with:</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>• Fact-checking claims</li>
                    <li>• Source credibility analysis</li>
                    <li>• Bias detection</li>
                  </ul>
                </Card>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex gap-3 max-w-3xl ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {getMessageIcon(message.role)}
                </div>
                <Card
                  className={`p-4 ${
                    message.role === "user"
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white dark:bg-slate-800"
                  }`}
                >
                  {message.role === "assistant" && message.analysisResult && (
                    <div className="mb-3">
                      {message.analysisResult.reviews &&
                        message.analysisResult.reviews.length > 0 && (
                          <div className="flex flex-col gap-2">
                            {message.analysisResult.reviews.map(
                              (review, index) => (
                                <div key={index} className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      {getRatingBadge(review.rating)}
                                      <span className="text-xs font-medium">
                                        {review.publisher}
                                      </span>
                                    </div>
                                    <span className="text-xs text-slate-500">
                                      {formatDate(review.reviewDate)}
                                    </span>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      <div className="text-xs text-slate-500 mt-2">
                        Claim date:{" "}
                        {formatDate(message.analysisResult.claimDate)}
                      </div>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  {message.role === "assistant" &&
                    message.analysisResult &&
                    message.analysisResult.reviews &&
                    message.analysisResult.reviews.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                        <a
                          href={message.analysisResult.reviews[0].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs flex items-center text-blue-500 hover:text-blue-600"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View full fact-check
                        </a>
                      </div>
                    )}
                </Card>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex gap-3 max-w-3xl">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  <Bot className="w-5 h-5" />
                </div>
                <Card className="p-4 bg-white dark:bg-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-sm text-slate-500">Analyzing...</span>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Form */}
      <div className="p-4 border-t bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Share a news article, headline, or claim to analyze..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
          AI-powered news analysis • Always verify important information from
          multiple sources
        </p>
      </div>
    </div>
  );
}
