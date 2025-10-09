import React, { useState } from 'react';
import { Form, Button, Card, Alert, Row, Col, Badge } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import emailService from '../services/emailService';
import 'react-datepicker/dist/react-datepicker.css';

const EmailScheduler = ({ onEmailScheduled, backendStatus }) => {
  const [formData, setFormData] = useState({
    recipientEmail: '',
    subject: '',
    body: ''
  });
  const [scheduledTime, setScheduledTime] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return now;
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [sendOption, setSendOption] = useState('schedule');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.recipientEmail.trim()) {
      setMessage('Recipient email is required');
      setMessageType('danger');
      return;
    }

    if (sendOption === 'schedule' && scheduledTime <= new Date()) {
      setMessage('Scheduled time must be in the future');
      setMessageType('danger');
      return;
    }

    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      let response;
      
      if (sendOption === 'immediate') {
        response = await emailService.sendEmail({
          receiversMail: formData.recipientEmail,
          subject: formData.subject || 'No Subject',
          body: formData.body || 'No content'
        });
      } else {
        response = await emailService.scheduleEmail({
          recipientEmail: formData.recipientEmail,
          subject: formData.subject || 'No Subject',
          body: formData.body || 'No content',
          scheduledTime: scheduledTime.toISOString()
        });
      }

      setMessage(`✅ ${response.message}`);
      setMessageType('success');

      // Reset form
      setFormData({
        recipientEmail: '',
        subject: '',
        body: ''
      });
      const now = new Date();
      now.setMinutes(now.getMinutes() + 30);
      setScheduledTime(now);

      if (onEmailScheduled) {
        onEmailScheduled();
      }

    } catch (error) {
      console.error('Error:', error);
      setMessage(`❌ ${error.message}`);
      setMessageType('danger');
    } finally {
      setLoading(false);
    }
  };

  const isFormDisabled = loading || backendStatus !== 'healthy';
  const isFormValid = formData.recipientEmail.trim() !== '';

  return (
    <Card className="shadow-sm border-0">
      <Card.Header className={`py-3 ${
        backendStatus === 'healthy' ? 'bg-primary' : 'bg-secondary'
      } text-white`}>
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            <i className="fas fa-clock me-2"></i>
            ChronoMail Scheduler
            {backendStatus !== 'healthy' && (
              <small className="ms-2 opacity-75">(Offline)</small>
            )}
          </h4>
          <Badge bg="light" text="dark">
            {sendOption === 'immediate' ? 'Instant Send' : 'Schedule'}
          </Badge>
        </div>
      </Card.Header>
      <Card.Body className="p-4">
        {message && (
          <Alert variant={messageType} dismissible onClose={() => setMessage('')}>
            {message}
          </Alert>
        )}

        {backendStatus !== 'healthy' && (
          <Alert variant="warning">
            <i className="fas fa-wifi-slash me-2"></i>
            <strong>Offline Mode</strong> - Cannot schedule emails until backend connection is restored.
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Send Option Toggle */}
          <Row className="mb-4">
            <Col>
              <div className="d-grid gap-2 d-md-flex">
                <Button
                  variant={sendOption === 'immediate' ? 'success' : 'outline-success'}
                  onClick={() => setSendOption('immediate')}
                  className="flex-fill"
                  disabled={isFormDisabled}
                >
                  <i className="fas fa-paper-plane me-2"></i>
                  Send Immediately
                </Button>
                <Button
                  variant={sendOption === 'schedule' ? 'warning' : 'outline-warning'}
                  onClick={() => setSendOption('schedule')}
                  className="flex-fill"
                  disabled={isFormDisabled}
                >
                  <i className="fas fa-clock me-2"></i>
                  Schedule for Later
                </Button>
              </div>
            </Col>
          </Row>

          {/* Form fields */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              <i className="fas fa-envelope me-2"></i>
              Recipient Email *
            </Form.Label>
            <Form.Control
              type="email"
              name="recipientEmail"
              value={formData.recipientEmail}
              onChange={handleChange}
              placeholder="Enter recipient email address"
              required
              disabled={isFormDisabled}
              size="lg"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              <i className="fas fa-tag me-2"></i>
              Subject
            </Form.Label>
            <Form.Control
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Enter email subject"
              disabled={isFormDisabled}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">
              <i className="fas fa-edit me-2"></i>
              Message
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              name="body"
              value={formData.body}
              onChange={handleChange}
              placeholder="Type your message here..."
              disabled={isFormDisabled}
            />
          </Form.Group>

          {sendOption === 'schedule' && (
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">
                <i className="fas fa-calendar-alt me-2"></i>
                Schedule Time *
              </Form.Label>
              <div>
                <DatePicker
                  selected={scheduledTime}
                  onChange={setScheduledTime}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  minDate={new Date()}
                  className="form-control form-control-lg"
                  disabled={isFormDisabled}
                />
              </div>
              <Form.Text className="text-muted">
                <i className="fas fa-info-circle me-1"></i>
                Selected: {format(scheduledTime, "PPPP 'at' h:mm a")}
              </Form.Text>
            </Form.Group>
          )}

          {/* Fixed Submit Button */}
          <div className="d-grid">
            <Button
              variant={sendOption === 'immediate' ? 'success' : 'primary'}
              type="submit"
              size="lg"
              disabled={isFormDisabled || !isFormValid}
              className="py-3 fw-bold"
            >
              {backendStatus !== 'healthy' ? (
                <>
                  <i className="fas fa-wifi-slash me-2"></i>
                  Backend Offline
                </>
              ) : loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  {sendOption === 'immediate' ? 'Sending...' : 'Scheduling...'}
                </>
              ) : (
                <>
                  <i className={`fas ${sendOption === 'immediate' ? 'fa-paper-plane' : 'fa-clock'} me-2`}></i>
                  {sendOption === 'immediate' ? 'Send Email Now' : 'Schedule Email'}
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EmailScheduler;