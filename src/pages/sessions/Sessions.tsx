import { useSessions, useRevokeSession, useRevokeAllOtherSessions } from '../../hooks/useAuth';
import { SkeletonList } from '../../components/Skeleton';
import { ErrorDisplay } from '../../components/ErrorDisplay';
import { Trash2, Monitor, Smartphone, Tablet, Globe, Calendar, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';

export const Sessions = () => {
  const { data, isLoading, error, refetch } = useSessions();
  const revokeSession = useRevokeSession();
  const revokeAllOthers = useRevokeAllOtherSessions();
  const queryClient = useQueryClient();

  const handleRevokeSession = async (sessionId: string) => {
    if (window.confirm('Are you sure you want to revoke this session?')) {
      await revokeSession.mutateAsync(sessionId);
    }
  };

  const handleRevokeAllOthers = async () => {
    if (window.confirm('Are you sure you want to revoke all other sessions? You will remain logged in on this device.')) {
      await revokeAllOthers.mutateAsync();
    }
  };

  const getDeviceIcon = (deviceInfo: any) => {
    if (!deviceInfo) return <Monitor className="h-5 w-5" />;
    
    const device = deviceInfo.device?.toLowerCase();
    if (device === 'mobile') return <Smartphone className="h-5 w-5" />;
    if (device === 'tablet') return <Tablet className="h-5 w-5" />;
    return <Monitor className="h-5 w-5" />;
  };

  const formatDeviceInfo = (deviceInfo: any) => {
    if (!deviceInfo) return 'Unknown device';
    
    const parts = [];
    if (deviceInfo.browser) parts.push(deviceInfo.browser);
    if (deviceInfo.os) parts.push(deviceInfo.os);
    if (deviceInfo.device) parts.push(deviceInfo.device);
    
    return parts.length > 0 ? parts.join(' on ') : 'Unknown device';
  };

  // Get current session ID from API response
  const currentSessionId = data?.currentSessionId;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Active Sessions</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your active login sessions across devices
          </p>
        </div>
        {data && data.sessions.length > 1 && (
          <button
            onClick={handleRevokeAllOthers}
            disabled={revokeAllOthers.isPending}
            className="px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            Revoke All Others
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors">
        {isLoading ? (
          <SkeletonList count={3} />
        ) : error ? (
          <div className="p-8">
            <ErrorDisplay
              error={error}
              onRetry={() => {
                queryClient.invalidateQueries({ queryKey: ['auth', 'sessions'] });
                refetch();
              }}
            />
          </div>
        ) : !data?.sessions.length ? (
          <div className="p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">No active sessions found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.sessions.map((session) => {
              const isCurrent = session.id === currentSessionId;
              const lastActivity = formatDistanceToNow(new Date(session.lastActivity), { addSuffix: true });
              const createdAt = new Date(session.createdAt).toLocaleDateString();

              return (
                <div
                  key={session.id}
                  className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    isCurrent ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">
                        {getDeviceIcon(session.deviceInfo)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {formatDeviceInfo(session.deviceInfo)}
                          </h3>
                          {isCurrent && (
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                              Current Session
                            </span>
                          )}
                          {session.rememberMe && (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                              Remember Me
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          {session.ipAddress && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{session.ipAddress}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Last active: {lastActivity}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            <span>Created: {createdAt}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {!isCurrent && (
                      <button
                        onClick={() => handleRevokeSession(session.id)}
                        disabled={revokeSession.isPending}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                        title="Revoke session"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Security Tip:</strong> If you notice any suspicious sessions, revoke them immediately. 
          Revoking a session will log out that device immediately.
        </p>
      </div>
    </div>
  );
};

