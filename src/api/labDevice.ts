import { http, testUrl } from "@/utils/http";

/** 获取仪器列表 */
export const getDeviceList = (data?: object) => {
  return http.request("get", `${testUrl}/api/v1/device/get_device_list`, {
    params: data
  });
};
/** 获取仪器详情 */
export const getDeviceDetail = (params?: object) => {
  return http.request("get", `${testUrl}/api/v1/device/get_device_detail`, {
    params
  });
};
/** 创建仪器 */
export const createDevice = (data?: object) => {
  return http.request("post", `${testUrl}/api/v1/device/create_device`, {
    data
  });
};
/** 更新仪器 */
export const updateDevice = (data?: object) => {
  return http.request("post", `${testUrl}/api/v1/device/update_device`, {
    data
  });
};

/** 删除仪器 */
export const deleteDevice = (data?: object) => {
  return http.request("post", `${testUrl}/api/v1/device/delete_device`, {
    data
  });
};

/** 课题组 */
export const get_group_list = (data?: object) => {
  return http.request("get", `${testUrl}/api/v1/project_group/get_group_list`, {
    params: data
  });
};
/** 创建课题组 */
export const create_group = (data?: object) => {
  return http.request("post", `${testUrl}/api/v1/project_group/create_group`, {
    data
  });
};
/** 设置课题组额度 */
export const update_group_quota = (data?: object) => {
  return http.request(
    "post",
    `${testUrl}/api/v1/project_group/update_group_quota`,
    {
      data
    }
  );
};
/** 统一充值接口 */
export const recharge = (data?: object) => {
  return http.request("post", `${testUrl}/api/v1/recharge/recharge`, {
    data
  });
};

/** 获取课题组详情 */
export const get_group_detail = (params?: object) => {
  return http.request(
    "get",
    `${testUrl}/api/v1/project_group/get_group_detail`,
    {
      params
    }
  );
};

/** 添加课题组成员 */
export const add_group_members = (data?: object) => {
  return http.request(
    "post",
    `${testUrl}/api/v1/project_group/add_group_members`,
    {
      data
    }
  );
};

/** 移除课题组成员 */
export const remove_group_member = (data?: object) => {
  return http.request(
    "post",
    `${testUrl}/api/v1/project_group/remove_group_member`,
    {
      data
    }
  );
};

/** 获取楼层列表 */
export const getFloorList = (params?: object) => {
  return http.request("get", `${testUrl}/api/v1/lab/get_floor_list`, {
    params
  });
};

/** 获取区域列表 */
export const getAreaList = (params?: object) => {
  return http.request("get", `${testUrl}/api/v1/lab/get_area_list`, {
    params
  });
};

/** 获取仪器占用情况 */
export const get_device_schedule = (params?: object) => {
  return http.request(
    "get",
    `${testUrl}/api/v1/reservation/get_device_schedule`,
    {
      params
    }
  );
};
/** 支付记录 */
export const get_recharge_records = (params?: object) => {
  return http.request(
    "get",
    `${testUrl}/api/v1/recharge/get_recharge_records`,
    {
      params
    }
  );
};
/** 预约记录 */
export const get_order_list = (params?: object) => {
  return http.request("get", `${testUrl}/api/v1/reservation/get_order_list`, {
    params
  });
};
/** 取消预约 */
export const cancel_order = (params?: object) => {
  return http.request("get", `${testUrl}/api/v1/reservation/cancel_order`, {
    params
  });
};
