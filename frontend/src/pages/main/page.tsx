import gsap from 'gsap';
import { onMount } from 'solid-js';
import { A } from '@solidjs/router';
import Mic from 'lucide-solid/icons/mic';
import LayoutDashboard from 'lucide-solid/icons/layout-dashboard';

import { Box } from '@/ui/common/Box';
import { Icon } from '@/ui/common/Icon';
import { Text } from '@/ui/common/Text';
import { Tooltip } from '@/ui/common/Tooltip';

import { createRef } from '@/feature/hook/createRef';

import { containerStyle, buttonStyle, buttonContainerStyle } from './page.css';

export const MainPage = () => {
  const [text, setText] = createRef();
  const [button1, setButton1] = createRef();
  const [button2, setButton2] = createRef();

  onMount(() => {
    const tl = gsap.timeline();
    tl.from(text(), {
      y: 16,
      opacity: 0,
      duration: 0.6,
    });
    tl.from(button1(), {
      y: 16,
      opacity: 0,
      duration: 0.6,
    }, '-=0.4');
    tl.from(button2(), {
      y: 16,
      opacity: 0,
      duration: 0.6,
    }, '-=0.4');
  });

  return (
    <div class={containerStyle}>
      <Text ref={setText} variant={'h3'}>
        어떤 페이지로 이동하시겠습니까?
      </Text>
      <div class={buttonContainerStyle}>
        <Tooltip label={'대시보드'}>
          <Box ref={setButton1} as={A} href={'/home'} class={buttonStyle}>
            <Icon icon={LayoutDashboard} size={48}/>
          </Box>
        </Tooltip>
        <Tooltip label={'가상 마이크'}>
          <Box ref={setButton2} as={A} href={'device'} class={buttonStyle}>
            <Icon icon={Mic} size={48}/>
          </Box>
        </Tooltip>
      </div>
    </div>
  );
};
