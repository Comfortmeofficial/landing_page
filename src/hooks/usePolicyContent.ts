import { useState, useEffect } from 'react';
import { policyApi } from '@/lib/api';
import type { PolicyContent } from '@/types';

export function usePolicyContent(type: 'privacy' | 'terms', defaultContent: PolicyContent) {
  const [content, setContent] = useState<PolicyContent>(defaultContent);

  useEffect(() => {
    const request = type === 'privacy' ? policyApi.getPrivacy() : policyApi.getTerms();
    request
      .then((res) => setContent(res.data))
      .catch(() => {});
  }, [type]);

  return content;
}
