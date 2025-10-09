import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Alert, Spinner, Row, Col } from 'react-bootstrap';
import emailService from '../services/emailService';
import { format, formatDistanceToNow } from 'date-fns';

const ScheduledEmailsList = ({ refreshTrigger }) => {
  const [scheduledEmails, setScheduledEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('checking');

  const loadScheduledEmails = async () => {
    try {
      setLoading(true);
      const emails = await emailService.getScheduledEmails();
      // Sort by scheduled time (most recent first)
      const sortedEmails = emails.sort((a, b) => 
        new Date(b.scheduledTime) - new Date(a.scheduledTime)
      );
      setScheduledEmails(sortedEmails);
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Error loading scheduled emails:', error);
      setMessage('Failed to load scheduled emails: ' + error.message);
      setConnectionStatus('disconnected');
      setScheduledEmails([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScheduledEmails();
  }, [refreshTrigger]);

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this scheduled email?')) {
      try {
        await emailService.cancelScheduledEmail(id);
        setMessage('✅ Email cancelled successfully');
        loadScheduledEmails(); // Refresh the list
      } catch (error) {
        setMessage('❌ Failed to cancel email: ' + error.message);
      }
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'SENT': return 'success';
      case 'FAILED': return 'danger';
      case 'CANCELLED': return 'secondary';
      default: return 'light';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return '⏳';
      case 'SENT': return '✅';
      case 'FAILED': return '❌';
      case 'CANCELLED': return '🚫';
      default: return '❓';
    }
  };

  const refreshList = () => {
    loadScheduledEmails();
    setMessage('🔄 Refreshing...');
  };

  if (loading && scheduledEmails.length === 0) {
    return (
      <Card className="shadow-sm border-0">
        <Card.Body className="text-center py-5">
          <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3 mb-0 text-muted">Loading scheduled emails...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-info text-white py-3">
        <Row className="align-items-center">
          <Col>
            <h5 className="mb-0">
              <i className="fas fa-list me-2"></i>
              Scheduled Emails
            </h5>
          </Col>
          <Col xs="auto">
            <div className="d-flex gap-2 align-items-center">
              <Badge bg={connectionStatus === 'connected' ? 'success' : 'danger'}>
                <i className={`fas fa-${connectionStatus === 'connected' ? 'check' : 'times'}-circle me-1`}></i>
                {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
              </Badge>
              <Button variant="light" size="sm" onClick={refreshList} disabled={loading}>
                <i className="fas fa-sync-alt"></i> Refresh
              </Button>
            </div>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body className="p-0">
        {message && (
          <Alert variant="info" className="mb-0 rounded-0" dismissible onClose={() => setMessage('')}>
            {message}
          </Alert>
        )}

        {scheduledEmails.length === 0 ? (
          <div className="text-center text-muted py-5">
            <i className="fas fa-inbox fa-3x mb-3 opacity-50"></i>
            <h5>No scheduled emails found</h5>
            <p className="mb-0">Schedule your first email using the form above!</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table striped hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Recipient</th>
                  <th>Subject</th>
                  <th>Scheduled Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {scheduledEmails.map((email) => (
                  <tr key={email.id}>
                    <td>
                      <div className="fw-semibold">{email.recipientEmail}</div>
                    </td>
                    <td>
                      <div className="text-truncate" style={{ maxWidth: '200px' }} title={email.subject}>
                        {email.subject || <em className="text-muted">(No Subject)</em>}
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="fw-semibold">
                          {format(new Date(email.scheduledTime), 'MMM d, yyyy')}
                        </div>
                        <small className="text-muted">
                          {format(new Date(email.scheduledTime), 'h:mm a')}
                        </small>
                        {email.status === 'PENDING' && (
                          <div>
                            <small className="text-warning">
                              <i className="fas fa-hourglass-half me-1"></i>
                              {formatDistanceToNow(new Date(email.scheduledTime))} from now
                            </small>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <Badge bg={getStatusVariant(email.status)} className="fs-6">
                        {getStatusIcon(email.status)} {email.status}
                      </Badge>
                      {email.sentTime && (
                        <div>
                          <small className="text-muted">
                            Sent: {format(new Date(email.sentTime), 'MMM d, h:mm a')}
                          </small>
                        </div>
                      )}
                    </td>
                    <td>
                      {email.status === 'PENDING' && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleCancel(email.id)}
                          title="Cancel this scheduled email"
                        >
                          <i className="fas fa-times"></i> Cancel
                        </Button>
                      )}
                      {email.status === 'SENT' && (
                        <Badge bg="success" className="fs-6">
                          <i className="fas fa-check"></i> Sent
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ScheduledEmailsList;