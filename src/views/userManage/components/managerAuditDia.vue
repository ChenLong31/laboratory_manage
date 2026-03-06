<template>
  <el-dialog
    v-model="visible"
    title="管理员申请审核"
    width="500px"
    :before-close="handleClose"
  >
    <el-form ref="formRef" :model="formData" label-width="120px">
      <el-form-item label="账号" prop="user_account">
        <el-input v-model="formData.user_account" disabled />
      </el-form-item>

      <el-form-item label="申请人" prop="user_name">
        <el-input v-model="formData.user_name" disabled />
      </el-form-item>

      <el-form-item label="管理员类型" prop="application_type">
        <el-select v-model="formData.application_type" disabled>
          <el-option label="仪器管理员" value="DEVICE_ADMIN" />
          <el-option label="课题组管理员" value="GROUP_ADMIN" />
        </el-select>
      </el-form-item>

      <el-form-item label="仪器/课题组名称" prop="target_name">
        <el-input v-model="formData.target_name" disabled />
      </el-form-item>

      <el-form-item label="申请时间" prop="submit_time">
        <el-input v-model="formData.submit_time" disabled />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleReject">驳回</el-button>
        <el-button type="primary" @click="handleApprove">通过</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { reviewApplication } from "@/api/user";
const emit = defineEmits(["confirm", "close"]);
import dayjs from "dayjs";
// 对话框显示状态
const visible = ref(false);

// 表单数据（与列表数据字段对齐）
const formData = reactive({
  user_account: "",
  user_name: "",
  application_type: "",
  target_name: "",
  submit_time: ""
});

const props = defineProps({
  id: [String, Number],
  data: Object // 接收外部传入的用户数据
});

// 打开弹窗
const open = userData => {
  visible.value = true;
  // 设置表单数据
  Object.assign(formData, {
    ...userData,
    submit_time: dayjs(userData.submit_time).format("YYYY-MM-DD HH:mm:ss")
  });
};

// 关闭弹窗
const handleClose = () => {
  visible.value = false;
  emit("close");
};

// 驳回操作
const handleReject = () => {
  ElMessageBox.confirm("确认驳回该用户的注册申请吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      const params = {
        application_id: props.id,
        action: "REJECT"
      };
      audit(params);
    })
    .catch(() => {
      // 取消驳回
    });
};
const audit = async params => {
  try {
    const res = await reviewApplication(params);
    if (res?.success) {
      ElMessage.success("操作成功");
      emit("confirm", params);
      visible.value = false;
    } else {
      ElMessage.error("操作失败");
    }
  } catch (e) {
    ElMessage.error("操作失败");
  }
};
// 通过操作
const handleApprove = () => {
  const params = {
    application_id: props.id,
    action: "APPROVE"
  };
  audit(params);
};

// 暴露方法供外部调用
defineExpose({
  open
});
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
