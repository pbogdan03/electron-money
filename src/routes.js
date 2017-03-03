import Core from './components/Core';
import Home from './components/Home';

function errorLoading(err) {
  throw new Error(`Dynamic page loading failed: ${err.stack}`);
}

function loadRoute(cb) {
  return module => cb(null, module.default);
}

export default {
  path: '/',
  component: Core,
  indexRoute: {
    component: Home
  },
  childRoutes: [
    {
      path: '*',
      component: Home
    }
  ]
}
