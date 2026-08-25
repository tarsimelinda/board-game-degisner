import React, { useState } from "react";
import { createRoot } from "react-dom/client";

import { Toolbar } from "./components/Toolbar";
import { BoardCanvas } from "./components/BoardCanvas";
import { PropertiesPanel } from "./components/PropertiesPanel";

import { BoardShape } from "./models/BoardArea";
import { PaperSize, Orientation } from "./models/BoardProject";

import { BoardLayout } from "./models/BoardLayout";

import { GridPreset } from "./models/GridPreset";

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

  const [gridPreset, setGridPreset] =
    useState<GridPreset>("medium");

  const [
    monopolySideFields,
    setMonopolySideFields,
  ] = useState(7);

  const [
    monopolyDepthPercent,
    setMonopolyDepthPercent,
  ] = useState(16);

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
          gridPreset={gridPreset}

          monopolySideFields={monopolySideFields}
          monopolyDepthPercent={monopolyDepthPercent}
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

          gridPreset={gridPreset}
          setGridPreset={setGridPreset}

          monopolySideFields={monopolySideFields}
          setMonopolySideFields={setMonopolySideFields}

          monopolyDepthPercent={monopolyDepthPercent}
          setMonopolyDepthPercent={setMonopolyDepthPercent}

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