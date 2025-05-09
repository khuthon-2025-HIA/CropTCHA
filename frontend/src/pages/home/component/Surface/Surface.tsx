import gsap from 'gsap';
import { createEffect, createSignal, For, onMount, Show } from 'solid-js';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import ZoomIn from 'lucide-solid/icons/zoom-in';
import ZoomOut from 'lucide-solid/icons/zoom-out';
import ScanSearch from 'lucide-solid/icons/scan-search';
import Volume2 from 'lucide-solid/icons/volume-2';

import { Text } from '@/ui/common/Text';
import { Icon } from '@/ui/common/Icon';
import { Button } from '@/ui/common/Button';
import { Tooltip } from '@/ui/common/Tooltip';

import { vars } from '@/feature/theme';
import { Device } from '@/feature/model/device';
import { createDrag } from '@/feature/hook/createDrag';
import { createRef } from '@/feature/hook/createRef';

import {
  svgStyle,
  containerStyle,
  cameraX,
  cameraY, itemStyle, dotStyle,
  itemX,
  itemY, editablePolygonStyle, fabContainerStyle,
  fabStyle, sourceStyle, sourceEditStyle, worldStyle, scaleVar,
} from './Surface.css';

type EditData = {
  shapeIndex?: number;
  pointIndex?: number;
  sourceIndex?: number;
};

type Point = [number, number];
type Shape = Point[];
export type SourcePoint = {
  point: Point;
  source: Device;
}
export type SurfaceProps = {
  mode?: 'view' | 'edit';
  shape: Shape[];
  source: SourcePoint[];
  onShapeChange?: (shape: Shape[]) => void;
  onSourceChange?: (source: SourcePoint[]) => void;
}
export const Surface = (props: SurfaceProps) => {
  const [zoomText, setZoomText] = createRef();
  const [containerRef, setContainerRef] = createRef();
  const [zoom1, setZoom1] = createRef();
  const [zoom2, setZoom2] = createRef();
  const [zoom3, setZoom3] = createRef();

  const { listener } = createDrag({
    move: ({ delta }) => {
      const data = editData();

      if (props.mode === 'edit') {
        if (typeof data.sourceIndex === 'number') {
          const sourceIndex = data.sourceIndex;
          const sourcePoint = editSource()[sourceIndex];

          setEditSource((prev) => {
            const newSource = [...prev];
            newSource[sourceIndex] = {
              ...sourcePoint,
              point: [
                sourcePoint.point[0] + delta[0],
                sourcePoint.point[1] + delta[1],
              ],
            };

            return newSource;
          });
        } else if (typeof data.shapeIndex === 'number' && typeof data.pointIndex === 'number') {
          const shapeIndex = data.shapeIndex;
          const pointIndex = data.pointIndex;
          const shape = editShape()[shapeIndex];
          const point = shape[pointIndex];

          setEditShape((prev) => {
            const newShape = [...prev];
            newShape[shapeIndex][pointIndex] = [
              point[0] + delta[0],
              point[1] + delta[1],
            ];
            return newShape;
          });
        } else if (typeof data.shapeIndex === 'number') {
          const shapeIndex = data.shapeIndex;
          const shape = editShape()[shapeIndex];

          setEditShape((prev) => {
            const newShape = [...prev];
            newShape[shapeIndex] = shape.map((point) => [
              point[0] + delta[0],
              point[1] + delta[1],
            ]);
            return newShape;
          });
        } else {
          setCoord((prev) => [
            prev[0] + delta[0],
            prev[1] + delta[1],
          ]);
        }
      } else {
        setCoord((prev) => [
          prev[0] + delta[0],
          prev[1] + delta[1],
        ]);
      }
    },
    end: () => {
      if (props.mode === 'edit') {
        props.onShapeChange?.(editShape());
        props.onSourceChange?.(editSource());
        setEditData({});
      }
    }
  });

  const [coord, setCoord] = createSignal<[number, number]>([0, 0]);
  const [scale, setScale] = createSignal(1);

  const [editData, setEditData] = createSignal<EditData>({});
  const [editShape, setEditShape] = createSignal<Shape[]>(props.shape);
  const [editSource, setEditSource] = createSignal<SourcePoint[]>(props.source);

  const shapes = () => props.mode === 'edit' ? editShape() : props.shape;
  const sources = () => props.mode === 'edit' ? editSource() : props.source;

  const zoom = (factor: number) => {
    const mainContainer = containerRef();
    if (!mainContainer) return;

    const oldScale = scale();
    let newScale = oldScale * factor;

    newScale = Math.max(0.1, Math.min(newScale, 10));
    if (newScale === oldScale) return;

    const rect = mainContainer.getBoundingClientRect();
    const pivotScreenX = rect.width / 2;
    const pivotScreenY = rect.height / 2;

    const [oldCoordX, oldCoordY] = coord();

    const newCoordX = pivotScreenX * (1 / newScale - 1 / oldScale) + oldCoordX;
    const newCoordY = pivotScreenY * (1 / newScale - 1 / oldScale) + oldCoordY;

    setScale(newScale);
    setCoord([newCoordX, newCoordY]);
  };

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    const minS = 0.1;
    const maxS = 10;
    const sensitivity = 0.1;
    const [camXOld, camYOld] = coord();
    const scaleOld = scale();
    const delta = event.deltaY > 0 ? -1 : 1;
    let scaleNew = scaleOld * (1 + delta * sensitivity);
    scaleNew = Math.max(minS, Math.min(maxS, scaleNew));
    if (scaleNew === scaleOld) return;

    const mouseCanvasX = event.offsetX;
    const mouseCanvasY = event.offsetY;

    const worldMouseX = mouseCanvasX / scaleOld + camXOld;
    const worldMouseY = mouseCanvasY / scaleOld + camYOld;

    const camXNew = worldMouseX - mouseCanvasX / scaleNew;
    const camYNew = worldMouseY - mouseCanvasY / scaleNew;

    setCoord([camXNew, camYNew]);
    setScale(scaleNew);
  };

  onMount(() => {
    const tl = gsap.timeline();
    tl.from(zoom3(), {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      ease: 'power4.out',
    });
    tl.from(zoom2(), {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      ease: 'power4.out',
    }, '-=0.5');
    tl.from(zoom1(), {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      ease: 'power4.out',
    }, '-=0.5');
    tl.from(zoomText(), {
      x: 16,
      opacity: 0,
      duration: 0.6,
      ease: 'power4.out',
    }, '-=0.5');
  });

  createEffect(() => {
    setEditShape(props.shape);
  });
  createEffect(() => {
    setEditSource(props.source);
  });

  return (
    <div
      ref={setContainerRef}
      class={containerStyle}
      style={assignInlineVars({
        [cameraX]: `${coord()[0]}px`,
        [cameraY]: `${coord()[1]}px`,
        [scaleVar]: `${scale()}`
      })}
      {...listener}
      onWheel={handleWheel}
    >
      <div class={worldStyle}>
        <svg class={svgStyle}>
          <For each={shapes()}>
            {(_, shapeIndex) => (
              <polygon
                points={shapes()[shapeIndex()].map(point => point.join(',')).join(' ')}
                fill={'transparent'}
                stroke={vars.role.text.default}
                stroke-width={vars.line.bold}
                classList={{
                  [itemStyle]: true,
                  [editablePolygonStyle]: props.mode === 'edit',
                }}
                onPointerDown={() => {
                  setEditData({
                    shapeIndex: shapeIndex(),
                  });
                }}
              />
            )}
          </For>
        </svg>
        <For each={sources()}>
          {({ point, source }, sourceIndex) => (
            <Tooltip label={source.label}>
              <div
                classList={{
                  [itemStyle]: true,
                  [sourceStyle]: true,
                  [sourceEditStyle]: props.mode === 'edit',
                }}
                style={assignInlineVars({
                  [itemX]: `${point[0]}px`,
                  [itemY]: `${point[1]}px`,
                })}
                onPointerDown={() => {
                  setEditData({ sourceIndex: sourceIndex() });
                }}
              >
                <Icon icon={Volume2}/>
              </div>
            </Tooltip>
          )}
        </For>
        <Show when={props.mode === 'edit'}>
          <For each={shapes()}>
            {(shape, shapeIndex) => (
              <For each={shape}>
                {(_, pointIndex) => (
                  <div
                    classList={{
                      [itemStyle]: true,
                      [dotStyle]: true,
                    }}
                    style={assignInlineVars({
                      [itemX]: `${shapes()[shapeIndex()][pointIndex()][0]}px`,
                      [itemY]: `${shapes()[shapeIndex()][pointIndex()][1]}px`,
                    })}
                    onPointerDown={() => {
                      setEditData({
                        shapeIndex: shapeIndex(),
                        pointIndex: pointIndex(),
                      });
                    }}
                  />
                )}
              </For>
            )}
          </For>
        </Show>
      </div>

      <div class={fabContainerStyle}>
        <Text ref={setZoomText}>
          Zoom: {scale().toFixed(2)}
        </Text>
        <Tooltip label={'축소'}>
          <Button
            ref={setZoom1}
            class={fabStyle}
            onClick={() => {
              zoom(1 / 1.1);
            }}
          >
            <Icon icon={ZoomOut}/>
          </Button>
        </Tooltip>
        <Tooltip label={'확대'}>
          <Button
            ref={setZoom2}
            class={fabStyle}
            onClick={() => {
              zoom(1.1);
            }}
          >
            <Icon icon={ZoomIn}/>
          </Button>
        </Tooltip>
        <Tooltip label={'배율 초기화'}>
          <Button
            ref={setZoom3}
            class={fabStyle}
            onClick={() => {
              setCoord([0, 0]);
              setScale(1);
            }}
          >
            <Icon icon={ScanSearch}/>
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};
