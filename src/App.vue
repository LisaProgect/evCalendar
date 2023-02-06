<script setup>
import CalendarInfo from "./utils/calendarInfo";

const calendar = new CalendarInfo();

const dayNames = calendar.dayNames;

const days = calendar.getCalendarDays(6, calendar.getThisMonthComps());
</script>

<template>
  <div class="row">
    <div class="col">
      <div class="calendar-container">
        <div class="week">
          <div class="weekday" v-for="dayName in dayNames" :key="dayName">
            {{ dayName }}
          </div>
          <div
            v-for="day in days"
            :key="day.id"
            class="day"
            :class="[
              `weekday-${day.weekDayPosition}`,
              {
                'day-today': day.isToday,
                'prev-month': day.inPrevMonth,
                'next-month': day.inNextMonth,
              },
            ]"
          >
            <div class="day-content">
              <span class="day-label">{{ day.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.row {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.col {
  flex: 0 0 70%;
  max-width: 70%;
}
.calendar-container {
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: center;
}
.week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  position: relative;
  width: min(95%, 70rem);
  border: 1px solid var(--gray);
  border-radius: var(--table-radius);
  overflow: hidden;
}
.weekday {
  border-bottom: 1px solid var(--gray);
  border-left: 1px solid var(--gray);
  background-color: #f9fafe;
  padding: 10px 0px;
  color: #999ba5;
  text-align: center;
  font-size: 0.9rem;
}

.weekday:first-child {
  border-left: none;
}

.day {
  padding: 3px 5px;
  border-right: 1px solid var(--gray);
  border-top: 1px solid var(--gray);
}

.weekday-6 {
  border-right: none;
}

.prev-month .day-label,
.next-month .day-label {
  color: #b3b3b3;
}
.day-content {
  position: relative;
}

</style>
