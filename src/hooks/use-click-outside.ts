import { MouseEventHandler, useEffect, useRef } from "react";
import { fromEvent, filter } from "rxjs";

export const useClickOutside = (callback: MouseEventHandler) => {
  const domRef = useRef<HTMLElement>();

  useEffect(() => {
    const subscription = fromEvent(window, "click")
      .pipe(
        filter((event) => {
          const target = event.target as HTMLElement | null;
          if (!domRef.current || !target) {
            return true;
          }
          return !domRef.current.contains(target);
        })
      )
      .subscribe(callback as any);

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return domRef;
};
