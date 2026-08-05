export const extractErrorMessage = (error) => {
  if (error.response) {
    // Server responded with 4xx/5xx
    return (
      error.response.data?.message || "Something went wrong. Please try again."
    );
  }
  if (error.request) {
    // Request sent, no response received
    return "Unable to reach the server. Please check your connection.";
  }
  // Request never sent — client-side/config error
  return error.message || "Unexpected error occurred.";
};
