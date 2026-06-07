export type MusicResult = {
  id: string;
  title: string;
  description: string;
  gradient: string;
};

export default function MusicResultCard({
  title,
  description,
  gradient,
}: MusicResult) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-colors hover:border-white/20 hover:bg-white/10">
      <div
        className={`aspect-video w-full bg-gradient-to-br ${gradient} transition-transform duration-300 group-hover:scale-105`}
      />
      <div className="flex flex-col gap-1 px-4 py-3 text-left">
        <p className="truncate text-sm font-medium text-white">{title}</p>
        <p className="line-clamp-2 text-xs text-white/60">{description}</p>
      </div>
    </div>
  );
}
