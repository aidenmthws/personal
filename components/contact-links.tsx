import { CopyEmail } from "@/components/copy-email";
import { ResumeLink } from "@/components/resume-link";
import { buttonStyles } from "@/components/ui/button-styles";
import { site } from "@/content/landings";

/** The Harbor's actions, on the Ride and Dry Land alike. */
export function ContactLinks() {
  return (
    <div className="flex flex-wrap items-start gap-4">
      <a href={site.linkedin.href} className={buttonStyles.accent}>
        {site.linkedin.label}
      </a>
      <CopyEmail email={site.email} labels={site.copyEmail} />
      <ResumeLink variant="outline" />
    </div>
  );
}
