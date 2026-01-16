<template>
  <div class="form-container">
    <el-form
      :model="formData"
      :rules="rules"
      ref="formRef"
      label-width="100px"
      class="form-content"
    >
      <el-card class="box-card" shadow="hover">
        <template #header>
          <span class="card-title">用户信息</span>
        </template>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="账号" prop="accountName">
              <el-input
                v-model="formData.accountName"
                :disabled="isEdit || formDisabled"
                placeholder="请输入账号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名称" prop="owner">
              <el-input
                v-model="formData.owner"
                :disabled="formDisabled"
                placeholder="请输入用户名称"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="手机号" prop="phoneNumber">
              <el-input
                v-model="formData.phoneNumber"
                :disabled="formDisabled"
                placeholder="请输入手机号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户类型" prop="userType">
              <el-select
                v-model="formData.userType"
                :disabled="formDisabled"
                placeholder="请选择用户类型"
                style="width: 100%"
              >
                <el-option label="超级管理员" value="super_admin" />
                <el-option label="仪器管理员" value="instrument_admin" />
                <el-option label="教师" value="teacher" />
                <el-option label="学生" value="student" />
                <el-option label="校外" value="external" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="formData.status"
                :disabled="formDisabled"
                placeholder="请选择状态"
                style="width: 100%"
              >
                <el-option label="启用" value="enabled" />
                <el-option label="禁用" value="disabled" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 操作按钮 -->
      <el-card class="box-card" shadow="hover">
        <div class="form-buttons">
          <el-button 
            type="primary" 
            @click="submitForm" 
            v-if="!formDisabled"
          >
            {{ isEdit ? '更新' : '创建' }}
          </el-button>
          <el-button @click="cancel"> 取消 </el-button>
        </div>
      </el-card>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

// 判断是否为编辑模式
const isEdit = computed(() => route.query.mode === 'edit');
// 判断是否为查看模式（禁用所有输入）
const formDisabled = computed(() => route.query.mode === "view");

// 表单引用
const formRef = ref();

// 表单数据
const formData = reactive({
  accountName: "",
  owner: "",
  phoneNumber: "",
  userType: "",
  status: ""
});

// 表单验证规则
const rules = {
  accountName: [
    { required: true, message: "请输入账号", trigger: "blur" },
    { min: 3, max: 20, message: "账号长度在3-20个字符之间", trigger: "blur" }
  ],
  owner: [
    { required: true, message: "请输入用户名称", trigger: "blur" }
  ],
  phoneNumber: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" }
  ],
  userType: [
    { required: true, message: "请选择用户类型", trigger: "change" }
  ],
  status: [
    { required: true, message: "请选择状态", trigger: "change" }
  ]
};

// 提交表单
const submitForm = async () => {
  try {
    await formRef.value.validate();
    
    if (isEdit.value) {
      // 编辑模式 - 更新用户信息
      console.log("更新用户信息:", formData);
      // 这里调用更新API
      // await updateUserApi(formData);
      ElMessage.success("用户信息更新成功");
    } else {
      // 新增模式 - 创建用户
      console.log("创建新用户:", formData);
      // 这里调用创建API
      // await createUserApi(formData);
      ElMessage.success("用户创建成功");
    }
    
    // 返回用户管理列表页
    router.push("/userManage");
  } catch (error) {
    console.log("验证失败:", error);
    ElMessage.error("请检查表单数据");
  }
};

// 重置表单
const cancel = () => {
  router.push("/userManage");
};

// 初始化数据函数 - 用于编辑和查看模式
const initData = async () => {
  const userId = route.query.id;
  if (!userId) {
    return;
  }

  try {
    // 这里应该从API获取用户数据
    // const response = await getUserByIdApi(userId);
    // 模拟获取数据
    setTimeout(() => {
      Object.assign(formData, {
        accountName: "user123",
        owner: "张三",
        phoneNumber: "13888888888",
        userType: "teacher",
        status: "enabled"
      });
    }, 500);
  } catch (error) {
    console.error("获取用户数据失败:", error);
    ElMessage.error("获取用户数据失败");
  }
};

// 组件挂载时初始化数据（仅在编辑或查看模式下）
onMounted(() => {
  if (isEdit.value || formDisabled.value) {
    initData();
  }
});
</script>

<style lang="scss" scoped>
:deep(.el-form-item__label) {
  justify-content: flex-start;
}
:deep(.el-form-item) {
  flex-direction: column;
}

.form-container {
  padding: 20px;

  .box-card {
    width: 100%;
    margin-bottom: 20px;
    
    .card-title {
      font-weight: bold;
      color: #303133;
      font-size: 16px;
    }

    .form-buttons {
      text-align: right;
      .el-button {
        margin-left: 10px;
      }
    }
  }
}
</style>