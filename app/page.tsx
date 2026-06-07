"use client";

import { FormEvent, useState } from "react";

import MusicResultCard, {
  type MusicResult,
} from "./components/MusicResultCard";

const MOCK_RESULTS: MusicResult[] = [
  {
    id: "1",
    title: "Rainy Night Drive",
    description: "비 오는 밤, 창밖을 보며 듣기 좋은 시티팝 모음",
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
  },
  {
    id: "2",
    title: "Lo-fi Rain Beats",
    description: "잔잔한 빗소리와 어우러지는 로파이 비트",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
  },
  {
    id: "3",
    title: "Late Night Jazz",
    description: "늦은 밤 감성을 채워주는 재즈 셀렉션",
    gradient: "from-amber-500 via-orange-500 to-rose-500",
  },
  {
    id: "4",
    title: "Mellow Acoustic",
    description: "차분한 어쿠스틱 사운드로 마음을 가라앉히는 플레이리스트",
    gradient: "from-slate-500 via-slate-700 to-slate-900",
  },
  {
    id: "5",
    title: "Dreamy Synthwave",
    description: "몽환적인 신스웨이브로 떠나는 드라이브",
    gradient: "from-fuchsia-500 via-violet-500 to-indigo-600",
  },
];

export default function Home() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [query, setQuery] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedInput = input.trim();

    if (!trimmedInput) {
      setError("상황을 입력해 주세요.");
      setQuery(null);
      return;
    }

    setError("");
    setQuery(trimmedInput);
  }

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
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black transition-colors hover:bg-white/80"
            >
              →
            </button>
          </form>

          {error && <p className="mt-4 text-sm text-red-200">{error}</p>}
        </section>

        {query && (
          <section className="w-full max-w-5xl px-6 pb-24">
            <h2 className="text-left text-lg font-medium text-white sm:text-xl">
              <span className="text-white/60">&ldquo;{query}&rdquo;</span>에
              어울리는 음악
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MOCK_RESULTS.map((result) => (
                <MusicResultCard key={result.id} {...result} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
