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
  CustomPathRoute,
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
    customPath,
    setCustomPath,
  ] = useState<CustomPathRoute>({
    points: [],
  });

  const [
    generatedCustomPath,
    setGeneratedCustomPath,
  ] =
    useState<CustomPathRoute | null>(
      null
    );

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

    setGeneratedCustomPath(
      null
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
        customPath.points.length <
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

        setGeneratedCustomPath({
          points: [
            ...customPath.points,
          ],
        });

        setCustomPathMessage(
          null
        );

        return;
      }

      if (preventFieldOverlap) {
        const safeFieldCount =
          findSafeFieldCount({
            points:
              customPath.points,

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

        setGeneratedCustomPath({
          points: [
            ...customPath.points,
          ],
        });

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

      setGeneratedCustomPath({
        points: [
          ...customPath.points,
        ],
      });

      const hasOverlap =
        customPathHasOverlap({
          points:
            customPath.points,

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
    route: CustomPathRoute
  ) => {
    setCustomPath(
      route
    );

    setGeneratedCustomPath(
      null
    );

    setCustomPathMessage(
      null
    );
  };

  const handleClearCustomPath =
    () => {
      setCustomPath({
        points: [],
      });

      setGeneratedCustomPath(
        null
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

    setGeneratedCustomPath(
      null
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

          customPath={
            customPath
          }

          generatedCustomPath={
            generatedCustomPath
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