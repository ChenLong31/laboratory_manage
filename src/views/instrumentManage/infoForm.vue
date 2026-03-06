<template>
  <div class="form-container">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
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
            <el-form-item label="仪器编号" prop="device_no">
              <el-input
                v-model="formData.device_no"
                :disabled="formDisabled"
                placeholder="请输入仪器编号"
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
            <el-form-item label="所属楼层" prop="floor_id">
              <el-select
                v-model="formData.floor_id"
                placeholder="请选择所属楼层"
                :disabled="formDisabled"
              >
                <el-option
                  v-for="item in floorOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <!-- 第二行 -->
          <!-- <el-col :span="8">
            <el-form-item label="所属区域" prop="area_id">
              <el-select
                v-model="formData.area_id"
                placeholder="请选择所属区域"
                :disabled="formDisabled"
              >
                <el-option
                  v-for="item in areaOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="仪器实例数量" prop="quantity">
              <el-input-number
                v-model="formData.quantity"
                :disabled="formDisabled"
                :min="1"
                placeholder="请输入仪器实例数量"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="图片" prop="thumbnail_url">
              <fileUpload
                v-model:code="formData.thumbnail_url"
                :action="'/api/upload'"
                :max-count="1"
                :headers="{ Authorization: `Bearer ${token}` }"
                @change="handleFileChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="描述信息/使用说明"
              prop="description"
              label-width="140px"
            >
              <el-input
                v-model="formData.description"
                :disabled="formDisabled"
                placeholder="请输入描述信息/使用说明"
                type="textarea"
                :rows="5"
              />
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
            <el-form-item label="预约时间范围" prop="available_time">
              <el-time-picker
                v-model="formData.available_time"
                is-range
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                format="HH:mm"
                value-format="HH:mm"
                :disabled="formDisabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="每分钟收费" prop="price_per_min">
              <el-input
                v-model="formData.price_per_min"
                :disabled="formDisabled"
                placeholder="请输入每分钟收费"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最小预约时长(分钟)" prop="min_duration">
              <el-input-number
                v-model="formData.min_duration"
                :disabled="formDisabled"
                :min="1"
                placeholder="请输入最小预约时长"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最大提前预约天数" prop="max_advance_days">
              <el-input-number
                v-model="formData.max_advance_days"
                :disabled="formDisabled"
                :min="1"
                placeholder="请输入最大提前预约天数"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="formData.status"
                :disabled="formDisabled"
                placeholder="请选择状态"
              >
                <el-option label="空闲" value="IDLE" />
                <el-option label="使用中" value="BUSY" />
                <el-option label="维护中" value="MAINTENANCE" />
                <el-option label="故障" value="FAULT" />
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
          <el-col :span="24">
            <el-form-item label="管理员" prop="admin_user_ids">
              <el-select
                v-model="formData.admin_user_ids"
                :disabled="formDisabled"
                placeholder="请选择管理员"
                multiple
                filterable
                :loading="loading"
              >
                <el-option
                  v-for="item in userOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <!-- 操作按钮 -->
      <el-card class="box-card" shadow="hover">
        <div class="form-buttons">
          <el-button v-if="!formDisabled" type="primary" @click="submitForm">
            确认
          </el-button>
          <el-button @click="cancel"> 取消 </el-button>
        </div>
      </el-card>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import fileUpload from "@/views/components/upload/fileUpload.vue";
import {
  getDeviceDetail,
  createDevice,
  updateDevice,
  getFloorList,
  getAreaList
} from "@/api/labDevice";
import { getUserList } from "@/api/user";
import { getToken } from "@/utils/auth";

const route = useRoute();
const router = useRouter();
const formDisabled = computed(() => route.query.mode === "view");
const token = getToken();

const floorOptions = ref([]);
const areaOptions = ref([]);
const userOptions = ref([]);
const loading = ref(false);

// 表单引用
const formRef = ref();

// 表单数据
const formData = reactive({
  device_no: "",
  name: "",
  floor_id: "",
  area_id: "",
  quantity: 1,
  thumbnail_url: "",
  description: "",
  available_time: [],
  price_per_min: "",
  min_duration: 30,
  max_advance_days: 7,
  status: "IDLE",
  admin_user_ids: []
});

// 表单验证规则
const rules = {
  device_no: [{ required: true, message: "请输入仪器编号", trigger: "blur" }],
  name: [{ required: true, message: "请输入仪器名称", trigger: "blur" }],
  floor_id: [{ required: true, message: "请选择所属楼层", trigger: "change" }],
  area_id: [{ required: true, message: "请选择所属区域", trigger: "change" }],
  status: [{ required: true, message: "请选择状态", trigger: "change" }],
  admin_user_ids: [
    { required: true, message: "请选择管理员", trigger: "change" }
  ]
};

const getOptions = async () => {
  const floorRes = await getFloorList({ page: 1, page_size: 200 });
  if (floorRes.success) {
    floorOptions.value = floorRes.content.list.map(item => ({
      label: item.name,
      value: item.id
    }));
  }
  // const areaRes = await getAreaList({ page: 1, page_size: 200 });
  // if (areaRes.success) {
  //   areaOptions.value = areaRes.content.list.map(item => ({
  //     label: item.name,
  //     value: item.id
  //   }));
  // }
};

const remoteMethod = () => {
  loading.value = true;
  getUserList({
    page: 1,
    page_size: 200,
    identity_status: "APPROVED"
  }).then(res => {
    loading.value = false;
    if (res.success) {
      userOptions.value = res.content.list.map(item => ({
        label: `${item.real_name}(${item.account})`,
        value: item.id
      }));
    }
  });
};

// 初始化数据函数 - 用于编辑和查看模式
const initData = async () => {
  if (route.query.mode === "edit" || route.query.mode === "view") {
    // 获取传递过来的整行数据
    const rowData = route.query.row ? JSON.parse(route.query.row) : null;
    let deviceId = rowData?.id;

    if (deviceId) {
      const res = await getDeviceDetail({ device_id: deviceId });
      if (res.success) {
        const data = res.content;
        Object.assign(formData, {
          ...data,
          available_time: [data.available_start_time, data.available_end_time],
          admin_user_ids: data.admins.map(admin => admin.id)
        });
        console.log("formData", formData);
      }
    }
  }
};

onMounted(async () => {
  await remoteMethod();
  await getOptions();
  initData();
});

// 提交表单
const submitForm = async () => {
  try {
    await formRef.value.validate();
    const params = {
      ...formData,
      available_start_time: formData.available_time?.[0],
      available_end_time: formData.available_time?.[1]
    };
    delete params.available_time;

    let res;
    if (route.query.mode === "edit") {
      params.device_id = route.query.id; // 确保传device_id
      res = await updateDevice(params);
    } else {
      res = await createDevice(params);
    }

    if (res.success) {
      ElMessage.success("提交成功");
      router.push("/instrumentManage/list");
    } else {
      ElMessage.error("提交失败");
    }
  } catch (error) {
    console.log("验证失败:", error);
    ElMessage.error("请检查表单数据");
  }
};

// 处理文件变化
const handleFileChange = url => {
  formData.thumbnail_url = url;
};

// 重置表单
const cancel = () => {
  router.push("/instrumentManage/list");
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
      font-size: 16px;
      font-weight: bold;
      color: #303133;
    }

    .form-buttons {
      float: right;
      text-align: right;

      .el-button {
        margin-right: 10px;
      }
    }
  }
}
</style>
