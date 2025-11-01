"use client";

const posts = [
  {
    id: "POST-401",
    author: "GoGreen HQ",
    avatar: "G",
    title: "Before & after • BeltLine loft",
    content:
      "Eco enzyme clean + plant-based polish. Tap to book the crew that handled it in under four hours.",
    media: "/media/beltline-loft.jpg",
    reactions: 126,
    replies: 18,
    publishedAt: "1h ago"
  },
  {
    id: "POST-400",
    author: "Neighbor Perks",
    avatar: "N",
    title: "15% Off multi-service bundles this week",
    content:
      "Combine a mobile detail with pressure washing and save 15%. Applies automatically at checkout.",
    reactions: 94,
    replies: 12,
    publishedAt: "4h ago"
  },
  {
    id: "POST-399",
    author: "Chelsea P.",
    avatar: "C",
    title: "Shoutout to Crew Emerald!",
    content:
      "Our short-term rental has never looked better. They even left plant-based goodies for guests 🌱",
    reactions: 58,
    replies: 7,
    publishedAt: "Yesterday"
  }
];

const CommunityFeed = () => (
  <section className="glass space-y-4 rounded-3xl p-6 text-white">
    {posts.map((post) => (
      <article
        key={post.id}
        className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/80"
      >
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 font-display text-lg text-white">
              {post.avatar}
            </span>
            <div>
              <h3 className="font-semibold text-white">{post.title}</h3>
              <p className="text-xs text-white/60">
                {post.author} • {post.publishedAt}
              </p>
            </div>
          </div>
          <button className="text-xs text-white/40 transition hover:text-white/70">
            •••
          </button>
        </header>
        <p className="mt-4 text-base text-white/70">{post.content}</p>
        <div className="mt-4 flex items-center gap-3 text-xs text-white/50">
          <span>{post.reactions} reactions</span>
          <span>{post.replies} replies</span>
          <button className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-widest text-white/60 transition hover:border-white hover:text-white">
            Boost
          </button>
          <button className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-widest text-white/60 transition hover:border-white hover:text-white">
            Share
          </button>
        </div>
      </article>
    ))}
    <div className="rounded-3xl border border-dashed border-white/20 p-6 text-center text-sm text-white/60">
      <p className="font-semibold text-white">Spin up resident campaigns</p>
      <p className="mt-2">
        Automate loyalty perks and neighborhood polls from the GoGreenOS
        marketing studio.
      </p>
      <button className="mt-4 rounded-full border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/70 hover:border-white hover:text-white">
        Launch campaign
      </button>
    </div>
  </section>
);

export default CommunityFeed;
