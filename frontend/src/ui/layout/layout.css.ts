import { style } from '@vanilla-extract/css';

import { vars } from '@/feature/theme';

export const containerStyle = style({
  width: '100%',
  height: '100%',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',

  backgroundColor: vars.role.surface.default,
});

export const headerStyle = style({
  width: '100%',
  height: '5.6rem',

  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',

  padding: `${vars.space.sm} ${vars.space.lg}`,

  backgroundColor: vars.role.surface.default,
})

export const layoutStyle = style({
  width: '100%',
  maxWidth: '120rem',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  flex: 1,

  padding: vars.space.md,
  paddingTop: 0,

  overflow: 'hidden',
  alignSelf: 'center',
});
