"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface TranslationResponse {
  meaning: string;
  context: string;
  examples: string[];
  nonGenZInsights: string[];
  disclaimer: string;
}

export default function Home() {
  const [term, setTerm] = useState("");
  const [response, setResponse] = useState<TranslationResponse | null>(null);

  const translateMutation = useMutation({
    mutationFn: async (term: string) => {
      const response = await api.post("/ai/translate-gen-z", { term });
      return response.data;
    },
    onSuccess: (data) => {
      setResponse(data);
      toast.success("Translation completed!");
    },
    onError: (error) => {
      console.error("Translation error:", error);
      toast.error("Failed to translate. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!term.trim()) {
      toast.error("Please enter a Gen Z term to translate");
      return;
    }
    translateMutation.mutate(term.trim());
  };

  const examples = [
    {
      label: "Contextual slang + emojis",
      value: "what's 'gng'? i saw this on some ig comments and someone replied, 'you're cooked gng 🥀 🥀 🥀 '",
    },
    {
      label: "No cap in a sentence",
      value: "my kid said 'no cap' when I asked if he finished his chores. what does that mean?",
    },
    {
      label: "It's giving...",
      value: "My daughter keeps saying 'it's giving' but not followed by anything. Like 'OMG, this outfit, it's giving!'. Giving what?",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-yellow-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
              Speak Gen Z in Seconds 🍒
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Drop any Gen Z word or phrase below and get a no-cap, parent-friendly explanation—fast.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle>Drop Your Slang</CardTitle>
                <CardDescription>
                  Type any Gen Z slang, phrase, or expression you want to understand
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="term">Gen Z Term or Phrase</Label>
                    <Textarea
                      id="term"
                      placeholder="e.g., &quot;That&apos;s cap&quot;, &quot;No cap&quot;, &quot;Slay&quot;, &quot;Periodt&quot;, &quot;Bussin&quot;..."
                      value={term}
                      onChange={(e) => setTerm(e.target.value)}
                      className="min-h-[120px] resize-none"
                      disabled={translateMutation.isPending}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={translateMutation.isPending || !term.trim()}
                  >
                    {translateMutation.isPending ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Translating...
                      </>
                    ) : (
                      "Make it make sense"
                    )}
                  </Button>
                  {/* Example Use Cases */}
                  <div className="mt-10 space-y-4 max-w-xl">
                     <p className="text-sm font-semibold text-gray-700 leading-relaxed">Need inspo? Try one of these:</p>
                     <div className="flex flex-col gap-3">
                       {examples.map((ex) => (
                         <button
                           key={ex.label}
                           type="button"
                           className="w-full text-left rounded-xl bg-muted/40 hover:bg-muted/70 transition px-5 py-4 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring text-base leading-relaxed font-medium"
                           onClick={() => {
                             setTerm(ex.value);
                             setResponse(null);
                           }}
                         >
                           {ex.value}
                         </button>
                       ))}
                     </div>
                   </div>
                </form>
              </CardContent>
            </Card>

            {/* Results Display */}
            <div className="space-y-6">
              {response && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">&quot;{term}&quot;</span>
                        <span className="text-sm font-normal text-gray-500">Translation</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Meaning</h4>
                        <p className="text-gray-700">{response.meaning}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Context</h4>
                        <p className="text-gray-700">{response.context}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Usage Examples</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {response.examples.map((example, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-gray-700">{example}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Insights for Non-Gen Z</CardTitle>
                      <CardDescription>
                        Practical advice to understand or use this term without sounding cringe
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {response.nonGenZInsights.map((tip, index) => (
                          <div key={index} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-200">
                            <p className="text-gray-700">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardHeader>
                      <CardTitle className="text-yellow-800">Important Note</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-yellow-700 text-sm">{response.disclaimer}</p>
                    </CardContent>
                  </Card>
                </>
              )}

              {!response && !translateMutation.isPending && (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Translate</h3>
                    <p className="text-gray-500">
                      Enter a Gen Z term to get started with your translation
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Tips Section */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle>💡 Translation Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Popular Terms to Try</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• &quot;That&apos;s cap&quot; (That&apos;s a lie)</li>
                    <li>• &quot;No cap&quot; (No lie, seriously)</li>
                    <li>• &quot;Slay&quot; (To do something exceptionally well)</li>
                    <li>• &quot;Periodt&quot; (End of discussion, emphasis)</li>
                    <li>• &quot;Bussin&quot; (Really good, amazing)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">How to Use This Tool</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Enter single words or full phrases</li>
                    <li>• Include context if helpful</li>
                    <li>• Use parent examples in conversations</li>
                    <li>• Remember language evolves quickly</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
