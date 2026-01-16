<template>
  <el-dialog
    v-model="visible"
    title="管理员申请审核"
    width="500px"
    :before-close="handleClose"
  >
    <el-form ref="formRef" :model="formData" label-width="120px">
      <el-form-item label="账号" prop="accountName">
        <el-input
          v-model="formData.accountName"
          disabled
          placeholder="请输入账号"
        />
      </el-form-item>

      <el-form-item label="申请人" prop="owner">
        <el-input
          v-model="formData.owner"
          disabled
          placeholder="请输入申请人"
        />
      </el-form-item>

      <el-form-item label="手机号" prop="phoneNumber">
        <el-input
          v-model="formData.phoneNumber"
          disabled
          placeholder="请输入手机号"
        />
      </el-form-item>

      <el-form-item label="管理员类型" prop="userType">
        <el-select
          v-model="formData.userType"
          disabled
          placeholder="请选择管理员类型"
        >
          <el-option label="仪器管理员" value="instrument_admin" />
          <el-option label="课题组管理员" value="group_admin" />
        </el-select>
      </el-form-item>

      <el-form-item label="仪器/课题组名称" prop="instrumentGroup">
        <el-input
          v-model="formData.instrumentGroup"
          disabled
          placeholder="请输入仪器/课题组名称"
        />
      </el-form-item>

      <el-form-item label="申请时间" prop="registerTime">
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
  instrumentGroup: "", // 新增字段
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
