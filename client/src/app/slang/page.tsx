"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SlangTerm {
  id?: string;
  term: string;
  canonical?: string | null;
  meaning: string;
  context?: string | null;
  examples: string[];
  type: string;
  youtubeUrl?: string | null;
}

const ITEMS_PER_PAGE = 25;

export default function SlangPage() {
  const [selectedTerm, setSelectedTerm] = useState<SlangTerm | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useQuery<{
    data: SlangTerm[];
    page: number;
    totalPages: number;
    total: number;
  }, Error>({
    queryKey: ["slang", currentPage],
    queryFn: async () => {
      const res = await api.get("/slang", {
        params: { page: currentPage, limit: ITEMS_PER_PAGE },
      });
      return res.data;
    },
    placeholderData: (prev) => prev,
  });

  const currentTerms = data?.data ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-yellow-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
              Most common Gen Z Slang 🔥
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your ultimate guide to the most popular Gen Z expressions. Click any term to learn more!
            </p>
          </div>

          {/* Loading / Error States */}
          {isLoading && (
            <p className="text-center text-gray-500">Loading slang terms…</p>
          )}
          {error && (
            <p className="text-center text-red-600">Failed to load slang terms.</p>
          )}

          {/* Grid of Slang Terms */}
          {!isLoading && !error && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {currentTerms.map((term) => (
                  <Card
                    key={term.id ?? term.term}
                    className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                    onClick={() => setSelectedTerm(term)}
                  >
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg font-semibold text-center">
                        {term.term}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="mt-8 flex justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    Page {currentPage} of {totalPages || 1}
                  </span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  Last
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Dialog for Term Details */}
      <Dialog open={!!selectedTerm} onOpenChange={() => setSelectedTerm(null)}>
        <DialogContent className="sm:max-w-[425px]">
          {selectedTerm && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  {selectedTerm.term}
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500">
                  Click outside to close
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Definition</h4>
                  <p className="text-gray-700 mt-1">{selectedTerm.meaning}</p>
                </div>
                {selectedTerm.context && (
                  <div>
                    <h4 className="font-semibold text-gray-900">Context</h4>
                    <p className="text-gray-700 mt-1">{selectedTerm.context}</p>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-gray-900">Examples</h4>
                  <div className="space-y-2 mt-1">
                    {selectedTerm.examples.map((example, index) => (
                      <div key={index} className="bg-gray-50 p-2 rounded-md">
                        <p className="text-gray-700">{example}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Video section */}
                <div>
                  <h4 className="font-semibold text-gray-900">Related Video</h4>
                  {selectedTerm.youtubeUrl ? (
                    <div className="w-full mt-2">
                      <iframe
                        className="w-full aspect-video rounded-md"
                        src={`https://www.youtube.com/embed/${getYoutubeId(selectedTerm.youtubeUrl)}`}
                        title={`YouTube video for ${selectedTerm.term}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <p className="text-gray-600 mt-2">
                      Reference video coming soon, twin! Stay tuned for more vibes. 🎬
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Utility to extract YouTube video ID from various URL formats
function getYoutubeId(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.slice(1);
    }
    const vParam = parsed.searchParams.get('v');
    if (vParam) return vParam;
    // Handle /embed/VIDEO_ID path
    const pathParts = parsed.pathname.split('/');
    return pathParts[pathParts.length - 1];
  } catch {
    // Fallback regex
    const match = url.match(/[A-Za-z0-9_-]{11}$/);
    return match ? match[0] : '';
  }
} 