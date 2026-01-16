<template>
  <el-dialog
    v-model="visible"
    title="用户注册审核"
    width="500px"
    :before-close="handleClose"
  >
    <el-form ref="formRef" :model="formData" label-width="100px">
      <el-form-item label="账号" prop="accountName">
        <el-input
          v-model="formData.accountName"
          disabled
          placeholder="请输入账号"
        />
      </el-form-item>

      <el-form-item label="用户姓名" prop="owner">
        <el-input
          v-model="formData.owner"
          disabled
          placeholder="请输入用户姓名"
        />
      </el-form-item>

      <el-form-item label="手机号" prop="phoneNumber">
        <el-input
          v-model="formData.phoneNumber"
          disabled
          placeholder="请输入手机号"
        />
      </el-form-item>

      <el-form-item label="用户类型" prop="userType">
        <el-select
          v-model="formData.userType"
          disabled
          placeholder="请选择用户类型"
        >
          <el-option label="校内用户" value="internal_user" />
          <el-option label="校外用户" value="external_user" />
        </el-select>
      </el-form-item>

      <el-form-item label="老师姓名" prop="teacherName">
        <el-input
          v-model="formData.teacherName"
          disabled
          placeholder="请输入老师姓名"
        />
      </el-form-item>

      <el-form-item label="联系方式" prop="contactWay">
        <el-input
          v-model="formData.contactWay"
          disabled
          placeholder="请输入联系方式"
        />
      </el-form-item>

      <el-form-item label="注册时间" prop="registerTime">
        <el-date-picker
          v-model="formData.registerTime"
          type="datetime"
          disabled
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
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

// 对话框显示状态
const visible = ref(false);

// 表单数据
const formData = reactive({
  accountName: "",
  owner: "",
  phoneNumber: "",
  userType: "",
  teacherName: "",
  contactWay: "",
  registerTime: ""
});

const props = defineProps({
  id: String | Number,
  data: Object // 接收外部传入的用户数据
});

// 打开弹窗
const open = userData => {
  visible.value = true;
  // 设置表单数据
  Object.assign(formData, userData);
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
        id: props.id,
        action: "reject",
        reason: "审核未通过"
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
    id: props.id,
    action: "approve"
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
