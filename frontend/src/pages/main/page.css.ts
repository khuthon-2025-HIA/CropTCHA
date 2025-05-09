import { style } from '@vanilla-extract/css';
import { vars } from '@/feature/theme';

export const containerStyle = style({
  width: '100%',
  height: '100%',

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.xl,
});

export const buttonContainerStyle = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: vars.space.xxl,
});

export const buttonStyle = style({
  width: '12.8rem',
  height: '12.8rem',
  aspectRatio: '1',

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: vars.space.xs,

  padding: vars.space.md,
  borderRadius: '50%',
  backgroundColor: vars.role.surface.default,
  borderStyle: 'solid',
  borderWidth: vars.line.md,
  borderColor: vars.role.surface.highest,
  color: vars.role.surface.text,
  cursor: 'pointer',

  ':hover': {
    backgroundColor: vars.role.surface.high,
  },
})
