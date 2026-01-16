<template>
  <div class="main">
    <el-card shadow="never">
      <el-form :model="filterForm" label-width="80px" inline>
        <el-form-item label="名称">
          <el-input v-model="filterForm.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            style="width: 200px"
            v-model="filterForm.status"
            placeholder="请选择状态"
            clearable
          >
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" class="mt-4">
      <div class="control">
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </div>
      <el-table :data="tableData" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === '1' ? 'success' : 'danger'">
              {{ scope.row.status === "1" ? "启用" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" link @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button type="primary" link @click="handleView(scope.row)"
              >查看</el-button
            >
            <el-button type="danger" link @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

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

    <FightingModal
      v-model:visible="modalVisible"
      :mode="modalMode"
      :data="currentRow"
      @success="handleModalSuccess"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import FightingModal from "./components/FightingModal.vue";

const filterForm = reactive({
  name: "",
  status: ""
});

const tableData = ref([
  {
    id: 1,
    name: "测试数据1",
    status: "1",
    createTime: "2023-01-01"
  },
  {
    id: 2,
    name: "测试数据2",
    status: "0",
    createTime: "2023-01-02"
  }
]);

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

const modalVisible = ref(false);
const modalMode = ref("view"); // view, add, edit
const currentRow = ref(null);

const handleSearch = () => {
  pagination.currentPage = 1;
  getTableData();
};

const handleReset = () => {
  filterForm.name = "";
  filterForm.status = "";
  handleSearch();
};
const getTableData = () => { 
};
const handleAdd = () => {
  currentRow.value = null;
  modalMode.value = "add";
  modalVisible.value = true;
};

const handleEdit = row => {
  currentRow.value = { ...row };
  modalMode.value = "edit";
  modalVisible.value = true;
};

const handleView = row => {
  currentRow.value = { ...row };
  modalMode.value = "view";
  modalVisible.value = true;
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

const handleModalSuccess = () => {
  modalVisible.value = false;
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
