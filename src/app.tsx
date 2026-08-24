import React, { useState } from "react";
import { createRoot } from "react-dom/client";

import { Toolbar } from "./components/Toolbar";
import { BoardCanvas } from "./components/BoardCanvas";
import { PropertiesPanel } from "./components/PropertiesPanel";

import { BoardShape } from "./models/BoardArea";
import { PaperSize, Orientation } from "./models/BoardProject";

import "./styles/app.css";

function App() {
  const [paperSize, setPaperSize] = useState<PaperSize>("A4");
  const [orientation, setOrientation] =
    useState<Orientation>("portrait");

const [boardShape, setBoardShape] =
  useState<BoardShape>("safe-page");

  return (
    <div className="app">
      <Toolbar />

      <div className="workspace">
        <BoardCanvas
          paperSize={paperSize}
          orientation={orientation}
          boardShape={boardShape}
        />

        <PropertiesPanel
          paperSize={paperSize}
          setPaperSize={setPaperSize}
          orientation={orientation}
          setOrientation={setOrientation}
          boardShape={boardShape}
          setBoardShape={setBoardShape}
        />
      </div>
    </div>
  );
}

const root = createRoot(document.body);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);