"use client";

import { FormEvent, useEffect, useState } from "react";

import MusicResultCard, {
  type MusicResult,
} from "./components/MusicResultCard";

type KeywordExtractionResult = {
  situation: string;
  emotion: string[];
  mood: string[];
  environment: string[];
  youtubeKeywords: string[];
  finalSearchQuery: string;
};

type YouTubeSearchResponse = {
  query: string;
  results: MusicResult[];
};

type ErrorResponse = {
  error?: string;
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

function isMusicResult(value: unknown): value is MusicResult {
  if (!value || typeof value !== "object") {
    return false;
  }

  const data = value as Record<string, unknown>;

  return (
    typeof data.id === "string" &&
    typeof data.title === "string" &&
    typeof data.description === "string" &&
    (data.channelTitle === undefined || typeof data.channelTitle === "string") &&
    (data.thumbnailUrl === undefined || typeof data.thumbnailUrl === "string") &&
    (data.videoUrl === undefined || typeof data.videoUrl === "string")
  );
}

function isYouTubeSearchResponse(
  value: unknown,
): value is YouTubeSearchResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const data = value as Record<string, unknown>;

  return (
    typeof data.query === "string" &&
    Array.isArray(data.results) &&
    data.results.every(isMusicResult)
  );
}

function isErrorResponse(value: unknown): value is ErrorResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const data = value as Record<string, unknown>;

  return typeof data.error === "string";
}

export default function Home() {
  const [input, setInput] = useState("");
  const [aiError, setAiError] = useState("");
  const [youtubeError, setYoutubeError] = useState("");
  const [keywordResult, setKeywordResult] =
    useState<KeywordExtractionResult | null>(null);
  const [query, setQuery] = useState<string | null>(null);
  const [results, setResults] = useState<MusicResult[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isYoutubeLoading, setIsYoutubeLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 200);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedInput = input.trim();
    setAiError("");
    setYoutubeError("");

    if (!trimmedInput) {
      setAiError("상황을 입력해 주세요.");
      setKeywordResult(null);
      setQuery(null);
      setResults([]);
      return;
    }

    setIsAiLoading(true);
    setKeywordResult(null);
    setQuery(null);
    setResults([]);

    try {
      const aiResponse = await fetch("/api/ai-keyword-extraction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: trimmedInput }),
      });

      const aiData: unknown = await aiResponse.json().catch(() => null);

      if (!aiResponse.ok) {
        throw new Error(
          isErrorResponse(aiData) && aiData.error
            ? aiData.error
            : "키워드 생성 요청에 실패했습니다.",
        );
      }

      if (!isKeywordExtractionResult(aiData)) {
        throw new Error("AI 응답 JSON 형식이 올바르지 않습니다.");
      }

      const finalSearchQuery = aiData.finalSearchQuery.trim();
      setIsAiLoading(false);
      setKeywordResult(aiData);
      setQuery(finalSearchQuery);

      if (!finalSearchQuery) {
        setYoutubeError("YouTube 검색어가 비어 있습니다.");
        return;
      }

      setIsYoutubeLoading(true);

      try {
        const youtubeResponse = await fetch("/api/youtube-search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: finalSearchQuery }),
        });

        const youtubeData: unknown = await youtubeResponse
          .json()
          .catch(() => null);

        if (!youtubeResponse.ok) {
          throw new Error(
            isErrorResponse(youtubeData) && youtubeData.error
              ? youtubeData.error
              : "YouTube 검색 요청에 실패했습니다.",
          );
        }

        if (!isYouTubeSearchResponse(youtubeData)) {
          throw new Error("YouTube 응답 JSON 형식이 올바르지 않습니다.");
        }

        setQuery(youtubeData.query);
        setResults(youtubeData.results);
      } catch (requestError) {
        setYoutubeError(
          requestError instanceof Error
            ? requestError.message
            : "YouTube 검색 요청에 실패했습니다.",
        );
      } finally {
        setIsYoutubeLoading(false);
      }
    } catch (requestError) {
      setAiError(
        requestError instanceof Error
          ? requestError.message
          : "키워드 생성 요청에 실패했습니다.",
      );
    } finally {
      setIsAiLoading(false);
    }
  }

  const isSearching = isAiLoading || isYoutubeLoading;
  const hasResultSection = Boolean(query || keywordResult);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <video
        className="fixed inset-0 h-full w-full object-cover"
        src="/videos/background.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      <div className="fixed inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

      <div className="relative z-10 flex flex-col items-center">
        <section className="flex min-h-screen w-full flex-col items-center justify-center px-6 text-center">
          <h1 className="font-serif text-5xl italic leading-tight text-white sm:text-6xl">
            Find your <span className="not-italic">mood.</span>
          </h1>

          <p className="mt-6 text-base text-white/80 sm:text-lg">
            지금의 상황을 입력하면 어울리는 음악 검색어를 추천합니다.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-10 flex w-full max-w-2xl items-center gap-3 rounded-full border border-white/20 bg-white/10 px-6 py-4 backdrop-blur-md"
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
              disabled={isSearching}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black transition-colors hover:bg-white/80 disabled:cursor-not-allowed disabled:bg-white/60"
            >
              {isSearching ? "..." : "→"}
            </button>
          </form>

          {isAiLoading && (
            <p className="mt-4 text-sm text-white/70">
              검색어를 생성하는 중입니다.
            </p>
          )}

          {aiError && <p className="mt-4 text-sm text-red-200">{aiError}</p>}
        </section>

        {hasResultSection && (
          <section className="w-full max-w-5xl px-6 pb-24">
            {query && (
              <h2 className="text-left text-lg font-medium text-white sm:text-xl">
                <span className="text-white/60">&ldquo;{query}&rdquo;</span>에
                어울리는 음악
              </h2>
            )}

            {keywordResult && (
              <details className="mt-4 text-left text-xs text-white/60">
                <summary className="cursor-pointer text-white/70">
                  AI 검색어 결과
                </summary>
                <div className="mt-2 space-y-1">
                  <p>finalSearchQuery: {keywordResult.finalSearchQuery}</p>
                  <p>
                    youtubeKeywords: {keywordResult.youtubeKeywords.join(", ")}
                  </p>
                </div>
              </details>
            )}

            {isYoutubeLoading && (
              <p className="mt-6 text-left text-sm text-white/70">
                YouTube 영상을 불러오는 중입니다.
              </p>
            )}

            {youtubeError && (
              <p className="mt-6 text-left text-sm text-red-200">
                {youtubeError}
              </p>
            )}

            {!isYoutubeLoading && !youtubeError && results.length === 0 && (
              <p className="mt-6 text-left text-sm text-white/70">
                검색된 영상이 없습니다.
              </p>
            )}

            {results.length > 0 && (
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((result) => (
                  <MusicResultCard key={result.id} {...result} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {hasResultSection && (
        <button
          type="button"
          aria-label="맨 위로 이동"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`fixed right-6 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 ${
            isScrolled
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        >
          ↑
        </button>
      )}
    </main>
  );
}
