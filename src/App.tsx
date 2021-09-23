import { Suspense } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { appRouter } from "./router";
import Page404 from "./pages/404";

const P = styled.p`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

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
            <Suspense fallback={false}>
              <routerItem.component></routerItem.component>
            </Suspense>
          </Route>
        ))}
        <Route>
          <Page404></Page404>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
