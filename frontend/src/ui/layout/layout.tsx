import type { RouteSectionProps } from '@solidjs/router';

import { Text } from '@/ui/common/Text';

import { containerStyle, headerStyle, layoutStyle } from './layout.css';

export type LayoutProps = RouteSectionProps;
export const Layout = (props: LayoutProps) => {
  return (
    <div class={containerStyle}>
      <header class={headerStyle}>
        <Text variant={'title'}>
          Header
        </Text>
      </header>
      <section role={'main'} class={layoutStyle}>
        {props.children}
      </section>
    </div>
  );
};
