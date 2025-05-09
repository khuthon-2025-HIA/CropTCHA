import { createSignal } from 'solid-js';

type DragCallbackParams = {
  event: PointerEvent;
  pointer: [number, number];
  delta: [number, number];
};
type DragCallback = (params: DragCallbackParams) => void;
type DetailedCallback = {
  move?: DragCallback;
  start?: DragCallback;
  end?: DragCallback;
};
export const createDrag = (callback?: DetailedCallback | DragCallback) => {
  const [isDrag, setIsDrag] = createSignal(false);
  const [pointer, setPointer] = createSignal<[number, number]>([0, 0]);
  const [delta, setDelta] = createSignal<[number, number]>([0, 0]);

  const handleStartDrag = (e: PointerEvent) => {
    setIsDrag(true);

    const newPointer = [e.clientX, e.clientY] as [number, number];
    setPointer(newPointer);

    document.addEventListener('pointermove', handleMove);
    document.addEventListener('pointerup', handleEndDrag);
    document.addEventListener('pointercancel', handleEndDrag);

    call('start', {
      event: e,
      pointer: newPointer,
      delta: [0, 0],
    });
  };

  const handleEndDrag = (e: PointerEvent) => {
    document.removeEventListener('pointermove', handleMove);
    document.removeEventListener('pointerup', handleEndDrag);
    document.removeEventListener('pointercancel', handleEndDrag);

    setIsDrag(false);

    const [lastX, lastY] = pointer();
    const newDelta = [e.clientX - lastX, e.clientY - lastY] as [number, number];
    const newPointer = [e.clientX, e.clientY] as [number, number];

    call('end', {
      event: e,
      pointer: newPointer,
      delta: newDelta,
    });
  };

  const handleMove = (e: PointerEvent) => {
    if (!isDrag()) return;
    e.preventDefault();

    const [lastX, lastY] = pointer();
    const newDelta = [e.clientX - lastX, e.clientY - lastY] as [number, number];
    const newPointer = [e.clientX, e.clientY] as [number, number];

    setDelta(newDelta);
    setPointer(newPointer);

    call('move', {
      event: e,
      pointer: newPointer,
      delta: newDelta,
    });
  };

  const call = (type: keyof DetailedCallback, params: DragCallbackParams) => {
    if (typeof callback === 'function') {
      if (type === 'move') {
        callback(params);
      }
    } else {
      const fn = callback?.[type];
      fn?.(params);
    }
  };

  return {
    isDrag,
    pointer,
    delta,
    listener: {
      onPointerDown: handleStartDrag,
    },
  };
};
