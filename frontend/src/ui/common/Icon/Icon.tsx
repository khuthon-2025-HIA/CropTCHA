import { splitProps, type Component, ValidComponent } from 'solid-js';
import { LucideProps } from 'lucide-solid';

import { Box, BoxProps } from '@/ui/common/Box';

import { iconStyle } from './Icon.css';

export type IconType = Component<LucideProps>;
export type IconProps<T extends ValidComponent> = Omit<BoxProps<T>, 'as' | 'size'> & LucideProps & {
  icon: IconType;
};
export const Icon = <T extends ValidComponent>(props: IconProps<T>) => {
  const [local, rest] = splitProps(
    props,
    ['icon'],
  );

  return (
    <Box
      {...rest}
      as={local.icon as ValidComponent}
      c={rest.c ?? 'inherit'}
      classList={{
        [iconStyle]: true,
        [rest.class ?? '']: !!rest.class,
        ...rest.classList,
      }}
      props={{
        size: rest.size ?? 16
      }}
    />
  );
};
