import { createSignal } from 'solid-js';
import Volume2 from 'lucide-solid/icons/volume-2';
import Maximize2 from 'lucide-solid/icons/maximize-2';
import LandPlot from 'lucide-solid/icons/land-plot';
import Grid2x2Plus from 'lucide-solid/icons/grid-2x2-plus';
import Grid2x2X from 'lucide-solid/icons/grid-2x2-x';

import { Card } from '@/ui/Card';
import { Icon } from '@/ui/common/Icon';
import { Item } from '@/ui/common/Item';
import { Text } from '@/ui/common/Text';
import { Button } from '@/ui/common/Button';
import { Tooltip } from '@/ui/common/Tooltip';

import { stagger } from '@/feature/theme';

import {
  buttonAnimation,
  containerStyle,
  mainSectionStyle,
  mainSectionToolbarStyle,
  sideSectionStyle,
} from './page.css';

export const HomePage = () => {
  const [mode, setMode] = createSignal<'view' | 'edit'>('view');

  const onCollapse = () => {

  };

  return (
    <div class={containerStyle}>
      <section class={mainSectionStyle}>
        <div class={mainSectionToolbarStyle}>
          <Tooltip label={'편집모드'}>
            <Button
              variant={'icon'}
              active={mode() === 'edit'}
              onClick={() => {
                setMode(mode() === 'edit' ? 'view' : 'edit');
              }}
            >
              <Icon icon={LandPlot}/>
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
        <Card m={'lg'}>
          test
        </Card>
      </section>
      <section
        classList={{
          [sideSectionStyle]: true,
          // [collapsedSideSectionStyle]: collapseSide(),
        }}
      >
        <Item.Group as={Card} style={{ flex: 1 }}>
          <Text variant={'caption'} p={'sm'}>
            발생한 이벤트
          </Text>
          <Item
            leftIcon={Volume2}
            name={'대충 뭔가 감지'}
            description={'센서 1에서 발생함'}
          />
          <Item
            leftIcon={Volume2}
            name={'대충 뭔가 감지'}
            description={'센서 2에서 발생함'}
          />
        </Item.Group>
      </section>
    </div>
  );
};
