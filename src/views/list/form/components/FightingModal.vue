<template>
  <el-dialog
    :title="getTitle()"
    v-model="dialogVisible"
    width="700px"
    :before-close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="80px"
    >
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="formData.name"
          :disabled="mode === 'view'"
          placeholder="请输入名称"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="formData.status"
          :disabled="mode === 'view'"
          placeholder="请选择状态"
          style="width: 100%"
        >
          <el-option label="启用" value="1" />
          <el-option label="禁用" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" v-if="mode === 'view'">
        <span>{{ formData.createTime }}</span>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm" v-if="mode !== 'view'">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, reactive, defineProps, defineEmits } from "vue";
import { ElMessage } from "element-plus";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  mode: {
    type: String, // view, add, edit
    default: "view"
  },
  data: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(["update:visible", "success"]);

const dialogVisible = ref(false);
const formRef = ref();

const formData = reactive({
  id: "",
  name: "",
  status: "",
  createTime: ""
});

const formRules = {
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "change" }]
};

watch(
  () => props.visible,
  val => {
    dialogVisible.value = val;
    if (val) {
      initData();
    }
  }
);

watch(dialogVisible, val => {
  if (!val) {
    emit("update:visible", val);
  }
});

const getTitle = () => {
  const titles = {
    view: "查看",
    add: "新增",
    edit: "编辑"
  };
  return titles[props.mode] || "查看";
};

const initData = () => {
  if (props.mode === "add") {
    Object.assign(formData, {
      id: "",
      name: "",
      status: "",
      createTime: ""
    });
  } else {
    Object.assign(formData, { ...props.data });
  }
};

const handleClose = () => {
  dialogVisible.value = false;
  formRef.value?.resetFields();
};

const handleConfirm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      // 这里处理提交逻辑
      console.log("提交数据", formData);
      ElMessage.success(`${getTitle()}成功`);
      emit("success");
      handleClose();
    }
  });
};
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
