export const extractErrorMessage = (error) => {
  if (error.response) {
    return (
      error.response.data?.message || "Something went wrong. Please try again."
    );
  }
  if (error.request) {
    return "Unable to reach the server. Please check your connection.";
  }
  return error.message || "Unexpected error occurred.";
};
