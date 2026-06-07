import { NextResponse } from "next/server";

type YouTubeThumbnail = {
  url?: string;
};

type YouTubeSearchItem = {
  id?: {
    videoId?: string;
  };
  snippet?: {
    title?: string;
    channelTitle?: string;
    description?: string;
    thumbnails?: {
      default?: YouTubeThumbnail;
      medium?: YouTubeThumbnail;
      high?: YouTubeThumbnail;
    };
    publishedAt?: string;
  };
};

type YouTubeSearchResponse = {
  items?: YouTubeSearchItem[];
  error?: {
    message?: string;
  };
};

function getYouTubeErrorMessage(
  value: unknown,
  fallback = "YouTube 검색 요청에 실패했습니다.",
) {
  if (!value || typeof value !== "object") {
    return fallback;
  }

  const error = (value as YouTubeSearchResponse).error;

  return typeof error?.message === "string" && error.message.trim()
    ? error.message
    : fallback;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "요청 JSON 형식이 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const rawQuery =
    body && typeof body === "object" && "query" in body
      ? (body as { query: unknown }).query
      : null;

  const query = typeof rawQuery === "string" ? rawQuery.trim() : "";

  if (!query) {
    return NextResponse.json(
      { error: "YouTube 검색어를 입력해 주세요." },
      { status: 400 },
    );
  }

  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "YOUTUBE_API_KEY가 설정되어 있지 않습니다." },
      { status: 500 },
    );
  }

  const youtubeUrl = new URL("https://www.googleapis.com/youtube/v3/search");
  youtubeUrl.search = new URLSearchParams({
    part: "snippet",
    type: "video",
    maxResults: "30",
    q: query,
    key: apiKey,
  }).toString();

  try {
    const youtubeResponse = await fetch(youtubeUrl, {
      method: "GET",
      cache: "no-store",
    });

    const youtubeData: unknown = await youtubeResponse.json().catch(() => null);

    if (!youtubeResponse.ok) {
      return NextResponse.json(
        { error: getYouTubeErrorMessage(youtubeData) },
        { status: 502 },
      );
    }

    const items =
      youtubeData && typeof youtubeData === "object"
        ? (youtubeData as YouTubeSearchResponse).items
        : null;

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "YouTube 응답 JSON 형식이 올바르지 않습니다." },
        { status: 502 },
      );
    }

    const results = items
      .map((item) => {
        const videoId = item.id?.videoId;
        const snippet = item.snippet;

        if (!videoId || !snippet) {
          return null;
        }

        return {
          id: videoId,
          title: snippet.title ?? "",
          channelTitle: snippet.channelTitle ?? "",
          description: snippet.description ?? "",
          thumbnailUrl:
            snippet.thumbnails?.high?.url ??
            snippet.thumbnails?.medium?.url ??
            snippet.thumbnails?.default?.url ??
            "",
          videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
          publishedAt: snippet.publishedAt ?? "",
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    return NextResponse.json({ query, results });
  } catch {
    return NextResponse.json(
      { error: "YouTube 검색 요청에 실패했습니다." },
      { status: 500 },
    );
  }
}
