export async function fetchWrapper(url: string, options: RequestInit = {}) {
  const res = await fetch(url, options);

  // Naively assume the user is not logged in if the server returns a 401 status code
  if (res.status === 401) {
    window.location.href = "/login";
    return res;
  }

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  return res;
}
