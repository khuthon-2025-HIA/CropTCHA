import { splitProps, ValidComponent } from 'solid-js';
import Check from 'lucide-solid/icons/check';

import { Icon } from '@/ui/common/Icon';
import { Box, boxPropList, BoxProps } from '@/ui/common/Box';

import { checkStyle, containerStyle, inputStyle } from './CheckBox.css';

export type CheckBoxProps<T extends ValidComponent = 'input'> = Omit<BoxProps<T>, 'checked' | 'onChange'> & {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
};
export const CheckBox = <T extends ValidComponent = 'input'>(props: CheckBoxProps<T>) => {
  const [local, boxProps, inputProps] = splitProps(
    props,
    ['checked', 'onChange'],
    boxPropList,
  );

  return (
    <Box
      {...boxProps}
      as={'label'}
      direction={boxProps.direction ?? 'row'}
      classList={{
        [containerStyle.on]: local.checked,
        [containerStyle.off]: !local.checked,
        ...props.classList,
      }}
    >
      <input
        {...inputProps}
        type={'checkbox'}
        checked={local.checked}
        onChange={(e) => {
          if (local.onChange) {
            local.onChange(e.currentTarget.checked);
          }
        }}
        class={inputStyle}
      />
      <Icon
        icon={Check}
        classList={{
          [checkStyle.on]: local.checked,
          [checkStyle.off]: !local.checked,
        }}
      />
      {props.children}
    </Box>
  )
};
