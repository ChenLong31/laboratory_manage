<template>
  <div class="form-container">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="120px"
      class="form-content"
    >
      <el-card class="box-card" shadow="hover">
        <template #header>
          <span class="card-title">用户信息</span>
        </template>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="账号" prop="account">
              <el-input
                v-model="formData.account"
                :disabled="isEdit || formDisabled"
                placeholder="请输入账号"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="!isEdit && !formDisabled" :span="12">
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="formData.password"
                type="password"
                placeholder="请输入密码"
                show-password
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="真实姓名" prop="real_name">
              <el-input
                v-model="formData.real_name"
                :disabled="formDisabled"
                placeholder="请输入真实姓名"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="mobile">
              <el-input
                v-model="formData.mobile"
                :disabled="formDisabled"
                placeholder="请输入手机号"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户类型" prop="user_type">
              <el-select
                v-model="formData.user_type"
                :disabled="formDisabled"
                placeholder="请选择用户类型"
                style="width: 100%"
              >
                <el-option label="内部用户" value="INTERNAL" />
                <el-option label="外部用户" value="EXTERNAL" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="formData.email"
                :disabled="formDisabled"
                placeholder="请输入邮箱"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学号" prop="student_no">
              <el-input
                v-model="formData.student_no"
                :disabled="formDisabled"
                placeholder="请输入学号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课题组" prop="research_group">
              <el-select
                v-model="formData.research_group"
                :disabled="formDisabled"
                placeholder="请选择课题组"
                style="width: 100%"
                filterable
                clearable
              >
                <el-option
                  v-for="item in groupOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="导师姓名" prop="teacher_name">
              <el-input
                v-model="formData.teacher_name"
                :disabled="formDisabled"
                placeholder="请输入导师姓名"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="导师联系方式" prop="teacher_contact">
              <el-input
                v-model="formData.teacher_contact"
                :disabled="formDisabled"
                placeholder="请输入导师联系方式"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="角色" prop="role">
              <el-select
                v-model="formData.role"
                :disabled="formDisabled"
                placeholder="请选择角色"
                style="width: 100%"
              >
                <el-option label="管理员" value="ADMIN" />
                <el-option label="普通用户" value="NORMAL" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="formData.status"
                :disabled="formDisabled"
                placeholder="请选择状态"
                style="width: 100%"
              >
                <el-option label="启用" value="ENABLE" />
                <el-option label="禁用" value="DISABLE" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 操作按钮 -->
      <el-card class="box-card" shadow="hover">
        <div class="form-buttons">
          <el-button v-if="!formDisabled" type="primary" @click="submitForm">
            {{ isEdit ? "更新" : "创建" }}
          </el-button>
          <el-button @click="cancel"> 取消 </el-button>
        </div>
      </el-card>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { adminAddUser, updateUser, getUserDetail } from "@/api/user";
import { get_group_list } from "@/api/labDevice";

const route = useRoute();
const router = useRouter();
const groupOptions = ref([]);

// 获取课题组列表
const fetchGroupList = async () => {
  try {
    const res = await get_group_list({ page: 1, page_size: 666 });
    if (res.success) {
      groupOptions.value = res.content.list;
    }
  } catch (error) {
    console.error("获取课题组列表失败:", error);
  }
};

// 判断是否为编辑模式
const isEdit = computed(() => route.query.mode === "edit");
// 判断是否为查看模式（禁用所有输入）
const formDisabled = computed(() => route.query.mode === "view");

// 表单引用
const formRef = ref();

// 表单数据
const formData = reactive({
  account: "",
  password: "",
  real_name: "",
  mobile: "",
  user_type: "INTERNAL", // 默认内部用户
  email: "",
  student_no: "",
  research_group: "",
  teacher_name: "",
  teacher_contact: "",
  role: "NORMAL", // 默认普通用户
  status: "ENABLE" // 默认启用
});

// 表单验证规则
const rules = computed(() => {
  const baseRules = {
    account: [
      { required: true, message: "请输入账号", trigger: "blur" },
      { min: 3, max: 20, message: "账号长度在3-20个字符之间", trigger: "blur" }
    ],
    real_name: [{ required: true, message: "请输入真实姓名", trigger: "blur" }],
    mobile: [
      { required: true, message: "请输入手机号", trigger: "blur" },
      {
        pattern: /^1[3-9]\d{9}$/,
        message: "请输入正确的手机号码",
        trigger: "blur"
      }
    ],
    user_type: [
      { required: true, message: "请选择用户类型", trigger: "change" }
    ]
  };

  if (!isEdit.value && !formDisabled.value) {
    baseRules.password = [
      { required: true, message: "请输入密码", trigger: "blur" },
      { min: 6, message: "密码长度不能少于6位", trigger: "blur" }
    ];
  }
  return baseRules;
});

// 提交表单
const submitForm = async () => {
  try {
    await formRef.value.validate();

    const commonPayload = {
      real_name: formData.real_name,
      mobile: formData.mobile,
      user_type: formData.user_type,
      email: formData.email,
      student_no: formData.student_no,
      research_group: formData.research_group,
      teacher_name: formData.teacher_name,
      teacher_contact: formData.teacher_contact,
      role: formData.role,
      status: formData.status
    };

    if (isEdit.value) {
      // 编辑模式 - 更新用户信息
      const params = {
        user_id: route.query.id,
        ...commonPayload
      };
      await updateUser(params);
      ElMessage.success("用户信息更新成功");
    } else {
      // 新增模式 - 创建用户
      const params = {
        account: formData.account,
        password: formData.password,
        ...commonPayload
      };
      await adminAddUser(params);
      ElMessage.success("用户创建成功");
    }

    // 返回用户管理列表页
    router.push("/userManage");
  } catch (error) {
    console.log("验证失败或API错误:", error);
    if (!error?.message) {
      ElMessage.error("请检查表单数据");
    }
  }
};

// 重置表单
const cancel = () => {
  router.push("/userManage");
};

// 初始化数据函数
const initData = async () => {
  // 从 query 中获取 ID，优先使用 rowData 中的 ID（如果存在），或者直接使用 query.id
  let userId = route.query.id;
  const rowDataStr = route.query.rowData;

  if (!userId && rowDataStr) {
    try {
      const rowData = JSON.parse(rowDataStr);
      userId = rowData.id;
    } catch (e) {
      // ignore
    }
  }

  // 优先使用接口获取详情
  if (userId) {
    try {
      const res = await getUserDetail({ user_id: userId });
      if (res.success && res.content) {
        Object.assign(formData, res.content);
        // Ensure defaults if null
        if (!formData.role) formData.role = "NORMAL";
        if (!formData.status) formData.status = "ENABLE";
        // Clear password for edit mode security/logic
        formData.password = "";
        return; // 接口获取成功，直接返回
      }
    } catch (error) {
      console.error("获取用户详情失败，尝试使用列表数据:", error);
    }
  }

  // 接口失败或没有ID时，尝试使用传递的行数据作为兜底
  if (rowDataStr) {
    try {
      const rowData = JSON.parse(rowDataStr);
      Object.assign(formData, rowData);
      // Ensure defaults if null
      if (!formData.role) formData.role = "NORMAL";
      if (!formData.status) formData.status = "ENABLE";
      // Clear password for edit mode security/logic
      formData.password = "";
    } catch (e) {
      console.error("Failed to parse row data", e);
    }
  }
};

// 组件挂载时初始化数据
onMounted(() => {
  fetchGroupList();
  if (isEdit.value || formDisabled.value) {
    initData();
  }
});
</script>

<style scoped>
.form-container {
  padding: 20px;
}

.box-card {
  margin-bottom: 20px;
}

.form-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
}
</style>
