import { createVar, style } from '@vanilla-extract/css';
import { vars } from '@/feature/theme';

export const containerStyle = style({
  width: '100%',
  height: '100%',

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.md,
});

export const visualizerStyle = style({
  position: 'relative',
  width: '100%',
  height: '6.4rem',
});

export const size = createVar();
export const order = createVar();
export const height = createVar();
export const lineStyle = style({
  width: `calc(100% / (${size} * 2))`,
  height: `100%`,

  transformOrigin: '50% 50%',
  transform: `scaleY(${height})`,

  background: 'linear-gradient(90deg, rgba(238, 119, 82, 0.8), rgba(231, 60, 126, 0.8), rgba(35, 166, 213, 0.8), rgba(35, 213, 171, 0.8))',
  backgroundSize: `calc(${size} * 100%) 100%`,
  backgroundPosition: `calc(${order} * (${size} * 100%)) 50%`,

  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
});
