<template>
  <div class="main">
    <el-card shadow="never">
      <el-form :model="filterForm" label-width="80px" inline>
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="账户名称">
              <el-input
                v-model="filterForm.number"
                placeholder="请输入账户名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="支付类型">
              <el-select
                style="width: 240px"
                v-model="filterForm.area"
                placeholder="请选择支付类型"
                clearable
              >
                <el-option label="启用" value="1" />
                <el-option label="禁用" value="0" />
              </el-select>
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
              <el-button type="primary" @click="handleSearch">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="支付时间">
              <el-date-picker
                style="width: 240px"
                v-model="filterForm.operatingTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="handleTimeChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7"></el-col>
          <el-col :span="7"> </el-col>
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
            v-if="row.status === '已完成' || row.status == '已取消'"
            type="text"
            size="small"
            @click="handleView(row)"
            >查看</el-button
          >
          <el-button
            v-else
            type="text"
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
import { dayjs, ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();

const filterForm = reactive({
  number: "",
  area: "",
  status: "",
  operatingTime: []
});

// 修改后的表头列定义 - 根据截图调整
const columns = [
  {
    label: "支付单号",
    prop: "orderNumber"
  },
  {
    label: "支付人",
    prop: "payer"
  },
  {
    label: "手机号",
    prop: "phoneNumber"
  },
  {
    label: "支付类型",
    prop: "paymentType"
  },
  {
    label: "支付时间",
    prop: "paymentTime"
  }
];

// 修改后的表格数据 - 根据截图调整
const tableData = ref([
  {
    id: 1,
    orderNumber: "7472629120361920173",
    payer: "陈晓宇",
    phoneNumber: "13888888888",
    paymentType: "课题组",
    paymentTime: "2025-02-28 10:30"
  },
  {
    id: 2,
    orderNumber: "7472629120361920173",
    payer: "陈晓宇",
    phoneNumber: "13888888888",
    paymentType: "课题组",
    paymentTime: "2025-02-28 10:30"
  },
  {
    id: 3,
    orderNumber: "7472629120361920173",
    payer: "陈晓宇",
    phoneNumber: "13888888888",
    paymentType: "个人账户",
    paymentTime: "2025-02-28 10:30"
  },
  {
    id: 4,
    orderNumber: "7472629120361920173",
    payer: "陈晓宇",
    phoneNumber: "13888888888",
    paymentType: "个人账户",
    paymentTime: "2025-02-28 10:30"
  },
  {
    id: 5,
    orderNumber: "7472629120361920173",
    payer: "陈晓宇",
    phoneNumber: "13888888888",
    paymentType: "个人用户",
    paymentTime: "2025-02-28 10:30"
  },
  {
    id: 6,
    orderNumber: "7472629120361920173",
    payer: "陈晓宇",
    phoneNumber: "13888888888",
    paymentType: "个人账户",
    paymentTime: "2025-02-28 10:30"
  },
  {
    id: 7,
    orderNumber: "7472629120361920173",
    payer: "陈晓宇",
    phoneNumber: "13888888888",
    paymentType: "个人账户",
    paymentTime: "2025-02-28 10:30"
  },
  {
    id: 8,
    orderNumber: "7472629120361920173",
    payer: "陈晓宇",
    phoneNumber: "13888888888",
    paymentType: "个人账户",
    paymentTime: "2025-02-28 10:30"
  },
  {
    id: 9,
    orderNumber: "7472629120361920173",
    payer: "陈晓宇",
    phoneNumber: "13888888888",
    paymentType: "个人账户",
    paymentTime: "2025-02-28 10:30"
  },
  {
    id: 10,
    orderNumber: "7472629120361920173",
    payer: "陈晓宇",
    phoneNumber: "13888888888",
    paymentType: "个人账户",
    paymentTime: "2025-02-28 10:30"
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
  filterForm.startTime = dayjs(filterForm.operatingTime[0]).format(
    "YYYY-MM-DD HH:mm:ss"
  );
  filterForm.endTime = dayjs(filterForm.operatingTime[1]).format(
    "YYYY-MM-DD HH:mm:ss"
  );
  delete filterForm.operatingTime;
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
