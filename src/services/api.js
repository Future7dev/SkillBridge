const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Helper to get Auth Headers
 */
export function getAuthHeaders() {
  const token = localStorage.getItem('skillbridge_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

/**
 * Fetch Jobs API
 */
export async function fetchJobs() {
  const res = await fetch(`${API_BASE_URL}/jobs`);
  if (!res.ok) throw new Error('Failed to fetch job postings from backend API.');
  return await res.json();
}

/**
 * Create Job Posting API
 */
export async function createJobPosting(jobData) {
  const res = await fetch(`${API_BASE_URL}/jobs`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(jobData)
  });
  if (!res.ok) throw new Error('Failed to post job to backend API.');
  return await res.json();
}

/**
 * Universal Login API - STRICT VALIDATION (No Mock Login Fallback for non-existent users)
 */
export async function loginUser(email, password, role) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role })
  });

  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.message || 'User account does not exist or credentials are invalid. Please register first.');
  }

  // Store JWT Token & User Data
  if (data.token) {
    localStorage.setItem('skillbridge_token', data.token);
    localStorage.setItem('skillbridge_user', JSON.stringify(data));
  }

  return data;
}

/**
 * Student Registration API
 */
export async function registerStudent(studentData) {
  const res = await fetch(`${API_BASE_URL}/auth/register-student`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Student registration failed.');

  if (data.token) {
    localStorage.setItem('skillbridge_token', data.token);
    localStorage.setItem('skillbridge_user', JSON.stringify(data));
  }
  return data;
}

/**
 * Recruiter Registration API
 */
export async function registerRecruiter(recruiterData) {
  const res = await fetch(`${API_BASE_URL}/auth/register-recruiter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recruiterData)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Recruiter registration failed.');

  if (data.token) {
    localStorage.setItem('skillbridge_token', data.token);
    localStorage.setItem('skillbridge_user', JSON.stringify(data));
  }
  return data;
}

/**
 * Mentor Registration API
 */
export async function registerMentor(mentorData) {
  const res = await fetch(`${API_BASE_URL}/auth/register-mentor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mentorData)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Mentor registration failed.');

  if (data.token) {
    localStorage.setItem('skillbridge_token', data.token);
    localStorage.setItem('skillbridge_user', JSON.stringify(data));
  }
  return data;
}

/**
 * Logout Helper
 */
export function logoutUser() {
  localStorage.removeItem('skillbridge_token');
  localStorage.removeItem('skillbridge_user');
}
