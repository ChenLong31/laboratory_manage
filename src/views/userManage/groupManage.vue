<template>
  <div class="main">
    <el-card shadow="never">
      <el-form :model="filterForm" label-width="100px" inline>
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="课题组编号">
              <el-input
                v-model="filterForm.number"
                placeholder="请输入课题组编号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="课题组名称">
              <el-input
                v-model="filterForm.name"
                placeholder="请输入课题组名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="管理员">
              <el-input
                v-model="filterForm.manager"
                placeholder="请输入管理员"
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
            <el-form-item label="管理员手机号">
              <el-input v-model="filterForm.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="创建时间">
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
      <div class="control">
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button
          :icon="Download"
          type="info"
          @click="handleAdd"
          style="float: right"
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
        <template #memberCount="{ row }">
          <el-button type="text" @click="memberPop(row)">{{
            row.memberCount
          }}</el-button>
        </template>
        <template #action="{ row }">
          <el-button type="text" @click="handleView(row, 'edit')"
            >编辑</el-button
          >
          <el-button type="text" @click="handlePop(row, '1')">额度</el-button>
          <el-button type="text" @click="handlePop(row, '2')">充值</el-button>
          <el-button type="text" style="color: red" @click="handleDelete(row)"
            >删除</el-button
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
    <el-dialog
      title="额度配置"
      v-model="visible"
      width="400px"
      :style="{ '--el-dialog-margin-top': '40vh' }"
    >
      <el-form :model="diaForm">
        <el-form-item label="可欠费额度" :label-width="100">
          <el-input v-model="diaForm.amount"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="btnConform('amount')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="充值"
      v-model="visible1"
      width="400px"
      :style="{ '--el-dialog-margin-top': '40vh' }"
    >
      <el-form :model="diaForm">
        <el-form-item label="充值金额" :label-width="100">
          <el-input v-model="diaForm.charge"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button @click="visible1 = false">取 消</el-button>
        <el-button type="primary" @click="btnConform('charge')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="课题组信息"
      v-model="visible2"
      width="600px"
      :style="{ '--el-dialog-margin-top': '30vh' }"
    >
      <el-form :model="groupInfo" :rules="groupRules">
        <el-form-item label="课题组名称" :label-width="100" prop="name">
          <el-input
            v-model="groupInfo.name"
            placeholder="请输入课题组名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="管理员" :label-width="100" prop="admin">
          <el-select
            v-model="groupInfo.admin"
            placeholder="请选择状态"
            clearable
          >
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button @click="visible2 = false">取 消</el-button>
        <el-button type="primary" @click="handleView('charge')"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="选择成员"
      v-model="memberVisible"
      width="600px"
      :style="{ '--el-dialog-margin-top': '30vh' }"
    >
      <div class="member-select-container">
        <div class="member-list">
          <!-- 左侧用户列表 -->
          <div class="user-list">
            <div class="search-bar">
              <el-input
                v-model="searchKey"
                placeholder="输入用户名或账号搜索"
                @input="handleSearchUser"
              />
            </div>
            <div class="users">
              <div
                v-for="user in filteredUsers"
                :key="user.id"
                class="user-item"
              >
                <el-checkbox
                  v-model="selectedUsers[user.id]"
                  @change="selectUser(user)"
                  >{{ user.name }}</el-checkbox
                >
              </div>
            </div>
          </div>

          <!-- 右侧已选成员 -->
          <div class="selected-list">
            <div class="header">
              <span>已选 {{ selectedMembers.length }}/30</span>
              <el-button type="text" @click="clearAll">清空</el-button>
            </div>
            <div class="selected-users">
              <div
                v-for="member in selectedMembers"
                :key="member.id"
                class="selected-user"
              >
                {{ member.name }}
                <el-button type="text" size="small" @click="removeUser(member)"
                  >×</el-button
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="memberVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSelect">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import "plus-pro-components/es/components/dialog-form/style/css";
import { Download } from "@element-plus/icons-vue";
import { ref, reactive, onMounted, nextTick, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();
// 额度
const visible = ref(false);
// 充值
const visible1 = ref(false);
// 课题组
const visible2 = ref(false);

const memberVisible = ref(false); // 控制弹窗显示隐藏
const selectedMembers = ref([]); // 存储已选成员
const allUsers = ref([
  // 模拟用户列表数据
  { id: 1, name: "丁昊哲" },
  { id: 2, name: "李书易" },
  { id: 3, name: "顾伦" },
  { id: 4, name: "李天泽" },
  { id: 5, name: "刘大大" }
]);
const groupRules = {
  name: [
    {
      required: true,
      message: "请输入课题组名称",
      trigger: "blur"
    }
  ],
  admin: [
    {
      required: true,
      message: "请选择管理员",
      trigger: "change"
    }
  ]
};
const groupInfo = reactive({});
const diaForm = reactive({
  amount: "",
  charge: ""
});
const filterForm = reactive({
  number: "",
  name: "",
  manager: "",
  phone: "",
  status: "",
  operatingTime: []
});

const columns = [
  {
    label: "课题组编号",
    prop: "groupNumber"
  },
  {
    label: "课题组名称",
    prop: "groupName"
  },
  {
    label: "管理员",
    prop: "managerName"
  },
  {
    label: "管理员手机号",
    prop: "managerPhone"
  },
  {
    label: "成员数量",
    prop: "memberCount",
    slot: "memberCount"
  },
  {
    label: "余额",
    prop: "balance",
    formatter: row => {
      return `${row.balance}元`;
    }
  },
  {
    label: "创建时间",
    prop: "createTime"
  },
  {
    label: "状态",
    prop: "status",
    formatter: row => {
      return row.status === "1" ? "启用" : "禁用";
    }
  },
  {
    label: "操作",
    width: 240,
    slot: "action"
  }
];

const tableData = ref([
  {
    id: 1,
    groupNumber: "admin",
    groupName: "陈晓宇",
    managerName: "彭琴",
    managerPhone: "13888888888",
    memberCount: 10,
    balance: 1000,
    createTime: "2025-02-28 10:30",
    status: "1",
    members: [
      {
        id: 1,
        name: "丁昊哲"
      },
      {
        id: 2,
        name: "李书易"
      }
    ]
  },
  {
    id: 2,
    groupNumber: "user1",
    groupName: "陈晓宇",
    managerName: "彭琴",
    managerPhone: "13888888888",
    memberCount: 20,
    balance: 1000,
    createTime: "2025-02-28 10:30",
    status: "1"
  },
  {
    id: 3,
    groupNumber: "user1",
    groupName: "陈晓宇",
    managerName: "彭琴",
    managerPhone: "13888888888",
    memberCount: 10,
    balance: 1000,
    createTime: "2025-02-28 10:30",
    status: "1"
  },
  {
    id: 4,
    groupNumber: "user1",
    groupName: "陈晓宇",
    managerName: "彭琴",
    managerPhone: "13888888888",
    memberCount: 10,
    balance: 1000,
    createTime: "2025-02-28 10:30",
    status: "1"
  },
  {
    id: 5,
    groupNumber: "user1",
    groupName: "陈晓宇",
    managerName: "彭琴",
    managerPhone: "13888888888",
    memberCount: 10,
    balance: 1000,
    createTime: "2025-02-28 10:30",
    status: "1"
  },
  {
    id: 6,
    groupNumber: "user1",
    groupName: "陈晓宇",
    managerName: "彭琴",
    managerPhone: "13888888888",
    memberCount: 10,
    balance: 1000,
    createTime: "2025-02-28 10:30",
    status: "1"
  },
  {
    id: 7,
    groupNumber: "user1",
    groupName: "陈晓宇",
    managerName: "彭琴",
    managerPhone: "13888888888",
    memberCount: 10,
    balance: 1000,
    createTime: "2025-02-28 10:30",
    status: "1"
  },
  {
    id: 8,
    groupNumber: "user1",
    groupName: "陈晓宇",
    managerName: "彭琴",
    managerPhone: "13888888888",
    memberCount: 10,
    balance: 1000,
    createTime: "2025-02-28 10:30",
    status: "1"
  },
  {
    id: 9,
    groupNumber: "user1",
    groupName: "陈晓宇",
    managerName: "彭琴",
    managerPhone: "13888888888",
    memberCount: 10,
    balance: 1000,
    createTime: "2025-02-28 10:30",
    status: "1"
  },
  {
    id: 10,
    groupNumber: "user1",
    groupName: "陈晓宇",
    managerName: "彭琴",
    managerPhone: "13888888888",
    memberCount: 10,
    balance: 1000,
    createTime: "2025-02-28 10:30",
    status: "1"
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
const btnConform = type => {
  switch (type) {
    case "amount":
      console.log("diaForm.amount", currentRow.value);
      break;
    case "charge":
      console.log("diaForm.charge", currentRow.value);
      break;
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
  visible2.value = true;
};

const handleView = (row, flag) => {
  currentRow.value = { ...row };

  visible2.value = true;
};
// 搜索关键词
const searchKey = ref("");

// 过滤后的用户列表
const filteredUsers = computed(() => {
  if (!searchKey.value) return allUsers.value;
  return allUsers.value.filter(user => user.name.includes(searchKey.value));
});

// 已选用户映射
const selectedUsers = ref(
  allUsers.value.reduce((acc, user) => {
    acc[user.id] = false;
    return acc;
  }, {})
);

// 处理搜索
const handleSearchUser = () => {
  // 搜索逻辑
};

// 选择用户
const selectUser = user => {
  const isAlreadySelected = selectedMembers.value.some(
    member => member.id === user.id
  );

  if (!isAlreadySelected) {
    // 如果未被选中，则添加到已选列表
    selectedMembers.value.push(user);
    selectedUsers.value[user.id] = true; // 同步左侧复选框状态
  } else {
    // 如果已被选中，则从已选列表移除
    selectedMembers.value = selectedMembers.value.filter(
      member => member.id !== user.id
    );
    selectedUsers.value[user.id] = false; // 同步左侧复选框状态
  }
};

// 移除用户
const removeUser = user => {
  selectedMembers.value = selectedMembers.value.filter(m => m.id !== user.id);
  selectedUsers.value[user.id] = false; // 同步左侧复选框状态
};

// 清空所有
const clearAll = () => {
  selectedMembers.value.forEach(member => {
    selectedUsers.value[member.id] = false;
  });
  selectedMembers.value = [];
};
// 确认选择
const confirmSelect = () => {
  // 更新当前行的成员数据
  if (currentRow.value) {
    currentRow.value.members = selectedMembers.value;
  }
  console.log("selectedMembers", selectedMembers.value);
  memberVisible.value = false;
  ElMessage.success("成员选择成功");
};

const memberPop = row => {
  currentRow.value = { ...row };

  // 初始化已选成员
  selectedMembers.value = row.members || [];

  // 清空之前的选中状态
  Object.keys(selectedUsers.value).forEach(key => {
    selectedUsers.value[key] = false;
  });

  // 设置当前选中成员的选中状态
  selectedMembers.value.forEach(member => {
    selectedUsers.value[member.id] = true;
  });

  memberVisible.value = true;
};
const handlePop = (row, index) => {
  currentRow.value = { ...row };
  index == 1 ? (visible.value = true) : (visible1.value = true);
};
const handleQuotaConfirm = data => {
  console.log("提交的额度数据:", data);
  // 调用接口保存额度配置
  ElMessage.success("额度配置已保存");
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

.member-select-container {
  display: flex;
  height: 400px;
}

.member-list {
  display: flex;
  width: 100%;
}

.user-list,
.selected-list {
  flex: 1;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.search-bar {
  margin-bottom: 10px;
}

.users {
  max-height: 300px;
  overflow-y: auto;
}

.user-item {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.selected-list .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.selected-users {
  max-height: 300px;
  overflow-y: auto;
}

.selected-user {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}
</style>
