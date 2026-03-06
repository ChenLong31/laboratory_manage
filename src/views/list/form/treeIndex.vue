<template>
  <div class="main">
    <el-row :gutter="20">
      <el-col :span="4">
        <el-card shadow="never" class="tree-card">
          <template #header>
            <div class="tree-header">
              <span>组织架构</span>
              <div>
                <el-button type="primary" link @click="handleAddTreeNode"
                  >新增</el-button
                >
              </div>
            </div>
          </template>
          <el-tree
            ref="treeRef"
            :data="treeData"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            :props="treeProps"
            @node-click="handleNodeClick"
          >
            <template #default="{ node, data }">
              <span class="custom-tree-node">
                <span>{{ node.label }}</span>
                <span>
                  <el-button
                    type="primary"
                    link
                    @click="handleEditTreeNode(data)"
                    >编辑</el-button
                  >
                  <el-button
                    type="danger"
                    link
                    @click="handleDeleteTreeNode(data)"
                    >删除</el-button
                  >
                </span>
              </span>
            </template>
          </el-tree>
        </el-card>
      </el-col>

      <el-col :span="20">
        <el-card shadow="never">
          <el-form :model="filterForm" label-width="80px" inline>
            <el-form-item label="名称">
              <el-input v-model="filterForm.name" placeholder="请输入名称" />
            </el-form-item>
            <el-form-item label="状态">
              <el-select
                v-model="filterForm.status"
                style="width: 200px"
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
      </el-col>
    </el-row>

    <FightingModal
      v-model:visible="modalVisible"
      :mode="modalMode"
      :data="currentRow"
      @success="handleModalSuccess"
    />

    <!-- 树节点操作弹窗 -->
    <el-dialog
      v-model="treeDialog.visible"
      :title="treeDialog.title"
      width="500px"
    >
      <el-form
        ref="treeFormRef"
        :model="treeDialog.formData"
        :rules="treeDialog.rules"
        label-width="80px"
      >
        <el-form-item label="节点名称" prop="label">
          <el-input
            v-model="treeDialog.formData.label"
            placeholder="请输入节点名称"
          />
        </el-form-item>
        <el-form-item label="父级节点" prop="parentId">
          <el-tree-select
            v-model="treeDialog.formData.parentId"
            :data="treeData"
            node-key="id"
            :render-after-expand="false"
            style="width: 100%"
            placeholder="请选择父级节点"
            clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="treeDialog.visible = false">取消</el-button>
          <el-button type="primary" @click="handleTreeConfirm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import FightingModal from "./components/FightingModal.vue";

const treeRef = ref();
const treeFormRef = ref();

// 树相关数据
const treeData = ref([
  {
    id: 1,
    label: "研发中心",
    children: [
      {
        id: 4,
        label: "前端组",
        children: [
          { id: 9, label: "Vue团队" },
          { id: 10, label: "React团队" }
        ]
      },
      {
        id: 5,
        label: "后端组"
      }
    ]
  },
  {
    id: 2,
    label: "测试中心",
    children: [
      {
        id: 6,
        label: "自动化测试组"
      },
      {
        id: 7,
        label: "手工测试组"
      }
    ]
  },
  {
    id: 3,
    label: "产品中心",
    children: [
      {
        id: 8,
        label: "UI/UX组"
      }
    ]
  }
]);

const treeProps = {
  children: "children",
  label: "label"
};

const treeDialog = reactive({
  visible: false,
  title: "",
  operation: "", // add, edit
  formData: {
    id: "",
    label: "",
    parentId: null
  },
  rules: {
    label: [{ required: true, message: "请输入节点名称", trigger: "blur" }]
  }
});

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

// 树操作相关方法
const handleNodeClick = data => {
  console.log("点击节点:", data);
  // 根据点击的树节点更新列表数据
  // 这里模拟更新数据
  ElMessage.info(`点击了节点: ${data.label}`);
};

const handleAddTreeNode = () => {
  treeDialog.title = "新增节点";
  treeDialog.operation = "add";
  treeDialog.formData = {
    id: "",
    label: "",
    parentId: null
  };
  treeDialog.visible = true;
};

const handleEditTreeNode = data => {
  treeDialog.title = "编辑节点";
  treeDialog.operation = "edit";
  treeDialog.formData = {
    id: data.id,
    label: data.label,
    parentId: null // 实际项目中需要根据父子关系确定
  };
  treeDialog.visible = true;
};

const handleDeleteTreeNode = data => {
  ElMessageBox.confirm(
    `确认删除节点"${data.label}"? 删除后将无法恢复。`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }
  )
    .then(() => {
      // 实际项目中调用删除接口
      ElMessage.success("删除成功");
    })
    .catch(() => {
      // 取消删除
    });
};

const handleTreeConfirm = () => {
  treeFormRef.value.validate(valid => {
    if (valid) {
      // 这里处理提交逻辑
      if (treeDialog.operation === "add") {
        ElMessage.success("新增节点成功");
      } else {
        ElMessage.success("编辑节点成功");
      }
      treeDialog.visible = false;
      // 实际项目中需要更新树数据
    }
  });
};

const handleSearch = () => {
  pagination.currentPage = 1;
  getTableData();
};

const handleReset = () => {
  filterForm.name = "";
  filterForm.status = "";
  handleSearch();
};

const getTableData = () => {};

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
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.tree-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.custom-tree-node {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
  font-size: 14px;
}

.tree-card {
  height: calc(100vh - 120px);
}

.tree-card :deep(.el-card__body) {
  height: calc(100% - 56px);
  overflow-y: auto;
}
</style>
