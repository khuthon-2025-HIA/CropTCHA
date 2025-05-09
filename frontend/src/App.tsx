import { Route, Router } from '@solidjs/router';

import { Layout } from '@/ui/layout';

import { AuthGuard } from '@/pages/AuthGuard';
import { MainPage } from '@/pages/main';
import { HomePage } from '@/pages/home';
import { DevicePage } from '@/pages/device';
import { TutorialPage } from '@/pages/tutorial';

import { ThemeProvider } from '@/feature/theme';

export const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Route component={AuthGuard}>
          <Route component={Layout}>
            <Route path={'/'} component={MainPage}/>
            <Route path={'/home'} component={HomePage}/>
            <Route path={'/device'} component={DevicePage}/>
            <Route path={'/tutorial'} component={TutorialPage}/>
          </Route>
        </Route>
      </Router>
    </ThemeProvider>
  );
};
