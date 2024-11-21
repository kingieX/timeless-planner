import React, { useState } from 'react';
import Cookies from 'js-cookie';

const EventReminderModal = ({ eventId, onClose }) => {
  const [message, setMessage] = useState('');
  const [medium, setMedium] = useState('sms');
  const [reminderTimes, setReminderTimes] = useState([]);
  const [reminderTime, setReminderTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const accessToken = Cookies.get('access_token');
  const API_BASE_URL = import.meta.env.VITE_BASE_URL;

  // Add reminder time to the list
  const addReminderTime = () => {
    if (reminderTime) {
      setReminderTimes([
        ...reminderTimes,
        { reminder_time: reminderTime, triggered: true },
      ]);
      setReminderTime(''); // Reset reminder time input after adding
    }
  };

  // Handle form submission
  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Prepare the request body in the required structure
    const requestBody = {
      message,
      medium,
      reminder_times: reminderTimes, // Include reminder times with 'triggered' field
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/event/${eventId}/create-event-reminder`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(requestBody), // Send as JSON
        }
      );

      if (response.ok) {
        const result = await response.json();
        setSuccess('Reminder set successfully!');
        setTimeout(() => {
          onClose(); // Close modal after success
        }, 2000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create reminder');
      }
    } catch (error) {
      console.error('Error creating reminder:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 w-full m-8 overflow-y-auto h-[90vh] max-w-xl rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Set Event Reminder</h2>

        <form onSubmit={handleSubmit}>
          {/* Message */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Message</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
              required
              disabled={isLoading}
            />
          </div>

          {/* Medium (SMS, Email, etc.) */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Medium</label>
            <select
              value={medium}
              onChange={e => setMedium(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
              disabled={isLoading}
            >
              <option value="sms">SMS</option>
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="browser">Browser</option>
              <option value="mobile_app">Mobile App</option>
            </select>
          </div>

          {/* Reminder Times */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Reminder Times</label>
            <div className="flex items-center">
              <input
                type="datetime-local"
                value={reminderTime}
                onChange={e => setReminderTime(e.target.value)}
                className="border border-gray-300 p-2 rounded w-full"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={addReminderTime}
                className="ml-2 bg-green-500 text-white font-semibold py-2 px-4 rounded"
                disabled={isLoading || !reminderTime}
              >
                Add
              </button>
            </div>
            <ul className="mt-2">
              {reminderTimes.map((time, index) => (
                <li key={index} className="text-gray-600">
                  {new Date(time.reminder_time).toLocaleString()} -{' '}
                  {time.triggered ? 'Triggered' : 'Not Triggered'}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={onClose}
              className="border mr-2 border-red-400 text-red-400 font-semibold py-2 px-4 hover:bg-red-400 hover:text-white transition duration-300"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary text-black font-semibold py-2 px-4 hover:bg-transparent hover:border hover:border-primary hover:text-primary transition duration-300"
              disabled={isLoading}
            >
              {isLoading ? 'Setting Reminder...' : 'Set Reminder'}
            </button>
          </div>

          {/* Display Success or Error Messages */}
          {error && (
            <div className="py-1 px-2 border border-gray my-4 border-l-4 border-l-red-500">
              <p className="text-red-500 text-center text-sm">{error}</p>
            </div>
          )}
          {success && <p className="text-green-500 text-center">{success}</p>}
        </form>
      </div>
    </div>
  );
};

export default EventReminderModal;
