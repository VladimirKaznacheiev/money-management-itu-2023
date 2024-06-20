<template>
  <div class="card-big-data">
    <div v-if="pieData" class="row">
      <div class="col-6">
        <div class="chart-container">
          <Doughnut :data="pieData" :options="pieOptions"/>
        </div>
      </div>
      <div class="col-6">
        <div class="col">
          <table class="data-table">
            <tr class="char-data-elem" v-for="(color, index) in paginatedData"
                :key="index">
              <td>
                <div :style="getColorStyle(color)" class="color-circle"></div>
              </td>
              <td>
                <span class="material-symbols-outlined icon-label">
                  {{ pieData.categoryIcons[startIndex + index] }}
                </span>
              </td>
              <td>
                <p class="char-data-element-label truncate">{{ pieData.labels[startIndex + index] }}</p>
              </td>
              <td>
                <p class="char-data-element-data">{{ pieData.datasets[0].data[startIndex + index] }} $</p>
              </td>
              <td>
                <p class="char-data-element-data">
                  {{
                    Number(((pieData.datasets[0].data[startIndex + index] / (isIncomePage ? pieData.income_amount : pieData.expense_amount)) * 100).toFixed(1))
                  }}
                  %
                </p>
              </td>
            </tr>
          </table>
          <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1">‹</button>
            <span>{{ currentPage }} / {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages">›</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  pieData: {
    type: Object,
    required: true
  },
  isIncomePage: {
    type: Boolean,
    required: true
  }
});

const currentPage = ref(1);
const itemsPerPage = 7;

const totalPages = computed(() => {
  return Math.ceil(props.pieData.labels.length / itemsPerPage);
});

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage;
});

const paginatedData = computed(() => {
  const endIndex = startIndex.value + itemsPerPage;
  return props.pieData.datasets[0].backgroundColor.slice(startIndex.value, endIndex);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

function getColorStyle(color) {
  return {
    backgroundColor: color,
  };
}
</script>

<style scoped>
.card-big-data {
  margin-top: 3vw;
}

.color-circle {
  width: 2vw;
  height: 2vw;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
}

.char-data-elem {
  height: 4vw;
  font-size: 1vw;
}

.char-data-element-label {
  font-weight: 500;
  margin-left: 1.25vw;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px; /* Adjust the max-width as needed */
}

.char-data-element-data {
  font-weight: 500;
  padding-left: 2vw;
  margin-left: 0.5vw;
  margin-top: 0.35vw;
}

.icon-label {
  font-size: 2vw;
  margin-left: 2vw;
}

.chart-container {
  width: 100%;
  height: 500px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 0.5rem;
}

.pagination button {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  margin: 0 0.5rem;
}

.pagination span {
  font-size: 1rem;
}

.pagination button:disabled {
  color: #ccc;
  cursor: not-allowed;
}

@media (max-width: 1024px) {
  .chart-container {
    height: 300px;
  }
}

@media (max-width: 768px) {
  .card-big-data {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .row {
    width: 100%;
    flex-direction: column;
    align-items: center;
  }

  .col-6 {
    width: 100%;
  }

  .chart-container {
    width: 100%;
    height: 400px;
  }

  .data-table {
    width: 100%;
    margin-top: 1rem;
  }

  .char-data-elem {
    height: 8vw;
    font-size: 2vw;
  }

  .color-circle {
    width: 4vw;
    height: 4vw;
  }

  .icon-label {
    font-size: 4vw;
    margin-left: 2vw;
  }
}
</style>
