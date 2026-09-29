export default function Loader() {
  return (
    <div className="grid gap-4 rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-glow">
      <div className="h-5 w-40 animate-pulse rounded-full bg-white/10" />
      <div className="grid gap-4">
        <div className="h-4 w-full animate-pulse rounded-full bg-white/10" />
        <div className="h-4 w-5/6 animate-pulse rounded-full bg-white/10" />
        <div className="flex gap-4">
          <div className="h-24 w-1/3 animate-pulse rounded-3xl bg-white/10" />
          <div className="h-24 w-1/3 animate-pulse rounded-3xl bg-white/10" />
          <div className="h-24 w-1/3 animate-pulse rounded-3xl bg-white/10" />
        </div>
      </div>
    </div>
  );
}
