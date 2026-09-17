import { buildSearchIndex } from '@/lib/search-index';

/** Written to /search-index.json by the static export. */
export const dynamic = 'force-static';

export function GET() {
  return Response.json(buildSearchIndex());
}
