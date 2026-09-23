// API Service for Feedants Competition Full-Stack Module
const BASE_URL = 'http://localhost:5000/api';

export const competitionApi = {
  // Fetch competition details with user state
  async getFeaturedCompetition(userId) {
    const url = userId 
      ? `${BASE_URL}/competitions/featured?userId=${userId}` 
      : `${BASE_URL}/competitions/featured`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch competition');
    return data.data;
  },

  // Atomic Registration
  async register(competitionId, userId, paymentMethod = 'Razorpay') {
    const res = await fetch(`${BASE_URL}/competitions/${competitionId}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, paymentMethod })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  // Submit competition entry
  async submitEntry(competitionId, payload) {
    const res = await fetch(`${BASE_URL}/competitions/${competitionId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Submission failed');
    return data;
  },

  // Admin / Reviewer helper: switch lifecycle
  async switchLifecycle(competitionId, state) {
    const res = await fetch(`${BASE_URL}/competitions/${competitionId}/switch-state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to switch state');
    return data;
  },

  // Admin / Reviewer helper: reset competition
  async resetCompetition(competitionId) {
    const res = await fetch(`${BASE_URL}/competitions/${competitionId}/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to reset competition');
    return data;
  },

  // Get demo users
  async getDemoUsers() {
    const res = await fetch(`${BASE_URL}/users`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch users');
    return data.data;
  }
};
