import { createSignal, For } from 'solid-js';
import Clock from 'lucide-solid/icons/clock';
import Volume2 from 'lucide-solid/icons/volume-2';

import { Card } from '@/ui/Card';
import { Box } from '@/ui/common/Box';
import { Icon } from '@/ui/common/Icon';
import { Text } from '@/ui/common/Text';
import { Item } from '@/ui/common/Item';
import { Tooltip } from '@/ui/common/Tooltip';
import { createClickAway, Popover } from '@/ui/common/Popover';

import { formatDate } from '@/feature/helper';
import { SoundEvent } from '@/feature/model/event';

export type EventItemProps = SoundEvent;
export const EventItem = (props: EventItemProps) => {
  const [open, setOpen] = createSignal(false);
  const track = createClickAway(() => setOpen(false));

  return (
    <Popover
      open={open()}
      element={
        <Card ref={track} shadow={'md'} p={'none'}>
          <Item.Group>
            <Box align={'center'} gap={'xs'} p={'md'}>
              <Text variant={'title'}>
                {props.data.insect}
              </Text>
              <Text variant={'caption'}>
                {formatDate(props.timestamp)}
              </Text>
              <Text variant={'caption'}>
                {`"${props.source.label}"에서 감지되었습니다`}
              </Text>
            </Box>
          </Item.Group>
          <Item.Group>
            <For each={props.data.others}>
              {(item) => (
                <Item
                  name={item.insect}
                  description={`${(item.value * 100).toFixed(2)}% 확률로 감지됨`}
                />
              )}
            </For>
          </Item.Group>
        </Card>
      }
    >
      <Item
        leftIcon={Volume2}
        name={props.data.insect}
        description={`"${props.source.label}"에서 감지되었습니다`}
        right={
          <Tooltip label={formatDate(props.timestamp)}>
            <Box p={'md'}>
              <Icon icon={Clock}/>
            </Box>
          </Tooltip>
        }
        onClick={() => setOpen(!open())}
      />
    </Popover>
  );
};
