import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Navbar, Nav, Row, Col, Card } from "react-bootstrap";

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/select-diagram"); // Navigate to the diagram selection page
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#">UML-to-Pseudocode</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#">Features</Nav.Link>
              <Nav.Link href="#">About</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Header */}
      <header style={{ backgroundColor: "#343a40", color: "white", padding: "60px 0", textAlign: "center" }}>
        <Container>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "20px" }}>UML-to-Pseudocode</h1>
          <p style={{ fontSize: "1.2rem", marginBottom: "30px" }}>
            Translate UML Diagrams into Pseudocode with ease. Click "Get Started" to begin.
          </p>
          <Button variant="light" size="lg" onClick={handleGetStarted}>
            Get Started
          </Button>
        </Container>
      </header>

      {/* About Section */}
      <section style={{ padding: "60px 0", backgroundColor: "#f8f9fa", textAlign: "center" }}>
        <Container>
          <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "20px" }}>About the Tool</h2>
          <p style={{ fontSize: "1.1rem", maxWidth: "800px", margin: "0 auto" }}>
            UML-to-Pseudocode helps developers quickly convert UML diagrams into structured pseudocode.
            This tool enhances productivity and makes software design seamless.
          </p>
        </Container>
      </section>

      {/* Key Features Section */}
      <section style={{ padding: "60px 0", backgroundColor: "#ffffff", textAlign: "center" }}>
        <Container>
          <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "40px" }}>Key Features</h2>
          <Row className="g-4 justify-content-center">
            <Col xs={12} md={6} lg={4}>
              <Card style={{ border: "none", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", height: "100%" }}>
                <Card.Body className="text-center">
                  <h4>⚡ Instant Conversion</h4>
                  <p>Automatically generate pseudocode from UML diagrams in seconds.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={6} lg={4}>
              <Card style={{ border: "none", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", height: "100%" }}>
                <Card.Body className="text-center">
                  <h4>🎨 Easy Drag & Drop</h4>
                  <p>Intuitive drag-and-drop functionality for seamless diagram creation.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={6} lg={4}>
              <Card style={{ border: "none", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", height: "100%" }}>
                <Card.Body className="text-center">
                  <h4>🔗 Import & Export</h4>
                  <p>Import diagrams and export pseudocode with ease.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section style={{ padding: "60px 0", backgroundColor: "#f8f9fa", textAlign: "center" }}>
        <Container>
          <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "40px" }}>What Users Say</h2>
          <Row className="g-4 justify-content-center">
            <Col xs={12} md={6} lg={4}>
              <Card style={{ border: "none", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", height: "100%" }}>
                <Card.Body className="text-center">
                  <p>"This tool saved me hours of work!"</p>
                  <strong>- John Mathew Alinsunurin</strong>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={6} lg={4}>
              <Card style={{ border: "none", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", height: "100%" }}>
                <Card.Body className="text-center">
                  <p>"A must-have for software engineers!"</p>
                  <strong>- Warly France Jaculan</strong>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={6} lg={4}>
              <Card style={{ border: "none", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", height: "100%" }}>
                <Card.Body className="text-center">
                  <p>"Super easy to use and very effective."</p>
                  <strong>- Everlyn Tisado</strong>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "#343a40", color: "white", padding: "20px 0", marginTop: "auto" }}>
        <Container className="text-center">
          <p>&copy; 2025 UML Diagram to Pseudocode. All rights reserved.</p>
          <p style={{ fontSize: "0.9rem" }}>Made with ❤️ by CSB3</p>
        </Container>
      </footer>
    </div>
  );
};

export default Home;