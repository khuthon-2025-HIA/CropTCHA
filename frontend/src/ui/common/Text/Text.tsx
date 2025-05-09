import { splitProps, ValidComponent } from 'solid-js';

import { cx } from '@/feature/helper';

import { Box, BoxProps } from '../Box';

import { textStyle, TextStyleType, TextVariants, textVariantStyle } from './Text.css';

export type TextOnlyProps = TextStyleType;
export type TextProps<T extends ValidComponent = 'div'> = BoxProps<T> & TextOnlyProps & {
  variant?: TextVariants;
};
export const Text = <T extends ValidComponent = 'div'>(
  props: TextProps<T> & { as?: T }
) => {
  const [textStyleProps, local, rest] = splitProps(
    props,
    ['ta', 'break', 'space', 'to', 'tw'],
    ['variant']
  );

  const textStyles = () => cx(
    textStyle({
      ta: textStyleProps.ta,
      break: textStyleProps.break,
      space: textStyleProps.space,
      to: textStyleProps.to,
      tw: textStyleProps.tw,
    }),
    rest.class
  );

  return (
    <Box
      {...rest}
      classList={{
        [textVariantStyle[local.variant ?? 'body']]: true,
        [textStyles()]: true,
        ...rest.classList,
      }}
    />
  );
};