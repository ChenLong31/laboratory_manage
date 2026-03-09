<template>
  <div class="banner-config-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>轮播图配置</span>
          <el-upload
            class="upload-demo"
            action="#"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleFileChange"
            multiple
            accept="image/*"
          >
            <el-button type="primary">批量上传</el-button>
          </el-upload>
        </div>
      </template>

      <div class="banner-list">
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          style="display: none"
          @change="onNativeFileChange"
        />
        <input
          ref="editInputRef"
          type="file"
          accept="image/*"
          style="display: none"
          @change="onEditFileChange"
        />
        <div
          v-for="(item, index) in bannerList"
          :key="index"
          class="banner-item"
        >
          <div class="image-wrapper">
            <el-image
              :src="item.url"
              fit="cover"
              class="banner-image"
              :preview-src-list="[item.url]"
            >
              <template #error>
                <div class="image-slot">
                  <el-icon><icon-picture /></el-icon>
                </div>
              </template>
            </el-image>
            <div class="delete-mask">
              <div class="mask-actions">
                <el-button
                  circle
                  type="primary"
                  size="small"
                  @click.stop="handleUpdateItem(index)"
                >
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-button
                  circle
                  type="danger"
                  size="small"
                  @click.stop="handleRemoveConfirm(index)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
          <div class="input-wrapper">
            <el-input
              v-model="item.title"
              placeholder="输入标题"
              maxlength="20"
              show-word-limit
              @blur="handleFieldBlur(index)"
            />
            <el-input-number
              placeholder="输入排序"
              v-model="item.sort_order"
              :min="0"
              :max="9999"
              controls-position="right"
              @blur="handleFieldBlur(index)"
              @change="handleFieldBlur(index)"
            />
          </div>
        </div>

        <!-- 占位图，如果不足6张 -->
        <div
          v-if="bannerList.length < 6"
          class="banner-item placeholder"
          @click="triggerUpload"
        >
          <el-icon class="plus-icon"><Plus /></el-icon>
          <div class="text">点击上传</div>
        </div>
      </div>

      <div class="footer-tips">最多 6 张，图片允许为空</div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  Delete,
  Plus,
  Picture as IconPicture,
  Edit
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { fileUpload } from "@/api/user";
import {
  getCarouselList,
  createCarousel,
  updateCarousel,
  deleteCarousel
} from "@/api/carousel";

interface BannerItem {
  id?: string;
  url: string;
  title: string;
  image_path?: string;
  link_url?: string;
  sort_order?: number;
  status?: string;
  saving?: boolean;
}

const fileInputRef = ref<HTMLInputElement | null>(null);
const editInputRef = ref<HTMLInputElement | null>(null);
const editingIndex = ref<number | null>(null);

const bannerList = ref<BannerItem[]>([
  // 模拟数据
  // { url: "https://via.placeholder.com/300x150", title: "示例图片1" }
]);

// 触发上传
const triggerUpload = () => {
  fileInputRef.value?.click();
};

const onNativeFileChange = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const files = input.files ? Array.from(input.files) : [];
  for (const f of files) {
    await handleNativeFile(f);
  }
  if (input) input.value = "";
};

const handleNativeFile = async (file: File) => {
  if (!file.type.startsWith("image/")) {
    ElMessage.warning("请上传图片文件");
    return;
  }
  if (bannerList.value.length >= 6) {
    ElMessage.warning("最多只能上传 6 张图片");
    return;
  }
  try {
    const { path, preview } = await uploadFileGetInfo(file);
    const payload: any = {
      image_path: path,
      sort_order: bannerList.value[bannerList.value.length - 1].sort_order + 1,
      title: "轮播图"
    };
    const saveRes: any = await createCarousel(payload);
    if (!saveRes?.success) {
      ElMessage.error("创建失败");
      return;
    }
    const id = String(saveRes?.content?.id || "");
    bannerList.value.push({
      id,
      url: preview,
      title: "",
      image_path: path,
      saving: false
    });
    ElMessage.success("已创建");
    getBannerData();
  } catch (error) {
    console.error(error);
    ElMessage.error(`图片 ${file.name} 上传出错`);
  }
};

// 处理文件选择（批量）
const handleFileChange = async (file: any, fileList: any[]) => {
  // 注意：这里 element-plus 的 on-change 会对每个文件触发一次
  // 我们需要过滤掉非图片
  await handleNativeFile(file.raw);
};

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

const uploadFileGetInfo = async (file: File) => {
  const base64 = await toBase64(file);
  const res: any = await fileUpload({
    file_name: file.name,
    file_base64: base64
  });
  if (!res?.success) throw new Error("upload failed");
  const path =
    res?.content?.path ||
    res?.content?.image_path ||
    res?.content?.file_path ||
    "";
  const serverUrl = res?.content?.url || res?.content?.file_url || "";
  const preview = serverUrl || `data:${file.type};base64,${base64}`;
  return { path, preview };
};

const handleRemove = async (index: number) => {
  const item = bannerList.value[index];
  if (item?.id) {
    const res: any = await deleteCarousel({ id: String(item.id) });
    if (!res?.success) {
      ElMessage.error("删除失败");
      return;
    }
  }
  bannerList.value.splice(index, 1);
};
const handleRemoveConfirm = async (index: number) => {
  try {
    await ElMessageBox.confirm("确认删除该轮播图？", "提示", {
      type: "warning",
      confirmButtonText: "删除",
      cancelButtonText: "取消"
    });
    await handleRemove(index);
  } catch {}
};

// 底部按钮已移除，上传和编辑均即时保存

const getBannerData = async () => {
  try {
    const res: any = await getCarouselList();
    const list = res?.content || res?.data?.list || [];
    bannerList.value = (list || []).slice(0, 6).map((x: any) => ({
      id: String(x.id),
      title: x.title || "",
      url: x.image_url || "",
      image_path: x.image_path || "",
      link_url: x.link_url || "",
      sort_order: x.sort_order,
      status: x.status,
      saving: false
    }));
  } catch (e) {
    ElMessage.error("列表加载失败");
  }
};

const handleUpdateItem = (index: number) => {
  editingIndex.value = index;
  editInputRef.value?.click();
};

const onEditFileChange = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  const index = editingIndex.value;
  editingIndex.value = null;
  if (input) input.value = "";
  if (!file || index === null) return;
  if (!file.type.startsWith("image/")) {
    ElMessage.warning("请上传图片文件");
    return;
  }
  const item = bannerList.value[index];
  item.saving = true;
  try {
    const { path, preview } = await uploadFileGetInfo(file);
    item.url = preview;
    item.image_path = path;
    await handleFieldBlur(index);
  } catch {
    ElMessage.error("操作失败");
  } finally {
    item.saving = false;
  }
};

const handleFieldBlur = async (index: number) => {
  const item = bannerList.value[index];
  const payload: any = {};
  if (item.title) payload.title = item.title;
  if (typeof item.sort_order === "number") payload.sort_order = item.sort_order;
  if (item.image_path) payload.image_path = item.image_path;
  if (item.id) {
    payload.id = String(item.id);
    const res: any = await updateCarousel(payload);
    if (!res?.success) throw new Error("update failed");
    ElMessage.success("已更新");
  } else {
    const res: any = await createCarousel(payload);
    if (!res?.success) throw new Error("create failed");
    if (res?.content?.id) item.id = String(res.content.id);
    ElMessage.success("已创建");
  }
};
onMounted(() => {
  getBannerData();
});
</script>

<style scoped lang="scss">
.banner-config-container {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .banner-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 20px;
  }

  .banner-item {
    width: 320px;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 4px;

    .input-wrapper {
      display: flex;
      gap: 8px;
      align-items: center;
      .el-input {
        flex: 1;
      }
      .el-input-number {
        width: 110px;
      }
    }

    &.placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px; /* 约等于图片高度+输入框高度 */
      color: #909399;
      cursor: pointer;
      border: 1px dashed #dcdfe6;

      &:hover {
        color: #409eff;
        border-color: #409eff;
      }

      .plus-icon {
        margin-bottom: 10px;
        font-size: 30px;
      }
    }

    .image-wrapper {
      position: relative;
      width: 100%;
      height: 150px;
      margin-bottom: 10px;
      overflow: hidden;
      border-radius: 4px;

      .banner-image {
        display: block;
        width: 100%;
        height: 100%;
      }

      .delete-mask {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        font-size: 24px;
        color: #fff;
        cursor: pointer;
        background-color: rgb(0 0 0 / 50%);
        opacity: 0;
        transition: opacity 0.3s;
      }

      &:hover .delete-mask {
        opacity: 1;
      }

      .image-slot {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color: #909399;
        background: #f5f7fa;
      }
      .mask-actions {
        display: flex;
        gap: 12px;
      }
    }
  }

  .footer-tips {
    margin-bottom: 20px;
    font-size: 14px;
    color: #409eff;
    text-align: center;
  }

  .action-footer {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }
}
</style>
