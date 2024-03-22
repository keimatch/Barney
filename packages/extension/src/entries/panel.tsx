import React from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { route, useRouter, RouteProvider } from "../hooks/useRouter";
import { ExperienceProvider } from "../hooks/useExperience";
import theme from "../chakra/theme";

const Router = () => {
  const { currentPath } = useRouter();
  const Component = route[currentPath];

  return <Component />;
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ExperienceProvider>
        <RouteProvider>
          <Router />
        </RouteProvider>
      </ExperienceProvider>
    </ChakraProvider>
  </React.StrictMode>
);
