<!-- src/components/AppointmentCalendarModal.vue -->
<template>
  <el-dialog
    v-model="visible"
    title="预约记录"
    width="1580px"
    :before-close="handleClose"
    @open="fetchAppointments"
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
          width="1500px"
          :chart-start="startDate"
          :chart-end="endDate"
          precision="hour"
          bar-start="startDate"
          bar-end="endDate"
          color-scheme="creamy"
          :grid="true"
          :row-height="60"
        >
          <g-gantt-row :bars="item" v-for="(item, index) in barComputed" />
        </g-gantt-chart>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";

const props = defineProps({
  instrumentId: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(["update:modelValue", "close"]);
const myCustomColors = {
  primary: "#42b983", // 主要条形颜色
  secondary: "#165DFF", // 次要颜色
  hoverHighlight: "rgba(66, 185, 131, 0.3)" // 悬停高亮
};
const visible = ref(false);
const currentDate = ref(dayjs()); // 使用 dayjs 对象
const appointments = ref([]);

// 计算时间范围：从前一天的12点到后一天的12点
const startDate = computed(() => {
  return dayjs(currentDate.value)
    .subtract(1, "day")
    .hour(18)
    .minute(0)
    .second(0)
    .millisecond(0)
    .toDate();
});

const endDate = computed(() => {
  return dayjs(currentDate.value)
    .add(1, "day")
    .hour(6)
    .minute(0)
    .second(0)
    .millisecond(0)
    .toDate();
});
const barComputed = computed(() => {
  return barList.value.map(item => {
    return item.map(bar => {
      return {
        ...bar,
        ganttBarConfig: {
          ...bar.ganttBarConfig,
          html: `<div class="appointment-tooltip">
                  <div class="appointment-user">预约人：${bar.ganttBarConfig.name}</div>
                  <div class="appointment-time">预约时间：${dayjs(bar.startDate).format("HH:mm:ss")} - ${dayjs(bar.endDate).format("HH:mm:ss")}</div>
                </div>`,
          style: {
            background: "#E5F1FF",
            color: "black"
          }
        }
      };
    });
  });
});
const barList = ref([
  [
    {
      startDate: "2026-01-14 13:00",
      endDate: "2026-01-14 19:00",
      ganttBarConfig: {
        id: "unique-id-1",
        name: "陈鹏"
      }
    }
  ],
  [
    {
      startDate: "2026-01-14 00:00",
      endDate: "2026-01-14 12:00",
      ganttBarConfig: {
        id: "another-unique-id-2",
        name: "陈鸟"
      }
    }
  ]
]);

// 获取预约数据（模拟接口）
const fetchAppointments = async () => {
  try {
    // 示例数据，实际应调用 API
    const mockData = [
      {
        id: 1,
        name: "陈鹏",
        startHour: 8,
        startMinute: 30,
        durationMinutes: 60,
        timeRange: "08:30 - 09:30"
      },
      {
        id: 2,
        name: "陈鹏",
        startHour: 10,
        startMinute: 0,
        durationMinutes: 60,
        timeRange: "10:00 - 11:00"
      }
    ];
    appointments.value = mockData;
  } catch (error) {
    ElMessage.error("加载预约失败");
  }
};

const prevDay = () => {
  currentDate.value = dayjs(currentDate.value).subtract(1, "day");
};

const nextDay = () => {
  currentDate.value = dayjs(currentDate.value).add(1, "day");
};

const onDateChange = date => {
  if (date) {
    currentDate.value = dayjs(date);
  }
};

const handleClose = () => {
  emit("close");
  visible.value = false;
};

// 打开弹窗的方法
const open = () => {
  visible.value = true;
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
  max-height: 70vh;
  overflow-y: auto;
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
}

.gantt-chart {
  width: 1500px;
  height: 600px;
  display: flex;
  border: 1px solid #dcdfe6;
  background-color: #f5f7fa;
}

.time-axis {
  width: 80px;
  border-right: 1px solid #dcdfe6;
  padding: 10px 0;
  background-color: #fff;
}

.hour-label {
  font-size: 12px;
  text-align: right;
  padding: 5px 10px;
}

.grid {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.day-header {
  padding: 10px;
  background-color: #f0f9ff;
  font-weight: bold;
  text-align: center;
}

.time-slots {
  display: flex;
  flex-direction: column;
  border-right: 1px solid #dcdfe6;
}

.slot {
  position: relative;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  padding-left: 10px;
}

.slot-time {
  font-size: 12px;
  color: #666;
}

.appointments {
  position: relative;
  flex: 1;
  background-color: #fff;
}

.appointment-item {
  position: absolute;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  padding: 4px 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;
}

.appointment-item:hover {
  opacity: 0.8;
}

.appointment-content {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
