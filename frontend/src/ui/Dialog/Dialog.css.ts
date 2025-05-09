import { style } from '@vanilla-extract/css';
import { alpha, vars } from '@/feature/theme';

export const backdropStyle = style({
  position: 'fixed',
  inset: 0,
  backgroundColor: alpha(vars.color.gray[900], 0.5),

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});
export const wrapperStyle = style({
  minWidth: '30rem',
});

export const contentStyle = style({
  width: '100%',
  height: '100%',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  gap: vars.space.sm,
})
