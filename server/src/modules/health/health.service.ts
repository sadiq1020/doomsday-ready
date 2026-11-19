// Service returning server health status and uptime
export const getHealthStatus = () => {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: "doomsday-ready-server",
  };
};

