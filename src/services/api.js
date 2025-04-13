
import { toast } from "sonner";

// Base API configuration
const API_BASE_URL = 'https://api.example.com';

// Simulated auth API functions
export const authApi = {
  login: async (email, password) => {
    try {
      // In a real app, this would be a fetch call to your backend
      if (email === 'admin@example.com' && password === 'password') {
        return { success: true, user: { name: 'Admin User', email } };
      } else {
        toast.error('Invalid credentials');
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  }
};

// Simulated children API functions
export const childrenApi = {
  getChildren: async () => {
    // Simulated API response
    return [
      {
        id: 1,
        name: 'Emma Thompson',
        age: 4,
        dob: '2020-03-15',
        status: 'active',
        parent: 'Michael & Jane Thompson',
        contactNumber: '(555) 123-4567',
        allergies: ['Peanuts', 'Dairy'],
        medicalConditions: [],
        emergencyContacts: ['Sarah Jenkins (Grandmother) - (555) 987-6543']
      },
      {
        id: 2,
        name: 'Mason Davis',
        age: 3,
        dob: '2021-07-22',
        status: 'new',
        parent: 'David & Lauren Davis',
        contactNumber: '(555) 234-5678',
        allergies: [],
        medicalConditions: ['Asthma'],
        emergencyContacts: [
          'Robert Davis (Grandfather) - (555) 876-5432', 
          'Emily Clark (Aunt) - (555) 345-6789'
        ]
      },
      {
        id: 3,
        name: 'Oliver Wilson',
        age: 5,
        dob: '2019-01-10',
        status: 'leaving',
        parent: 'James Wilson',
        contactNumber: '(555) 345-6789',
        allergies: ['Eggs'],
        medicalConditions: [],
        emergencyContacts: ['Patricia Wilson (Grandmother) - (555) 432-1098']
      }
    ];
  },

  getChildDetails: async (id) => {
    // Implementation would fetch specific child details
    // For now, returning mock data for first child
    const children = await childrenApi.getChildren();
    return children.find(child => child.id === id) || null;
  }
};

// Attendance API functions
export const attendanceApi = {
  getAttendance: async () => {
    // Mock attendance data
    return {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      children: [
        {
          id: 1,
          name: 'Emma Thompson',
          attendance: [true, true, false, true, true]
        },
        {
          id: 2,
          name: 'Mason Davis',
          attendance: [true, true, true, true, false]
        },
        {
          id: 3,
          name: 'Oliver Wilson',
          attendance: [false, true, true, false, true]
        }
      ]
    };
  }
};
