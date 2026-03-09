import api from "./api";

export const getTripExpenses = (tripId) => {
  return api.get(`/driver/expenses/${tripId}`);
};