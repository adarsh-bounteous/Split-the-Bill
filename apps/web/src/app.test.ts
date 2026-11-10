import { describe, expect, it } from 'vitest';
import { APP_TITLE } from './app';

describe('app', () => {
  it('has a title', () => {
    expect(APP_TITLE).toBe('Split the Bill');
  });
});
