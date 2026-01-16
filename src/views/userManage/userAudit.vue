<template>
  <div class="main">
    <el-card shadow="never">
      <el-form :model="filterForm" label-width="80px" inline>
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="用户账号">
              <el-input
                v-model="filterForm.number"
                placeholder="请输入用户账号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="用户名称">
              <el-select
                style="width: 240px"
                v-model="filterForm.area"
                placeholder="请选择用户名称"
                clearable
              >
                <el-option label="启用" value="1" />
                <el-option label="禁用" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="用户类型">
              <el-select
                style="width: 240px"
                v-model="filterForm.status"
                placeholder="请选择用户类型"
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
            <el-form-item label="手机号">
              <el-input
                v-model="filterForm.phone"
                placeholder="请输入用户账号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="注册时间">
              <el-date-picker
                style="width: 240px"
                v-model="filterForm.operatingTime"
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
            <el-form-item label="状态">
              <el-select
                style="width: 240px"
                v-model="filterForm.status"
                placeholder="请选择状态"
                clearable
              >
                <el-option label="已审核" value="1" />
                <el-option label="待审核" value="0" />
                <el-option label="驳回" value="2" />
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
        <!-- <el-button type="primary" @click="handleAdd">新增</el-button> -->
        <!-- <el-button type="info" @click="handleAdd" color="#F7F8FA"
          >批量导入</el-button
        > -->
        <el-button
          :icon="Download"
          type="info"
          @click="handleAdd"
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
        <template #status="{ row }">
          <el-tag v-if="row.auditStatus === '1'" type="success" size="small">
            已审核
          </el-tag>
          <el-tag
            v-else-if="row.auditStatus === '0'"
            type="warning"
            size="small"
          >
            待审核
          </el-tag>
          <el-tag
            v-else-if="row.auditStatus === '2'"
            type="danger"
            size="small"
          >
            驳回
          </el-tag>
          <el-tag v-else type="info" size="small">
            {{ row.auditStatus }}
          </el-tag>
        </template>
        <template #action="{ row }">
          <el-button type="text" @click="handlePop(row)">审核</el-button>
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
      ref="quotaConfigDialogRef"
      :id="currentRow?.id"
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
const router = useRouter();

const filterForm = reactive({
  number: "",
  area: "",
  status: "",
  operatingTime: []
});

const columns = [
  {
    label: "账号",
    prop: "accountName"
  },
  {
    label: "用户名称",
    prop: "owner"
  },
  {
    label: "老师姓名",
    prop: "teacherName"
  },
  {
    label: "手机号",
    prop: "phoneNumber"
  },
  {
    label: "用户类型",
    prop: "userType"
  },
  {
    label: "状态",
    prop: "auditStatus",
    slot: "status"
  },
  {
    label: "注册时间",
    prop: "registerTime"
  },

  {
    label: "操作",
    width: 160,
    slot: "action"
  }
];

const tableData = ref([
  {
    id: 1,
    accountName: "admin",
    owner: "陈晓宇",
    teacherName: "李老师",
    phoneNumber: "13888888888",
    userType: "超级管理员",
    auditStatus: "1", // 已审核
    registerTime: "2025-02-28 10:30"
  },
  {
    id: 2,
    accountName: "user1",
    owner: "陈晓宇",
    teacherName: "王老师",
    phoneNumber: "13888888888",
    userType: "仪器管理员",
    auditStatus: "0", // 待审核
    registerTime: "2025-02-28 10:30"
  },
  {
    id: 3,
    accountName: "user1",
    owner: "陈晓宇",
    teacherName: "张老师",
    phoneNumber: "13888888888",
    userType: "教师",
    auditStatus: "2", // 驳回
    registerTime: "2025-02-28 10:30"
  },
  {
    id: 4,
    accountName: "user1",
    owner: "陈晓宇",
    teacherName: "刘老师",
    phoneNumber: "13888888888",
    userType: "学生",
    auditStatus: "1", // 已审核
    registerTime: "2025-02-28 10:30"
  },
  {
    id: 5,
    accountName: "user1",
    owner: "陈晓宇",
    teacherName: "赵老师",
    phoneNumber: "13888888888",
    userType: "校外",
    auditStatus: "0", // 待审核
    registerTime: "2025-02-28 10:30"
  }
]);

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 10
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
  console.log("filterForm", filterForm);
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
      quotaConfigDialogRef.value.open();
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
