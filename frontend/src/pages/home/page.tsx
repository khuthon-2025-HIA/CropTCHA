import { createSignal, For, onMount } from 'solid-js';
import Mic from 'lucide-solid/icons/mic';
import EyeOff from 'lucide-solid/icons/eye-off';
import LandPlot from 'lucide-solid/icons/land-plot';
import Grid2x2X from 'lucide-solid/icons/grid-2x2-x';
import Maximize2 from 'lucide-solid/icons/maximize-2';
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
import { devices } from '@/feature/store/device';

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

export const HomePage = () => {
  const [section1, setSection1] = createRef();
  const [section2, setSection2] = createRef();
  const [section3, setSection3] = createRef();

  const [mode, setMode] = createSignal<'view' | 'edit'>('view');

  const [shape, setShape] = createSignal<[number, number][][]>([
    [
      [50, 50],
      [50, 150],
      [150, 150],
      [150, 50],
    ],
  ]);
  const [source, setSource] = createSignal<SourcePoint[]>([
    {
      point: [50, 50],
      source: {
        id: '1',
        type: 'mic',
        label: '마이크 1',
      },
    }
  ])

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

  const onCollapse = () => {

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

  return (
    <div class={containerStyle}>
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
          <div style={{ flex: 1 }}/>
          <Tooltip label={'크게 보기'}>
            <Button variant={'icon'} onClick={onCollapse}>
              <Icon icon={Maximize2}/>
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
          <For each={events.list}>
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
              each={devices.list}
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
