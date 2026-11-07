import { site } from "@/content/landings";
import { resumeIsPublished } from "@/lib/resume";

import { buttonStyles } from "./ui/button-styles";

type ResumeLinkProps = { variant: keyof typeof buttonStyles };

export function ResumeLink({ variant }: ResumeLinkProps) {
  if (!resumeIsPublished()) {
    return (
      <p>
        {site.resume.missingNote}{" "}
        <a href={`mailto:${site.email}`} className="inline-block py-2.5">
          {site.resume.missingAction}
        </a>
      </p>
    );
  }

  return (
    <a href={site.resume.href} download className={buttonStyles[variant]}>
      {site.resume.label}
    </a>
  );
}
