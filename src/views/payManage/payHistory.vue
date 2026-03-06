<template>
  <div class="main">
    <el-card shadow="never">
      <el-form :model="filterForm" label-width="80px" inline>
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="课题组">
              <el-select
                v-model="filterForm.target_id"
                style="width: 240px"
                placeholder="请选择课题组"
                clearable
                filterable
              >
                <el-option
                  v-for="item in groupOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="支付类型">
              <el-select
                v-model="filterForm.target_type"
                style="width: 240px"
                placeholder="请选择支付类型"
                clearable
              >
                <el-option label="课题组" value="PROJECT_GROUP" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <div style="display: flex">
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button @click="handleReset">重置</el-button>
              </div>
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
            type="primary"
            link
            size="small"
            @click="handleView(row)"
            >查看</el-button
          >
          <el-button
            v-else
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
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import { get_recharge_records, get_group_list } from "@/api/labDevice";
const router = useRouter();

const filterForm = reactive({
  target_type: "",
  target_id: ""
});
const groupOptions = ref([]);

// 修改后的表头列定义 - 根据截图调整
const columns = [
  { label: "记录ID", prop: "id" },
  { label: "目标类型", prop: "target_type" },
  { label: "目标名称", prop: "target_name" },
  { label: "充值金额", prop: "amount" },
  { label: "充值前余额", prop: "balance_before" },
  { label: "充值后余额", prop: "balance_after" },
  { label: "操作人", prop: "operator_name" },
  {
    label: "备注",
    prop: "remark"
  },
  {
    label: "支付时间",
    prop: "create_time",
    formatter: (row, column, cellValue) =>
      dayjs(cellValue).format("YYYY-MM-DD HH:mm:ss")
  }
];

const tableData = ref([
  {
    id: "1",
    target_type: "PROJECT_GROUP",
    target_id: "3",
    target_name: "生物工程学院",
    amount: "500.00",
    balance_before: "1000.00",
    balance_after: "1500.00",
    operator_id: "1",
    operator_name: "系统管理员",
    remark: "2025年度经费",
    create_time: "2025-11-15T10:30:00Z"
  }
]);

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 10
});

const modalMode = ref("view"); // view, add, edit
const currentRow = ref(null);

const handleTimeChange = () => {};

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
    target_type: filterForm.target_type || undefined,
    target_id: filterForm.target_id || undefined
  };
  get_recharge_records(params).then(res => {
    tableData.value = res?.content?.list ?? [];
    pagination.total = res?.content?.total ?? 0;
  });
};

const handleAdd = () => {};

const handleView = row => {};

const handleDelete = row => {};

const handleSizeChange = val => {
  pagination.pageSize = val;
  getTableData();
};

const handleCurrentChange = val => {
  pagination.currentPage = val;
  getTableData();
};
const getGroupOptions = () => {
  get_group_list({ page: 1, page_size: 200 }).then(res => {
    groupOptions.value = (res?.content?.list ?? []).map(i => ({
      label: i.name,
      value: i.id
    }));
  });
};
onMounted(() => {
  getTableData();
  getGroupOptions();
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
