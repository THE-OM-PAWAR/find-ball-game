import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StudioLayout } from '../studio/StudioLayout';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Studio Asset & Level Routes */}
        <Route path="/studio/level" element={<StudioLayout />} />
        <Route path="/studio/blueprint" element={<StudioLayout />} />
        <Route path="/studio/map" element={<StudioLayout />} />
        <Route path="/studio/Level" element={<StudioLayout />} />
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
        <Route path="/studio" element={<Navigate to="/studio/level" replace />} />

        {/* Default App Root */}
        <Route path="/" element={<Navigate to="/studio/level" replace />} />

        {/* Catch-all 404 Fallback */}
        <Route path="*" element={<Navigate to="/studio/level" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
