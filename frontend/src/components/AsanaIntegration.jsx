import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import axios from 'axios';

const AsanaIntegration = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle');

  const syncTasks = async () => {
    setLoading(true);
    setSyncStatus('syncing');
    try {
      const response = await axios.post('/api/asana/sync');
      if (response.data.success) {
        setSyncStatus('success');
        // Refresh tasks list
        fetchTasks();
      }
    } catch (err) {
      setError(err.message);
      setSyncStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Asana Tasks</h2>
        <button
          onClick={syncTasks}
          disabled={loading}
          className={`px-4 py-2 rounded-md ${
            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {loading ? 'Syncing...' : 'Sync with Asana'}
        </button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {syncStatus === 'success' && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription>Tasks synchronized successfully!</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {tasks.map(task => (
          <div
            key={task._id}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{task.title}</h3>
                <p className="text-gray-600">{task.description}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  task.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {task.status}
              </span>
            </div>
            {task.dueDate && (
              <div className="mt-2 text-sm text-gray-500">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AsanaIntegration;