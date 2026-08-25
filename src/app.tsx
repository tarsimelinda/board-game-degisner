import React, { useState } from "react";
import { createRoot } from "react-dom/client";

import { Toolbar } from "./components/Toolbar";
import { BoardCanvas } from "./components/BoardCanvas";
import { PropertiesPanel } from "./components/PropertiesPanel";

import { BoardShape } from "./models/BoardArea";
import { PaperSize, Orientation } from "./models/BoardProject";

import { BoardLayout } from "./models/BoardLayout";

import "./styles/app.css";

function App() {
  const [paperSize, setPaperSize] = useState<PaperSize>("A4");
  const [orientation, setOrientation] =
    useState<Orientation>("portrait");

  const [boardShape, setBoardShape] =
    useState<BoardShape>("rectangle");

  const [fieldCountInput, setFieldCountInput] = useState(50);
  const [generatedFieldCount, setGeneratedFieldCount] = useState(0);

  const [layout, setLayout] =
    useState<BoardLayout>("perimeter");

  return (
    <div className="app">
      <Toolbar />

      <div className="workspace">
        <BoardCanvas
          paperSize={paperSize}
          orientation={orientation}
          boardShape={boardShape}
          fieldCount={generatedFieldCount}
          layout={layout}
        />

        <PropertiesPanel
          paperSize={paperSize}
          setPaperSize={setPaperSize}

          orientation={orientation}
          setOrientation={setOrientation}

          boardShape={boardShape}
          setBoardShape={setBoardShape}

          fieldCount={fieldCountInput}
          setFieldCount={setFieldCountInput}

          layout={layout}
          setLayout={setLayout}

          onGenerate={() =>
            setGeneratedFieldCount(fieldCountInput)
          }
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