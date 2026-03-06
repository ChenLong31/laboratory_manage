<template>
  <div class="main">
    <el-card shadow="never">
      <el-form :model="filterForm" label-width="80px" inline>
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="预约编号">
              <el-input
                v-model="filterForm.order_no"
                style="width: 240px"
                placeholder="请输入预约编号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="仪器名称">
              <el-input
                v-model="filterForm.device_id"
                style="width: 240px"
                placeholder="请输入仪器名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="预约人">
              <el-input
                v-model="filterForm.user_id"
                style="width: 240px"
                placeholder="请输入预约人ID"
              />
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
            <el-form-item label="订单类型">
              <el-select
                v-model="filterForm.order_type"
                style="width: 240px"
                placeholder="请选择订单类型"
                clearable
              >
                <el-option label="仪器预约" value="INSTRUMENT" />
                <el-option label="培训预约" value="TRAINING" />
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
                <el-option label="未开始" value="NOT_STARTED" />
                <el-option label="进行中" value="IN_PROGRESS" />
                <el-option label="已完成" value="COMPLETED" />
                <el-option label="已取消" value="CANCELLED" />
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
        <template #action="{ row }">
          <el-button
            v-if="row.status !== 'CANCELLED'"
            type="primary"
            link
            style="color: red"
            size="small"
            @click="handleDelete(row)"
            >取消</el-button
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Download } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import { get_order_list, cancel_order } from "@/api/labDevice";

const router = useRouter();

const filterForm = reactive({
  order_no: "",
  device_id: "",
  user_id: "",
  status: "",
  order_type: "",
  operatingTime: []
});
const tableHeight = ref("500px");

// 修改后的表头列定义
const columns = [
  { label: "订单编号", prop: "order_no" },
  { label: "仪器名称", prop: "lab_device_name" },
  { label: "预约人", prop: "user_name" },
  { label: "学号", prop: "student_no" },
  {
    label: "开始时间",
    prop: "start_time",
    formatter: (row, column, cellValue) =>
      dayjs(cellValue).format("YYYY-MM-DD HH:mm:ss")
  },
  {
    label: "结束时间",
    prop: "end_time",
    formatter: (row, column, cellValue) =>
      dayjs(cellValue).format("YYYY-MM-DD HH:mm:ss")
  },
  {
    label: "下单时间",
    prop: "create_time",
    formatter: (row, column, cellValue) =>
      dayjs(cellValue).format("YYYY-MM-DD HH:mm:ss")
  },
  {
    label: "支付方式",
    prop: "payment_method",
    formatter: (row, column, cellValue) => {
      const map = { GROUP: "课题组", PERSONAL: "个人" };
      return map[cellValue] || cellValue;
    }
  },
  {
    label: "状态",
    prop: "status",
    formatter: (row, column, cellValue) => {
      const map = {
        NOT_STARTED: "未开始",
        IN_PROGRESS: "进行中",
        COMPLETED: "已完成",
        CANCELLED: "已取消"
      };
      return map[cellValue] || cellValue;
    }
  },
  { label: "操作", width: 120, slot: "action" }
];

// 修改后的表格数据
const tableData = ref([
  {
    id: "123",
    order_no: "ORD202502210001",
    order_type: "INSTRUMENT",
    device_id: "3",
    device_name: "原子力显微镜",
    lab_device_id: "LD001",
    lab_device_name: "原子力显微镜-01",
    user_id: "10",
    user_name: "张三",
    student_no: "2021018221",
    start_time: "2025-02-22T09:00:00Z",
    end_time: "2025-02-22T11:00:00Z",
    price: "30.00",
    payment_method: "GROUP",
    is_free: false,
    status: "NOT_STARTED",
    approval_status: "PENDING",
    create_time: "2025-02-21T10:00:00Z"
  }
]);

const handleTimeChange = () => {
  if (filterForm.operatingTime?.length === 2) {
    filterForm.start_date = dayjs(filterForm.operatingTime[0]).format(
      "YYYY-MM-DD"
    );
    filterForm.end_date = dayjs(filterForm.operatingTime[1]).format(
      "YYYY-MM-DD"
    );
  } else {
    filterForm.start_date = undefined;
    filterForm.end_date = undefined;
  }
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

const getTableData = () => {
  const params = {
    page: pagination.currentPage,
    page_size: pagination.pageSize,
    order_no: filterForm.order_no || undefined,
    device_id: filterForm.device_id || undefined,
    user_id: filterForm.user_id || undefined,
    status: filterForm.status || undefined,
    order_type: filterForm.order_type || undefined,
    start_date: filterForm.start_date || undefined,
    end_date: filterForm.end_date || undefined
  };
  get_order_list(params).then(res => {
    tableData.value = res?.content?.list ?? [];
    pagination.total = res?.content?.total ?? 0;
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

const handleView = row => {
  currentRow.value = { ...row };
  modalMode.value = "view";
  router.push({
    path: "/instrumentManage/infoForm",
    query: { mode: modalMode.value }
  });
};

const handleDelete = row => {
  ElMessageBox.confirm("确认取消预约?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      // 调用删除接口
      cancel_order({
        order_id: row.id
      }).then(res => {
        ElMessage.success("取消成功");
      });
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
onMounted(() => {
  getTableData();
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
