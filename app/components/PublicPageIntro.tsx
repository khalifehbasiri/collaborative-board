interface PublicPageIntroProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function PublicPageIntro({ eyebrow, title, description }: PublicPageIntroProps) {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-310 px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-accent">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold leading-[0.98] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
          {description}
        </p>
      </div>
    </section>
  );
}
