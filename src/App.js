import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import UMLEditorField from "./Pages/UMLEditorField";
import DiagramSelection from "./Pages/DiagramTypeSelection";
import { DiagramOptions } from "./Pages/DiagramTypeSelection";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [diagramType, setDiagramType] = useState(null);

  return (
    <Router>
      <Routes>
        {/* Home Screen */}
        <Route path="/" element={<Home />} />

        {/* Diagram Selection Screen */}
        <Route
          path="/select-diagram"
          element={
            <DiagramSelection
              onSelectDiagram={(type) => {
                setDiagramType(type);
              }}
            />
          }
        />

        {/* Diagram Options Screen */}
        <Route 
          path="/diagram-options/:diagramType" 
          element={<DiagramOptions />} 
        />

        {/* Editor Screen */}
        <Route
          path="/editor/:type"
          element={<UMLEditorField />}
        />
      </Routes>
    </Router>
  );
};

export default App;