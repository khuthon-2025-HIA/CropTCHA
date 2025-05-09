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

export const toolbarStyle = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: vars.space.xs,
});
export const toolbarButtonStyle = style({
  padding: `${vars.space.xxs} ${vars.space.xs}`,
  borderRadius: vars.space.xs,
});

export const deviceContainerStyle = style({
  paddingTop: vars.space.md,
});

export const deviceStyle = style({
  width: '4.2rem',
  height: '4.2rem',
  borderRadius: '50%',

  padding: vars.space.md,
});
