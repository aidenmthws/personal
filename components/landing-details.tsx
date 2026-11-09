import { ContactLinks } from "@/components/contact-links";
import { CopyEmail } from "@/components/copy-email";
import { NetCatch } from "@/components/net-catch";
import { ResumeLink } from "@/components/resume-link";
import { SkillJars } from "@/components/skill-jars";
import { TagList } from "@/components/tag-list";
import { landings, site, type Landing as LandingContent } from "@/content/landings";

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

      {landing.id === "harbor" && (
        <>
          <ContactLinks />
          <ResumeLink variant="outline" />
        </>
      )}
    </>
  );
}

/** The route stops where each skill was used. */
function skillStops(skills: string[]) {
  return Object.fromEntries(
    skills.map((skill) => [
      skill,
      landings.flatMap((item, index) => (item.skills.includes(skill) ? [index] : [])),
    ]),
  );
}

function Headline({ value, label }: { value: string; label: string }) {
  return (
    <p className="flex items-baseline gap-4">
      <span className="font-display text-metric">{value}</span>
      <span className="text-label text-muted-foreground">{label}</span>
    </p>
  );
}

/** A Ride card's content. Full bullets stay on Dry Land. */
export function LandingCardBody({ landing }: { landing: LandingContent }) {
  const metric = landing.metrics[0];

  return (
    <>
      <p>{landing.summary}</p>

      {metric && landing.catch ? (
        <NetCatch labels={site.net} results={landing.catch}>
          <Headline value={metric.value} label={metric.label} />
        </NetCatch>
      ) : (
        metric && <Headline value={metric.value} label={metric.label} />
      )}

      {landing.coursework && <TagList items={landing.coursework} />}

      {landing.projects?.map((project) => (
        <div key={project.name}>
          <h3 className="font-medium">{project.name}</h3>
          <p className="text-label text-muted-foreground">
            {project.status ? `${project.dates}. ${project.status}.` : project.dates}
          </p>
          <TagList items={project.stack} />
        </div>
      ))}

      {landing.skillGroups && (
        <SkillJars
          groups={landing.skillGroups}
          stops={skillStops(landing.skillGroups.flatMap((group) => group.skills))}
          landingTitles={landings.map((item) => item.title)}
          labels={site.spices}
        />
      )}

      {landing.id === "harbor" && (
        <>
          <ContactLinks />
          <CopyEmail email={site.email} labels={site.copyEmail} />
          <ResumeLink variant="outline" />
        </>
      )}
    </>
  );
}
