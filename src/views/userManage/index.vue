<template>
  <div class="main">
    <el-card shadow="never">
      <el-form :model="filterForm" label-width="80px" inline>
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="用户账号">
              <el-input
                v-model="filterForm.account"
                style="width: 240px"
                placeholder="请输入用户账号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="用户名称">
              <el-input
                v-model="filterForm.real_name"
                style="width: 240px"
                placeholder="请输入用户名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="用户类型">
              <el-select
                v-model="filterForm.user_type"
                style="width: 240px"
                placeholder="请选择用户类型"
                clearable
              >
                <el-option label="内部用户" value="INTERNAL" />
                <el-option label="外部用户" value="EXTERNAL" />
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
            <el-form-item label="手机号">
              <el-input
                v-model="filterForm.phone"
                style="width: 240px"
                placeholder="请输入手机号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="创建时间">
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
        <el-button
          v-if="userInfo.account === 'admin123'"
          type="primary"
          @click="handleAdd"
          >新增</el-button
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
        <template #trainingStatus="{ row }">
          <el-select v-model="row.trainingStatus" placeholder="">
            <el-option
              v-for="item in trainingStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
        <template #action="{ row }">
          <el-button
            v-if="userInfo.account === 'admin123'"
            type="primary"
            link
            @click="handleView(row, 'edit')"
            >编辑</el-button
          >
          <!-- <el-button type="primary" link @click="handlePop(row)"
            >额度</el-button
          > -->
          <el-button
            v-if="userInfo.account === 'admin123'"
            type="primary"
            link
            style="color: red"
            @click="handleDelete(row)"
            >删除</el-button
          >
        </template>
        <template #identity_status>
          <el-tag type="success">已通过</el-tag>
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

    <QuotaConfigDialog
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
import { getUserList, deleteUser } from "@/api/user";
import QuotaConfigDialog from "./components/QuotaConfigDialog.vue";
import dayjs from "dayjs";
const router = useRouter();

// 筛选表单字段映射为接口参数
const filterForm = reactive({
  account: "",
  real_name: "",
  user_type: "",
  identity_status: "",
  operatingTime: [],
  startTime: "", // 创建时间开始
  endTime: "" // 创建时间结束
});
const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const trainingStatusOptions = [
  { label: "未培训", value: "not_trained" },
  { label: "通过", value: "passed" },
  { label: "未通过", value: "failed" }
];

const columns = [
  { label: "账号", prop: "account" },
  { label: "用户名称", prop: "real_name" },
  { label: "手机号", prop: "mobile" },
  {
    label: "用户类型",
    prop: "user_type",
    formatter: (row, column, cellValue) => {
      return cellValue === "INTERNAL"
        ? "内部用户"
        : cellValue === "EXTERNAL"
          ? "外部用户"
          : "--";
    }
  },
  {
    label: "审核状态",
    prop: "identity_status",
    slot: "identity_status"
  },
  {
    label: "启用状态",
    prop: "status",
    formatter: (row, column, cellValue) => {
      return cellValue === "ENABLE"
        ? "已启用"
        : cellValue === "DISABLE"
          ? "已禁用"
          : "未知状态";
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
    label: "培训情况",
    width: 200,
    slot: "trainingStatus"
  },
  { label: "操作", width: 160, slot: "action" }
];

const tableData = ref([
  {
    id: "10",
    account: "zhangsan",
    real_name: "张三",
    mobile: "13800138000",
    user_type: "INTERNAL",
    student_no: "2021018221",
    identity_status: "PENDING",
    create_time: "2025-11-01T10:00:00Z"
  }
]);

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

const modalMode = ref("view"); // view, add, edit
const currentRow = ref(null);
const quotaConfigDialogRef = ref(null);

// 时间范围变化处理
const handleTimeChange = () => {
  if (filterForm.operatingTime && filterForm.operatingTime.length === 2) {
    filterForm.startTime = filterForm.operatingTime[0];
    filterForm.endTime = filterForm.operatingTime[1];
  }
};

// 查询
const handleSearch = () => {
  pagination.currentPage = 1;
  getTableData();
};

// 重置
const handleReset = () => {
  Object.keys(filterForm).forEach(key => {
    if (key !== "operatingTime") {
      filterForm[key] = "";
    } else {
      filterForm[key] = [];
    }
  });
  handleSearch();
};

// 获取数据
const getTableData = () => {
  const params = {
    page: pagination.currentPage,
    page_size: pagination.pageSize,
    account: filterForm.account || undefined,
    real_name: filterForm.real_name || undefined,
    user_type: filterForm.user_type || undefined,
    identity_status: "APPROVED",
    start_time: filterForm.startTime || undefined,
    end_time: filterForm.endTime || undefined
  };

  getUserList(params).then(res => {
    tableData.value = res.content.list;
    pagination.total = res.content.total;
  });
};

// 新增
const handleAdd = () => {
  currentRow.value = null;
  modalMode.value = "add";
  router.push({
    path: "/userManage/userInfoForm",
    query: { mode: modalMode.value }
  });
};

// 编辑
const handleView = (row, flag) => {
  currentRow.value = { ...row };
  modalMode.value = flag;
  router.push({
    path: "/userManage/userInfoForm",
    query: {
      mode: modalMode.value,
      rowData: JSON.stringify(row),
      id: row.id
    }
  });
};

// 额度弹窗
const handlePop = row => {
  currentRow.value = row;
  nextTick(() => {
    if (quotaConfigDialogRef.value) {
      quotaConfigDialogRef.value.open();
    }
  });
};

// 额度确认
const handleQuotaConfirm = data => {
  console.log("提交的额度数据:", data);
  ElMessage.success("额度配置已保存");
};

// 删除
const handleDelete = row => {
  ElMessageBox.confirm("确认删除该条数据?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      deleteUser({ user_id: row.id }).then(() => {
        ElMessage.success("删除成功");
        getTableData();
      });
    })
    .catch(() => {});
};

// 分页大小变更
const handleSizeChange = val => {
  pagination.pageSize = val;
  getTableData();
};

// 当前页变更
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
