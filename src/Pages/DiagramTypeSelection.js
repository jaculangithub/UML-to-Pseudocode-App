import React, { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import { Container, Button, Row, Col, Card, Navbar, Nav, Alert } from "react-bootstrap";
import { FaFileImport, FaFileImage, FaFileCode } from "react-icons/fa";

const DiagramSelection = () => {
  const navigate = useNavigate();
  const diagramTypes = ["class", "activity", "sequence", "state"];
  const [selectedDiagram, setSelectedDiagram] = useState(null);

  const handleSelect = (type) => {
    setSelectedDiagram(type);
  };

  const navigateToOptions = () => {
    if (selectedDiagram) {
      navigate(`/diagram-options/${selectedDiagram}`);
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
              {/* <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#import">Import</Nav.Link>
              <Nav.Link href="#">About</Nav.Link>  */}
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
              onClick={navigateToOptions}
              disabled={!selectedDiagram}
            >
              Continue with {selectedDiagram ? selectedDiagram.charAt(0).toUpperCase() + selectedDiagram.slice(1) : ""} Diagram
            </Button>
          </div>
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
                text="Import existing diagrams in PNG"
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

// New Component for Diagram Options Page
const DiagramOptions = () => {
  const navigate = useNavigate();
  const { diagramType } = useParams(); // useParams is used here
  const [selectedOption, setSelectedOption] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

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
        file.type === "image/png" 
        // || 
        // file.name.endsWith(".xmi") || 
        // file.name.endsWith(".xml")
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

  const sendFilesToBackend = async () => {
    if (uploadedFiles.length === 0) {
      console.log("No files to upload");
      return;
    }

    const formData = new FormData();
    uploadedFiles.forEach((file) => {
      formData.append("files", file);
    });
    
    // Add the diagram type to the form data
    formData.append("diagramType", diagramType);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Response from Python backend:", data);
      // Handle the response - you can navigate to results page or show success message

      const hasError = data.processed_files[0].error
      
      if(hasError){
        alert("Error uploading files. Please check diagram and try again.")
      }

      if (data.processed_files && data.processed_files.length > 0 && !hasError) {
        alert(`Successfully processed ${data.processed_files.length} file(s) for ${data.diagram_type_received} diagram`);
        
        const noErrors = data.processed_files.every(file => !file.error);
        if (noErrors) {
          console.log("Processed files", data.processed_files)
          let diagram_type = data.processed_files[0].diagram_type
          console.log("Diagram type from backend:", diagram_type)
          console.log("Structured data:", data.processed_files[0].processed_data)
          const nodesData = data.processed_files[0].processed_data.nodes;
          console.log("Nodes data:", nodesData);
          
          // add drag handle for the all the nodes
          for (let i = 0; i < nodesData.length; i++) {
            nodesData[i]["dragHandle"] = ".drag-handle__label"
            nodesData[i]["selectable"] = true
          }

          navigate(`/editor/${diagram_type}`, { 
            state: { 
              results: data.processed_files[0].processed_data, 
              nodesData: nodesData} 
            });
          // console.log("Before navigation - raw data:", data);
          // console.log("Before navigation - actors:", data.processed_files[0].processed_data.nodes[0].data);
          // console.log("Before navigation - actors type:", data.processed_files[0].processed_data.nodes[0].data.actors);
          // console.log("Before navigation - actors stringified:", JSON.stringify(data.processed_files[0].processed_data.nodes[0].data.actors));
          console.log("Navigated to editor with results");
        }
      }
      
    } catch (err) {
      console.error("Error uploading files:", err);
      alert("Error uploading files. Please try again.");
    }
  };


  const handleCreateDiagram = () => {
    navigate(`/editor/${diagramType}`);
  };

  const displayName = diagramType ? diagramType.charAt(0).toUpperCase() + diagramType.slice(1) : "";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8f9fa" }}>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#">UML-to-Pseudocode</Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="text-center" style={{ padding: "40px 0" }}>
        <h2 className="display-5 fw-bold mb-4">{displayName} Diagram</h2>
        <p className="lead mb-5">Choose how you want to work with your diagram</p>

        <Row className="justify-content-center mb-5">
          <Col md={6}>
            <Card 
              className="h-100 cursor-pointer"
              style={{ 
                border: selectedOption === 'create' ? "2px solid #0d6efd" : "1px solid #dee2e6",
                cursor: "pointer"
              }}
              onClick={() => setSelectedOption('create')}
            >
              <Card.Body className="d-flex flex-column p-4">
                <div className="display-4 mb-3">🎨</div>
                <h3 className="h4 fw-bold">Create New Diagram</h3>
                <p className="text-muted mb-4">
                  Start from scratch with our intuitive diagram editor
                </p>
                <Button 
                  variant={selectedOption === 'create' ? "primary" : "outline-primary"}
                  className="mt-auto"
                >
                  Create Diagram
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card 
              className="h-100 cursor-pointer"
              style={{ 
                border: selectedOption === 'upload' ? "2px solid #0d6efd" : "1px solid #dee2e6",
                cursor: "pointer"
              }}
              onClick={() => setSelectedOption('upload')}
            >
              <Card.Body className="d-flex flex-column p-4">
                <div className="display-4 mb-3">📁</div>
                <h3 className="h4 fw-bold">Upload Existing Files</h3>
                <p className="text-muted mb-4">
                  Import PNG files to convert to pseudocode
                </p>
                <Button 
                  variant={selectedOption === 'upload' ? "primary" : "outline-primary"}
                  className="mt-auto"
                >
                  Upload Files
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Upload Section - Only shown when upload is selected */}
        {selectedOption === 'upload' && (
          <section className="p-4 bg-white rounded-3 shadow-sm mb-4">
            <h3 className="h4 fw-bold mb-4">
              <FaFileImport className="me-2" />
              Upload Your Files
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
                <p className="text-muted mb-3">Supports: PNG</p>
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

                <div className="mt-4 text-center">
                  <Button variant="success" onClick={sendFilesToBackend}>
                    Process Files
                  </Button>
                </div> 
              </div>
            )}
          </section>
        )}

        {/* Action Buttons */}
        <div className="mt-4">
          {selectedOption === 'create' && (
            <Button variant="primary" size="lg" onClick={handleCreateDiagram}>
              Start Creating {displayName} Diagram
            </Button>
          )}
          <Button 
            variant="outline-secondary" 
            className="ms-2" 
            onClick={() => navigate("/select-diagram")}
          >
            Back to Diagram Selection
          </Button>
        </div>
      </Container>
    </div>
  );
};

// Sub-components (unchanged)
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

// Export both components
export default DiagramSelection;
export { DiagramOptions };