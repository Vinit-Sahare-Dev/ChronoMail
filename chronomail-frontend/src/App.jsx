import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Navbar, Alert, Button } from 'react-bootstrap';
import EmailScheduler from './components/EmailScheduler';
import ScheduledEmailsList from './components/ScheduledEmailsList';
import emailService from './services/emailService';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Fixed typo
import './styles/App.css'; // This should work now

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [connectionMessage, setConnectionMessage] = useState('');

  const checkBackendHealth = async () => {
    try {
      console.log('🔄 Checking backend health...');
      const result = await emailService.testConnection();
      
      if (result.connected) {
        setBackendStatus('healthy');
        setConnectionMessage('Backend connected successfully');
        console.log('✅ Backend is healthy');
      } else {
        setBackendStatus('unhealthy');
        setConnectionMessage(result.message);
        console.log('❌ Backend connection failed:', result.message);
      }
    } catch (error) {
      setBackendStatus('unhealthy');
      setConnectionMessage('Error checking backend connection');
      console.error('💥 Health check error:', error);
    }
  };

  useEffect(() => {
    // Check immediately on component mount
    checkBackendHealth();
    
    // Check every 10 seconds
    const interval = setInterval(checkBackendHealth, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleEmailScheduled = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleManualRetry = () => {
    setBackendStatus('checking');
    setConnectionMessage('Retrying connection...');
    checkBackendHealth();
  };

  return (
    <div className="App">
      {/* Navigation Bar */}
      <Navbar bg="dark" variant="dark" className="mb-4 shadow">
        <Container>
          <Navbar.Brand href="#" className="fw-bold">
            <i className="fas fa-clock me-2 text-warning"></i>
            ChronoMail
            <small className="ms-2 opacity-75">- Intelligent Email Scheduling</small>
          </Navbar.Brand>
          <Navbar.Text>
            <div className="d-flex align-items-center">
              <div className={`status-indicator ${backendStatus === 'healthy' ? 'healthy' : backendStatus === 'checking' ? 'checking' : 'unhealthy'} me-2`}></div>
              <span className={
                backendStatus === 'healthy' ? 'text-success' : 
                backendStatus === 'checking' ? 'text-warning' : 'text-danger'
              }>
                {backendStatus === 'healthy' ? 'Connected' : 
                 backendStatus === 'checking' ? 'Checking...' : 'Disconnected'}
              </span>
            </div>
          </Navbar.Text>
        </Container>
      </Navbar>

      <Container fluid="lg">
        {/* Connection Status Alert */}
        {backendStatus === 'unhealthy' && (
          <Alert variant="danger" className="mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <i className="fas fa-exclamation-triangle me-2"></i>
                <strong>Backend Connection Issue</strong>
                <div className="mt-1">
                  <small>{connectionMessage}</small>
                </div>
                <div className="mt-2">
                  <small className="text-muted">
                    Please ensure:
                    <ul className="mb-0 mt-1">
                      <li>Spring Boot application is running on port 8099</li>
                      <li>No other application is using port 8099</li>
                      <li>Backend started successfully without errors</li>
                    </ul>
                  </small>
                </div>
              </div>
              <Button variant="outline-danger" size="sm" onClick={handleManualRetry}>
                <i className="fas fa-sync-alt me-1"></i> Retry
              </Button>
            </div>
          </Alert>
        )}

        {backendStatus === 'checking' && (
          <Alert variant="warning" className="mb-4">
            <div className="d-flex align-items-center">
              <div className="spinner-border spinner-border-sm me-2" role="status"></div>
              <span>Checking backend connection...</span>
            </div>
          </Alert>
        )}

        <Row className="justify-content-center">
          <Col xl={10}>
            <Row className="g-4">
              {/* Email Scheduler - Left Side */}
              <Col lg={6}>
                <EmailScheduler 
                  onEmailScheduled={handleEmailScheduled}
                  backendStatus={backendStatus}
                />
              </Col>

              {/* Scheduled Emails List - Right Side */}
              <Col lg={6}>
                <ScheduledEmailsList 
                  refreshTrigger={refreshTrigger}
                  backendStatus={backendStatus}
                />
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Footer */}
        <Row className="mt-5">
          <Col className="text-center">
            <p className="text-muted">
              <small>
                <i className="fas fa-code me-1"></i>
                Built with ❤️ using Spring Boot & React | ChronoMail v1.0
                {backendStatus === 'healthy' && (
                  <span className="ms-2 text-success">
                    <i className="fas fa-check-circle me-1"></i>
                    System Online
                  </span>
                )}
              </small>
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;