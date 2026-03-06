import { http, testUrl } from "@/utils/http";

export type UserResult = {
  success: boolean;
  data: {
    /** 头像 */
    avatar: string;
    /** 用户名 */
    username: string;
    /** 昵称 */
    nickname: string;
    /** 当前登录用户的角色 */
    roles: Array<string>;
    /** 按钮级别权限 */
    permissions: Array<string>;
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

export type UserInfo = {
  /** 头像 */
  avatar: string;
  /** 用户名 */
  username: string;
  /** 昵称 */
  nickname: string;
  /** 邮箱 */
  email: string;
  /** 联系电话 */
  phone: string;
  /** 简介 */
  description: string;
};

export type UserInfoResult = {
  success: boolean;
  data: UserInfo;
};

type ResultTable = {
  success: boolean;
  data?: {
    /** 列表数据 */
    list: Array<any>;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    pageSize?: number;
    /** 当前页数 */
    currentPage?: number;
  };
};

/** 登录 */
export const getLogin = (data?: object) => {
  // return http.request("post", `/login`, {
  return http.request<UserResult>("post", `${testUrl}/api/v1/user/login`, {
    data
  });
};
/** 用户列表 */
export const getUserList = (data?: object) => {
  return http.request("get", `${testUrl}/api/v1/user/get_user_list`, {
    params: data
  });
};
/** 审核用户注册 */
export const reviewUser = (data?: object) => {
  return http.request(
    "post",
    `${testUrl}/api/v1/user/review_user_registration`,
    {
      data
    }
  );
};
/** 管理员申请列表 */
export const getApplicationList = (data?: object) => {
  return http.request(
    "get",
    `${testUrl}/api/v1/admin_application/get_application_list`,
    {
      params: data
    }
  );
};

/** 管理员添加用户 */
export const adminAddUser = (data?: object) => {
  return http.request("post", `${testUrl}/api/v1/user/admin_add_user`, {
    data
  });
};

/** 更新用户信息 */
export const updateUser = (data?: object) => {
  return http.request("post", `${testUrl}/api/v1/user/update_user`, {
    data
  });
};

/** 删除用户 */
export const deleteUser = (data?: object) => {
  return http.request("post", `${testUrl}/api/v1/user/delete_user`, {
    data
  });
};
/** 审核管理员申请 */
export const reviewApplication = (data?: object) => {
  return http.request(
    "post",
    `${testUrl}/api/v1/admin_application/review_application`,
    {
      data
    }
  );
};

/** 刷新`token` */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>("post", "/refresh-token", { data });
};

/** 账户设置-个人信息 */
export const getMine = (data?: object) => {
  return http.request<UserInfoResult>("get", "/mine", { data });
};

/** 账户设置-个人安全日志 */
export const getMineLogs = (data?: object) => {
  return http.request<ResultTable>("get", "/mine-logs", { data });
};

/** 获取用户详情 */
export const getUserDetail = (data?: object) => {
  return http.request("post", `${testUrl}/api/v1/user/get_user_detail`, {
    data
  });
};
/** 获取用户详情 */
export const fileUpload = (data?: object) => {
  return http.request("post", `${testUrl}/api/v1/file/upload`, {
    data
  });
};
