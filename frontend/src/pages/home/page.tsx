import { createEffect, createSignal, For, onMount } from 'solid-js';
import Mic from 'lucide-solid/icons/mic';
import EyeOff from 'lucide-solid/icons/eye-off';
import LandPlot from 'lucide-solid/icons/land-plot';
import Grid2x2X from 'lucide-solid/icons/grid-2x2-x';
import Grid2x2Plus from 'lucide-solid/icons/grid-2x2-plus';
import ChevronRight from 'lucide-solid/icons/chevron-right';

import { Card } from '@/ui/Card';
import { Box } from '@/ui/common/Box';
import { Icon } from '@/ui/common/Icon';
import { Item } from '@/ui/common/Item';
import { Text } from '@/ui/common/Text';
import { Button } from '@/ui/common/Button';
import { Tooltip } from '@/ui/common/Tooltip';

import { stagger } from '@/feature/theme';
import { events } from '@/feature/store/event';

import { SourcePoint, Surface } from './component/Surface';
import { EventItem } from './component/EventItem';

import {
  buttonAnimation,
  containerStyle,
  deviceContainerStyle,
  deviceStyle,
  mainSectionStyle,
  mainSectionToolbarStyle,
  sideSectionStyle,
  toolbarButtonStyle,
  toolbarStyle,
} from './page.css';
import { createRef } from '@/feature/hook/createRef';
import gsap from 'gsap';
import BellPlus from 'lucide-solid/icons/bell-plus';
import { Dialog } from '@/ui/Dialog';
import { Device } from '@/feature/model/device';
import { createShapeResource, createShapeMutation } from '@/feature/api/shape';
import { createDeviceResource } from '@/feature/api/device';
import { createEventResource } from '@/feature/api/event.ts';

export const HomePage = () => {
  const [section1, setSection1] = createRef();
  const [section2, setSection2] = createRef();
  const [section3, setSection3] = createRef();

  const [mode, setMode] = createSignal<'view' | 'edit'>('view');
  const [deviceAddOpen, setDeviceAddOpen] = createSignal(false);

  const [initShape] = createShapeResource();
  const [devices] = createDeviceResource();
  const [events] = createEventResource();
  const { mutate } = createShapeMutation();
  const [shape, setShape] = createSignal<[number, number][][]>([]);
  const [source, setSource] = createSignal<SourcePoint[]>([]);

  const onAddShape = () => {
    setShape([
      ...shape(),
      [
        [50, 50],
        [50, 150],
        [150, 150],
        [150, 50],
      ],
    ]);
  };
  const onRemoveShape = () => {
    setShape(shape().slice(0, -1));
  };

  const onAddSource = (device: Device) => {
    setSource([
      ...source(),
      {
        point: [50, 50],
        source: device,
      },
    ]);
    setDeviceAddOpen(false);
  };

  onMount(() => {
    const tl = gsap.timeline();
    tl.from(section1(), {
      y: 16,
      opacity: 0,
      duration: 0.6,
      ease: 'power4.out',
    });
    tl.from(section2(), {
      y: 16,
      opacity: 0,
      duration: 0.6,
      ease: 'power4.out',
    }, '-=0.5');
    tl.from(section3(), {
      y: 16,
      opacity: 0,
      duration: 0.6,
      ease: 'power4.out',
    }, '-=0.5');
  });

  createEffect(() => {
    setShape(initShape()?.shapes ?? []);
    setSource(initShape()?.sources ?? []);
  });

  createEffect(() => {
    if (initShape.state === 'pending') return;

    mutate(shape(), source()).then(() => {
      console.log('shape updated');
    });
  });

  return (
    <div class={containerStyle}>
      <Dialog
        title={'추가할 센서를 선택하세요'}
        open={deviceAddOpen()}
        onClose={() => setDeviceAddOpen(false)}
        footer={
          <Button
            variant={'text'}
            onClick={() => setDeviceAddOpen(false)}
          >
            닫기
          </Button>
        }
      >
        <div class={deviceContainerStyle}>
          <For
            each={devices()}
            fallback={
              <Box align={'center'} gap={'xs'}>
                <Icon icon={EyeOff} size={24} c={'text.caption'}/>
                <Text variant={'caption'} ta={'center'}>
                  연결된 센서 없음
                </Text>
              </Box>
            }
          >
            {(device) => {
              const disabled = () => source().some((it) => it.source.id === device.id);

              return (
                <Tooltip label={disabled() ? `"${device.label}"(이)가 이미 추가됨` : device.label}>
                  <Box
                    disabled={disabled()}
                    as={'button'}
                    c={disabled() ? 'text.caption' : 'primary.default'}
                    bg={disabled() ? 'surface.high' : 'primary.container'}
                    class={deviceStyle}
                    onClick={() => onAddSource(device)}
                  >
                    <Icon icon={Mic}/>
                  </Box>
                </Tooltip>
              );
            }}
          </For>
        </div>
      </Dialog>
      <section ref={setSection1} class={mainSectionStyle}>
        <div class={mainSectionToolbarStyle}>
          <Tooltip label={'편집모드'}>
            <Button
              variant={'text'}
              active={mode() === 'edit'}
              onClick={() => {
                setMode(mode() === 'edit' ? 'view' : 'edit');
              }}
              gap={'xs'}
            >
              <Icon icon={LandPlot}/>
              편집모드
            </Button>
          </Tooltip>
          <Tooltip label={'공간 추가하기'}>
            <Button
              variant={'icon'}
              classList={{
                [buttonAnimation.enter]: mode() === 'edit',
                [buttonAnimation.exit]: mode() !== 'edit',
              }}
              style={stagger(0)}
              onClick={onAddShape}
            >
              <Icon icon={Grid2x2Plus}/>
            </Button>
          </Tooltip>
          <Tooltip label={'공간 삭제하기'}>
            <Button
              variant={'icon'}
              classList={{
                [buttonAnimation.enter]: mode() === 'edit',
                [buttonAnimation.exit]: mode() !== 'edit',
              }}
              style={stagger(1)}
              onClick={onRemoveShape}
            >
              <Icon icon={Grid2x2X}/>
            </Button>
          </Tooltip>
          <Tooltip label={'센서 추가하기'}>
            <Button
              variant={'icon'}
              classList={{
                [buttonAnimation.enter]: mode() === 'edit',
                [buttonAnimation.exit]: mode() !== 'edit',
              }}
              style={stagger(2)}
              onClick={() => setDeviceAddOpen(true)}
            >
              <Icon icon={BellPlus}/>
            </Button>
          </Tooltip>
        </div>
        <Surface
          mode={mode()}
          shape={shape()}
          source={source()}
          onShapeChange={setShape}
          onSourceChange={setSource}
        />
      </section>
      <section
        classList={{
          [sideSectionStyle]: true,
          // [collapsedSideSectionStyle]: collapseSide(),
        }}
      >
        <Item.Group ref={setSection2} as={Card} style={{ flex: 1 }}>
          <Box class={toolbarStyle} p={'sm'}>
            <Text variant={'caption'}>발생한 이벤트</Text>
            <Button variant={'text'} class={toolbarButtonStyle}>
              <Text variant={'caption'}>
                전체보기
              </Text>
              <Icon icon={ChevronRight} c={'text.caption'} size={12}/>
            </Button>
          </Box>
          <For each={events()}>
            {(event) => (
              <EventItem
                {...event}
              />
            )}
          </For>
        </Item.Group>
        <Card ref={setSection3}>
          <div class={toolbarStyle}>
            <Text variant={'caption'}>연결된 센서</Text>
            <Button variant={'text'} class={toolbarButtonStyle}>
              <Text variant={'caption'}>
                전체보기
              </Text>
              <Icon icon={ChevronRight} c={'text.caption'} size={12}/>
            </Button>
          </div>
          <div class={deviceContainerStyle}>
            <For
              each={devices() ?? []}
              fallback={
                <Box align={'center'} gap={'xs'}>
                  <Icon icon={EyeOff} size={24} c={'text.caption'}/>
                  <Text variant={'caption'} ta={'center'}>
                    연결된 센서 없음
                  </Text>
                </Box>
              }
            >
              {(device) => (
                <Tooltip label={device.label}>
                  <Box
                    c={'primary.default'}
                    bg={'primary.container'}
                    class={deviceStyle}
                  >
                    <Icon icon={Mic}/>
                  </Box>
                </Tooltip>
              )}
            </For>
          </div>
        </Card>
      </section>
    </div>
  );
};
