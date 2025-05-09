import { createEffect, createSignal } from 'solid-js';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import ZoomIn from 'lucide-solid/icons/zoom-in';
import ZoomOut from 'lucide-solid/icons/zoom-out';
import ScanSearch from 'lucide-solid/icons/scan-search';
import CirclePlus from 'lucide-solid/icons/circle-plus';
import CircleMinus from 'lucide-solid/icons/circle-minus';

import { Card } from '@/ui/Card';
import { Icon } from '@/ui/common/Icon';
import { Button } from '@/ui/common/Button';
import { Text } from '@/ui/common/Text';
import { Item } from '@/ui/common/Item/Item';
import { Popover } from '@/ui/common/Popover';

import { alpha, vars } from '@/feature/theme';
import { resolveVar } from '@/feature/helper';
import { createRef } from '@/feature/hook/createRef';

import {
  canvasStyle,
  containerStyle,
  fabContainerStyle,
  fabStyle,
  popupStyle,
  x,
  y
} from './Surface.css';

type Point = [number, number];
type Shape = Point[];

type DraggedShapeStartInfo = {
  index: number;
  initialMouseWorld: Point;
  initialShapePoints: Shape;
};

export type SurfaceProps = {
  mode?: 'view' | 'edit';
  shape: Shape[];
  onShapeChange?: (shape: Shape[]) => void;
}
export const Surface = (props: SurfaceProps) => {
    const [canvas, setCanvas] = createRef<HTMLCanvasElement>();

    const [camera, setCamera] = createSignal<Point>([0, 0]);
    const [scale, setScale] = createSignal(1);
    const [editShape, setEditShape] = createSignal<Shape[]>(props.shape);
    const [open, setOpen] = createSignal(false);

    const currentShapeArray = () => props.mode === 'view' ? props.shape : editShape();

    const [isPanning, setIsPanning] = createSignal(false);
    const [panStartPoint, setPanStartPoint] = createSignal<Point>([0, 0]);
    const [cameraAtPanStart, setCameraAtPanStart] = createSignal<Point>([0, 0]);
    const [scaleAtPanStart, setScaleAtPanStart] = createSignal(1);

    const [isDraggingPoint, setIsDraggingPoint] = createSignal(false);
    const [draggedShapeIndex, setDraggedShapeIndex] = createSignal<number | null>(null);
    const [draggedPointIndex, setDraggedPointIndex] = createSignal<number | null>(null);

    const [isDraggingShape, setIsDraggingShape] = createSignal(false);
    const [draggedShapeStartInfo, setDraggedShapeStartInfo] = createSignal<DraggedShapeStartInfo | null>(null);

    const [hoveredPointInfo, setHoveredPointInfo] = createSignal<{ shapeIdx: number, pointIdx: number } | null>(null);
    const [hoveredShapeIndex, setHoveredShapeIndex] = createSignal<number | null>(null);

    const hoveredShapeBottom = () => {
      const position = getShapeCenterPosition(hoveredShapeIndex());
      if (!position) return null;

      return [(position[0] - camera()[0]) * scale(), (position[1] - camera()[1]) * scale()];
    };

    const screenToWorld = (screenX: number, screenY: number): Point => {
      const [camX, camY] = camera();
      const s = scale();
      return [screenX / s + camX, screenY / s + camY];
    };

    const isPointInShape = (point: Point, shape: Shape): boolean => {
      if (!shape || shape.length < 3) return false;

      let [px, py] = point;
      let isInside = false;
      let j = shape.length - 1;
      for (let i = 0; i < shape.length; j = i++) {
        const [vix, viy] = shape[i];
        const [vjx, vjy] = shape[j];

        const intersect = ((viy > py) !== (vjy > py))
          && (px < (vjx - vix) * (py - viy) / (vjy - viy) + vix);
        if (intersect) isInside = !isInside;
      }
      return isInside;
    };

    const getShapeCenterPosition = (index: number | null): Point | null => {
      if (index === null) return null;

      const targetShape = currentShapeArray()[index];
      if (!targetShape || targetShape.length === 0) return null;

      let minY = targetShape[0][1];
      let maxY = targetShape[0][1];
      let minX = targetShape[0][0];
      let maxX = targetShape[0][0];

      for (let i = 1; i < targetShape.length; i++) {
        const point = targetShape[i];
        minX = Math.min(minX, point[0]);
        maxX = Math.max(maxX, point[0]);
        minY = Math.min(minY, point[1]);
        maxY = Math.max(maxY, point[1]);
      }

      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      return [centerX, centerY];
    };

    const handlePointerDown = (event: MouseEvent) => {
      const cvs = canvas();
      if (!cvs) return;

      const currentMode = props.mode || 'view';
      const [mouseX_world, mouseY_world] = screenToWorld(event.offsetX, event.offsetY);

      if (currentMode === 'edit') {
        const pointScreenRadius = 5;
        const pointWorldRadius = pointScreenRadius / scale();

        for (let i = 0; i < currentShapeArray().length; i++) {
          const currentShapeInstance = currentShapeArray()[i];
          for (let j = 0; j < currentShapeInstance.length; j++) {
            const [pointX_world, pointY_world] = currentShapeInstance[j];
            const dx = mouseX_world - pointX_world;
            const dy = mouseY_world - pointY_world;
            if (dx * dx + dy * dy < pointWorldRadius * pointWorldRadius) {
              setIsDraggingPoint(true);
              setDraggedShapeIndex(i);
              setDraggedPointIndex(j);
              setIsPanning(false);
              setIsDraggingShape(false);
              cvs.style.cursor = 'move';
              return;
            }
          }
        }

        for (let i = currentShapeArray().length - 1; i >= 0; i--) {
          if (isPointInShape([mouseX_world, mouseY_world], currentShapeArray()[i])) {
            setIsDraggingShape(true);
            setDraggedShapeStartInfo({
              index: i,
              initialMouseWorld: [mouseX_world, mouseY_world],
              initialShapePoints: currentShapeArray()[i].map(p => [...p] as Point)
            });
            setIsPanning(false);
            setIsDraggingPoint(false);
            cvs.style.cursor = 'move';
            return;
          }
        }
      }

      setIsPanning(true);
      setPanStartPoint([event.offsetX, event.offsetY]);
      setCameraAtPanStart([...camera()]);
      setScaleAtPanStart(scale());
      setIsDraggingPoint(false);
      setIsDraggingShape(false);
      cvs.style.cursor = 'grabbing';
    };

    const handlePointerMove = (event: MouseEvent) => {
      const cvs = canvas();
      if (!cvs) return;

      const [mouseX_world, mouseY_world] = screenToWorld(event.offsetX, event.offsetY);

      if (isDraggingShape()) {
        const info = draggedShapeStartInfo();
        if (!info || props.mode !== 'edit') return;

        const deltaX = mouseX_world - info.initialMouseWorld[0];
        const deltaY = mouseY_world - info.initialMouseWorld[1];

        const newShapes = editShape().map(s => s.map(p => [...p] as Point));

        newShapes[info.index] = info.initialShapePoints.map(p => [p[0] + deltaX, p[1] + deltaY]);

        setEditShape(newShapes);
      } else if (isDraggingPoint()) {
        const shapeIdx = draggedShapeIndex();
        const pointIdx = draggedPointIndex();
        if (shapeIdx === null || pointIdx === null || props.mode !== 'edit') return;

        const newShapes = editShape().map(s => s.map(p => [...p] as Point));
        newShapes[shapeIdx][pointIdx] = [mouseX_world, mouseY_world];
        setEditShape(newShapes);
      } else if (isPanning()) {
        const currentMousePoint: Point = [event.offsetX, event.offsetY];
        const startDragMousePos = panStartPoint();
        const initialCameraPos = cameraAtPanStart();
        const dragStartScale = scaleAtPanStart();

        const dx_screen = currentMousePoint[0] - startDragMousePos[0];
        const dy_screen = currentMousePoint[1] - startDragMousePos[1];

        const dx_world = dx_screen / dragStartScale;
        const dy_world = dy_screen / dragStartScale;

        setCamera([initialCameraPos[0] - dx_world, initialCameraPos[1] - dy_world]);
      } else {
        let newHoveredShapeIndex: number | null = null;
        for (let i = currentShapeArray().length - 1; i >= 0; i -= 1) {
          if (isPointInShape([mouseX_world, mouseY_world], currentShapeArray()[i])) {
            newHoveredShapeIndex = i;
            break;
          }
        }
        if (newHoveredShapeIndex === null && props.mode === 'edit') setOpen(false);
        if (props.mode === 'edit') setHoveredShapeIndex(newHoveredShapeIndex);

        if (props.mode === 'edit') {
          const pointScreenRadius = 5;
          const pointWorldRadius = pointScreenRadius / scale();
          let foundHover = false;
          for (let i = 0; i < currentShapeArray().length; i++) {
            for (let j = 0; j < currentShapeArray()[i].length; j++) {
              const [pointX_world_vertex, pointY_world_vertex] = currentShapeArray()[i][j];
              const dx = mouseX_world - pointX_world_vertex;
              const dy = mouseY_world - pointY_world_vertex;
              if (dx * dx + dy * dy < pointWorldRadius * pointWorldRadius) {
                cvs.style.cursor = 'pointer';
                setHoveredPointInfo({ shapeIdx: i, pointIdx: j });
                foundHover = true;
                break;
              }
            }
            if (foundHover) break;
          }
          if (!foundHover) {
            if (newHoveredShapeIndex !== null) {
              cvs.style.cursor = 'grab';
            } else {
              cvs.style.cursor = 'default';
            }
            setHoveredPointInfo(null);
          }
        }
      }
    };

    const handlePointerUpOrLeave = () => {
      const cvs = canvas();
      let cursorNeedsReset = false;

      if (isDraggingPoint()) {
        setIsDraggingPoint(false);
        setDraggedShapeIndex(null);
        setDraggedPointIndex(null);
        if (props.mode === 'edit') props.onShapeChange?.(editShape());
        cursorNeedsReset = true;
      }
      if (isDraggingShape()) {
        setIsDraggingShape(false);
        setDraggedShapeStartInfo(null);
        if (props.mode === 'edit') props.onShapeChange?.(editShape());
        cursorNeedsReset = true;
      }
      if (isPanning()) {
        setIsPanning(false);
        cursorNeedsReset = true;
      }

      if (cvs && cursorNeedsReset) {
        if (props.mode === 'edit') {
          if (hoveredPointInfo()) {
            cvs.style.cursor = 'pointer';
          } else if (hoveredShapeIndex() !== null) {
            cvs.style.cursor = 'grab';
          } else {
            cvs.style.cursor = 'default';
          }
        } else {
          cvs.style.cursor = 'grab';
        }
      }
    };

    const zoom = (factor: number) => {
      const cvs = canvas();
      if (!cvs || cvs.width === 0 || cvs.height === 0) return;
      const minS = 0.1;
      const maxS = 10;
      const [camXOld, camYOld] = camera();
      const scaleOld = scale();
      let scaleNew = scaleOld * factor;
      scaleNew = Math.max(minS, Math.min(maxS, scaleNew));
      if (scaleNew === scaleOld) return;

      const viewCenterX = cvs.width / 2;
      const viewCenterY = cvs.height / 2;

      const worldViewCenterX = viewCenterX / scaleOld + camXOld;
      const worldViewCenterY = viewCenterY / scaleOld + camYOld;

      const camXNew = worldViewCenterX - viewCenterX / scaleNew;
      const camYNew = worldViewCenterY - viewCenterY / scaleNew;

      setCamera([camXNew, camYNew]);
      setScale(scaleNew);
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const cvs = canvas();
      if (!cvs) return;
      const minS = 0.1;
      const maxS = 10;
      const sensitivity = 0.1;
      const [camXOld, camYOld] = camera();
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

      setCamera([camXNew, camYNew]);
      setScale(scaleNew);
    };

    const handleClick = () => {
      if (props.mode !== 'edit') return;
      if (isDraggingPoint() || isDraggingShape() || isPanning()) return;

      const index = hoveredShapeIndex();
      if (index === null) {
        setOpen(false);
        return;
      }
      setOpen(!open());
    };

    const addPoint = (shapeIdx: number) => {
      const newShapes = editShape().map(s => s.map(p => [...p] as Point));
      const targetShape = newShapes[shapeIdx];
      if (!targetShape || targetShape.length < 2) return;

      const p1 = targetShape[targetShape.length - 2];
      const p2 = targetShape[targetShape.length - 1];
      const midPoint: Point = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
      targetShape.splice(targetShape.length - 1, 0, midPoint);

      setEditShape(newShapes);
      props.onShapeChange?.(newShapes);
    };

    const removePoint = (shapeIdx: number) => {
      const newShapes = editShape().map(s => s.map(p => [...p] as Point));
      const targetShape = newShapes[shapeIdx];
      if (!targetShape || targetShape.length <= 3) return;

      targetShape.pop();

      setEditShape(newShapes);
      props.onShapeChange?.(newShapes);
    };

    createEffect(() => {
      const cvs = canvas();
      if (!cvs) return;
      const ctx = cvs.getContext('2d');
      if (!ctx) return;

      if (cvs.width !== cvs.clientWidth || cvs.height !== cvs.clientHeight) {
        cvs.width = cvs.clientWidth;
        cvs.height = cvs.clientHeight;
      }
      if (cvs.width === 0 || cvs.height === 0) return;

      const currentCameraVal = camera();
      const currentScaleVal = scale();
      const shapesToDraw = currentShapeArray();
      const currentHoveredShapeIdx = hoveredShapeIndex();

      ctx.clearRect(0, 0, cvs.width, cvs.height);

      ctx.save();
      ctx.scale(currentScaleVal, currentScaleVal);
      ctx.translate(-currentCameraVal[0], -currentCameraVal[1]);

      shapesToDraw.forEach((singleShape, shapeIndex) => {
        if (!singleShape || singleShape.length === 0) return;
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';

        if (shapeIndex === currentHoveredShapeIdx && !isDraggingShape()) {
          ctx.fillStyle = 'rgba(127, 127, 127, 0.3)';
        } else {
          ctx.fillStyle = 'transparent';
        }

        singleShape.forEach((point, pointIndex) => {
          if (!point || point.length < 2) return;
          const [ptX, ptY] = point;
          if (pointIndex === 0) ctx.moveTo(ptX, ptY);
          else ctx.lineTo(ptX, ptY);
        });

        if (singleShape.length > 1) {
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else if (singleShape.length === 1 && singleShape[0]?.length >= 2) {
          const [ptX, ptY] = singleShape[0];
          ctx.beginPath();
          const dotRadius = 1 / currentScaleVal;
          ctx.arc(ptX, ptY, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      if (props.mode === 'edit') {
        let pointVisualRadius = 5;
        const getHandleWorldRadius = () => pointVisualRadius / currentScaleVal;

        const defaultPointClr = alpha(resolveVar(vars.role.primary.default), 0.6);
        const hoveredPointClr = alpha(resolveVar(vars.role.primary.default), 0.8);
        const selectedPointClr = alpha(resolveVar(vars.role.primary.default), 1);

        shapesToDraw.forEach((singleShape, shapeIdx) => {
          singleShape.forEach((point, pointIdx) => {
            const [ptX, ptY] = point;
            ctx.beginPath();

            pointVisualRadius = 5;

            if (isDraggingPoint() && draggedShapeIndex() === shapeIdx && draggedPointIndex() === pointIdx) {
              pointVisualRadius = 7;
              ctx.fillStyle = selectedPointClr;
            } else if (hoveredPointInfo()?.shapeIdx === shapeIdx && hoveredPointInfo()?.pointIdx === pointIdx) {
              pointVisualRadius = 6;
              ctx.fillStyle = hoveredPointClr;
            } else {
              ctx.fillStyle = defaultPointClr;
            }

            ctx.arc(ptX, ptY, getHandleWorldRadius(), 0, Math.PI * 2);
            ctx.fill();
          });
        });
      }
      ctx.restore();
    });

    createEffect(() => {
      setEditShape(props.shape.map((s) => s.map((p) => [...p])));
    });

    createEffect(() => {
      const cvs = canvas();
      if (!cvs) return;

      if (isPanning() || isDraggingPoint() || isDraggingShape()) return;

      if (props.mode === 'edit') {
        cvs.style.cursor = 'default';
      } else {
        cvs.style.cursor = 'grab';
      }
    });

    return (
      <div class={containerStyle}>
        <canvas
          ref={setCanvas}
          class={canvasStyle}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUpOrLeave}
          onPointerLeave={handlePointerUpOrLeave}
          onWheel={handleWheel}
          onClick={handleClick}
        />
        <div class={fabContainerStyle}>
          <Text>
            Zoom: {scale().toFixed(2)}
          </Text>
          <Button
            class={fabStyle}
            onClick={() => {
              zoom(1 / 1.1);
            }}
          >
            <Icon icon={ZoomOut}/>
          </Button>
          <Button
            class={fabStyle}
            onClick={() => {
              zoom(1.1);
            }}
          >
            <Icon icon={ZoomIn}/>
          </Button>
          <Button
            class={fabStyle}
            onClick={() => {
              setCamera([0, 0]);
              setScale(1);
            }}
          >
            <Icon icon={ScanSearch}/>
          </Button>
        </div>
        <Popover
          open={open() && props.mode === 'edit' && hoveredShapeIndex() !== null}
          element={
            <Item.Group
              w={'20rem'}
              as={Card}
              shadow={'md'}
            >
              <Item
                rightIcon={CirclePlus}
                name={'꼭지점 추가'}
                onClick={() => {
                  const index = hoveredShapeIndex();
                  if (index === null) return;
                  addPoint(index);
                }}
              />
              <Item
                disabled={currentShapeArray()[hoveredShapeIndex() ?? 0]?.length <= 3}
                rightIcon={CircleMinus}
                name={'꼭지점 삭제'}
                onClick={() => {
                  const index = hoveredShapeIndex();
                  if (index === null) return;
                  removePoint(index);
                }}
              />
            </Item.Group>
          }
          shift={false}
          autoUpdate={{
            layoutShift: true,
            animationFrame: true,
          }}
        >
          <div
            class={popupStyle}
            style={assignInlineVars({
              [x]: `${hoveredShapeBottom()?.[0] ?? 0}px`,
              [y]: `${hoveredShapeBottom()?.[1] ?? 0}px`,
            })}
          />
        </Popover>
      </div>
    );
  }
;
