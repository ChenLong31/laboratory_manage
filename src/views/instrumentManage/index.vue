<template>
  <div class="main">
    <el-card shadow="never">
      <el-form :model="filterForm" label-width="80px" inline>
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="仪器编号">
              <el-input
                v-model="filterForm.number"
                style="width: 240px"
                placeholder="请输入仪器编号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="仪器名称">
              <el-input
                v-model="filterForm.name"
                style="width: 240px"
                placeholder="请输入仪器名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="所属楼层">
              <el-select
                v-model="filterForm.floor_id"
                style="width: 240px"
                placeholder="请选择所属楼层"
                clearable
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
          <el-col :span="3">
            <el-form-item>
              <el-button type="primary" @click="handleSearch">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="所属区域">
              <el-select
                v-model="filterForm.area_id"
                style="width: 240px"
                placeholder="请选择所属区域"
                clearable
              >
                <el-option
                  v-for="item in areaOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="创建时间">
              <el-date-picker
                v-model="filterForm.operatingTime"
                style="width: 240px"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="handleTimeChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="状态">
              <el-select
                v-model="filterForm.status"
                style="width: 240px"
                placeholder="请选择状态"
                clearable
              >
                <el-option label="空闲" value="IDLE" />
                <el-option label="使用中" value="BUSY" />
                <el-option label="维护中" value="MAINTENANCE" />
                <el-option label="故障" value="FAULT" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="never" class="mt-4">
      <div class="control">
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button type="info" color="#F7F8FA" @click="handleAdd"
          >批量导入</el-button
        >
        <el-button
          :icon="Download"
          type="info"
          style="float: right"
          color="#F7F8FA"
          @click="handleAdd"
          >下载</el-button
        >
      </div>
      <pure-table
        :data="tableData"
        :columns="columns"
        stripe
        adaptive
        :adaptiveConfig="{ offsetBottom: 108 }"
        align-whole="center"
        :header-cell-style="{
          backgroundColor: '#f0f9ff',
          color: '#333',
          fontWeight: 'bold'
        }"
      >
        <template #image="{ row }">
          <el-image
            preview-teleported
            loading="lazy"
            :src="row.image"
            :preview-src-list="tableData.map(v => v.image)"
            fit="cover"
          />
        </template>
        <template #action="{ row }">
          <el-button type="primary" link size="small" @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-button type="primary" link size="small" @click="handleRecord(row)"
            >记录</el-button
          >
          <el-button
            type="primary"
            link
            style="color: red"
            size="small"
            @click="handleDelete(row)"
            >删除</el-button
          >
        </template>
      </pure-table>
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <AppointmentCalendarModal
      ref="calendarModalRef"
      :instrument-id="selectedInstrumentId"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Download } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import {
  getDeviceList,
  getFloorList,
  getAreaList,
  deleteDevice
} from "@/api/labDevice";
import AppointmentCalendarModal from "./AppointmentCalendarModal.vue";
import dayjs from "dayjs";
const router = useRouter();

const filterForm = reactive({
  device_no: "",
  name: "",
  floor_id: "",
  area_id: "",
  status: "",
  operatingTime: []
});
const tableHeight = ref("500px");

const floorOptions = ref([]);
const areaOptions = ref([]);

const tableData = ref([
  {
    id: "1",
    device_no: "AFM001",
    name: "原子力显微镜",
    floor_id: "1",
    floor_name: "1楼",
    area_id: "1",
    area_name: "北区",
    quantity: 2,
    instance_count: 2,
    thumbnail_url: "https://example.com/thumb.jpg",
    description: "高精度原子力显微镜",
    available_start_time: "08:00",
    available_end_time: "18:00",
    price_per_min: "5.00",
    min_duration: 30,
    max_advance_days: 7,
    status: "IDLE",
    create_time: "2025-01-01T08:00:00Z"
  }
]);
const columns = [
  {
    label: "仪器编号",
    prop: "device_no"
  },
  {
    label: "仪器名称",
    prop: "name"
  },
  {
    label: "所属楼层",
    prop: "floor_name"
  },
  {
    label: "所属区域",
    prop: "area_name"
  },
  {
    label: "状态",
    prop: "status",
    formatter: (row, column, cellValue) => {
      const map = {
        IDLE: "空闲",
        BUSY: "使用中",
        MAINTENANCE: "维护中",
        FAULT: "故障"
      };
      return map[cellValue] || cellValue;
    }
  },
  {
    label: "创建时间",
    prop: "create_time",
    formatter: (row, column, cellValue) => {
      return dayjs(cellValue).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  {
    label: "操作",
    width: 200,
    slot: "action"
  }
];

const handleTimeChange = () => {
  if (filterForm.operatingTime && filterForm.operatingTime.length === 2) {
    filterForm.create_time_start = dayjs(filterForm.operatingTime[0]).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    filterForm.create_time_end = dayjs(filterForm.operatingTime[1]).format(
      "YYYY-MM-DD HH:mm:ss"
    );
  } else {
    filterForm.create_time_start = undefined;
    filterForm.create_time_end = undefined;
  }
};

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});
const modalMode = ref("view"); // view, add, edit
const currentRow = ref(null);

const handleSearch = () => {
  pagination.currentPage = 1;
  getTableData();
};

const handleReset = () => {
  Object.keys(filterForm).forEach(key => {
    if (key === "operatingTime") {
      filterForm[key] = [];
    } else {
      filterForm[key] = "";
    }
  });
  handleSearch();
};
const getTableData = () => {
  const params = {
    page: pagination.currentPage,
    page_size: pagination.pageSize,
    device_no: filterForm.device_no || undefined,
    name: filterForm.name || undefined,
    floor_id: filterForm.floor_id || undefined,
    area_id: filterForm.area_id || undefined,
    status: filterForm.status || undefined,
    create_time_start: filterForm.create_time_start || undefined,
    create_time_end: filterForm.create_time_end || undefined
  };
  getDeviceList(params).then(res => {
    tableData.value = res.content.list;
    pagination.total = res.content.total;
  });
};

const getFloorData = () => {
  getFloorList({ page: 1, page_size: 200 }).then(res => {
    floorOptions.value = res.content.list.map(item => ({
      label: item.name,
      value: item.id
    }));
  });
};

const getAreaData = () => {
  getAreaList({ page: 1, page_size: 200 }).then(res => {
    areaOptions.value = res.content.list.map(item => ({
      label: item.name,
      value: item.id
    }));
  });
};
const handleAdd = () => {
  currentRow.value = null;
  modalMode.value = "add";
  router.push({
    path: "/instrumentManage/infoForm",
    query: { mode: modalMode.value }
  });
};

const handleEdit = row => {
  currentRow.value = { ...row };
  modalMode.value = "edit";
  router.push({
    path: "/instrumentManage/infoForm",
    query: { mode: modalMode.value, id: row.id, row: JSON.stringify(row) }
  });
};
// 添加新的响应式变量
const calendarModalRef = ref(null);
const selectedInstrumentId = ref(null);
const handleRecord = row => {
  selectedInstrumentId.value = row.id;

  // 等待 DOM 更新后调用组件的 open 方法
  nextTick(() => {
    if (calendarModalRef.value) {
      calendarModalRef.value.open();
    }
  });
};

const handleDelete = row => {
  ElMessageBox.confirm("确认删除该条数据?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      deleteDevice({ device_id: row.id }).then(res => {
        if (res.success) {
          ElMessage.success("删除成功");
          getTableData();
        } else {
          ElMessage.error("删除失败");
        }
      });
    })
    .catch(() => {
      // 取消删除
    });
};

const handleSizeChange = val => {
  pagination.pageSize = val;
  getTableData();
};

const handleCurrentChange = val => {
  pagination.currentPage = val;
  getTableData();
};
onMounted(() => {
  getTableData();
  getFloorData();
  getAreaData();
});
</script>

<style scoped>
.control {
  margin-bottom: 10px;
}

.mt-4 {
  margin-top: 1rem;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}
</style>
