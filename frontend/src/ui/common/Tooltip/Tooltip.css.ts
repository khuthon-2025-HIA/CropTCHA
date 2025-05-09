import { style } from '@vanilla-extract/css';

import { vars } from '@/feature/theme';

export const containerStyle = style({
  color: vars.role.surface.text,
  backgroundColor: vars.role.surface.default,
  boxShadow: vars.shadow.md,

  fontSize: '1.2rem',
  padding: `${vars.space.xs} ${vars.space.sm}`,
  borderRadius: vars.space.xs,
});
