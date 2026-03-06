<!-- src/components/QuotaConfigDialog.vue -->
<template>
  <el-dialog
    v-model="visible"
    title="额度配置"
    width="400px"
    :before-close="handleClose"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="预付款额度" prop="prepaidAmount">
        <el-input
          v-model.number="formData.prepaidAmount"
          placeholder="请输入金额"
        />
      </el-form-item>

      <el-form-item label="可欠费额度" prop="creditAmount">
        <el-input
          v-model.number="formData.creditAmount"
          placeholder="请输入金额"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">完成</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from "vue";

const emit = defineEmits(["confirm", "close"]);

// 对话框显示状态
const visible = ref(false);

// 表单数据
const formData = reactive({
  prepaidAmount: null,
  creditAmount: null
});
const props = defineProps({
  id: [String, Number]
});
// 表单校验规则
const rules = {
  prepaidAmount: [
    { required: true, message: "请输入预付款额度", trigger: "blur" },
    { type: "number", message: "请输入有效数字", trigger: "blur" }
  ],
  creditAmount: [
    { required: true, message: "请输入可欠费额度", trigger: "blur" },
    { type: "number", message: "请输入有效数字", trigger: "blur" }
  ]
};

// 表单引用
const formRef = ref(null);

// 打开弹窗
const open = () => {
  visible.value = true;
  // 重置表单
  formData.prepaidAmount = null;
  formData.creditAmount = null;
};

// 关闭弹窗
const handleClose = () => {
  visible.value = false;
  formRef.value.resetFields();
  emit("close");
};

// 提交表单
const handleSubmit = () => {
  formRef.value.validate(valid => {
    if (valid) {
      let params = { ...formData, id: props.id };
      console.log("提交数据:", params);
      emit("confirm", params);
      visible.value = false;
    }
  });
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
