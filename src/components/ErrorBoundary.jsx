// components/ErrorBoundary.jsx
import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export class ErrorBoundary extends React.Component {
  state = { 
    hasError: false, 
    error: null,
    errorInfo: null 
  };

  static getDerivedStateFromError(error) {
    return { 
      hasError: true, 
      error,
      errorInfo: null 
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null 
    });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mt-5 text-center">
          <h2 className="text-danger mb-4">⚠️ Application Error</h2>
          
          <div className="card border-danger mb-4">
            <div className="card-body text-start">
              <h5 className="card-title text-danger">Error Details:</h5>
              <p className="text-muted mb-1">
                {this.state.error?.message || 'Unknown error occurred'}
              </p>
              {this.state.errorInfo && (
                <details className="mt-3">
                  <summary>Stack trace</summary>
                  <pre className="text-start text-muted small p-2 bg-light">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3">
            <button 
              onClick={this.handleReset}
              className="btn btn-primary"
            >
              Reload Application
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="btn btn-outline-secondary"
            >
              Return Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

// Enhanced Router Error Boundary
export const RouterErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <div className="container mt-5 text-center">
      <h2 className="text-danger mb-4">🚧 Route Error</h2>
      
      <div className="card border-danger mb-4">
        <div className="card-body">
          <p className="text-muted">
            {error?.message || error?.statusText || 'Unknown routing error'}
          </p>
          {error?.status && (
            <p className="text-muted">Error code: {error.status}</p>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-center gap-3">
        <button 
          onClick={() => navigate(-1)}
          className="btn btn-primary"
        >
          Go Back
        </button>
        <button 
          onClick={() => navigate('/')}
          className="btn btn-outline-secondary"
        >
          Return Home
        </button>
      </div>
    </div>
  );
};