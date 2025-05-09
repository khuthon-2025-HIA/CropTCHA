import { createVar, fallbackVar, style, styleVariants } from '@vanilla-extract/css';

import { vars } from '@/feature/theme';

export const hoverBackgroundStyle = createVar();

type SpaceKeys = Exclude<keyof typeof vars.space, 'xxs'>;
const offsetSpaces = Object.keys(vars.space)
  .reduce((acc, key) => {
    if (key === 'xxs') return acc;

    return {
      ...acc,
      [key]: createVar(),
    };
  }, {} as Record<SpaceKeys, string>);

const backupVars = Object.entries(offsetSpaces)
  .reduce((prev, [key, newVar]) => ({
    ...prev,
    [newVar]: vars.space[key as SpaceKeys],
  }), {});
const offsetVars = Object.entries(offsetSpaces)
  .reduce((prev, [key, newVar]) => ({
    ...prev,
    [vars.space[key as SpaceKeys]]: `calc(${newVar} - ${vars.space.xxs})`
  }), {});

export const containerStyle = style({
  padding: vars.space.xxs,
  borderRadius: vars.space.sm,
  overflow: 'hidden',
  flexShrink: 0,

  vars: backupVars,
});

export const wrapperStyle = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: vars.space.xs,

  vars: offsetVars,
});

export const clickableContainerStyle = style({
  userSelect: 'none',
  cursor: 'pointer',

  ':hover': {
    background: fallbackVar(hoverBackgroundStyle, vars.role.surface.high),
  }
});

export const disabledStyle = style({
  color: `${vars.role.text.disabled} !important`,
  cursor: 'default',

  ':hover': {
    background: 'none',
  }
});

export const textGroupStyle = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: vars.space.xs,
  padding: `${vars.space.sm} ${vars.space.md}`,

  flex: 1,

  selectors: {
    '* + &': {
      paddingLeft: vars.space.sm,
    },
    '&:has(+ *)': {
      paddingRight: vars.space.sm,
    },
  },
});

export const textStyle = styleVariants({
  default: {
    fontSize: '1.4rem',
    color: vars.role.surface.text,
  },
  caption: {
    fontSize: '1.2rem',
    color: vars.role.text.caption,
  }
});

export const iconStyle = style({
  flexShrink: 0,
  padding: vars.space.sm,
});
