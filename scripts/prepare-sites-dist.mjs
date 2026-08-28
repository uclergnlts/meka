import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { buildSync } from "esbuild";

mkdirSync("dist/server/vendor", { recursive: true });
mkdirSync("dist/.openai", { recursive: true });

buildSync({
  entryPoints: ["node_modules/react/index.js"],
  bundle: true,
  format: "esm",
  platform: "neutral",
  outfile: "dist/server/vendor/react-impl.js",
});

writeFileSync(
  "dist/server/vendor/react.js",
  `import React from "./react-impl.js";
export default React;
export const {
  Activity, Children, Component, Fragment, Profiler, PureComponent, StrictMode,
  Suspense, __CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
  __COMPILER_RUNTIME, cache, cacheSignal, captureOwnerStack, cloneElement,
  createContext, createElement, createRef, forwardRef, isValidElement, lazy,
  memo, startTransition, unstable_useCacheRefresh, use, useActionState,
  useCallback, useContext, useDebugValue, useDeferredValue, useEffect,
  useEffectEvent, useId, useImperativeHandle, useInsertionEffect, useLayoutEffect,
  useMemo, useOptimistic, useReducer, useRef, useState, useSyncExternalStore,
  useTransition, version
} = React;
`,
);

buildSync({
  entryPoints: ["node_modules/react/jsx-runtime.js"],
  bundle: true,
  format: "esm",
  platform: "neutral",
  outfile: "dist/server/vendor/react-jsx-runtime-impl.js",
});

writeFileSync(
  "dist/server/vendor/react-jsx-runtime.js",
  `import runtime from "./react-jsx-runtime-impl.js";
export default runtime;
export const { Fragment, jsx, jsxs } = runtime;
`,
);

buildSync({
  entryPoints: ["node_modules/react-dom/server.edge.js"],
  bundle: true,
  format: "esm",
  platform: "neutral",
  outfile: "dist/server/vendor/react-dom-server-edge-impl.js",
});

writeFileSync(
  "dist/server/vendor/react-dom-server-edge.js",
  `import server from "./react-dom-server-edge-impl.js";
export default server;
export const { renderToReadableStream, renderToStaticMarkup, renderToString, version } = server;
`,
);

const entry = readFileSync("dist/server/entry.js", "utf8")
  .replaceAll('from"react"', 'from"./vendor/react.js"')
  .replaceAll('from"react/jsx-runtime"', 'from"./vendor/react-jsx-runtime.js"')
  .replaceAll('from"react-dom/server.edge"', 'from"./vendor/react-dom-server-edge.js"')
  .replaceAll('from"../vinext-client-assets.js"', 'from"./vinext-client-assets.js"');

copyFileSync("dist/vinext-client-assets.js", "dist/server/vinext-client-assets.js");
writeFileSync("dist/server/index.js", entry);
writeFileSync("dist/.openai/hosting.json", readFileSync(".openai/hosting.json", "utf8"));
