import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StudioLayout } from '../studio/StudioLayout';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Studio Asset Routes */}
        <Route path="/studio/houses" element={<StudioLayout />} />
        <Route path="/studio/walls" element={<StudioLayout />} />
        <Route path="/studio/road" element={<StudioLayout />} />
        <Route path="/studio/trees" element={<StudioLayout />} />
        <Route path="/studio/bikes" element={<StudioLayout />} />
        <Route path="/studio/rooftops" element={<StudioLayout />} />
        <Route path="/studio/props" element={<StudioLayout />} />
        <Route path="/studio/player" element={<StudioLayout />} />
        <Route path="/studio/lighting" element={<StudioLayout />} />

        {/* Studio Root Redirect */}
        <Route path="/studio" element={<Navigate to="/studio/houses" replace />} />

        {/* Default App Root */}
        <Route path="/" element={<Navigate to="/studio/houses" replace />} />

        {/* Catch-all 404 Fallback */}
        <Route path="*" element={<Navigate to="/studio/houses" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
