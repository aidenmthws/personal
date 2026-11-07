import { site } from "@/content/landings";

export function SiteFooter() {
  return (
    <footer className="relative z-40 w-full bg-background px-4 py-12 md:px-6">
      <div className="mx-auto max-w-4xl">
      <h2 className="font-display text-heading font-medium">{site.log.title}</h2>
      <p className="mt-2 max-w-2xl text-label text-muted-foreground">{site.log.body}</p>
      </div>
    </footer>
  );
}
