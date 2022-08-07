export const ApiRoutes = {
  CHECKOUT: {
    service: "/checkout",
    url: "",
    method: "POST",
    authenticate: false,
  },
  SERVICE: {
    service: "/service",
    url: "",
    method: "GET",
    authenticate: false,
  },
  SERVICE_DETAILS: {
    service: "/service",
    url: "/:id",
    method: "GET",
    authenticate: false,
  },
  TIER_LIST: {
    service: "/tier",
    url: "",
    method: "GET",
    authenticate: false,
  },
  TIER_DETAILS: {
    service: "/tier",
    url: "/:id",
    method: "GET",
    authenticate: false,
  },
};
