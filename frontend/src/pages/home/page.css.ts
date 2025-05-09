import { style } from '@vanilla-extract/css';
import { vars, animation } from '@/feature/theme';

export const containerStyle = style({
  width: '100%',
  height: '100%',

  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  gap: vars.space.md,
});

export const mainSectionStyle = style({
  width: '100%',
  height: '100%',

  borderStyle: 'solid',
  borderColor: vars.role.surface.highest,
  borderWidth: vars.line.md,
  borderRadius: vars.space.sm,

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
});

export const mainSectionToolbarStyle = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: vars.space.xs,

  borderBottomStyle: 'solid',
  borderBottomWidth: vars.line.md,
  borderBottomColor: vars.role.surface.highest,
});

export const buttonAnimation = animation({
  opacity: 0,
  pointerEvents: 'none',
  translate: '-0.8rem',
});

export const sideSectionStyle = style({
  width: '30rem',
  height: '100%',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  gap: vars.space.md,

  flexShrink: 0,
});
