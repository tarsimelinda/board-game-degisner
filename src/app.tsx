import React, { useState } from "react";

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
  customPathHasOverlap,
  findSafeFieldCount,
} from "./utils/customPathGenerator";

import {
  FieldShape,
} from "./models/FieldShape";

import { BoardLayout } from "./models/BoardLayout";

import { GridPreset } from "./models/GridPreset";

import {
  CustomPathDistribution,
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
    preventFieldOverlap,
    setPreventFieldOverlap,
  ] = useState(true);

  const [
    customPathMessage,
    setCustomPathMessage,
  ] = useState<string | null>(
    null
  );

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

  const [
    customPathDistribution,
    setCustomPathDistribution,
  ] =
    useState<CustomPathDistribution>(
      "spaced"
    );

  const [
    continuousPathWidthMm,
    setContinuousPathWidthMm,
  ] = useState(14);

  const [
    customPathFieldShape,
    setCustomPathFieldShape,
  ] = useState<FieldShape>(
    "circle"
  );

  const handleCustomPathDistributionChange = (
    distribution:
      CustomPathDistribution
  ) => {
    setCustomPathDistribution(
      distribution
    );

    setGeneratedCustomPathPoints(
      []
    );

    setCustomPathMessage(
      null
    );
  };

  const handleGenerate = () => {
    if (
      layout === "custom-path"
    ) {
      if (
        customPathPoints.length <
        2
      ) {
        setCustomPathMessage(
          "Draw a path first."
        );

        return;
      }

      if (
        customPathDistribution ===
        "continuous"
      ) {
        setGeneratedFieldCount(
          fieldCountInput
        );

        setGeneratedCustomPathPoints(
          [...customPathPoints]
        );

        setCustomPathMessage(
          null
        );

        return;
      }

      if (preventFieldOverlap) {
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
          setCustomPathMessage(
            "The path is too short for the selected field size."
          );

          return;
        }

        setGeneratedFieldCount(
          safeFieldCount
        );

        setGeneratedCustomPathPoints(
          [...customPathPoints]
        );

        if (
          safeFieldCount <
          fieldCountInput
        ) {
          setCustomPathMessage(
            `${safeFieldCount} fields were generated instead of ${fieldCountInput} to prevent overlap.`
          );
        }
        else {
          setCustomPathMessage(
            null
          );
        }

        return;
      }

      setGeneratedFieldCount(
        fieldCountInput
      );

      setGeneratedCustomPathPoints(
        [...customPathPoints]
      );

      const hasOverlap =
        customPathHasOverlap({
          points:
            customPathPoints,

          fieldCount:
            fieldCountInput,

          fieldSizeMm:
            customPathFieldSizeMm,

          minimumGapMm: 1,
        });

      if (hasOverlap) {
        setCustomPathMessage(
          "Warning: some fields overlap. Check the board carefully before exporting."
        );
      }
      else {
        setCustomPathMessage(
          null
        );
      }

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

    setCustomPathMessage(
      null
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

      setCustomPathMessage(
        null
      );
    };

  const handleCustomPathFieldSizeChange = (
    size: number
  ) => {
    setCustomPathFieldSizeMm(
      size
    );

    setGeneratedCustomPathPoints(
      []
    );

    setCustomPathMessage(
      null
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

          customPathDistribution={
            customPathDistribution
          }

          continuousPathWidthMm={
            continuousPathWidthMm
          }

          customPathFieldShape={
            customPathFieldShape
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
            handleCustomPathFieldSizeChange
          }

          preventFieldOverlap={
            preventFieldOverlap
          }

          setPreventFieldOverlap={
            setPreventFieldOverlap
          }

          customPathMessage={
            customPathMessage
          }

          customPathDistribution={
            customPathDistribution
          }

          setCustomPathDistribution={
            handleCustomPathDistributionChange
          }

          continuousPathWidthMm={
            continuousPathWidthMm
          }

          setContinuousPathWidthMm={
            setContinuousPathWidthMm
          }

          customPathFieldShape={
            customPathFieldShape
          }

          setCustomPathFieldShape={
            setCustomPathFieldShape
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