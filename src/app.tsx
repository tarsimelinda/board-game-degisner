import React, { useState, useMemo } from "react";

import { createRoot } from "react-dom/client";

import { Toolbar } from "./components/Toolbar";
import { BoardCanvas } from "./components/BoardCanvas";
import { PropertiesPanel } from "./components/PropertiesPanel";

import { BoardShape } from "./models/BoardArea";

import {
  PaperSize,
  Orientation,
} from "./models/BoardProject";

import {
  calculateRecommendedMaxFields,
  findSafeFieldCount,
} from "./utils/boardGenerator";

import { BoardLayout } from "./models/BoardLayout";

import { GridPreset } from "./models/GridPreset";

import {
  PathPoint,
} from "./models/CustomPath";

import "./styles/app.css";

function App() {
  const [
    paperSize,
    setPaperSize,
  ] = useState<PaperSize>("A4");

  const [
    orientation,
    setOrientation,
  ] = useState<Orientation>("portrait");

  const [
    boardShape,
    setBoardShape,
  ] = useState<BoardShape>(
    "rectangle"
  );

  const [
    fieldCountInput,
    setFieldCountInput,
  ] = useState(50);

  const [
    generatedFieldCount,
    setGeneratedFieldCount,
  ] = useState(0);

  const [
    customPathPoints,
    setCustomPathPoints,
  ] = useState<PathPoint[]>([]);

  const [
    generatedCustomPathPoints,
    setGeneratedCustomPathPoints,
  ] = useState<PathPoint[]>([]);

  const [
    layout,
    setLayout,
  ] = useState<BoardLayout>(
    "perimeter"
  );

  const [
    gridPreset,
    setGridPreset,
  ] = useState<GridPreset>(
    "medium"
  );

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

  const [
    showFieldNumbers,
    setShowFieldNumbers,
  ] = useState(true);

  const [
    customPathFieldSizeMm,
    setCustomPathFieldSizeMm,
  ] = useState(10);

  const customPathRecommendedMax =
    useMemo(
      () =>
        calculateRecommendedMaxFields({
          points:
            customPathPoints,

          fieldSizeMm:
            customPathFieldSizeMm,

          minimumGapMm: 1,
        }),
      [
        customPathPoints,
        customPathFieldSizeMm,
      ]
    );

  const handleGenerate = () => {
    if (
      layout === "custom-path"
    ) {
      const safeFieldCount =
        findSafeFieldCount({
          points:
            customPathPoints,

          requestedFieldCount:
            fieldCountInput,

          fieldSizeMm:
            customPathFieldSizeMm,

          minimumGapMm: 1,
        });

      if (
        safeFieldCount < 2
      ) {
        return;
      }

      setGeneratedFieldCount(
        safeFieldCount
      );

      setFieldCountInput(
        safeFieldCount
      );

      setGeneratedCustomPathPoints(
        [...customPathPoints]
      );

      return;
    }

    setGeneratedFieldCount(
      fieldCountInput
    );
  };

  const handleCustomPathChange = (
    points: PathPoint[]
  ) => {
    setCustomPathPoints(
      points
    );

    setGeneratedCustomPathPoints(
      []
    );
  };

  const handleClearCustomPath =
    () => {
      setCustomPathPoints(
        []
      );

      setGeneratedCustomPathPoints(
        []
      );
    };

  return (
    <div className="app">
      <Toolbar />

      <div className="workspace">
        <BoardCanvas
          paperSize={
            paperSize
          }

          orientation={
            orientation
          }

          boardShape={
            boardShape
          }

          fieldCount={
            generatedFieldCount
          }

          layout={
            layout
          }

          gridPreset={
            gridPreset
          }

          monopolyShortSideFields={
            monopolyShortSideFields
          }

          monopolyLongSideFields={
            monopolyLongSideFields
          }

          monopolyDepthPercent={
            monopolyDepthPercent
          }

          showFieldNumbers={
            showFieldNumbers
          }

          customPathPoints={
            customPathPoints
          }

          generatedCustomPathPoints={
            generatedCustomPathPoints
          }

          customPathFieldSizeMm={
            customPathFieldSizeMm
          }

          onCustomPathChange={
            handleCustomPathChange
          }
        />

        <PropertiesPanel
          paperSize={
            paperSize
          }

          setPaperSize={
            setPaperSize
          }

          orientation={
            orientation
          }

          setOrientation={
            setOrientation
          }

          boardShape={
            boardShape
          }

          setBoardShape={
            setBoardShape
          }

          fieldCount={
            fieldCountInput
          }

          setFieldCount={
            setFieldCountInput
          }

          layout={
            layout
          }

          setLayout={
            setLayout
          }

          gridPreset={
            gridPreset
          }

          setGridPreset={
            setGridPreset
          }

          monopolyShortSideFields={
            monopolyShortSideFields
          }

          setMonopolyShortSideFields={
            setMonopolyShortSideFields
          }

          monopolyLongSideFields={
            monopolyLongSideFields
          }

          setMonopolyLongSideFields={
            setMonopolyLongSideFields
          }

          monopolyDepthPercent={
            monopolyDepthPercent
          }

          setMonopolyDepthPercent={
            setMonopolyDepthPercent
          }

          showFieldNumbers={
            showFieldNumbers
          }

          setShowFieldNumbers={
            setShowFieldNumbers
          }

          onGenerate={
            handleGenerate
          }

          onClearCustomPath={
            handleClearCustomPath
          }

          customPathFieldSizeMm={
            customPathFieldSizeMm
          }

          setCustomPathFieldSizeMm={
            setCustomPathFieldSizeMm
          }

          customPathRecommendedMax={
            customPathRecommendedMax
          }
        />
      </div>
    </div>
  );
}

const root =
  createRoot(
    document.body
  );

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);