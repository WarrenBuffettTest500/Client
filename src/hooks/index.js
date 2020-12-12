import { useEffect } from 'react';

export const useInfinteScroll = ({
  root = null,
  target,
  callback,
  threshold = 1.0,
  rootMargin = '0px',
}) => {
  useEffect(() => {
    const observer = new IntersectionObserver(callback, {
      root,
      rootMargin,
      threshold,
    });

    if (!target)  return;

    observer.observe(target);
    return () => {
      observer.unobserve(target);
    };
  }, [target, root]);
};
