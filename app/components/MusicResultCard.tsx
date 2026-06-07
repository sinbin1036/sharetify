/* eslint-disable @next/next/no-img-element */

export type MusicResult = {
  id: string;
  title: string;
  description: string;
  channelTitle?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  gradient?: string;
};

export default function MusicResultCard({
  title,
  description,
  channelTitle,
  thumbnailUrl,
  videoUrl,
  gradient = "from-indigo-500 via-purple-500 to-pink-500",
}: MusicResult) {
  const cardDescription = [channelTitle, description].filter(Boolean).join(" · ");
  const cardClassName =
    "group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-colors hover:border-white/20 hover:bg-white/10";

  const cardContent = (
    <>
      <div className="aspect-square w-full overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className={`h-full w-full bg-gradient-to-br ${gradient} transition-transform duration-300 group-hover:scale-105`}
          />
        )}
      </div>
      <div className="flex flex-col gap-1 px-4 py-3 text-left">
        <p className="truncate text-sm font-medium text-white">{title}</p>
        <p className="line-clamp-2 text-xs text-white/60">{cardDescription}</p>
      </div>
    </>
  );

  if (videoUrl) {
    return (
      <a
        href={videoUrl}
        target="_blank"
        rel="noreferrer"
        className={cardClassName}
      >
        {cardContent}
      </a>
    );
  }

  return <div className={cardClassName}>{cardContent}</div>;
}
