import { gsap } from 'gsap';
import { JSX, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import { Box } from '@/ui/common/Box';
import { Text } from '@/ui/common/Text';

import { backdropStyle, contentStyle, wrapperStyle } from './Dialog.css';

export type DialogProps = {
  open?: boolean;
  onClose?: () => void;

  title?: string;
  children?: JSX.Element;
  footer?: JSX.Element;
}
export const Dialog = (props: DialogProps) => {
  return (
    <Show when={props.open}>
      <Portal>
        <div
          ref={(el) => gsap.from(el, {
            opacity: 0,
            duration: 0.6,
            ease: 'power4.out',
          })}
          class={backdropStyle}
          onClick={props.onClose}
        >
          <Box
            ref={(el) => gsap.from(el, {
              opacity: 0,
              scale: 0.8,
              duration: 0.6,
              ease: 'power4.out',
            })}
            bg={'surface.default'}
            shadow={'xl'}
            r={'md'}
            p={'md'}
            gap={'xs'}
            class={wrapperStyle}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <Text variant={'title'}>
              {props.title}
            </Text>
            <section class={contentStyle}>
              {props.children}
            </section>
            {props.footer}
          </Box>
        </div>
      </Portal>
    </Show>
  );
};