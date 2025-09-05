import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Row, Col, Card, Navbar, Nav, Alert } from "react-bootstrap";
import { FaFileImport, FaFileImage, FaFileCode } from "react-icons/fa";

const DiagramSelection = () => {
  const navigate = useNavigate();
  const diagramTypes = ["class", "activity", "sequence", "state"];
  const [selectedDiagram, setSelectedDiagram] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleSelect = (type) => {
    setSelectedDiagram(type);
  };

  const navigateToEditor = () => {
    if (selectedDiagram) {
      navigate(`/editor/${selectedDiagram}`);
    }
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter(file => 
        file.type === "image/png" || 
        file.name.endsWith(".xmi") || 
        file.name.endsWith(".xml")
      );
      setUploadedFiles(files);
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files).filter(file => 
        file.type === "image/png" || 
        file.name.endsWith(".xmi") || 
        file.name.endsWith(".xml")
      );
      setUploadedFiles(files);
    }
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 🔹 Send files to Python backend
  const sendFilesToBackend = async () => {
    if (uploadedFiles.length === 0) {
      console.log("No files to upload");
      return;
    }

    const formData = new FormData();
    uploadedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Response from Python backend:", data); // 👈 Print result in console
    } catch (err) {
      console.error("Error uploading files:", err);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8f9fa" }}>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#">UML-to-Pseudocode</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#import">Import</Nav.Link>
              <Nav.Link href="#">About</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="text-center" style={{ padding: "40px 0" }}>
        {/* Diagram Selection Section */}
        <section id="diagrams" className="mb-5">
          <h2 className="display-5 fw-bold mb-4">Select UML Diagram</h2>
          <Row className="g-4 justify-content-center">
            {diagramTypes.map((type) => (
              <Col key={type} xs={12} md={6} lg={3}>
                <DiagramCard 
                  type={type} 
                  isSelected={selectedDiagram === type}
                  onClick={() => handleSelect(type)}
                />
              </Col>
            ))}
          </Row>
          
          <div className="mt-4">
            <Button 
              variant="primary" 
              size="lg" 
              onClick={navigateToEditor}
              disabled={!selectedDiagram}
            >
              Create {selectedDiagram ? selectedDiagram.charAt(0).toUpperCase() + selectedDiagram.slice(1) : ""} Diagram
            </Button>
          </div>
        </section>

        {/* File Import Section */}
        <section id="import" className="mb-5 p-4 bg-white rounded-3 shadow-sm">
          <h3 className="h4 fw-bold mb-4">
            <FaFileImport className="me-2" />
            Import Existing Diagram
          </h3>
          
          <div 
            id="dropzone"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragActive ? "#0d6efd" : "#dee2e6"}`,
              borderRadius: "10px",
              padding: "40px",
              backgroundColor: dragActive ? "rgba(13, 110, 253, 0.05)" : "transparent",
              transition: "all 0.3s ease",
              cursor: "pointer"
            }}
            className="mb-4"
          >
            <div className="d-flex flex-column align-items-center">
              <FaFileImage size={48} className="text-muted mb-3" />
              <FaFileCode size={48} className="text-muted mb-3" />
              <p className="mb-2 fw-semibold">Drag & Drop your files here</p>
              <p className="text-muted mb-3">Supports: PNG, XMI, XML</p>
              <Button variant="outline-primary" onClick={() => document.getElementById('fileInput').click()}>
                Or browse files
              </Button>
              <input 
                type="file" 
                multiple 
                accept=".png,.xmi,.xml,image/png"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="fileInput"
              />
            </div>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="h5 mb-3">Selected Files:</h4>
              <div className="d-flex flex-wrap gap-2 justify-content-center">
                {uploadedFiles.map((file, index) => (
                  <Alert 
                    key={index}
                    variant="light"
                    className="d-flex align-items-center"
                    style={{ width: "fit-content" }}
                  >
                    {file.type === "image/png" ? (
                      <FaFileImage className="me-2" />
                    ) : (
                      <FaFileCode className="me-2" />
                    )}
                    {file.name}
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="ms-2 text-danger"
                      onClick={() => removeFile(index)}
                    >
                      ×
                    </Button>
                  </Alert>
                ))}
              </div>

              {/* Send to backend button */}
              <div className="mt-4 text-center">
                <Button variant="success" onClick={sendFilesToBackend}>
                  Send to Backend
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* Features Section */}
        <section id="features" className="p-4 bg-white rounded-3 shadow-sm">
          <h3 className="h4 fw-bold mb-4">Key Features</h3>
          <Row className="g-4">
            <Col md={4}>
              <FeatureCard 
                icon="📊"
                title="Visual UML Editing"
                text="Create beautiful UML diagrams with our intuitive editor"
              />
            </Col>
            <Col md={4}>
              <FeatureCard 
                icon="💾"
                title="File Import"
                text="Import existing diagrams in PNG, XMI, or XML formats"
              />
            </Col>
            <Col md={4}>
              <FeatureCard 
                icon="📝"
                title="Pseudocode Generation"
                text="Automatically convert diagrams to readable pseudocode"
              />
            </Col>
          </Row>
        </section>

        {/* Back to Home Button */}
        <div className="text-center mt-4">
          <Button variant="secondary" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </Container>
    </div>
  );
};

// Sub-components
const DiagramCard = ({ type, isSelected, onClick }) => {
  const displayName = type.charAt(0).toUpperCase() + type.slice(1);
  
  return (
    <Card
      onClick={() => onClick(type)}
      style={{
        border: isSelected ? "2px solid #0d6efd" : "none",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        transition: "all 0.2s ease",
        cursor: "pointer",
        height: "100%",
        backgroundColor: "white",
      }}
      className="h-100"
    >
      <Card.Body className="d-flex flex-column">
        <h3 className="h5 fw-bold mb-3">{displayName} Diagram</h3>
        <p className="text-muted mb-4">
          Create and edit {type.toLowerCase()} diagrams with ease.
        </p>
        <Button
          variant={isSelected ? "primary" : "outline-primary"}
          className="mt-auto"
          onClick={(e) => {
            e.stopPropagation();
            onClick(type);
          }}
        >
          {isSelected ? "Selected" : "Select"}
        </Button>
      </Card.Body>
    </Card>
  );
};

const FeatureCard = ({ icon, title, text }) => (
  <div className="h-100 p-3 text-center">
    <div className="display-4 mb-3">{icon}</div>
    <h4 className="h5 fw-bold">{title}</h4>
    <p className="text-muted">{text}</p>
  </div>
);

export default DiagramSelection;
