import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/feature/theme';

const baseContainerStyle = style({
  position: 'relative',

  width: '2.4rem',
  height: '2.4rem',

  borderRadius: '2.4rem',
  borderStyle: 'solid',
  borderWidth: vars.line.md,
  borderColor: vars.role.surface.highest,

  cursor: 'pointer',
  transition: 'box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
});

export const containerStyle = styleVariants({
  on: [baseContainerStyle, {
    borderColor: vars.role.primary.default,
    boxShadow: `0 0 0 1.2rem ${vars.role.primary.container} inset`,
  }],
  off: [baseContainerStyle, {
    boxShadow: `0 0 0 0 ${vars.role.primary.container} inset`,
  }],
});

export const inputStyle = style({
  display: 'none',
});

const baseCheckStyle = style({
  position: 'absolute',
  top: '50%',
  left: '50%',

  color: 'inherit',
  transform: 'translate(-50%, -50%)',
  userSelect: 'none',

  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
});
export const checkStyle = styleVariants({
  on: [baseCheckStyle, {
    opacity: 1,
    color: vars.role.primary.default,
    transform: 'translate(-50%, -50%) scale(1)',
  }],
  off: [baseCheckStyle, {
    opacity: 0,
    transform: 'translate(-50%, -50%) scale(0.8)',
  }],
});
