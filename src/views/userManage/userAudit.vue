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
            <el-form-item label="注册时间">
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
          <el-col :span="7">
            <!-- <el-form-item label="身份状态">
              <el-select
                v-model="filterForm.identity_status"
                style="width: 240px"
                placeholder="请选择身份状态"
                clearable
              >
                <el-option label="待审核" value="PENDING" />
                <el-option label="已通过" value="APPROVED" />
                <el-option label="已拒绝" value="REJECTED" />
              </el-select>
            </el-form-item> -->
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
      <!-- <div class="control">
        <el-button
          :icon="Download"
          type="info"
          color="#F7F8FA"
          @click="handleAdd"
          >下载</el-button
        >
      </div> -->

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
          <el-tag
            v-if="row.identity_status === 'APPROVED'"
            type="success"
            size="small"
          >
            已审核
          </el-tag>
          <el-tag
            v-else-if="row.identity_status === 'PENDING'"
            type="warning"
            size="small"
          >
            待审核
          </el-tag>
          <el-tag
            v-else-if="row.identity_status === 'REJECTED'"
            type="danger"
            size="small"
          >
            驳回
          </el-tag>
          <el-tag v-else type="info" size="small">
            {{ row.identity_status }}
          </el-tag>
        </template>
        <template #action="{ row }">
          <el-button
            v-if="row.identity_status === 'PENDING'"
            type="primary"
            link
            @click="handlePop(row)"
            >审核</el-button
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

    <auditDia
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
import auditDia from "./components/auditDia.vue";
import { getUserList, reviewUser } from "@/api/user";
import dayjs from "dayjs";
const router = useRouter();

// 筛选表单字段映射为接口参数
const filterForm = reactive({
  account: "",
  real_name: "",
  user_type: "",
  identity_status: "",
  operatingTime: [],
  startTime: "", // 注册时间开始
  endTime: "" // 注册时间结束
});

// 表格列定义
const columns = [
  { label: "账号", prop: "account" },
  { label: "用户名称", prop: "real_name" },
  { label: "手机号", prop: "mobile" },
  { label: "用户类型", prop: "user_type" },
  { label: "学号", prop: "student_no" },
  {
    label: "身份状态",
    prop: "identity_status",
    slot: "status"
  },
  {
    label: "注册时间",
    prop: "create_time",
    formatter: (row, column, cellValue) => {
      return dayjs(cellValue).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  { label: "操作", width: 160, slot: "action" }
];

// 数据列表和分页
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
    identity_status: "PENDING" || undefined,
    start_time: filterForm.startTime || undefined,
    end_time: filterForm.endTime || undefined
  };

  getUserList(params).then(res => {
    console.log("res", res);
    if (res.success) {
      tableData.value = res.content.list;
      pagination.total = res.content.total;
    } else {
      ElMessage.error("获取数据失败");
    }
  });
};

// 下载
const handleAdd = () => {
  // 可添加导出逻辑
};

// 审核弹窗
const handlePop = row => {
  currentRow.value = row;
  nextTick(() => {
    if (quotaConfigDialogRef.value) {
      quotaConfigDialogRef.value.open(row);
    }
  });
};

// 审核确认
const handleQuotaConfirm = data => {
  const { action, user_id } = data;
  reviewUser({ user_id, action }).then(res => {
    if (res.success) {
      ElMessage.success("审核成功");
      getTableData(); // 刷新列表
    } else {
      ElMessage.error("审核失败");
    }
  });
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
