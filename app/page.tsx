"use client";

import { FormEvent, useState } from "react";

type KeywordExtractionResult = {
  situation: string;
  emotion: string[];
  mood: string[];
  environment: string[];
  youtubeKeywords: string[];
  finalSearchQuery: string;
};

type ErrorResponse = {
  error?: string;
  rawResponse?: string;
};

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isKeywordExtractionResult(
  value: unknown,
): value is KeywordExtractionResult {
  if (!value || typeof value !== "object") {
    return false;
  }

  const data = value as Record<string, unknown>;

  return (
    typeof data.situation === "string" &&
    isStringArray(data.emotion) &&
    isStringArray(data.mood) &&
    isStringArray(data.environment) &&
    isStringArray(data.youtubeKeywords) &&
    typeof data.finalSearchQuery === "string"
  );
}

function isErrorResponse(value: unknown): value is ErrorResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const data = value as Record<string, unknown>;

  return (
    typeof data.error === "string" ||
    typeof data.rawResponse === "string"
  );
}

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<KeywordExtractionResult | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedInput = input.trim();
    setError("");
    setResult(null);

    if (!trimmedInput) {
      setError("상황을 입력해 주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-keyword-extraction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: trimmedInput }),
      });

      const data: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        if (isErrorResponse(data) && data.rawResponse) {
          console.error("Raw AI response:", data.rawResponse);
        }

        throw new Error(
          isErrorResponse(data) && data.error
            ? data.error
            : "키워드 생성 요청에 실패했습니다.",
        );
      }

      if (!isKeywordExtractionResult(data)) {
        console.error("Invalid API response:", data);
        throw new Error("AI 응답 JSON 형식이 올바르지 않습니다.");
      }

      setResult(data);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "키워드 생성 요청에 실패했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/background.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center px-6 text-center">
        <h1 className="font-serif text-5xl italic leading-tight text-white sm:text-6xl">
          Find your <span className="not-italic">mood.</span>
        </h1>

        <p className="mt-6 text-base text-white/80 sm:text-lg">
          지금의 상황을 입력하면 어울리는 음악 검색어를 추천합니다.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 flex w-full items-center gap-3 rounded-full border border-white/20 bg-white/10 px-6 py-4 backdrop-blur-md"
        >
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="비 오는 날 드라이브하면서 들을 노래"
            className="flex-1 bg-transparent text-sm text-white placeholder-white/50 outline-none sm:text-base"
          />
          <button
            type="submit"
            aria-label="검색"
            disabled={isLoading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black transition-colors hover:bg-white/80 disabled:cursor-not-allowed disabled:bg-white/60"
          >
            {isLoading ? "..." : "→"}
          </button>
        </form>

        {isLoading && (
          <p className="mt-4 text-sm text-white/70">검색어를 생성하는 중입니다.</p>
        )}

        {error && <p className="mt-4 text-sm text-red-200">{error}</p>}

        {result && (
          <section className="mt-6 max-h-96 w-full overflow-y-auto rounded-lg border border-white/20 bg-black/35 p-5 text-left text-white backdrop-blur-md">
            <div>
              <p className="text-xs uppercase text-white/50">Final Search Query</p>
              <p className="mt-1 text-lg font-semibold">{result.finalSearchQuery}</p>
            </div>

            <div className="mt-4">
              <p className="text-xs uppercase text-white/50">YouTube Keywords</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/85">
                {result.youtubeKeywords.map((keyword, index) => (
                  <li key={`${keyword}-${index}`}>{keyword}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <p className="text-xs uppercase text-white/50">Debug JSON</p>
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-md bg-black/40 p-3 text-xs text-white/80">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
