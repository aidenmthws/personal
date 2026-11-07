import { existsSync } from "node:fs";
import { join } from "node:path";

import { site } from "@/content/landings";

/**
 * Checked while pages prerender, so dropping the PDF into `public/` and
 * rebuilding switches every resume link on without any client code.
 */
export function resumeIsPublished() {
  return existsSync(join(process.cwd(), "public", site.resume.file));
}
