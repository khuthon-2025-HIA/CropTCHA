import { splitProps, ValidComponent } from 'solid-js';

import { Box, BoxProps } from '../Box';

import { buttonActiveStyle, buttonStyle } from './Button.css';

type ButtonVariants = keyof typeof buttonStyle
export type ButtonProps<T extends ValidComponent = 'button'> = BoxProps<T> & {
  variant?: ButtonVariants;
  active?: boolean;
};
export const Button = <T extends ValidComponent = 'button'>(
  props: ButtonProps<T> & { as?: T }
) => {
  const [local, rest] = splitProps(
    props,
    ['variant', 'active']
  );

  return (
    <Box
      {...rest}
      size={rest.size ?? '1.4rem'}
      as={rest.as ?? 'button'}
      direction={rest.direction ?? 'row'}
      classList={{
        [buttonStyle[local.variant ?? 'default']]: !local.active,
        [buttonActiveStyle[local.variant ?? 'default']]: local.active,
        [rest.class]: !!rest.class,
        ...rest.classList,
      }}
    />
  );
};
