const EmailScheduler = ({ onEmailScheduled, backendStatus }) => {
  // ... your existing state and functions ...

  const isFormDisabled = loading || backendStatus !== 'healthy';

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
        </div>
      </Card.Header>
      <Card.Body className="p-4">
        {/* Show offline message if backend is not healthy */}
        {backendStatus !== 'healthy' && (
          <Alert variant="warning">
            <i className="fas fa-wifi-slash me-2"></i>
            <strong>Offline Mode</strong> - Cannot schedule emails until backend connection is restored.
          </Alert>
        )}

        {/* Your form content here */}
		<div className="d-grid">
		  <Button
		    variant={sendOption === 'immediate' ? 'success' : 'primary'}
		    type="submit"
		    size="lg"
		    disabled={isFormDisabled || backendStatus !== 'healthy'}
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
      </Card.Body>
    </Card>
  );
};