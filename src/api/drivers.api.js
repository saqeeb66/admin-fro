// src/api/drivers.api.js
import api from "./api";

/* GET AVAILABLE DRIVERS */
export const getAvailableDrivers = () => {
  return api.get("/admin/drivers/available");
};

/* ADD DRIVER */
export const addDriver = (driverData) => {
  return api.post("/admin/drivers/add", driverData);
};
