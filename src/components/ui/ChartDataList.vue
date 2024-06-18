  <template>
    <div class="card-big-data">
      <div v-if="pieData" class="row">
        <div class="col-6">
          <div class="chart-container">
            <Doughnut :data="pieData" :options="pieOptions" />
          </div>
        </div>
        <div class="col-6">
          <div class="col">
            <table class="data-table">
              <tr class="char-data-elem" v-for="(color, index) in pieData.datasets[0].backgroundColor"
                  :key="index">
                <td>
                  <div :style="getColorStyle(color)" class="color-circle"></div>
                </td>
                <td>
                  <span class="material-symbols-outlined icon-label">
                    {{ pieData.categoryIcons[index] }}
                  </span>
                </td>
                <td>
                  <p class="char-data-element-label">{{ pieData.labels[index] }}</p>
                </td>
                <td>
                  <p class="char-data-element-data">{{ pieData.datasets[0].data[index] }} $</p>
                </td>
                <td>
                  <p class="char-data-element-data">
                    {{
                      Number(((pieData.datasets[0].data[index] / (isIncomePage ? pieData.income_amount : pieData.expense_amount)) * 100).toFixed(1))
                    }}
                    %
                  </p>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { defineProps } from 'vue';
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
    margin-left: 0.25vw;
    margin-top: 0.35vw;
  }

  .char-data-element-data {
    font-weight: 500;
    padding-left: 2vw;
    margin-left: 0.5vw;
    margin-top: 0.35vw;
  }

  .chart-container {
    height: 26vw;
  }

  .icon-label {
    font-size: 2vw;
    margin-left: 1vw;
  }

  .data-table {
    margin-top: 3vw;
  }
  </style>
