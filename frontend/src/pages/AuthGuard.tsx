// import { createEffect } from 'solid-js';
// import { Navigate, useLocation } from '@solidjs/router';

import type { RouteSectionProps } from '@solidjs/router';

// const allowedPaths = ['/'];
export type AuthGuardProps = RouteSectionProps;
export const AuthGuard = (props: AuthGuardProps) => {
  // const location = useLocation();

  // createEffect(() => {
  //   if (!auth.isLoggedIn && !allowedPaths.includes(location.pathname)) {
  //     return <Navigate href={'/path'} state={{ from: location.pathname }}/>;
  //   }
  // });

  return props.children;
};