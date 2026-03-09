import { http, testUrl } from "@/utils/http";

export const getCarouselList = (params?: object) => {
  return http.request("get", `${testUrl}/api/v1/carousel/get_list`, {
    params
  });
};

export const createCarousel = (data?: object) => {
  return http.request("post", `${testUrl}/api/v1/carousel/create`, {
    data
  });
};

export const updateCarousel = (data?: object) => {
  return http.request("post", `${testUrl}/api/v1/carousel/update`, {
    data
  });
};

export const deleteCarousel = (data?: object) => {
  return http.request("post", `${testUrl}/api/v1/carousel/delete`, {
    data
  });
};
