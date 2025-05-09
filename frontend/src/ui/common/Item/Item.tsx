import { Show, splitProps, ValidComponent } from 'solid-js';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { JSX } from 'solid-js/jsx-runtime';

import { ItemGroup } from './ItemGroup';

import { Tooltip } from '../Tooltip';
import { Box, BoxProps } from '../Box';
import { Icon, IconType } from '../Icon';

import { ColorMapKey, colors, RoleMapKey, roles } from '@/feature/theme';

import {
  clickableContainerStyle,
  containerStyle,
  disabledStyle,
  hoverBackgroundStyle,
  iconStyle,
  textGroupStyle,
  textStyle,
  wrapperStyle,
} from './Item.css';

export type ItemProps<T extends ValidComponent> = BoxProps<T> & {
  name?: string;
  description?: string;

  leftIcon?: IconType;
  rightIcon?: IconType;
  left?: JSX.Element;
  right?: JSX.Element;

  disabled?: boolean;
  clickable?: boolean | ColorMapKey | RoleMapKey;
  tooltip?: string;
};
export const Item = <T extends ValidComponent = 'li'>(props: ItemProps<T>) => {
  const [
    textProps,
    itemProps,
    localProps,
    rest,
  ] = splitProps(
    props,
    ['name', 'description', 'tooltip'],
    ['leftIcon', 'rightIcon', 'left', 'right'],
    ['clickable'],
  );

  const hoverBackgroundColor = () => {
    if (typeof localProps.clickable !== 'string') return null;

    return colors[localProps.clickable as keyof typeof colors] ?? roles[localProps.clickable as keyof typeof roles];
  };

  return (
    <Tooltip
      enabled={typeof textProps.tooltip === 'string'}
      label={textProps.tooltip}
    >
      <Box
        {...rest}
        as={rest.as ?? 'li'}
        classList={{
          ...rest.classList,
          [rest.class]: !!rest.class,
          [containerStyle]: true,
          [clickableContainerStyle]: localProps.clickable ?? rest.onClick,
          [disabledStyle]: rest.disabled,
        }}
        style={assignInlineVars({
          [hoverBackgroundStyle]: hoverBackgroundColor(),
        })}
      >
        <div class={wrapperStyle}>
          <Show when={itemProps.left}>
            {itemProps.left}
          </Show>
          <Show when={itemProps.leftIcon}>
            {(icon) => (
              <Icon
                icon={icon()}
                c={'text.default'}
                classList={{
                  [iconStyle]: true,
                  [disabledStyle]: rest.disabled,
                }}
              />
            )}
          </Show>
          <div class={textGroupStyle}>
            <Show when={textProps.name}>
              <div
                classList={{
                  [textStyle.default]: true,
                  [disabledStyle]: rest.disabled,
                }}
              >
                {textProps.name}
              </div>
            </Show>
            <Show when={textProps.description}>
              <div
                classList={{
                  [textStyle.caption]: true,
                  [disabledStyle]: rest.disabled,
                }}
              >
                {textProps.description}
              </div>
            </Show>
          </div>
          <Show when={itemProps.rightIcon}>
            {(icon) => (
              <Icon
                icon={icon()}
                c={'text.default'}
                classList={{
                  [iconStyle]: true,
                  [disabledStyle]: rest.disabled,
                }}
              />
            )}
          </Show>
          <Show when={itemProps.right}>
            {itemProps.right}
          </Show>
        </div>
      </Box>
    </Tooltip>
  );
};
Item.Group = ItemGroup;
