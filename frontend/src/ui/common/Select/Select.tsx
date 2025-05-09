import { createEffect, createSignal, For, JSX, Show, splitProps, ValidComponent } from 'solid-js';
import ChevronsUpDown from 'lucide-solid/icons/chevrons-up-down';
import Check from 'lucide-solid/icons/check';
import Lock from 'lucide-solid/icons/lock';

import { Item } from '../Item';
import { Button } from '../Button';
import { Box, BoxOnlyProps } from '../Box';
import { Icon, IconType } from '../Icon';
import { createClickAway, Popover } from '../Popover';

import { buttonStyle, inputStyle, textStyle } from './Select.css';
import { PolymorphicProps } from '@/ui/common/Polymorphic';

const DEFAULT_GROUP = '__default__';

export type SelectItemProps = {
  group?: string;
  label: string;
  value: string;
  icon?: IconType;
  disabled?: boolean;
}
type SelectTypeResolver<R extends boolean = true> = R extends true ? string : (string | null);
type SingleSelectProps<R extends boolean> = {
  type?: 'default';
  required?: R;
  value?: SelectTypeResolver<R>;
  onChange?: (value: SelectTypeResolver<R>) => void;

  children?: (value: SelectTypeResolver<R>) => JSX.Element;
};
type MultiSelectProps = {
  type: 'multiple';
  required?: boolean;
  value: string[];
  onChange?: (value: string[]) => void;

  children?: (value: string[]) => JSX.Element;
}

type SelectOnlyProps<R extends boolean = false> = {
  data: SelectItemProps[];
  placeholder?: JSX.Element;
} & (SingleSelectProps<R> | MultiSelectProps);
export type SelectProps<
  T extends ValidComponent,
  R extends boolean
> = BoxOnlyProps & SelectOnlyProps<R> & Omit<PolymorphicProps<T>, 'as' | 'onChange'>;
export const Select = <
  T extends ValidComponent = 'input',
  R extends boolean = false,
>(props: SelectProps<T, R>) => {
  const [local, rest] = splitProps(
    props,
    ['required', 'type', 'data', 'value', 'onChange', 'placeholder', 'children'],
  );

  const [button, setButton] = createSignal<HTMLButtonElement | null>(null);
  const [open, setOpen] = createSignal(false);
  const [element, setElement] = createSignal<HTMLElement | null>(null);
  const track = createClickAway(() => setOpen(false));

  const groupedItems = () => {
    const grouped: Record<string, SelectItemProps[]> = {};

    local.data.forEach((item: SelectItemProps) => {
      grouped[item.group ?? DEFAULT_GROUP] ??= [];
      grouped[item.group ?? DEFAULT_GROUP].push(item);
    });

    return Object.entries(grouped);
  };
  const minWidth = () => {
    const element = button();
    if (!element) return '20rem';
    const { width } = element.getBoundingClientRect();

    return `${width}px`;
  };

  const onChange = (item: SelectItemProps) => {
    if (local.type === 'multiple') {
      const newValue: string[] = [...local.value ?? []];
      if (local.value?.includes(item.value)) newValue.splice(newValue.indexOf(item.value), 1);
      else newValue.push(item.value);

      local.onChange?.(newValue);
    } else {
      if (!local.required && local.value === item.value) local.onChange?.(null);
      else local.onChange?.(item.value);
    }
  };
  const render = (value: string | string[] | null) => {
    if (!value) return null;

    if (Array.isArray(value)) {
      if (local.children) return local.children(value);

      return value.map((item) => local.data.find((i: SelectItemProps) => i.value === item)?.label).join(', ');
    }

    if (local.children) return local.children(value);

    return local.data.find((i: SelectItemProps) => i.value === value)?.label;
  };

  createEffect(() => {
    if (!open()) return;

    track(element());
  });

  return (
    <Popover
      open={open()}
      offset={4}
      size={8}
      placement={'bottom'}
      element={(
        <Box
          ref={setElement}
          bg={'surface.default'}
          bd={'md'}
          bc={'surface.highest'}
          r={'md'}
          shadow={'md'}
          style={{
            'min-width': minWidth(),
            'height': '100%',
            overflow: 'auto',
          }}
        >
          <For each={groupedItems()}>
            {([groupName, group]) => (
              <Item.Group>
                <Show when={groupName !== DEFAULT_GROUP}>
                  <Box px={'md'} py={'xs'} class={textStyle.group}>
                    {groupName}
                  </Box>
                </Show>
                <For each={group}>
                  {(item) => {
                    const isActive = () => Array.isArray(local.value)
                      ? local.value.includes(item.value)
                      : local.value === item.value;

                    return (
                      <Item
                        name={item.label}
                        leftIcon={item.icon}
                        rightIcon={item.disabled ? Lock : isActive() ? Check : undefined}
                        disabled={item.disabled}
                        onClick={() => onChange(item)}
                      />
                    );
                  }}
                </For>
              </Item.Group>
            )}
          </For>
        </Box>
      )}
    >
      <Button
        ref={setButton}
        classList={{
          [buttonStyle]: true,
          [textStyle.default]: true,
        }}
        onClick={() => setOpen(!open())}
      >
        <Show
          when={Array.isArray(local.value) ? local.value.length > 0 : !!local.value}
          fallback={
            <span class={textStyle.placeholder}>
              {local.placeholder}
            </span>
          }
        >
          {render(local.value ?? null)}
        </Show>
        <Icon icon={ChevronsUpDown}/>
        <input
          {...rest}
          required={local.required}
          value={local.value}
          aria-role={'combobox'}
          class={inputStyle}
        />
      </Button>
    </Popover>
  );
};
