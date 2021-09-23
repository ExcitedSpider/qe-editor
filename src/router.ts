import { lazy } from "react";

export const appRouter = [
  {
    path: "/",
    name: "home",
    exact: true,
    component: lazy(() => import("./pages/home")),
  },
];
