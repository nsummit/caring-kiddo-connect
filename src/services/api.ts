import { toast } from "sonner";

const API_BASE_URL = 'http://localhost:5000/api';

// Handle common API response patterns
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Unknown error occurred" }));
    throw new Error(errorData.message || "Request failed");
  }
  return response.json();
};

// Authentication API calls
export const authApi = {
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      
      const data = await handleResponse(response);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  },

  getCurrentUser: () => {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Helper function to include auth token in requests
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Children API calls
export const childrenApi = {
  getAllChildren: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/children`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch children");
      throw error;
    }
  },
  
  getChildById: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/children/${id}`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch child details");
      throw error;
    }
  },
  
  createChild: async (childData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/children`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(childData),
      });
      const data = await handleResponse(response);
      toast.success("Child registered successfully");
      return data;
    } catch (error: any) {
      toast.error(error.message || "Failed to register child");
      throw error;
    }
  },
  
  updateChild: async (id: string, childData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/children/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(childData),
      });
      const data = await handleResponse(response);
      toast.success("Child information updated");
      return data;
    } catch (error: any) {
      toast.error(error.message || "Failed to update child information");
      throw error;
    }
  },
  
  deleteChild: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/children/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      await handleResponse(response);
      toast.success("Child record deleted");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete child record");
      throw error;
    }
  }
};

// Attendance API calls
export const attendanceApi = {
  getAttendanceByDate: async (date: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/date/${date}`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch attendance records");
      throw error;
    }
  },
  
  getAttendanceByMonth: async (year: number, month: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/month/${year}/${month}`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch monthly attendance");
      throw error;
    }
  },
  
  getAttendanceByChild: async (childId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/child/${childId}`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch child's attendance");
      throw error;
    }
  },
  
  markAttendance: async (attendanceData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(attendanceData),
      });
      const data = await handleResponse(response);
      toast.success("Attendance marked successfully");
      return data;
    } catch (error: any) {
      toast.error(error.message || "Failed to mark attendance");
      throw error;
    }
  },
  
  updateAttendance: async (id: string, attendanceData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(attendanceData),
      });
      const data = await handleResponse(response);
      toast.success("Attendance updated successfully");
      return data;
    } catch (error: any) {
      toast.error(error.message || "Failed to update attendance");
      throw error;
    }
  }
};

// Progress & Observations API calls
export const progressApi = {
  getAllObservations: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/progress/observations`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch observations");
      throw error;
    }
  },
  
  getObservationsByChild: async (childId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/progress/observations/child/${childId}`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch child's observations");
      throw error;
    }
  },
  
  createObservation: async (observationData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/progress/observations`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(observationData),
      });
      const data = await handleResponse(response);
      toast.success("Observation recorded successfully");
      return data;
    } catch (error: any) {
      toast.error(error.message || "Failed to record observation");
      throw error;
    }
  },
  
  updateObservation: async (id: string, observationData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/progress/observations/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(observationData),
      });
      const data = await handleResponse(response);
      toast.success("Observation updated successfully");
      return data;
    } catch (error: any) {
      toast.error(error.message || "Failed to update observation");
      throw error;
    }
  },
  
  deleteObservation: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/progress/observations/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      await handleResponse(response);
      toast.success("Observation deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete observation");
      throw error;
    }
  }
};

// Communication API calls
export const communicationApi = {
  getAllMessages: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/communication/messages`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch messages");
      throw error;
    }
  },
  
  getMessagesByUser: async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/communication/messages/user/${userId}`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch user messages");
      throw error;
    }
  },
  
  sendMessage: async (messageData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/communication/messages`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(messageData),
      });
      const data = await handleResponse(response);
      toast.success("Message sent successfully");
      return data;
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
      throw error;
    }
  },
  
  getAnnouncements: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/communication/announcements`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch announcements");
      throw error;
    }
  },
  
  sendAnnouncement: async (announcementData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/communication/announcements`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(announcementData),
      });
      const data = await handleResponse(response);
      toast.success("Announcement sent successfully");
      return data;
    } catch (error: any) {
      toast.error(error.message || "Failed to send announcement");
      throw error;
    }
  }
};
