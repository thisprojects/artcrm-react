const useNetworkRequest = () => {
  const requests = {
    async getItems(endpoint) {
      return await fetch(
        `http://${process.env.REACT_APP_HOSTNAME}:8080${endpoint}`
      ).then((r) => r.json());
    },

    async postItem(endpoint, formPayload) {
      return await fetch(
        `http://${process.env.REACT_APP_HOSTNAME}:8080${endpoint}`,
        {
          method: "POST",
          body: JSON.stringify(formPayload),
          headers: { "Content-Type": "application/json" },
        }
      ).then((r) => r);
    },

    async putItem(endpoint, formPayload) {
      return await fetch(
        `http://${process.env.REACT_APP_HOSTNAME}:8080${endpoint}`,
        {
          method: "PUT",
          body: JSON.stringify(formPayload),
          headers: { "Content-Type": "application/json" },
        }
      );
    },

    async deleteItem(endpoint, payload) {
      return await fetch(
        `http://${process.env.REACT_APP_HOSTNAME}:8080${endpoint}`,
        {
          method: "DELETE",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        }
      ).then((r) => r);
    },
  };

  return requests;
};

export default useNetworkRequest;
