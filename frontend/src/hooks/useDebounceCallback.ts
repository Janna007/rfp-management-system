import { useMemo, useEffect } from "react";
import { debounce } from "lodash";

export function useDebounceCallback<A extends unknown[], R>(
  callback: (...args: A) => R,
  delay: number
) {
  const debouncedFn = useMemo(() => {
    return debounce((...args: A) => callback(...args), delay);
  }, [callback, delay]);

  useEffect(() => {
    return () => {
      debouncedFn.cancel();
    };
  }, [debouncedFn]);

  return debouncedFn;
}
