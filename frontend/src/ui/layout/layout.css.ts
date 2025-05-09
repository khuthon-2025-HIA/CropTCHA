import { style } from '@vanilla-extract/css';

import { vars } from '@/feature/theme';

export const containerStyle = style({
  width: '100%',
  height: '100%',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
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

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  flex: 1,

  overflow: 'hidden',

  backgroundColor: vars.role.surface.default,
});
