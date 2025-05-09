import { render } from 'solid-js/web';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';

import { App } from './App';

import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';

import '@/feature/theme/layer.css';
import '@/feature/theme/reset.css';
import '@/feature/theme/global.css';

gsap.registerPlugin(Flip);

render(
  () => <App/>,
  document.querySelector('#root')!,
);
