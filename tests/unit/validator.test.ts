import { describe, it, expect } from 'vitest';
import { articleSchema } from '@/lib/validators/article.validator';

describe('Article Validator', () => {
  it('should validate a correct article', () => {
    const validArticle = {
      title: 'Valid Title Here',
      content: 'This is a long enough content to pass the fifty character minimum length requirement for validation.',
      category: 'Technology',
      status: 'DRAFT',
      tags: [],
    };
    
    const result = articleSchema.safeParse(validArticle);
    expect(result.success).toBe(true);
  });

  it('should reject short titles', () => {
    const invalidArticle = {
      title: 'No', // Too short
      content: 'This is a long enough content to pass the fifty character minimum length requirement for validation.',
      category: 'Technology',
    };
    
    const result = articleSchema.safeParse(invalidArticle);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Title must be at least 5 characters long.');
    }
  });

  it('should reject short content', () => {
    const invalidArticle = {
      title: 'Valid Title',
      content: 'Too short', // Too short
      category: 'Technology',
    };
    
    const result = articleSchema.safeParse(invalidArticle);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Article content must be at least 50 characters long.');
    }
  });
});
