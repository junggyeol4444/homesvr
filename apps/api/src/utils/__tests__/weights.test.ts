import { describe, expect, it } from 'vitest';
import { normalizeWeights } from '../../utils/weights';

describe('normalizeWeights', () => {
  it('returns normalized values that sum to 1', () => {
    const result = normalizeWeights({ performance: 5, value: 3, design: 2 });
    const sum = Object.values(result).reduce((acc, value) => acc + value, 0);
    expect(sum).toBeCloseTo(1);
  });

  it('handles empty weights', () => {
    expect(normalizeWeights({})).toEqual({});
  });
});
