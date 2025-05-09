import { Route, Router } from '@solidjs/router';

import { Layout } from '@/ui/layout';

import { AuthGuard } from '@/pages/AuthGuard';
import { HomePage } from '@/pages/home';
import { TutorialPage } from '@/pages/tutorial';

import { ThemeProvider } from '@/feature/theme';

export const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Route component={AuthGuard}>
          <Route component={Layout}>
            <Route path={'/'} component={HomePage}/>
            <Route path={'/tutorial'} component={TutorialPage}/>
          </Route>
        </Route>
      </Router>
    </ThemeProvider>
  );
};
