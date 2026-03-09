import api from "./api";

/* GET ALL TRIPS (ADMIN) */
export const getAllTrips = () => {
  return api.get("/admin/trips");
};

/* ASSIGN DRIVER (ADMIN) */
export const assignDriverToTrip = (tripId, driverId) => {
  return api.post(`/admin/trips/${tripId}/assign/${driverId}`);
};

/* BOOK TRIP (ROLE BASED) */
export const bookTrip = (data) => { return api.post("/user/trips", data); };
