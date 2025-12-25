import { AlertCircle, RefreshCw, XCircle, WifiOff, ServerCrash } from 'lucide-react';
import { AxiosError } from 'axios';

interface ErrorDisplayProps {
  error: Error | AxiosError | unknown;
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
  showDetails?: boolean;
}

export const ErrorDisplay = ({
  error,
  title,
  message,
  onRetry,
  retryLabel = 'Try Again',
  className = '',
  showDetails = false,
}: ErrorDisplayProps) => {
  // Extract error information
  const getErrorInfo = () => {
    if (error instanceof AxiosError) {
      // Network error
      if (!error.response) {
        return {
          icon: WifiOff,
          title: title || 'Network Error',
          message: message || 'Unable to connect to the server. Please check your internet connection.',
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
        };
      }

      // Server error
      if (error.response.status >= 500) {
        return {
          icon: ServerCrash,
          title: title || 'Server Error',
          message: message || error.response.data?.message || 'The server encountered an error. Please try again later.',
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
        };
      }

      // Client error (4xx)
      if (error.response.status >= 400) {
        return {
          icon: XCircle,
          title: title || 'Request Error',
          message: message || error.response.data?.message || 'There was a problem with your request.',
          color: 'text-orange-600 dark:text-orange-400',
          bgColor: 'bg-orange-50 dark:bg-orange-900/20',
          borderColor: 'border-orange-200 dark:border-orange-800',
        };
      }
    }

    // Generic error
    if (error instanceof Error) {
      return {
        icon: AlertCircle,
        title: title || 'An Error Occurred',
        message: message || error.message || 'Something went wrong. Please try again.',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
      };
    }

    // Unknown error
    return {
      icon: AlertCircle,
      title: title || 'Unknown Error',
      message: message || 'An unexpected error occurred. Please try again.',
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-800',
      borderColor: 'border-gray-200 dark:border-gray-700',
    };
  };

  const errorInfo = getErrorInfo();
  const Icon = errorInfo.icon;

  return (
    <div
      className={`rounded-lg border ${errorInfo.borderColor} ${errorInfo.bgColor} p-6 ${className}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className={`h-6 w-6 ${errorInfo.color}`} />
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${errorInfo.color}`}>
            {errorInfo.title}
          </h3>
          <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            <p>{errorInfo.message}</p>
          </div>

          {showDetails && error instanceof Error && (
            <details className="mt-4">
              <summary className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                Show technical details
              </summary>
              <pre className="mt-2 text-xs text-gray-600 dark:text-gray-400 overflow-auto max-h-40 p-2 bg-gray-100 dark:bg-gray-900 rounded">
                {error.stack || error.toString()}
              </pre>
            </details>
          )}

          {onRetry && (
            <div className="mt-4">
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                {retryLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Hook for handling errors with retry
export const useErrorHandler = () => {
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
      return error.response?.data?.message || error.message || 'An error occurred';
    }
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unexpected error occurred';
  };

  const isNetworkError = (error: unknown): boolean => {
    return error instanceof AxiosError && !error.response;
  };

  const isServerError = (error: unknown): boolean => {
    return error instanceof AxiosError && error.response?.status !== undefined && error.response.status >= 500;
  };

  const isClientError = (error: unknown): boolean => {
    return error instanceof AxiosError && error.response?.status !== undefined && error.response.status >= 400 && error.response.status < 500;
  };

  return {
    getErrorMessage,
    isNetworkError,
    isServerError,
    isClientError,
  };
};

