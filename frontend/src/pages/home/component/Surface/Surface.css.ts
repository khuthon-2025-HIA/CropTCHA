import { createVar, style } from '@vanilla-extract/css';
import { vars } from '@/feature/theme';

export const containerStyle = style({
  position: 'relative',

  width: '100%',
  height: 0,
  flex: 1,
});

export const canvasStyle = style({
  width: '100%',
  height: '100%',

  touchAction: 'none',
});

export const fabContainerStyle = style({
  position: 'absolute',
  right: vars.space.lg,
  bottom: vars.space.lg,

  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: vars.space.md,
});
export const fabStyle = style({
  width: '4.2rem',
  height: '4.2rem',
  borderRadius: '50%',
});

export const x = createVar();
export const y = createVar();
export const popupStyle = style({
  position: 'absolute',
  top: y,
  left: x,
  width: 10,
  height: 10,
  pointerEvents: 'none',
});
