<template>
  <div class="main">
    <el-card shadow="never">
      <el-form :model="filterForm" label-width="80px" inline>
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="预约编号">
              <el-input
                v-model="filterForm.number"
                placeholder="请输入预约编号"
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
            <el-form-item label="预约人">
              <el-input v-model="filterForm.name" placeholder="请输入预约人" />
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
            <el-form-item label="类型">
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
import { ElMessage, ElMessageBox } from "element-plus";
import { Download } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

const router = useRouter();

const filterForm = reactive({
  name: "",
  status: ""
});
const tableHeight = ref("500px");

// 修改后的表头列定义
const columns = [
  {
    label: "预约订单编号",
    prop: "number"
  },
  {
    label: "仪器名称",
    prop: "name"
  },
  {
    label: "结束时间",
    prop: "endTime"
  },
  {
    label: "下单时间",
    prop: "orderTime"
  },
  {
    label: "支付方式",
    prop: "paymentMethod"
  },
  {
    label: "状态",
    prop: "status"
  },
  {
    label: "预约人",
    prop: "booker"
  },
  {
    label: "学号",
    prop: "studentId"
  },
  {
    label: "操作",
    width: 120,
    slot: "action"
  }
];

// 修改后的表格数据
const tableData = ref([
  {
    id: 1,
    number: "7472629120361920173",
    name: "质构仪",
    endTime: "2025-02-28 10:30",
    orderTime: "2025-02-28 10:30",
    paymentMethod: "项目组",
    status: "进行中",
    booker: "Amanda",
    studentId: "202434312"
  },
  {
    id: 2,
    number: "7472629120361920173",
    name: "离心机",
    endTime: "2025-02-28 10:30",
    orderTime: "2025-02-28 10:30",
    paymentMethod: "项目组",
    status: "未开始",
    booker: "Amanda",
    studentId: "202434312"
  },
  {
    id: 3,
    number: "7472629120361920173",
    name: "多光谱仪",
    endTime: "2025-02-28 10:30",
    orderTime: "2025-02-28 10:30",
    paymentMethod: "项目组",
    status: "未开始",
    booker: "Amanda",
    studentId: "202434312"
  },
  {
    id: 4,
    number: "7472629120361920173",
    name: "质构仪",
    endTime: "2025-02-28 10:30",
    orderTime: "2025-02-28 10:30",
    paymentMethod: "项目组",
    status: "未开始",
    booker: "Amanda",
    studentId: "202434312"
  },
  {
    id: 5,
    number: "7472629120361920173",
    name: "质构仪",
    endTime: "2025-02-28 10:30",
    orderTime: "2025-02-28 10:30",
    paymentMethod: "项目组",
    status: "已取消",
    booker: "Amanda",
    studentId: "202434312"
  },
  {
    id: 6,
    number: "7472629120361920173",
    name: "质构仪",
    endTime: "2025-02-28 10:30",
    orderTime: "2025-02-28 10:30",
    paymentMethod: "项目组",
    status: "已完成",
    booker: "Amanda",
    studentId: "202434312"
  },
  {
    id: 7,
    number: "7472629120361920173",
    name: "质构仪",
    endTime: "2025-02-28 10:30",
    orderTime: "2025-02-28 10:30",
    paymentMethod: "项目组",
    status: "已完成",
    booker: "Amanda",
    studentId: "202434312"
  },
  {
    id: 8,
    number: "7472629120361920173",
    name: "质构仪",
    endTime: "2025-02-28 10:30",
    orderTime: "2025-02-28 10:30",
    paymentMethod: "项目组",
    status: "已完成",
    booker: "Amanda",
    studentId: "202434312"
  },
  {
    id: 9,
    number: "7472629120361920173",
    name: "质构仪",
    endTime: "2025-02-28 10:30",
    orderTime: "2025-02-28 10:30",
    paymentMethod: "项目组",
    status: "已完成",
    booker: "Amanda",
    studentId: "202434312"
  },
  {
    id: 10,
    number: "7472629120361920173",
    name: "质构仪",
    endTime: "2025-02-28 10:30",
    orderTime: "2025-02-28 10:30",
    paymentMethod: "项目组",
    status: "已完成",
    booker: "Amanda",
    studentId: "202434312"
  }
]);

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
