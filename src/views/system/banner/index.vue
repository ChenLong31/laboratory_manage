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
            <div class="delete-mask" @click="handleRemove(index)">
              <el-icon><Delete /></el-icon>
            </div>
          </div>
          <div class="input-wrapper">
            <el-input
              v-model="item.title"
              placeholder="输入标题"
              maxlength="20"
              show-word-limit
            />
          </div>
        </div>

        <!-- 占位图，如果不足6张 -->
        <div
          class="banner-item placeholder"
          v-if="bannerList.length < 6"
          @click="triggerUpload"
        >
          <el-icon class="plus-icon"><Plus /></el-icon>
          <div class="text">点击上传</div>
        </div>
      </div>

      <div class="footer-tips">最多 6 张，图片允许为空</div>

      <div class="action-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="saving"
          >保存</el-button
        >
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Delete, Plus, Picture as IconPicture } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { fileUpload } from "@/api/user";
// 假设这里有一个获取和保存banner配置的接口，如果没有需要新增
// import { getBannerConfig, saveBannerConfig } from "@/api/system";

interface BannerItem {
  url: string;
  title: string;
  file?: File; // 临时存储文件对象用于上传
}

const bannerList = ref<BannerItem[]>([
  // 模拟数据
  // { url: "https://via.placeholder.com/300x150", title: "示例图片1" }
]);

const saving = ref(false);

// 触发上传
const triggerUpload = () => {
  const uploadInput = document.querySelector(
    ".card-header .el-upload__input"
  ) as HTMLElement;
  if (uploadInput) {
    uploadInput.click();
  }
};

// 处理文件选择（批量）
const handleFileChange = async (file: any, fileList: any[]) => {
  // 注意：这里 element-plus 的 on-change 会对每个文件触发一次
  // 我们需要过滤掉非图片
  if (file.raw.type.indexOf("image/") === -1) {
    ElMessage.warning("请上传图片文件");
    return;
  }

  if (bannerList.value.length >= 6) {
    ElMessage.warning("最多只能上传 6 张图片");
    return;
  }

  // 立即上传获取 URL (或者保存时统一上传，这里选择立即上传以获取预览URL)
  // 这里简化处理，先用 FileReader 读取本地预览，保存时再上传，或者直接上传
  // 为了体验更好，通常建议先上传拿到 URL
  try {
    const base64 = await toBase64(file.raw);
    const res: any = await fileUpload({
      file_name: file.name,
      file_base64: base64
    });

    if (res?.success) {
      const url =
        res?.content?.url || res?.content?.file_url || res?.content || "";
      bannerList.value.push({
        url: url,
        title: "",
        file: file.raw
      });
    } else {
      ElMessage.error(`图片 ${file.name} 上传失败`);
    }
  } catch (error) {
    console.error(error);
    ElMessage.error(`图片 ${file.name} 上传出错`);
  }
};

const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = error => reject(error);
  });

// 移除图片
const handleRemove = (index: number) => {
  bannerList.value.splice(index, 1);
};

// 取消
const handleCancel = () => {
  // 重新获取数据或者清空
  // getBannerData();
  ElMessage.info("已取消");
};

// 保存
const handleSave = async () => {
  if (bannerList.value.length === 0) {
    // 允许为空，显示默认图逻辑在前端展示端处理，这里后端可能存空数组
  }

  saving.value = true;
  try {
    // 构造数据提交给后端
    // const data = bannerList.value.map(item => ({ url: item.url, title: item.title }));
    // await saveBannerConfig(data);

    // 模拟保存成功
    setTimeout(() => {
      saving.value = false;
      localStorage.setItem("bannerList", JSON.stringify(bannerList.value));
      ElMessage.success("保存成功");
    }, 1000);
  } catch (error) {
    saving.value = false;
    ElMessage.error("保存失败");
  }
};

// 获取初始数据
const getBannerData = async () => {
  // const res = await getBannerConfig();
  // if (res.success) {
  //   bannerList.value = res.data;
  // }
  const localData = localStorage.getItem("bannerList");
  if (localData) {
    try {
      bannerList.value = JSON.parse(localData);
    } catch (e) {
      console.error(e);
    }
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
    justify-content: space-between;
    align-items: center;
  }

  .banner-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 20px;
  }

  .banner-item {
    width: 300px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 10px;
    background-color: #fff;

    &.placeholder {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 200px; /* 约等于图片高度+输入框高度 */
      border: 1px dashed #dcdfe6;
      cursor: pointer;
      color: #909399;

      &:hover {
        border-color: #409eff;
        color: #409eff;
      }

      .plus-icon {
        font-size: 30px;
        margin-bottom: 10px;
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
        width: 100%;
        height: 100%;
        display: block;
      }

      .delete-mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s;
        cursor: pointer;
        color: #fff;
        font-size: 24px;
      }

      &:hover .delete-mask {
        opacity: 1;
      }

      .image-slot {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background: #f5f7fa;
        color: #909399;
      }
    }

    .input-wrapper {
    }
  }

  .footer-tips {
    color: #409eff;
    font-size: 14px;
    margin-bottom: 20px;
    text-align: center;
  }

  .action-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}
</style>
