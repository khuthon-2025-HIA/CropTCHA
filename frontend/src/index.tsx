import { render } from 'solid-js/web';

import { App } from './App';

import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';

import '@/feature/theme/layer.css';
import '@/feature/theme/reset.css';
import '@/feature/theme/global.css';

render(
  () => <App/>,
  document.querySelector('#root')!,
);
