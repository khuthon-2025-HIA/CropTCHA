import { createVar, style } from '@vanilla-extract/css';
import { vars } from '@/feature/theme';

export const containerStyle = style({
  position: 'relative',

  width: '100%',
  height: 0,
  flex: 1,

  overflow: 'hidden',

  touchAction: 'none',
  userSelect: 'none',
});

export const itemX = createVar();
export const itemY = createVar();
export const cameraX = createVar();
export const cameraY = createVar();
export const scaleVar = createVar();
export const worldStyle = style({
  width: '100%',
  height: '100%',

  overflow: 'visible',
  scale: scaleVar,
});

export const svgStyle = style({
  width: '100%',
  height: '100%',

  touchAction: 'none',
  userSelect: 'none',
});

export const itemStyle = style({
  translate: `${cameraX} ${cameraY}`,
  transformOrigin: '50% 50%',

  userSelect: 'none',
  touchAction: 'none',
});

export const editablePolygonStyle = style({
  cursor: 'pointer',
  fill: vars.role.surface.default,

  transition: 'fill 0.3s cubic-bezier(0.16, 1, 0.3, 1)',

  selectors: {
    '&:hover': {
      fill: vars.role.surface.highest,
    },
  },
});

export const dotStyle = style({
  position: 'absolute',
  top: `calc(${itemY} - ${vars.space.md} / 2)`,
  left: `calc(${itemX} - ${vars.space.md} / 2)`,
  width: vars.space.md,
  height: vars.space.md,

  cursor: 'pointer',
  borderRadius: '50%',

  opacity: 0.5,
  background: vars.role.primary.default,
  boxShadow: `0 0 0 0rem ${vars.role.primary.default}`,
  transition: 'box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  transitionProperty: 'box-shadow, opacity',

  selectors: {
    '&:hover': {
      boxShadow: `0 0 0 0.4rem ${vars.role.primary.default}`,
    },
    '&:active': {
      boxShadow: `0 0 0 0.4rem ${vars.role.primary.default}`,
      opacity: 1,
    }
  }
});

export const sourceStyle = style({
  position: 'absolute',
  top: `calc(${itemY} - 2.4rem)`,
  left: `calc(${itemX} - 2.4rem)`,
  width: '4.8rem',
  height: '4.8rem',

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  borderRadius: '50%',

  background: vars.role.surface.default,
  borderStyle: 'solid',
  borderWidth: vars.line.md,
  borderColor: vars.role.surface.highest,
  boxShadow: vars.shadow.md,

  transition: 'box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  transitionProperty: 'box-shadow, scale',
});

export const sourceEditStyle = style({
  cursor: 'pointer',

  selectors: {
    '&:hover': {
      boxShadow: vars.shadow.lg,
      scale: 1.2,
    },
  }
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
