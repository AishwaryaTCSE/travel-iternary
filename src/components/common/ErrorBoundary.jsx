// src/components/common/ErrorBoundary.jsx
import React from 'react';
import { withTranslation } from 'react-i18next';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    // Safely get the t function from props with fallback to a function that returns the key
    const t = this.props.t || ((key) => {
      const translations = {
        'error.somethingWentWrong': 'Something went wrong!',
        'error.tryRefreshing': 'Please try refreshing the page or contact support if the problem persists.',
        'error.errorDetails': 'Error Details',
        'error.backToHome': 'Back to Home',
        'error.unknownError': 'An unknown error occurred'
      };
      return translations[key] || key;
    });
    
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {t('error.somethingWentWrong')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('error.tryRefreshing')}
            </p>
            {this.state.error && (
              <details className="text-left text-sm text-gray-500 border-t pt-4 mt-4">
                <summary className="cursor-pointer mb-2">
                  {t('error.errorDetails')}
                </summary>
                <div className="bg-gray-50 p-3 rounded overflow-auto max-h-40">
                  <p className="font-mono text-red-500">
                    {this.state.error.toString()}
                  </p>
                  <pre className="text-xs mt-2 text-gray-600">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {t('error.reloadPage')}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrap the component with withTranslation HOC to access the t function
export default withTranslation()(ErrorBoundary);