import { onMount } from 'solid-js';
import gsap from 'gsap';

import { Text } from '@/ui/common/Text';

import { createRef } from '@/feature/hook/createRef';

import { containerStyle, groupStyle } from './page.css';

export const TutorialPage = () => {
  const [group1, refGroup1] = createRef();

  onMount(() => {
    gsap.from(group1(), {
      y: 16,
      opacity: 0,
      duration: 0.6,
    })
  });

  return (
    <div class={containerStyle}>
      <div class={groupStyle} ref={refGroup1}>
        <Text variant={'h1'}>CropTCHA</Text>
        <Text variant={'caption'}>대충 설명을 적어봅시다</Text>
      </div>
    </div>
  )
};
