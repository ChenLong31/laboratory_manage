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
      <div class="control">
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <!-- <el-button
          :icon="Download"
          type="info"
          style="float: right"
          color="#F7F8FA"
          @click="handleAdd"
          >下载</el-button
        > -->
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
          <el-button type="primary" link @click="memberPop(row)">{{
            row.member_count
          }}</el-button>
        </template>
        <template #action="{ row }">
          <el-button type="primary" link @click="handleView(row, 'edit')"
            >编辑</el-button
          >
          <el-button type="primary" link @click="handlePop(row, '1')"
            >额度</el-button
          >
          <el-button type="primary" link @click="handlePop(row, '2')"
            >充值</el-button
          >
          <el-button
            type="primary"
            link
            style="color: red"
            @click="handleDelete(row)"
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
      v-model="visible"
      title="额度配置"
      width="400px"
      :style="{ '--el-dialog-margin-top': '40vh' }"
    >
      <el-form :model="diaForm">
        <el-form-item label="预付款额度" prop="prepay_limit">
          <el-input
            v-model.number="diaForm.prepay_limit"
            placeholder="请输入金额"
          />
        </el-form-item>
        <el-form-item label="可欠费额度">
          <el-input v-model="diaForm.credit_limit" />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div style="text-align: center">
          <el-button @click="visible = false">取 消</el-button>
          <el-button type="primary" @click="btnConform('diaForm')"
            >确 定</el-button
          >
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="visible1"
      title="充值"
      width="400px"
      :style="{ '--el-dialog-margin-top': '40vh' }"
    >
      <el-form :model="diaForm">
        <el-form-item label="充值金额" :label-width="100">
          <el-input v-model="diaForm.charge" />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div style="text-align: center">
          <el-button @click="visible1 = false">取 消</el-button>
          <el-button type="primary" @click="btnConform('charge')"
            >确 定</el-button
          >
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="visible2"
      title="课题组信息"
      width="600px"
      :style="{ '--el-dialog-margin-top': '30vh' }"
    >
      <el-form :model="groupInfo" :rules="groupRules">
        <el-form-item label="课题组名称" :label-width="100" prop="name">
          <el-input v-model="groupInfo.name" placeholder="请输入课题组名称" />
        </el-form-item>
        <el-form-item label="管理员" :label-width="100" prop="admin_account">
          <el-select
            v-model="groupInfo.admin_account"
            :disabled="formDisabled"
            placeholder="请选择管理员"
            filterable
            remote
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="item in userOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div style="text-align: center">
          <el-button @click="visible2 = false">取 消</el-button>
          <el-button type="primary" @click="handleCreateGroup">确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-model="memberVisible"
      title="选择成员"
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
              <el-button type="primary" link @click="clearAll">清空</el-button>
            </div>
            <div class="selected-users">
              <div
                v-for="member in selectedMembers"
                :key="member.id"
                class="selected-user"
              >
                {{ member.name }}
                <el-button
                  type="primary"
                  link
                  size="small"
                  @click="removeUser(member)"
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
import dayjs from "dayjs";
import {
  get_group_list,
  update_group_quota,
  recharge,
  get_group_detail,
  add_group_members,
  remove_group_member,
  create_group
} from "@/api/labDevice";
import "plus-pro-components/es/components/dialog-form/style/css";
import { Download } from "@element-plus/icons-vue";
import { ref, reactive, onMounted, nextTick, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { getUserList } from "@/api/user";

const router = useRouter();
// 额度
const visible = ref(false);
// 充值
const visible1 = ref(false);
// 课题组
const visible2 = ref(false);

const userOptions = ref([]);
const loading = ref(false);

const memberVisible = ref(false); // 控制弹窗显示隐藏
const selectedMembers = ref([]); // 存储已选成员
const remoteMethod = () => {
  loading.value = true;
  getUserList({
    page: 1,
    page_size: 200,
    identity_status: "APPROVED"
  }).then(res => {
    loading.value = false;
    if (res.success) {
      userOptions.value = res.content.list.map(item => ({
        label: `${item.real_name}(${item.account})`,
        value: item.account
      }));
    }
  });
};
const allUsers = ref([]);
const groupRules = {
  name: [
    {
      required: true,
      message: "请输入课题组名称",
      trigger: "blur"
    }
  ],
  admin_account: [
    {
      required: true,
      message: "请选择管理员",
      trigger: "change"
    }
  ]
};
const groupInfo = reactive({
  name: "",
  admin_account: ""
});
const diaForm = reactive({
  prepay_limit: null,
  credit_limit: null,
  charge: null
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
    prop: "group_no"
  },
  {
    label: "课题组名称",
    prop: "name"
  },
  {
    label: "管理员",
    prop: "admin_name"
  },
  {
    label: "管理员手机号",
    prop: "admin_phone"
  },
  {
    label: "成员数量",
    prop: "member_count",
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
    prop: "create_time",
    formatter: (row, column, cellValue) => {
      return dayjs(cellValue).format("YYYY-MM-DD HH:mm:ss");
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
    id: "1",
    group_no: "XM1203231",
    name: "生物工程学院",
    balance: "1000.00",
    admin_name: "李四",
    member_count: 25,
    create_time: "2025-10-01T08:00:00Z"
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
    case "diaForm":
      if (!currentRow.value) {
        ElMessage.error("请选择课题组");
        return;
      }
      update_group_quota({
        project_group_id: currentRow.value.id,
        prepay_limit: Number(diaForm.prepay_limit ?? 0),
        credit_limit: Number(diaForm.credit_limit ?? 0)
      })
        .then(() => {
          ElMessage.success("额度配置成功");
          visible.value = false;
          getTableData();
        })
        .catch(() => {
          ElMessage.error("额度配置失败");
        });
      break;
    case "charge":
      if (!currentRow.value) {
        ElMessage.error("请选择课题组");
        return;
      }
      recharge({
        project_group_id: currentRow.value.id,
        amount: Number(diaForm.charge ?? 0)
      })
        .then(() => {
          ElMessage.success("充值成功");
          visible1.value = false;
          getTableData();
        })
        .catch(() => {
          ElMessage.error("充值失败");
        });
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
  get_group_list({
    page: pagination.currentPage,
    page_size: pagination.pageSize,
    name: filterForm.name
  }).then(res => {
    tableData.value = res.content.list;
    pagination.total = res.content.total;
  });
};

const handleAdd = flag => {
  visible2.value = true;
  groupInfo.name = "";
  groupInfo.admin_account = "";
  remoteMethod();
};

const handleView = (row, flag) => {
  currentRow.value = { ...row };

  visible2.value = true;
};
const handleCreateGroup = () => {
  if (!groupInfo.name || !groupInfo.admin_account) {
    ElMessage.error("请填写课题组名称并选择管理员");
    return;
  }
  create_group({
    name: groupInfo.name,
    admin_account: groupInfo.admin_account
  }).then(res => {
    if (res?.success) {
      ElMessage.success("创建成功");
      visible2.value = false;
      getTableData();
    } else {
      ElMessage.error("创建失败");
    }
  });
};
// 搜索关键词
const searchKey = ref("");

// 过滤后的用户列表
const filteredUsers = computed(() => {
  if (!searchKey.value) return allUsers.value;
  return allUsers.value.filter(
    user =>
      user.name.includes(searchKey.value) ||
      user.account.includes(searchKey.value)
  );
});

// 已选用户映射
const selectedUsers = ref({});

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
const removeUser = async user => {
  if (currentRow.value) {
    try {
      const res = await remove_group_member({
        project_group_id: currentRow.value.id,
        account: user.account
      });
      if (res.success) {
        selectedMembers.value = selectedMembers.value.filter(
          m => m.id !== user.id
        );
        selectedUsers.value[user.id] = false;
        ElMessage.success("移除成员成功");
        getTableData();
      }
    } catch (error) {
      ElMessage.error("移除成员失败");
    }
  }
};

// 清空所有
const clearAll = () => {
  selectedMembers.value.forEach(member => {
    selectedUsers.value[member.id] = false;
  });
  selectedMembers.value = [];
};
// 确认选择
const confirmSelect = async () => {
  if (currentRow.value) {
    // 找出新添加的成员（在 selectedMembers 中但不在原始 members 中的）
    const originalAccounts = (currentRow.value.members || []).map(
      m => m.account
    );
    const newAccounts = selectedMembers.value
      .filter(m => !originalAccounts.includes(m.account))
      .map(m => m.account);

    if (newAccounts.length > 0) {
      try {
        const res = await add_group_members({
          project_group_id: currentRow.value.id,
          accounts: newAccounts
        });
        if (res.success) {
          ElMessage.success("添加成员成功");
          memberVisible.value = false;
          getTableData();
        }
      } catch (error) {
        ElMessage.error("添加成员失败");
      }
    } else {
      memberVisible.value = false;
    }
  }
};

const loadAllUsers = async () => {
  const res = await getUserList({
    page: 1,
    page_size: 200,
    identity_status: "APPROVED"
  });
  if (res?.success) {
    allUsers.value = res.content.list.map(item => ({
      id: item.id,
      name: item.real_name,
      account: item.account
    }));
    selectedUsers.value = allUsers.value.reduce((acc, u) => {
      acc[u.id] = false;
      return acc;
    }, {});
  }
};
const memberPop = async row => {
  currentRow.value = { ...row };

  try {
    await loadAllUsers();
    const res = await get_group_detail({ project_group_id: row.id });
    if (res) {
      // 这里的 content.members 是后端返回的成员列表
      const members = res.content.members || [];
      // const members = [
      //   {
      //     user_id: "10",
      //     account: "zhangsan",
      //     real_name: "张三",
      //     avatar: "https://...",
      //     gender: "MALE",
      //     student_no: "2021018221",
      //     user_type: "INTERNAL",
      //     role: "MEMBER"
      //   }
      // ];
      // 转换一下格式以匹配 allUsers 的结构 (id, name, account)
      currentRow.value.members = members.map(m => ({
        id: m.user_id,
        name: m.real_name,
        account: m.account
      }));

      // 初始化已选成员
      selectedMembers.value = [...currentRow.value.members];

      // 清空之前的选中状态
      Object.keys(selectedUsers.value).forEach(key => {
        selectedUsers.value[key] = false;
      });

      // 设置当前选中成员的选中状态
      selectedMembers.value.forEach(member => {
        if (selectedUsers.value[member.id] !== undefined) {
          selectedUsers.value[member.id] = true;
        }
      });

      memberVisible.value = true;
    }
  } catch (error) {
    ElMessage.error("获取成员列表失败");
  }
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
