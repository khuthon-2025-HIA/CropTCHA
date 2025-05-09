import { StyleRule } from '@vanilla-extract/css';
import { createMediaQuery } from '@solid-primitives/media';

const size = {
  tablet: '768px',
  desktop: '1024px',
};
export const LayoutCondition = {
  mobile: `screen and (max-width: ${size.tablet})`,
  tablet: `screen and (min-width: ${size.tablet})`,
  desktop: `screen and (min-width: ${size.desktop})`
};

type WithQueryStyle<N, M = never, T = never, D = never> = Omit<N, 'mobile' | 'tablet' | 'desktop'> & (
    M | T | D extends never
  ? {}
  : {
    '@media': {
      [condition in keyof typeof LayoutCondition]: (
        condition extends 'desktop' ? D :
          condition extends 'tablet' ? T : M
        )
    }
  }
  );

export const responsive = <
  N extends StyleRule = {},
  M extends StyleRule = {},
  T extends StyleRule = {},
  D extends StyleRule = {},
>({
  tablet,
  desktop,
  mobile,
  ...normal
}: N & { mobile?: M; tablet?: T; desktop?: D; }): WithQueryStyle<N, M, T, D> => {
  if (!mobile && !tablet && !desktop) return normal as WithQueryStyle<N, M, T, D>;

  const media: Record<string, StyleRule> = {};
  if (desktop) {
    media[LayoutCondition.desktop] = desktop;
  }
  if (tablet) {
    media[LayoutCondition.tablet] = tablet;
  }
  if (mobile) {
    media[LayoutCondition.mobile] = mobile;
  }

  return {
    ...normal,
    '@media': media,
  } as unknown as WithQueryStyle<N, M, T, D>;
};

export const createResponsive = () => {
  const isDesktop = createMediaQuery(LayoutCondition.desktop);
  const isTablet = createMediaQuery(LayoutCondition.tablet);
  const isMobile = createMediaQuery(LayoutCondition.mobile);

  return new Proxy({
    desktop: false,
    tablet: false,
    mobile: true,
  }, {
    get(_, key) {
      if (key === 'desktop') return isDesktop();
      if (key === 'tablet') return isTablet();
      if (key === 'mobile') return isMobile();

      return false;
    }
  });
};
