import { describe, it, expect } from 'vitest';
import { hasAccess, canWrite } from '@/lib/auth/rbac';

describe('RBAC Permissions', () => {
  it('should allow VIEWER to access ARTICLES, REPORTS, TEST_CASES, BUGS', () => {
    expect(hasAccess('VIEWER', 'ARTICLES')).toBe(true);
    expect(hasAccess('VIEWER', 'REPORTS')).toBe(true);
    expect(hasAccess('VIEWER', 'TEST_CASES')).toBe(true);
    expect(hasAccess('VIEWER', 'BUGS')).toBe(true);
  });

  it('should allow ONLY QA role to write and edit BUGS', () => {
    expect(canWrite('QA', 'BUGS')).toBe(true);
    expect(canWrite('ADMIN', 'BUGS')).toBe(false);
    expect(canWrite('EDITOR', 'BUGS')).toBe(false);
    expect(canWrite('VIEWER', 'BUGS')).toBe(false);
  });

  it('should allow EDITOR to write ARTICLES but not BUGS', () => {
    expect(hasAccess('EDITOR', 'ARTICLES')).toBe(true);
    expect(canWrite('EDITOR', 'ARTICLES')).toBe(true);
    expect(canWrite('EDITOR', 'BUGS')).toBe(false);
  });
});
