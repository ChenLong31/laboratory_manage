<!-- src/components/AppointmentCalendarModal.vue -->
<template>
  <el-dialog
    v-model="visible"
    title="预约记录"
    width="1580px"
    :before-close="handleClose"
  >
    <div class="calendar-container">
      <!-- 顶部控制栏 -->
      <div class="controls">
        <el-date-picker
          v-model="currentDate"
          type="date"
          placeholder="选择日期"
          @change="onDateChange"
        />
        <el-button @click="prevDay">前一天</el-button>
        <el-button @click="nextDay">后一天</el-button>
      </div>

      <!-- 甘特图主体 -->
      <div class="gantt-chart">
        <g-gantt-chart
          :chart-start="chartStart"
          :chart-end="chartEnd"
          precision="hour"
          bar-start="start_time"
          bar-end="end_time"
          color-scheme="creamy"
          :grid="true"
          :row-height="60"
        >
          <g-gantt-row
            v-for="instance in instances"
            :key="instance.lab_device_id"
            :label="instance.lab_device_name"
            :bars="instance.reservations"
          />
        </g-gantt-chart>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";
import { get_device_schedule } from "@/api/labDevice";

const props = defineProps({
  instrumentId: {
    type: [Number, String],
    default: ""
  }
});

const emit = defineEmits(["update:modelValue", "close"]);

const visible = ref(false);
const currentDate = ref(dayjs().toDate()); // 当前选中日期
const instances = ref([]); // 仪器实例及预约数据

// 图表显示的开始时间：选中日期的 00:00
const chartStart = computed(() => {
  return dayjs(currentDate.value).startOf("day").format("YYYY-MM-DD HH:mm");
});

// 图表显示的结束时间：选中日期的 23:59
const chartEnd = computed(() => {
  return dayjs(currentDate.value).endOf("day").format("YYYY-MM-DD HH:mm");
});

// 获取预约数据
const fetchAppointments = async () => {
  if (!props.instrumentId) return;

  const dateStr = dayjs(currentDate.value).format("YYYY-MM-DD");
  try {
    const res = await get_device_schedule({
      device_id: props.instrumentId,
      start_date: dateStr,
      end_date: dateStr
    });

    if (res.success) {
      // 处理返回数据，适配甘特图格式
      instances.value = (res.content.instances || []).map(inst => ({
        lab_device_id: inst.lab_device_id,
        lab_device_name: inst.lab_device_name,
        reservations: (inst.reservations || []).map(resv => ({
          ...resv,
          // 确保时间格式正确
          start_time: dayjs(resv.start_time).format("YYYY-MM-DD HH:mm"),
          end_time: dayjs(resv.end_time).format("YYYY-MM-DD HH:mm"),
          ganttBarConfig: {
            id: resv.order_id,
            label: "", // 不在条内显示文字，使用tooltip
            style: {
              background: getStatusColor(resv.status),
              borderRadius: "4px",
              color: "white"
            },
            html: `<div class="appointment-tooltip" style="padding: 4px;">
                    <div>预约人ID：${resv.user_id}</div>
                    <div>时间：${dayjs(resv.start_time).format("HH:mm")} - ${dayjs(resv.end_time).format("HH:mm")}</div>
                    <div>状态：${getStatusText(resv.status)}</div>
                  </div>`
          }
        }))
      }));
    }
  } catch (error) {
    console.error(error);
    ElMessage.error("加载预约记录失败");
  }
};

const getStatusColor = status => {
  const map = {
    APPROVED: "#67C23A", // 绿色
    PENDING: "#E6A23C", // 橙色
    REJECTED: "#F56C6C", // 红色
    COMPLETED: "#409EFF", // 蓝色
    CANCELLED: "#909399" // 灰色
  };
  return map[status] || "#409EFF";
};

const getStatusText = status => {
  const map = {
    APPROVED: "已批准",
    PENDING: "待审批",
    REJECTED: "已驳回",
    COMPLETED: "已完成",
    CANCELLED: "已取消"
  };
  return map[status] || status;
};

// 日期切换逻辑
const prevDay = () => {
  currentDate.value = dayjs(currentDate.value).subtract(1, "day").toDate();
};

const nextDay = () => {
  currentDate.value = dayjs(currentDate.value).add(1, "day").toDate();
};

const onDateChange = val => {
  if (val) {
    currentDate.value = val;
  }
};

// 监听日期变化重新获取数据
watch(currentDate, () => {
  if (visible.value) {
    fetchAppointments();
  }
});

const handleClose = () => {
  visible.value = false;
  emit("close");
};

// 打开弹窗的方法，接收 row 数据
const open = row => {
  visible.value = true;
  // 重置为今天
  currentDate.value = dayjs().toDate();
  // fetchAppointments();
};

const close = () => {
  visible.value = false;
  emit("close");
};

defineExpose({
  open,
  close
});
</script>

<style scoped>
.calendar-container {
  width: 100%;
  height: 600px;
  display: flex;
  flex-direction: column;
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
  padding: 0 20px;
}

.gantt-chart {
  flex: 1;
  overflow: hidden;
}

/* 穿透样式调整甘特图 */
:deep(.g-gantt-row-label) {
  width: 150px;
  font-weight: bold;
}

:deep(.g-gantt-bar) {
  border-radius: 4px;
}
</style>
