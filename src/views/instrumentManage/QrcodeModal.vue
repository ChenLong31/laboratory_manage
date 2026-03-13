<template>
  <el-dialog
    v-model="visible"
    title="仪器二维码"
    width="400px"
    :before-close="handleClose"
    center
  >
    <div class="qrcode-container">
      <div class="qrcode-info">
        <div class="info-item">
          <span class="label">仪器编号：</span>
          <span class="value">{{ deviceInfo.device_no }}</span>
        </div>
        <div class="info-item">
          <span class="label">仪器名称：</span>
          <span class="value">{{ deviceInfo.name }}</span>
        </div>
      </div>
      <div class="qrcode-wrapper">
        <ReQrcode :text="qrcodeText" :width="250" />
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import ReQrcode from "@/components/ReQrcode";

const emit = defineEmits(["update:modelValue", "close"]);

const visible = ref(false);
const deviceInfo = ref({
  id: "",
  device_no: "",
  name: ""
});

const qrcodeText = computed(() => {
  return JSON.stringify({
    deviceId: deviceInfo.value.id,
    deviceNo: deviceInfo.value.device_no,
    name: deviceInfo.value.name
  });
});

const handleClose = () => {
  visible.value = false;
  emit("close");
};

const open = row => {
  deviceInfo.value = {
    id: row.id,
    device_no: row.device_no,
    name: row.name
  };
  visible.value = true;
};

const close = () => {
  visible.value = false;
  emit("close");
};

defineExpose({
  open,
  close
});
</script>

<style scoped>
.qrcode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.qrcode-info {
  width: 100%;
  padding: 0 20px 20px 20px;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  margin-bottom: 10px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  font-weight: bold;
  color: #606266;
  min-width: 80px;
}

.value {
  color: #303133;
}

.qrcode-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}
</style>
