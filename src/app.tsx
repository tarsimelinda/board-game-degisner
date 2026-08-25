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
    monopolyShortSideFields,
    setMonopolyShortSideFields,
  ] = useState(7);

  const [
    monopolyLongSideFields,
    setMonopolyLongSideFields,
  ] = useState(11);

  const [
    monopolyDepthPercent,
    setMonopolyDepthPercent,
  ] = useState(16);

  const [showFieldNumbers, setShowFieldNumbers] =
    useState(true);

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

          monopolyShortSideFields={monopolyShortSideFields}
          monopolyLongSideFields={monopolyLongSideFields}
          monopolyDepthPercent={monopolyDepthPercent}

          showFieldNumbers={showFieldNumbers}
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

          monopolyShortSideFields={monopolyShortSideFields}
          setMonopolyShortSideFields={setMonopolyShortSideFields}

          monopolyLongSideFields={monopolyLongSideFields}
          setMonopolyLongSideFields={setMonopolyLongSideFields}

          monopolyDepthPercent={monopolyDepthPercent}
          setMonopolyDepthPercent={setMonopolyDepthPercent}

          showFieldNumbers={showFieldNumbers}
          setShowFieldNumbers={setShowFieldNumbers}

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