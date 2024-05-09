import { useState, useCallback, useMemo, RefObject, useEffect } from 'react';
import { throttle } from 'lodash';
import { useEventListener } from './useEventListener';
import { getRefElement, isSSR } from '..';

export interface Scroll {
  rect?: {
    bottom: number;
    top: number;
    height: number;
    left: number;
    right: number;
    width: number;
    x: number;
    y: number;
  };
  viewport?: {
    w: number;
    h: number;
  };
  window?: {
    scrollY: number;
    scrollX: number;
  };
}

interface UseScroll {
  wait?: number;
  element?: RefObject<Element> | Window | null;
}

export const useScrollPosition = (options?: UseScroll): Scroll => {
  const { wait, element } = useMemo<UseScroll>(
    () => ({
      wait: 250,
      element: isSSR ? undefined : window,
      ...options,
    }),
    [options],
  );

  const getBoundingRect = useCallback(() => {
    const target = getRefElement(element);
    if (isSSR || !target) {
      return undefined;
    }

    if ('nodeType' in target) {
      const rect = target.getBoundingClientRect();
      return {
        bottom: rect.bottom,
        top: rect.top,
        height: rect.height,
        left: rect.left,
        right: rect.right,
        width: rect.width,
        x: rect.x,
        y: rect.y,
      };
    }
    return undefined;
  }, [element]);

  const getDocumentBoundingRect = useCallback(() => {
    const target = isSSR ? undefined : window;

    if (isSSR || !target) {
      return undefined;
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    return {
      w: vw,
      h: vh,
    };
  }, [element]);

  const getViewPortPosition = () => {
    const target = isSSR ? undefined : window;

    if (!target) return undefined;

    return {
      scrollY: target.scrollY,
      scrollX: target.scrollX,
    };
  };

  const [scroll, setScroll] = useState<Scroll>({});

  useEffect(() => {
    setScroll({
      rect: getBoundingRect(),
      window: getViewPortPosition(),
      viewport: getDocumentBoundingRect(),
    });
  }, []);

  const scrollFunc = useCallback(() => {
    setScroll(prev => ({
      ...prev,
      rect: getBoundingRect(),
      window: getViewPortPosition(),
    }));
  }, [getViewPortPosition]);

  const resizeFunc = useCallback(() => {
    setScroll(prev => ({
      ...prev,
      rect: getBoundingRect(),
      viewport: getDocumentBoundingRect(),
    }));
  }, [getBoundingRect, getDocumentBoundingRect]);

  const handleScroll = useMemo(
    () =>
      wait !== 0 ? throttle(() => scrollFunc(), wait) : () => scrollFunc(),
    [wait, scrollFunc],
  );

  useEventListener({
    type: 'scroll',
    listener: handleScroll,
    options: { passive: true },
  });

  useEventListener({
    type: 'resize',
    listener: resizeFunc,
    options: { passive: true },
  });

  useEventListener({
    type: 'resize',
    listener: resizeFunc,
    element,
    options: { passive: true },
  });

  return scroll;
};