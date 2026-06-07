import { NextResponse } from "next/server";

type KeywordExtractionResult = {
  situation: string;
  emotion: string[];
  mood: string[];
  environment: string[];
  youtubeKeywords: string[];
  finalSearchQuery: string;
};

const SYSTEM_PROMPT = `You are an AI keyword extraction engine for a music search web service called Sharetify.

Your task is to analyze the user's natural language input and convert it into YouTube music or playlist search keywords.

Extract:
- situation
- emotion
- mood
- environment
- youtubeKeywords
- finalSearchQuery

Return JSON only.

The JSON must follow this exact shape:
{
  "situation": string,
  "emotion": string[],
  "mood": string[],
  "environment": string[],
  "youtubeKeywords": string[],
  "finalSearchQuery": string
}

Rules:
- Do not answer conversationally.
- Do not use markdown.
- Do not include any text outside the JSON object.
- The generated keywords must be suitable for YouTube music or playlist search.
- Keywords should be natural Korean search phrases when the user input is Korean.
- If the user input is English, generate natural English YouTube search keywords.
- Avoid overly abstract keywords.
- Prefer searchable phrases such as:
  - "비 오는 날 감성 노래"
  - "집중할 때 듣는 플레이리스트"
  - "새벽 감성 인디 노래"
  - "기분 좋아지는 팝송 플레이리스트"
- The finalSearchQuery should be one concise and useful YouTube search query.
- Do not recommend specific songs unless the user explicitly asks for a specific song.`;

const keywordExtractionSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    situation: {
      type: "string",
      description: "A concise description of the user's situation.",
    },
    emotion: {
      type: "array",
      items: { type: "string" },
      description: "Emotion words inferred from the input.",
    },
    mood: {
      type: "array",
      items: { type: "string" },
      description: "Music mood keywords inferred from the input.",
    },
    environment: {
      type: "array",
      items: { type: "string" },
      description: "Environment or context phrases inferred from the input.",
    },
    youtubeKeywords: {
      type: "array",
      items: { type: "string" },
      description: "Natural YouTube music or playlist search phrases.",
    },
    finalSearchQuery: {
      type: "string",
      description: "One concise YouTube search query.",
    },
  },
  required: [
    "situation",
    "emotion",
    "mood",
    "environment",
    "youtubeKeywords",
    "finalSearchQuery",
  ],
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

function extractResponseText(response: unknown): string {
  if (!response || typeof response !== "object") {
    return "";
  }

  const data = response as {
    output_text?: unknown;
    output?: Array<{
      content?: Array<{
        text?: unknown;
      }>;
    }>;
  };

  if (typeof data.output_text === "string") {
    return data.output_text;
  }

  return (
    data.output
      ?.flatMap((item) => item.content ?? [])
      .map((content) => content.text)
      .filter((text): text is string => typeof text === "string")
      .join("") ?? ""
  );
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

  const rawInput =
    body && typeof body === "object" && "input" in body
      ? (body as { input: unknown }).input
      : null;

  const input = typeof rawInput === "string" ? rawInput.trim() : "";

  if (!input) {
    return NextResponse.json(
      { error: "상황을 입력해 주세요." },
      { status: 400 },
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY가 설정되어 있지 않습니다." },
      { status: 500 },
    );
  }

  try {
    const openAIResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-5.4-mini",
        input: [
          {
            role: "system",
            content: [{ type: "input_text", text: SYSTEM_PROMPT }],
          },
          {
            role: "user",
            content: [{ type: "input_text", text: input }],
          },
        ],
        max_output_tokens: 600,
        text: {
          format: {
            type: "json_schema",
            name: "sharetify_keyword_extraction",
            strict: true,
            schema: keywordExtractionSchema,
          },
        },
      }),
    });

    const openAIData: unknown = await openAIResponse.json().catch(() => null);

    if (!openAIResponse.ok) {
      const message =
        openAIData &&
        typeof openAIData === "object" &&
        "error" in openAIData &&
        openAIData.error &&
        typeof openAIData.error === "object" &&
        "message" in openAIData.error &&
        typeof openAIData.error.message === "string"
          ? openAIData.error.message
          : "OpenAI 요청에 실패했습니다.";

      return NextResponse.json({ error: message }, { status: 502 });
    }

    const modelResponseText = extractResponseText(openAIData);

    try {
      const parsed: unknown = JSON.parse(modelResponseText);

      if (!isKeywordExtractionResult(parsed)) {
        return NextResponse.json(
          { error: "AI 응답 JSON 형식이 올바르지 않습니다." },
          { status: 502 },
        );
      }

      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json(
        { error: "AI 응답 JSON 형식이 올바르지 않습니다." },
        { status: 502 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: "키워드 생성 요청에 실패했습니다." },
      { status: 500 },
    );
  }
}
