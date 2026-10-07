import { useDebouncedValue } from '@/lib/useDebouncedValue';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

export function useListSearch(param = 'q', delayMs = 300) {
  const [params, setParams] = useSearchParams();
  const fromUrl = params.get(param) ?? '';
  const [value, setValue] = useState(fromUrl);
  const query = useDebouncedValue(value, delayMs);

  useEffect(() => {
    setValue(fromUrl);
  }, [fromUrl]);

  useEffect(() => {
    const current = params.get(param) ?? '';
    if (query === current) {
      return;
    }
    const next = new URLSearchParams(params);
    if (query) {
      next.set(param, query);
    } else {
      next.delete(param);
    }
    setParams(next, { replace: true });
  }, [query, param, params, setParams]);

  return { value, setValue, query };
}
