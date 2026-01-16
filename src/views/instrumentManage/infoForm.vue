<template>
  <div class="form-container">
    <el-form
      :model="formData"
      :rules="rules"
      ref="formRef"
      label-width="100px"
      class="form-content"
    >
      <el-card class="box-card" shadow="hover">
        <template #header>
          <span class="card-title">基本信息</span>
        </template>
        <el-row :gutter="20">
          <!-- 第一行 -->
          <el-col :span="8">
            <el-form-item label="仪器编码" prop="name">
              <el-input
                v-model="formData.name"
                :disabled="formDisabled"
                placeholder="请输入仪器编码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仪器名称" prop="name">
              <el-input
                v-model="formData.name"
                :disabled="formDisabled"
                placeholder="请输入仪器名称"
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="所属楼层" prop="floor">
              <el-select v-model="formData.floor" placeholder="请选择所属楼层">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <!-- 第二行 -->
          <el-col :span="8">
            <el-form-item label="所属区域" prop="area">
              <el-select v-model="formData.area" placeholder="请选择所属区域">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="图片" prop="purchaseDate">
              <fileUpload
                v-model:code="formData.fileCode"
                :action="'/api/upload'"
                :max-count="5"
                :headers="{ Authorization: `Bearer ${token}` }"
                @change="handleFileChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="描述信息/使用说明"
              prop="desc"
              label-width="140px"
            >
              <el-input
                v-model="formData.desc"
                placeholder="请输入描述信息/使用说明"
                type="textarea"
                :row="5"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card" shadow="hover">
        <template #header>
          <span class="card-title">预约配置</span>
        </template>
        <el-row :gutter="20">
          <!-- 第三行 -->
          <el-col :span="8">
            <el-form-item label="预约时间" prop="purchaseDate">
              <el-time-picker
                v-model="formData.purchaseDate"
                is-range
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="计费规则/收费标准"
              prop="rule"
              label-width="140px"
            >
              <el-select
                v-model="formData.rule"
                :disabled="formDisabled"
                placeholder="请选择计费规则/收费标准"
              >
                <el-option label="正常" value="normal" />
                <el-option label="维修中" value="repairing" />
                <el-option label="停用" value="disabled" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="formData.status"
                :disabled="formDisabled"
                placeholder="请选择状态"
              >
                <el-option label="正常" value="normal" />
                <el-option label="维修中" value="repairing" />
                <el-option label="停用" value="disabled" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card" shadow="hover">
        <template #header>
          <span class="card-title">管理员</span>
        </template>
        <el-row :gutter="20">
          <!-- 第三行 -->
          <el-col :span="8">
            <el-form-item label="管理员" prop="manager">
              <el-select
                v-model="formData.manager"
                :disabled="formDisabled"
                placeholder="请选择管理员"
                multiple
              >
                <el-option label="正常" value="normal" />
                <el-option label="维修中" value="repairing" />
                <el-option label="停用" value="disabled" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <!-- 操作按钮 -->
      <el-card class="box-card" shadow="hover">
        <div class="form-buttons">
          <el-button type="primary" @click="submitForm" v-if="!formDisabled">
            创建
          </el-button>
          <el-button @click="cancel"> 取消 </el-button>
        </div>
      </el-card>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref, toRefs, computed, watch, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import fileUpload from "@/views/components/upload/fileUpload.vue";
const route = useRoute();
const router = useRouter();
const formDisabled = computed(() => route.query.mode === "view");

onMounted(() => {
  if (route.query.mode === "edit" || route.query.mode === "view") {
    // 添加initData函数，如果不存在的话
    initData();
  }
});

// 表单引用
const formRef = ref();
const options = [
  { label: "型号1", value: "model1" },
  { label: "型号2", value: "model2" },
  { label: "型号3", value: "model3" }
];
// 表单数据
const formData = reactive({
  name: "",
  model: "",
  brand: "",
  serialNumber: "",
  purchaseDate: "",
  status: "",
  manager: "",
  location: "",
  price: ""
});

// 表单验证规则
const rules = {
  name: [{ required: true, message: "请输入仪器名称", trigger: "blur" }],
  model: [{ required: true, message: "请输入型号", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "change" }]
};

// 提交表单
const submitForm = async () => {
  try {
    await formRef.value.validate();
    console.log("表单数据:", formData);
    ElMessage.success("提交成功");
  } catch (error) {
    console.log("验证失败:", error);
    ElMessage.error("请检查表单数据");
  }
};
// 处理文件变化
const handleFileChange = annex => {
  this.formData.annex = annex;
};
// 重置表单
const cancel = () => {
  router.push("/instrumentManage/list");
};

// 初始化数据函数 - 用于编辑和查看模式
const initData = () => {
  // 这里应该从API获取数据并填充表单
  // 示例数据
  if (route.query.mode === "edit" || route.query.mode === "view") {
    // 模拟获取数据
    setTimeout(() => {
      Object.assign(formData, {
        name: "示例仪器",
        model: "X-model-100",
        brand: "示例品牌",
        serialNumber: "SN-123456",
        purchaseDate: new Date(),
        status: "normal",
        manager: "张三",
        location: "实验室A-001",
        price: "50000"
      });
    }, 500);
  }
};
</script>

<style lang="scss" scoped>
:deep(.el-form-item__label) {
  justify-content: flex-start;
}
:deep(.el-form-item) {
  flex-direction: column;
}
.form-container {
  .box-card {
    width: 100%;
    margin-bottom: 10px;
    .card-title {
      font-weight: bold;
      color: #303133;
      font-size: 16px;
    }

    .form-buttons {
      text-align: right;
      float: right;
      .el-button {
        margin-right: 10px;
      }
    }
  }
}
</style>
