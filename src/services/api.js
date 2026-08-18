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
 * Delete Job Posting API
 */
export async function deleteJobPosting(jobId) {
  const res = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete job posting from backend API.');
  return true;
}

/**
 * Fetch Applications API
 */
export async function fetchApplications() {
  const res = await fetch(`${API_BASE_URL}/applications`);
  if (!res.ok) throw new Error('Failed to fetch applications from backend API.');
  return await res.json();
}

/**
 * Create Application API
 */
export async function createApplicationApi(appData) {
  const res = await fetch(`${API_BASE_URL}/applications`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(appData)
  });
  if (!res.ok) throw new Error('Failed to submit application to backend API.');
  return await res.json();
}

/**
 * Update Application Status API
 */
export async function updateApplicationStatusApi(appId, status, notes) {
  const res = await fetch(`${API_BASE_URL}/applications/${appId}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status, notes })
  });
  if (!res.ok) throw new Error('Failed to update application status in backend API.');
  return await res.json();
}

/**
 * Delete Application API
 */
export async function deleteApplicationApi(appId) {
  const res = await fetch(`${API_BASE_URL}/applications/${appId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete application from backend API.');
  return true;
}

/**
 * Python 3.12 NLP Engine Analysis API
 * Invokes Python TF-IDF Vectorization, Cosine Similarity & NER Skill Extraction
 */
export async function analyzePythonNlp(resumeText, jobDescription) {
  const res = await fetch(`${API_BASE_URL}/nlp/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeText, jobDescription })
  });
  if (!res.ok) throw new Error('Failed to execute Python NLP analysis engine.');
  return await res.json();
}

/**
 * Universal Login API
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
