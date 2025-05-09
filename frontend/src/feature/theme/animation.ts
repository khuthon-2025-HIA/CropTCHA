import { ComplexStyleRule, fallbackVar, styleVariants } from '@vanilla-extract/css';
import { assignInlineVars } from '@vanilla-extract/dynamic';

import { sx } from '@/feature/helper';

import { staggerVar } from './animation.css';

export const animation = (
  exit: ComplexStyleRule,
  enter?: ComplexStyleRule,
) => {
  return styleVariants({
    enter: {
      ...enter,

      transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      transitionDelay: `calc(${fallbackVar(staggerVar, '0')} * 0.1s)`,
    },
    exit: {
      ...exit,
      transition: 'all 0.6s cubic-bezier(0.87, 0, 0.13, 1)',
      transitionDelay: `calc(${fallbackVar(staggerVar, '0')} * 0.1s)`,
    },
  });
};

export const stagger = (num: number, ...styles: Parameters<typeof sx>) => {
  return sx(...styles, assignInlineVars({
    [staggerVar]: `${num}`,
  }));
};
