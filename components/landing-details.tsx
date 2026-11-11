import { ContactLinks } from "@/components/contact-links";
import { TagList } from "@/components/tag-list";
import { site, type Landing as LandingContent } from "@/content/landings";

/** Role, place, and dates, in the order they appear on the resume. */
export function LandingMeta({ landing }: { landing: LandingContent }) {
  const lines = [landing.role, landing.location, landing.dates].filter(Boolean);

  if (lines.length === 0) return null;

  return (
    <p className="mt-2 text-label text-muted-foreground">
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </p>
  );
}

/** Everything a landing holds beyond its card summary, for Dry Land. */
export function LandingDetails({ landing }: { landing: LandingContent }) {
  return (
    <>
      {landing.bullets.length > 0 ? (
        <ul className="flex list-disc flex-col gap-2 pl-4">
          {landing.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      ) : (
        <p>{landing.summary}</p>
      )}

      {landing.coursework && (
        <div>
          <h3 className="mb-2 font-medium">{site.labels.coursework}</h3>
          <TagList items={landing.coursework} />
        </div>
      )}

      {landing.projects?.map((project) => (
        <div key={project.name}>
          <h3 className="font-medium">{project.name}</h3>
          <p className="text-label text-muted-foreground">
            {project.status ? `${project.dates}. ${project.status}.` : project.dates}
          </p>
          <p className="mt-2">{project.description}</p>
          <div className="mt-2">
            <TagList items={project.stack} />
          </div>
        </div>
      ))}

      {landing.skillGroups?.map((group) => (
        <div key={group.name}>
          <h3 className="mb-2 font-medium">{group.name}</h3>
          <TagList items={group.skills} />
        </div>
      ))}

      {landing.id === "harbor" && <ContactLinks />}
    </>
  );
}
