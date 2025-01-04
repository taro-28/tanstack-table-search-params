import "./styles/globals.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import BasicPage from "./basic";
import CustomDefaultValuePage from "./custom-default-value";
import CustomEncoderDecoderPage from "./custom-encoder-decoder";
import CustomParamNamePage from "./custom-param-name";
import DebouncePage from "./debounce";
import Layout from "./layout";
import PushPage from "./push";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<BasicPage />} />
          <Route path="/custom-param-name" element={<CustomParamNamePage />} />
          <Route
            path="/custom-default-value"
            element={<CustomDefaultValuePage />}
          />
          <Route
            path="/custom-encoder-decoder"
            element={<CustomEncoderDecoderPage />}
          />
          <Route path="/debounce" element={<DebouncePage />} />
          <Route path="/push" element={<PushPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
