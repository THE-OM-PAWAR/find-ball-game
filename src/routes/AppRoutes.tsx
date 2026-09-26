import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StudioLayout } from '../studio/StudioLayout';
import { LevelMapStudio } from '../map/LevelMapStudio';
import { ImmersiveGameView } from '../game/ImmersiveGameView';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 100% Immersive Fullscreen Game on Root / */}
        <Route path="/" element={<ImmersiveGameView />} />
        <Route path="/play" element={<ImmersiveGameView />} />
        <Route path="/game" element={<ImmersiveGameView />} />

        {/* Level Map Inspection Studio */}
        <Route path="/map" element={<LevelMapStudio />} />
        <Route path="/Map" element={<LevelMapStudio />} />

        {/* Studio Asset & Level Routes */}
        <Route path="/studio/map" element={<StudioLayout />} />
        <Route path="/studio/Map" element={<StudioLayout />} />
        <Route path="/studio/level" element={<StudioLayout />} />
        <Route path="/studio/blueprint" element={<StudioLayout />} />
        <Route path="/studio/houses" element={<StudioLayout />} />
        <Route path="/studio/dog" element={<StudioLayout />} />
        <Route path="/studio/Dog" element={<StudioLayout />} />
        <Route path="/studio/nature" element={<StudioLayout />} />
        <Route path="/studio/Nature" element={<StudioLayout />} />
        <Route path="/studio/trees" element={<StudioLayout />} />
        <Route path="/studio/walls" element={<StudioLayout />} />
        <Route path="/studio/road" element={<StudioLayout />} />
        <Route path="/studio/bikes" element={<StudioLayout />} />
        <Route path="/studio/rooftops" element={<StudioLayout />} />
        <Route path="/studio/props" element={<StudioLayout />} />
        <Route path="/studio/player" element={<StudioLayout />} />
        <Route path="/studio/lighting" element={<StudioLayout />} />

        {/* Studio Root Redirect */}
        <Route path="/studio" element={<Navigate to="/studio/map" replace />} />

        {/* Catch-all 404 Fallback to Game */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

