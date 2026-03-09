import api from "./api";

/* GET ALL TRIPS */
export const getAllTrips = () => {
  return api.get("/admin/trips");
};

/* ASSIGN DRIVER TO TRIP */
export const assignDriverToTrip = (tripId, driverId) => {
  return api.post(`/admin/trips/${tripId}/assign/${driverId}`);
};

/* BOOK TRIP */
export const bookTrip = (data) => {
  return api.post("/user/trips", data);
};
