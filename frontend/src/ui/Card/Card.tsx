import { Box, BoxOnlyProps } from '@/ui/common/Box';
import { PolymorphicProps } from '@/ui/common/Polymorphic';
import { ValidComponent } from 'solid-js';
import { isDarkTheme } from '@/feature/theme';

export type CardProps<T extends ValidComponent> = BoxOnlyProps & PolymorphicProps<T> & {};
export const Card = <T extends ValidComponent>(props: CardProps<T>) => {
  return (
    <Box
      {...props}
      bg={props.bg ?? (isDarkTheme() ? 'surface.high' : 'surface.default')}
      bd={props.bd ?? 'md'}
      bc={props.bc ?? 'surface.highest'}
      p={props.p ?? 'md'}
      r={props.r ?? 'md'}
    >
      {props.children}
    </Box>
  );
};
