import type { VisualKey } from '@/types/content';
import { TableI29 } from './TableI29';
import { ReturnsStructure } from './ReturnsStructure';
import { NumberVsAmount } from './NumberVsAmount';
import { FieldComparison } from './FieldComparison';

/**
 * Visuals are referenced from article content by key, never imported into it.
 *
 * ▸ TO ADD A VISUAL: build the component, add its key to `VisualKey` in
 *   types/content.ts, and register it here. Article files then reference it as
 *   `{ type: 'visual', component: 'my-new-visual' }`.
 */
export const visuals: Record<VisualKey, () => React.JSX.Element> = {
  'table-i29': TableI29,
  'returns-structure': ReturnsStructure,
  'number-vs-amount': NumberVsAmount,
  'field-comparison': FieldComparison,
};

export function Visual({ component }: { component: VisualKey }) {
  const Component = visuals[component];
  if (!Component) return null;
  return <Component />;
}
