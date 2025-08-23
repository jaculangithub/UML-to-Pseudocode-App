
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import UMLEditorField from "./Pages/UMLEditorField";
import DiagramSelection from "./Pages/DiagramTypeSelection"; // Import the DiagramSelection component
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
                setDiagramType(type); // Set the selected diagram type
              }}
            />
          }
        />

        {/* Editor Screen */}
        <Route
          path="/editor"
          element={<UMLEditorField diagramType={diagramType} />}
        />
      </Routes>
    </Router>

  );
};

export default App;

// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
