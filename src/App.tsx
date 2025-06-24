import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import MapPage from "@/pages/map";
import AnalysisPage from "@/pages/analysis";
import PredictionPage from "@/pages/prediction";

function App() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/analysis" element={<AnalysisPage />} />
      <Route path="/prediction" element={<PredictionPage />} />
    </Routes>
  );
}

export default App;

