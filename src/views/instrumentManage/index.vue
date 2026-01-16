<template>
  <div class="main">
    <el-card shadow="never">
      <el-form :model="filterForm" label-width="80px" inline>
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="仪器编号">
              <el-input
                v-model="filterForm.number"
                placeholder="请输入仪器编号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="仪器名称">
              <el-input
                v-model="filterForm.name"
                placeholder="请输入仪器名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="所属楼层">
              <el-select
                style="width: 240px"
                v-model="filterForm.floor"
                placeholder="请选择所属楼层"
                clearable
              >
                <el-option label="启用" value="1" />
                <el-option label="禁用" value="0" />
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
                style="width: 240px"
                v-model="filterForm.area"
                placeholder="请选择所属区域"
                clearable
              >
                <el-option label="启用" value="1" />
                <el-option label="禁用" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="创建时间">
              <el-date-picker
                style="width: 240px"
                v-model="filterForm.operatingTime"
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
                style="width: 240px"
                v-model="filterForm.status"
                placeholder="请选择状态"
                clearable
              >
                <el-option label="启用" value="1" />
                <el-option label="禁用" value="0" />
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
        <el-button type="info" @click="handleAdd" color="#F7F8FA"
          >批量导入</el-button
        >
        <el-button
          :icon="Download"
          type="info"
          @click="handleAdd"
          style="float: right"
          color="#F7F8FA"
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
            :initial-index="index"
            fit="cover"
          />
        </template>
        <template #action="{ row }">
          <el-button type="text" size="small" @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="handleRecord(row)"
            >记录</el-button
          >
          <el-button
            type="text"
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
import AppointmentCalendarModal from "./AppointmentCalendarModal.vue";
const router = useRouter();

const filterForm = reactive({
  name: "",
  status: ""
});
const tableHeight = ref("500px");

const tableData = ref([
  {
    id: 1,
    number: "SYD001",
    name: "质构仪",
    image: "https://pure-admin.github.io/pure-admin-table/imgs/1.jpg",
    floor: "1层",
    area: "表征检测区",
    quantity: 3,
    createTime: "2025-02-28 10:30",
    status: "1"
  },
  {
    id: 2,
    number: "SYD002",
    name: "离心机",
    image: "https://pure-admin.github.io/pure-admin-table/imgs/2.jpg",
    floor: "2层",
    area: "表征检测区",
    quantity: 1,
    createTime: "2025-02-28 10:30",
    status: "1"
  },
  {
    id: 3,
    number: "SYD003",
    name: "多光谱仪",
    image: "https://pure-admin.github.io/pure-admin-table/imgs/3.jpg",
    floor: "3层",
    area: "表征检测区",
    quantity: 1,
    createTime: "2025-02-28 10:30",
    status: "1"
  },
  {
    id: 4,
    number: "SYD004",
    name: "质构仪",
    image: "https://pure-admin.github.io/pure-admin-table/imgs/4.jpg",
    floor: "1层",
    area: "表征检测区",
    quantity: 1,
    createTime: "2025-02-28 10:30",
    status: "1"
  },
  {
    id: 5,
    number: "SYD005",
    name: "质构仪",
    image: "https://pure-admin.github.io/pure-admin-table/imgs/5.jpg",
    floor: "1层",
    area: "表征检测区",
    quantity: 1,
    createTime: "2025-02-28 10:30",
    status: "1"
  },
  {
    id: 6,
    number: "SYD006",
    name: "质构仪",
    image: "https://pure-admin.github.io/pure-admin-table/imgs/6.jpg",
    floor: "1层",
    area: "表征检测区",
    quantity: 1,
    createTime: "2025-02-28 10:30",
    status: "1"
  },
  {
    id: 7,
    number: "SYD007",
    name: "质构仪",
    image: "https://via.placeholder.com/32x32?text=图标7",
    floor: "1层",
    area: "表征检测区",
    quantity: 1,
    createTime: "2025-02-28 10:30",
    status: "1"
  },
  {
    id: 8,
    number: "SYD008",
    name: "质构仪",
    image: "https://via.placeholder.com/32x32?text=图标8",
    floor: "1层",
    area: "表征检测区",
    quantity: 1,
    createTime: "2025-02-28 10:30",
    status: "1"
  },
  {
    id: 9,
    number: "SYD009",
    name: "质构仪",
    image: "https://via.placeholder.com/32x32?text=图标9",
    floor: "1层",
    area: "表征检测区",
    quantity: 1,
    createTime: "2025-02-28 10:30",
    status: "1"
  },
  {
    id: 10,
    number: "SYD0010",
    name: "质构仪",
    image: "https://via.placeholder.com/32x32?text=图标10",
    floor: "1层",
    area: "表征检测区",
    quantity: 1,
    createTime: "2025-02-28 10:30",
    status: "1"
  }
]);
const columns = [
  {
    label: "仪器编号",
    prop: "number"
  },
  {
    label: "仪器名称",
    prop: "name"
  },
  {
    label: "缩略图",
    prop: "image",
    width: 120,
    slot: "image"
  },
  {
    label: "所属楼层",
    prop: "floor"
  },
  {
    label: "所属区域",
    prop: "area"
  },
  {
    label: "数量",
    prop: "quantity"
  },
  {
    label: "创建时间",
    prop: "createTime"
  },
  {
    label: "状态",
    prop: "status",
    formatter: (row, column, cellValue) => {
      return cellValue === "1" ? "启用" : "禁用";
    }
  },
  {
    label: "操作",
    width: 200,
    slot: "action"
  }
];

const handleTimeChange = () => {
  filterForm.startTime = dayjs(filterForm.operatingTime[0]).format(
    "YYYY-MM-DD HH:mm:ss"
  );
  filterForm.endTime = dayjs(filterForm.operatingTime[1]).format(
    "YYYY-MM-DD HH:mm:ss"
  );
  delete filterForm.operatingTime;
};

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 10
});
const modalMode = ref("view"); // view, add, edit
const currentRow = ref(null);

const handleSearch = () => {
  pagination.currentPage = 1;
  getTableData();
};

const handleReset = () => {
  Object.keys(filterForm).forEach(key => {
    filterForm[key] = ""; // 其他字段置空
  });
  handleSearch();
};
const getTableData = () => {};
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
    query: { mode: modalMode.value }
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
      // 调用删除接口
      ElMessage.success("删除成功");
      getTableData();
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
</script>

<style scoped>
.control {
  margin-bottom: 10px;
}
.mt-4 {
  margin-top: 1rem;
}

.pagination {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
}
</style>
