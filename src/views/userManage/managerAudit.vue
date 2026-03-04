<template>
  <div class="main">
    <el-card shadow="never">
      <el-form :model="filterForm" label-width="80px" inline>
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="账户名称">
              <el-input
                v-model="filterForm.account"
                placeholder="请输入账户名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="申请类型">
              <el-select
                v-model="filterForm.application_type"
                style="width: 240px"
                placeholder="全部"
                clearable
              >
                <el-option label="仪器管理员" value="DEVICE_ADMIN" />
                <el-option label="课题组管理员" value="GROUP_ADMIN" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="状态">
              <el-select
                v-model="filterForm.status"
                style="width: 240px"
                placeholder="全部"
                clearable
              >
                <el-option label="待审批" value="PENDING" />
                <el-option label="已通过" value="APPROVED" />
                <el-option label="已驳回" value="REJECTED" />
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
            <el-form-item label="申请时间">
              <el-date-picker
                v-model="filterForm.operatingTime"
                style="width: 240px"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="handleTimeChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7" />
          <el-col :span="7" />
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
        <template #status="{ row }">
          <el-tag v-if="row.status === 'APPROVED'" type="success" size="small">
            已通过
          </el-tag>
          <el-tag
            v-else-if="row.status === 'PENDING'"
            type="warning"
            size="small"
          >
            待审批
          </el-tag>
          <el-tag
            v-else-if="row.status === 'REJECTED'"
            type="danger"
            size="small"
          >
            已驳回
          </el-tag>
          <el-tag v-else type="info" size="small">
            {{ row.status }}
          </el-tag>
        </template>
        <template #action="{ row }">
          <el-button
            v-if="row.status === 'PENDING'"
            type="primary"
            link
            @click="handlePop(row)"
            >审批</el-button
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

    <managerAuditDia
      :id="currentRow?.id"
      ref="quotaConfigDialogRef"
      @confirm="handleQuotaConfirm"
      @close="quotaDialogVisible = false"
    />
  </div>
</template>

<script setup>
import { Download } from "@element-plus/icons-vue";
import { ref, reactive, onMounted, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import managerAuditDia from "./components/managerAuditDia.vue";
import { getApplicationList } from "@/api/user";
import dayjs from "dayjs";
const router = useRouter();

const filterForm = reactive({
  account: "",
  real_name: "",
  application_type: "",
  status: "",
  operatingTime: []
});

const columns = [
  { label: "账号", prop: "user_account" },
  { label: "申请人", prop: "user_name" },
  {
    label: "管理员类型",
    prop: "application_type",
    formatter: row =>
      row.application_type === "DEVICE_ADMIN"
        ? "仪器管理员"
        : row.application_type === "GROUP_ADMIN"
          ? "课题组管理员"
          : row.application_type
  },
  { label: "仪器/课题组名称", prop: "target_name" },
  {
    label: "申请时间",
    prop: "submit_time",
    formatter: (row, column, cellValue) => {
      return dayjs(cellValue).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  { label: "状态", prop: "status", slot: "status" },
  { label: "操作", width: 160, slot: "action" }
];

const tableData = ref([
  {
    id: "5",
    user_id: "10",
    user_account: "zhangsan",
    user_name: "张三",
    application_type: "DEVICE_ADMIN",
    target_name: "原子力显微镜",
    target_id: "3",
    status: "PENDING",
    submit_time: "2025-11-10T14:00:00Z",
    approval_time: null
  }
]);

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 8
});

const modalMode = ref("view"); // view, add, edit
const currentRow = ref(null);

const handleTimeChange = () => {
  if (filterForm.operatingTime && filterForm.operatingTime.length === 2) {
    filterForm.startTime = filterForm.operatingTime[0];
    filterForm.endTime = filterForm.operatingTime[1];
  }
};

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
    account: filterForm.account,
    real_name: filterForm.real_name,
    application_type: filterForm.application_type,
    status: filterForm.status
  };
  getApplicationList(params).then(res => {
    tableData.value = res?.content?.list ?? [];
    pagination.total = res?.content?.total ?? 0;
  });
};

const handleAdd = flag => {
  currentRow.value = null;
  modalMode.value = "flag";
  router.push({
    path: "/userManage/userInfoForm",
    query: { mode: modalMode.value }
  });
};

const handleView = (row, flag) => {
  currentRow.value = { ...row };
  modalMode.value = flag;
  router.push({
    path: "/userManage/userInfoForm",
    query: { mode: modalMode.value }
  });
};

const quotaConfigDialogRef = ref(null);
const handlePop = row => {
  currentRow.value = row;
  nextTick(() => {
    if (quotaConfigDialogRef.value) {
      quotaConfigDialogRef.value.open(row);
    }
  });
};

const handleQuotaConfirm = data => {
  getTableData();
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

const handleExport = () => {
  ElMessage.success("导出成功");
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
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
}
</style>
