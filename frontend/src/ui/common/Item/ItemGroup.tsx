import { JSX, ValidComponent } from 'solid-js';

import { Box, BoxProps } from '@/ui/common/Box';

import { itemGroupStyle } from './ItemGroup.css';

export type ItemGroupProps<T extends ValidComponent> = BoxProps<T> & {
  children?: JSX.Element;
};
export const ItemGroup = <T extends ValidComponent = 'ul'>(props: ItemGroupProps<T>) => {
  return (
    <Box
      {...props}
      as={props.as ?? 'ul'}
      classList={{
        [itemGroupStyle]: true,
        [props.class!]: !!props.class,
        ...props.classList,
      }}
      data-item-group
    >
      {props.children}
    </Box>
  )
};
