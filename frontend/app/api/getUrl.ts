const BACKEND_API_URL = process.env.BACKEND_API_URL ?? 'http://localhost:8000';
const INTERNAL_BACKEND_API_URL =
  process.env.INTERNAL_BACKEND_API_URL ?? 'http://backend:8000';
const IS_DOCKER = process.env.IS_DOCKER ?? false;

// We need this because queries can be prefetched on the server as a form of SSR in Tanstack Start.
// Since I am hosting the backend on the same server as the frontend web server is running it will fail
// these server side pre-fetches unless it usese the internal docker address of the backend

function getApiUrl() {
  // Also check for if we are running through docker to not affect the local development
  if (typeof window === 'undefined' && IS_DOCKER) {
    return INTERNAL_BACKEND_API_URL;
  }
  return BACKEND_API_URL;
}

export { getApiUrl, BACKEND_API_URL };
