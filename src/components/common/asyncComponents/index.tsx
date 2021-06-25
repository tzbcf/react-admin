import { lazy } from 'react';

const asyncComponent = (path: string) => {
  return lazy(() => import(path));
}

export default asyncComponent;