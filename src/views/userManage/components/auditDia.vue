<template>
  <el-dialog
    v-model="visible"
    title="用户注册审核"
    width="500px"
    :before-close="handleClose"
  >
    <el-form ref="formRef" :model="formData" label-width="100px">
      <el-form-item label="账号" prop="account">
        <el-input v-model="formData.account" disabled />
      </el-form-item>

      <el-form-item label="用户名称" prop="real_name">
        <el-input v-model="formData.real_name" disabled />
      </el-form-item>

      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="formData.mobile" disabled />
      </el-form-item>

      <el-form-item label="用户类型" prop="user_type">
        <el-select v-model="formData.user_type" disabled>
          <el-option label="内部用户" value="INTERNAL" />
          <el-option label="外部用户" value="EXTERNAL" />
        </el-select>
      </el-form-item>

      <el-form-item label="老师姓名" prop="teacherName">
        <el-input
          v-model="formData.teacher_name"
          disabled
          placeholder="请输入老师姓名"
        />
      </el-form-item>

      <el-form-item label="联系方式" prop="contactWay">
        <el-input
          v-model="formData.teacher_contact"
          disabled
          placeholder="请输入联系方式"
        />
      </el-form-item>

      <el-form-item label="注册时间" prop="create_time">
        <el-input v-model="formData.create_time" disabled />
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
const emit = defineEmits(["confirm", "close"]);
import dayjs from "dayjs";
// 对话框显示状态
const visible = ref(false);

// 表单数据
const formData = reactive({
  account: "",
  real_name: "",
  mobile: "",
  user_type: "",
  student_no: "",
  identity_status: "",
  create_time: ""
});

const props = defineProps({
  id: String | Number,
  data: Object // 接收外部传入的用户数据
});

// 打开弹窗
const open = userData => {
  visible.value = true;
  // 设置表单数据
  Object.assign(formData, {
    ...userData,
    create_time: dayjs(userData.create_time).format("YYYY-MM-DD HH:mm:ss")
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
        user_id: props.id,
        action: "REJECT"
      };
      console.log("驳回数据:", params);
      audit(params);
    })
    .catch(() => {
      // 取消驳回
    });
};
const audit = async params => {
  // 发接口
  ElMessage.success("操作成功");
  emit("confirm", params);
  visible.value = false;
};
// 通过操作
const handleApprove = () => {
  const params = {
    user_id: props.id,
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
