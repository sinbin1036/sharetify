export default function Home() {
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

        <div className="mt-10 flex w-full items-center gap-3 rounded-full border border-white/20 bg-white/10 px-6 py-4 backdrop-blur-md">
          <input
            type="text"
            placeholder="비 오는 날 드라이브하면서 들을 노래"
            className="flex-1 bg-transparent text-sm text-white placeholder-white/50 outline-none sm:text-base"
          />
          <button
            type="button"
            aria-label="검색"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black transition-colors hover:bg-white/80"
          >
            →
          </button>
        </div>
      </div>
    </main>
  );
}
