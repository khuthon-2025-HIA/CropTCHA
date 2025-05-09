import { createSignal, For, getOwner, onCleanup, runWithOwner } from 'solid-js';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import Mic from 'lucide-solid/icons/mic';
import CloudOff from 'lucide-solid/icons/cloud-off';

import { Box } from '@/ui/common/Box';
import { Text } from '@/ui/common/Text';
import { Button } from '@/ui/common/Button';

import {
  containerStyle,
  height,
  lineStyle,
  order,
  size,
  visualizerStyle
} from './page.css';
import { Icon } from '@/ui/common/Icon';

const SIZE = 128;
export const DevicePage = () => {
  const [volumeData, setVolumeData] = createSignal<number[]>([]);

  const startRecord = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true }).catch((err: Error) => err);
    if (stream instanceof Error) {
      console.error(stream);
      return null;
    }

    const context = new AudioContext();
    const analyser = context.createAnalyser();
    analyser.fftSize = SIZE * 2;
    const sourceNode = context.createMediaStreamSource(stream);
    sourceNode.connect(analyser, 0);
    const pcmData = new Float32Array(analyser.fftSize / 2);

    let stop = false;
    const startVisualizer = (callback: (volume: Float32Array<ArrayBuffer>) => void) => {
      const onFrame = () => {
        analyser.getFloatFrequencyData(pcmData);
        const normalized = pcmData.map((value) => Math.min(Math.max(0, 1 + (value - analyser.maxDecibels) / (analyser.maxDecibels - analyser.minDecibels)), 1));
        callback(normalized);

        if (!stop) window.requestAnimationFrame(onFrame);
      };
      onFrame();
    };

    const stopVisualizer = () => {
      stop = true;
      stream.getTracks().forEach((track) => track.stop());
      context.close();
      setVolumeData([]);
    };

    return {
      startVisualizer,
      stopVisualizer,
    };
  };

  const owner = getOwner();
  const onConnect = async () => {
    const result = await startRecord();
    if (!result) return;

    const { startVisualizer, stopVisualizer } = result;
    startVisualizer(setVolumeData);

    runWithOwner(owner, () => {
      onCleanup(() => {
        stopVisualizer();
      });
    });
  };

  return (
    <div class={containerStyle}>
      <Text variant={'title'}>
        가상 마이크 연결
      </Text>
      <Box
        direction={'row'}
        justify={'space-between'}
        align={'flex-end'}
        class={visualizerStyle}
      >
        <For
          each={volumeData()}
          fallback={
            <Text
              w={'100%'}
              variant={'caption'}
              align={'center'}
              ta={'center'}
              p={'md'}
              gap={'sm'}
            >
              <Icon icon={CloudOff} w={24} />
              기기를 연결해주세요
            </Text>
          }
        >
          {(volume, index) => (
            <div
              class={lineStyle}
              style={assignInlineVars({
                [order]: `${(index() + 1) / SIZE}`,
                [height]: `${Math.round(volume * 95) + 5}%`,
                [size]: `${SIZE}`,
              })}
            />
          )}
        </For>
      </Box>
      <Button
        onClick={onConnect}
        gap={'xs'}
      >
        <Icon icon={Mic} />
        마이크 연결
      </Button>
    </div>
  );
};
