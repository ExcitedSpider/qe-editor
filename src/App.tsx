import { Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { appRouter } from "./router";
import Page404 from "./pages/404";

import 'adui/es/style/base.css';

function App() {
  return (
    <Router>
      <Switch>
        {appRouter.map((routerItem) => (
          <Route
            key={routerItem.name}
            exact={routerItem.exact}
            path={routerItem.path}
          >
            {/* 暂时不考虑加载中效果 */}
            <Suspense fallback={false}>
              <routerItem.component></routerItem.component>
            </Suspense>
          </Route>
        ))}
        {/* fallback 404 page */}
        <Route component={Page404}></Route>
      </Switch>
    </Router>
  );
}

export default App;
