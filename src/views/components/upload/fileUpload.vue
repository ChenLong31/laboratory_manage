<template>
  <div class="custom-upload">
    <el-upload
      v-model:file-list="fileList"
      :action="uploadAction"
      :http-request="customRequest"
      :on-success="handleSuccess"
      :on-error="handleError"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-preview="handlePreview"
      :limit="maxCount"
      :on-exceed="handleExceed"
      :headers="headers"
      :data="uploadData"
      :accept="acceptTypes"
    >
      <el-button color="#F7F8FA" :icon="Upload">上传图片</el-button>
    </el-upload>

    <!-- 图片预览对话框 -->
    <el-dialog v-model="previewVisible" title="图片预览" width="50%">
      <img :src="previewImageUrl" style="width: 100%; height: auto" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { ElMessage } from "element-plus";
import { Upload } from "@element-plus/icons-vue";
import { fileUpload as apiFileUpload } from "@/api/user";

// 定义 props
interface Props {
  // 文件上传地址
  action?: string;
  // 最大上传数量
  maxCount?: number;
  // 接受的文件类型
  acceptTypes?: string;
  // 文件上传所需参数（如token）
  headers?: Record<string, any>;
  // 额外上传数据
  uploadData?: Record<string, any>;
  // 用于获取已上传文件的编码
  code?: string;
}

const props = withDefaults(defineProps<Props>(), {
  action: "/api/upload", // 默认上传地址
  maxCount: 5,
  acceptTypes: ".jpg,.jpeg,.png,.gif",
  headers: () => ({}),
  uploadData: () => ({}),
  code: ""
});

// 定义 emit
const emit = defineEmits<{
  "update:code": [value: string];
  change: [value: string];
}>();

// 响应式数据
const fileList = ref<any[]>([]);
const previewVisible = ref(false);
const previewImageUrl = ref("");

// 文件上传地址
const uploadAction = ref(props.action);

const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = String(reader.result ?? "");
      const commaIndex = result.indexOf(",");
      resolve(commaIndex >= 0 ? result.slice(commaIndex + 1) : result);
    };
    reader.onerror = error => reject(error);
  });

const customRequest = async (option: any) => {
  try {
    const base64 = await toBase64(option.file);
    const res: any = await apiFileUpload({
      file_name: option.file.name,
      file_base64: base64
    });
    if (res?.success) {
      // 优先使用返回的 url，其次是 path
      const url = res?.content?.path || res?.content?.url || "";
      option.onSuccess(res, option.file);

      // 更新 v-model 和触发 change 事件
      emit("update:code", url);
      emit("change", url);

      const updated = [...fileList.value];
      const idx = updated.findIndex(f => f.uid === option.file.uid);
      if (idx !== -1) {
        updated[idx].url = url;
        updated[idx].status = "success";
      } else {
        updated.push({
          name: option.file.name,
          url,
          uid: option.file.uid,
          status: "success"
        });
      }
      fileList.value = updated;
    } else {
      option.onError(new Error("upload failed"));
      ElMessage.error("上传失败");
    }
  } catch (e) {
    option.onError(e);
    ElMessage.error("上传失败");
  }
};

// 监听 code 变化，获取已上传的文件列表
watch(
  () => props.code,
  newCode => {
    if (newCode) {
      // 如果 code 是一个字符串，直接显示
      if (typeof newCode === "string" && newCode.trim() !== "") {
        fileList.value = [
          {
            name: "缩略图",
            url: newCode,
            status: "success"
          }
        ];
      } else {
        fetchFileList(newCode);
      }
    } else {
      fileList.value = [];
    }
  },
  { immediate: true }
);

// 获取已上传文件列表
const fetchFileList = async (code: string) => {
  // try {
  //   const response = await api()
  //   // 假设接口返回的数据结构为 { success: true, data: [...] }
  //   if (response.success && Array.isArray(response.data)) {
  //     // 将返回的文件数据转换为 upload 组件需要的格式
  //     fileList.value = response.data.map((item: any) => ({
  //       name: item.name || "file",
  //       url: item.url,
  //       uid: item.uid || Date.now() + Math.random(),
  //       // 如果后端返回了其他属性，也可以添加
  //       ...item
  //     }));
  //     // 触发 change 事件
  //     emit("change", fileList.value);
  //   }
  // } catch (error) {
  //   console.error("获取文件列表失败:", error);
  //   ElMessage.error("获取文件列表失败");
  // }
};

// 文件上传成功回调
const handleSuccess = (response: any, file: any, fileList: any[]) => {
  ElMessage.success("上传成功");
  // customRequest 已经处理了 emit，这里不需要重复处理
};

// 文件上传失败回调
const handleError = (error: any, file: any, fileList: any[]) => {
  console.error("上传失败:", error);
  ElMessage.error("上传失败");
};

// 上传前验证
const beforeUpload = (file: any) => {
  const isImage = file.type.startsWith("image/");
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error("只能上传图片文件!");
    return false;
  }

  if (!isLt2M) {
    ElMessage.error("图片大小不能超过 2MB!");
    return false;
  }

  return true;
};

// 文件移除
const handleRemove = (file: any) => {
  const index = fileList.value.findIndex(item => item.uid === file.uid);
  if (index !== -1) {
    fileList.value.splice(index, 1);
    // 如果文件列表为空，清空 code
    if (fileList.value.length === 0) {
      emit("update:code", "");
      emit("change", "");
    }
    // updateFileList(fileList.value);
  }
};

// 文件预览
const handlePreview = (file: any) => {
  previewImageUrl.value = file.url;
  previewVisible.value = true;
};

// 处理超出限制
const handleExceed = (files: any, fileList: any[]) => {
  ElMessage.warning(`最多只能上传 ${props.maxCount} 张图片`);
};

// 更新文件列表并触发事件
const updateFileList = (list: any[]) => {
  // 过滤掉上传失败的文件
  const validList = list.filter(item => item.status !== "fail");
  fileList.value = validList;
};

// 初始化时加载文件列表
onMounted(() => {
  if (props.code) {
    fetchFileList(props.code);
  }
});
</script>

<style scoped>
.custom-upload .el-upload--picture-card {
  width: 80px;
  height: 80px;
  line-height: 76px;
}

.el-upload-list__item {
  width: 80px;
  height: 80px;
}

.el-upload-list__item-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
