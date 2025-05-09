import { styleVariants } from '@vanilla-extract/css';
import { recipe, RecipeVariants } from '@vanilla-extract/recipes';

import { layered, vars } from '@/feature/theme';

export const textVariantStyle = styleVariants({
  h1: {
    fontSize: '3.2rem',
    fontWeight: 'bold',
    color: vars.role.text.default,
  },
  h2: {
    fontSize: '2.4rem',
    fontWeight: 'bold',
    color: vars.role.text.default,
  },
  h3: {
    fontSize: '2.0rem',
    fontWeight: 'bold',
    color: vars.role.text.default,
  },

  title: {
    fontSize: '1.6rem',
    fontWeight: 'bold',
    color: vars.role.text.default,
  },
  body: {
    fontSize: '1.4rem',
    fontWeight: '400',
    color: vars.role.text.default,
  },
  caption: {
    fontSize: '1.2rem',
    fontWeight: '400',
    color: vars.role.text.caption,
  },
});

export const textStyle = recipe({
  variants: {
    ta: {
      start: layered({ textAlign: 'start' }),
      left: layered({ textAlign: 'left' }),
      center: layered({ textAlign: 'center' }),
      right: layered({ textAlign: 'right' }),
      end: layered({ textAlign: 'end' }),
      justify: layered({ textAlign: 'justify' }),
      match: layered({ textAlign: 'match-parent' }),
    },
    break: {
      normal: layered({ wordBreak: 'normal' }),
      keepAll: layered({ wordBreak: 'keep-all' }),
      breakWord: layered({ wordBreak: 'break-word' }),
      breakAll: layered({ wordBreak: 'break-all' }),
    },
    space: {
      default: layered({ whiteSpace: 'normal' }),
      nowrap: layered({ whiteSpace: 'nowrap' }),
      pre: layered({ whiteSpace: 'pre' }),
      preWrap: layered({ whiteSpace: 'pre-wrap' }),
      preLine: layered({ whiteSpace: 'pre-line' }),
    },
    to: {
      default: layered({ textOverflow: 'clip' }),
      ellipsis: layered({ textOverflow: 'ellipsis' }),
    },
    tw: {
      wrap: layered({ textWrap: 'wrap' }),
      nowrap: layered({ textWrap: 'nowrap' }),
      balance: layered({ textWrap: 'balance' }),
    },
  },
});

export type TextVariants = keyof typeof textVariantStyle;
export type TextStyleType = RecipeVariants<typeof textStyle>;