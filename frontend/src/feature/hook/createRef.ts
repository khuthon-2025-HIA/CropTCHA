import { createSignal } from 'solid-js';

type RefCallback<T> = (node: T) => void;
export const createRef = <T extends Element = HTMLElement>(
  callback?: RefCallback<T>
) => {
  const [ref, setRef] = createSignal<T | null>(null);

  const refCallback = (node: T) => {
    setRef(node as Exclude<T, Function>);
    callback?.(node);
  };

  return [ref, refCallback] as const;
};
