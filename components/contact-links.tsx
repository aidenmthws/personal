import { site } from "@/content/landings";

export function ContactLinks() {
  return (
    <ul className="flex flex-col">
      <li>
        <a href={`mailto:${site.email}`} className="inline-block py-2.5 break-all">
          {site.emailLabel}
        </a>
      </li>
      <li>
        <a href={site.linkedin.href} className="inline-block py-2.5 break-all">
          {site.linkedin.label}
        </a>
      </li>
    </ul>
  );
}
