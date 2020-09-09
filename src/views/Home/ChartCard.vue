<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <span @click="countR600_MAX(days)">按日</span>
          <span @click="countR600_MAX(weeks)">按周</span>
          <span @click="countR600_MAX(months)">按月</span>
          <span @click="countR600_MAX(years)">按年</span>
          <schart ref="R600_MAX" class="schart" canvasId="R600_MAX" :options="R600_MAX"></schart>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <span @click="countR600_PRO(days)">按日</span>
          <span @click="countR600_PRO(weeks)">按周</span>
          <span @click="countR600_PRO(months)">按月</span>
          <span @click="countR600_PRO(years)">按年</span>
          <schart ref="R600_PRO" class="schart" canvasId="R600_PRO" :options="R600_PRO"></schart>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <span @click="countR600_PRO_1500(days)">按日</span>
          <span @click="countR600_PRO_1500(weeks)">按周</span>
          <span @click="countR600_PRO_1500(months)">按月</span>
          <span @click="countR600_PRO_1500(years)">按年</span>
          <schart ref="R600_PRO_1500" class="schart" canvasId="R600_PRO_1500" :options="R600_PRO_1500"></schart>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <span @click="countR600_PRO_KIT(days)">按日</span>
          <span @click="countR600_PRO_KIT(weeks)">按周</span>
          <span @click="countR600_PRO_KIT(months)">按月</span>
          <span @click="countR600_PRO_KIT(years)">按年</span>
          <schart ref="R600_PRO_KIT" class="schart" canvasId="R600_PRO_KIT" :options="R600_PRO_KIT"></schart>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Schart from 'vue-schart'
import { countProductsApi } from '@/config/api'
import { SUCCESS_CODE } from '@/config/constants'

export default {
  name: 'chart-card',
  components: {
    Schart
  },
  data () {
    return {
      R600_MAX: {
        type: 'bar',
        title: {
          text: 'R600_MAX生产统计'
        },
        xRorate: 25,
        labels: [],
        datasets: []
      },
      R600_PRO: {
        type: 'bar',
        title: {
          text: 'R600_PRO数量统计'
        },
        xRorate: 25,
        labels: [],
        datasets: []
      },
      R600_PRO_1500: {
        type: 'bar',
        title: {
          text: 'R600_PRO_1500数量统计'
        },
        xRorate: 25,
        labels: [],
        datasets: []
      },
      R600_PRO_KIT: {
        type: 'bar',
        title: {
          text: 'R600_PRO_KIT数量统计'
        },
        xRorate: 25,
        labels: [],
        datasets: []
      },
      years: 1,
      months: 2,
      weeks: 3,
      days: 4
    }
  },
  created () {
    this.countR600_MAX(this.months)
    this.countR600_PRO(this.months)
    this.countR600_PRO_1500(this.months)
    this.countR600_PRO_KIT(this.months)
  },
  methods: {
    countR600_MAX (scope) {
      this.R600_MAX.labels = []
      this.R600_MAX.datasets = []
      this.$axios
        .get(countProductsApi + `?scope=${scope}&product=5`)
        .then((res) => {
          const { data, code, message } = res.data
          if (code !== SUCCESS_CODE) {
            return this.$message.error(message)
          }
          if (data.length > 0) {
            const dates = []
            const counts = []
            data.map((item) => {
              if (scope === this.years) dates.push(item.years)
              if (scope === this.months) dates.push(item.months)
              if (scope === this.weeks) dates.push(item.weeks)
              if (scope === this.days) dates.push(item.days)
              counts.push(item.count)
            })
            this.R600_MAX.labels = dates
            this.R600_MAX.datasets.push({
              label: 'R600_MAX',
              data: counts
            })
          }
        })
        .catch((err) => {
          this.$message.error(err.message)
        })
    },
    countR600_PRO (scope) {
      this.R600_PRO.labels = []
      this.R600_PRO.datasets = []
      this.$axios
        .get(countProductsApi + `?scope=${scope}&product=7`)
        .then((res) => {
          const { data, code, message } = res.data
          if (code !== SUCCESS_CODE) {
            return this.$message.error(message)
          }
          if (data.length > 0) {
            const dates = []
            const counts = []
            data.map((item) => {
              if (scope === this.years) dates.push(item.years)
              if (scope === this.months) dates.push(item.months)
              if (scope === this.weeks) dates.push(item.weeks)
              if (scope === this.days) dates.push(item.days)
              counts.push(item.count)
            })
            this.R600_PRO.labels = dates
            this.R600_PRO.datasets.push({
              label: 'R600_PRO',
              data: counts
            })
          }
        })
        .catch((err) => {
          this.$message.error(err.message)
        })
    },
    countR600_PRO_1500 (scope) {
      this.R600_PRO_1500.labels = []
      this.R600_PRO_1500.datasets = []
      this.$axios
        .get(countProductsApi + `?scope=${scope}&product=8`)
        .then((res) => {
          const { data, code, message } = res.data
          if (code !== SUCCESS_CODE) {
            return this.$message.error(message)
          }
          if (data.length > 0) {
            const dates = []
            const counts = []
            data.map((item) => {
              if (scope === this.years) dates.push(item.years)
              if (scope === this.months) dates.push(item.months)
              if (scope === this.weeks) dates.push(item.weeks)
              if (scope === this.days) dates.push(item.days)
              counts.push(item.count)
            })
            this.R600_PRO_1500.labels = dates
            this.R600_PRO_1500.datasets.push({
              label: 'R600_PRO_1500',
              data: counts
            })
          }
        })
        .catch((err) => {
          this.$message.error(err.message)
        })
    },
    countR600_PRO_KIT (scope) {
      this.R600_PRO_KIT.labels = []
      this.R600_PRO_KIT.datasets = []
      this.$axios
        .get(countProductsApi + `?scope=${scope}&product=9`)
        .then((res) => {
          const { data, code, message } = res.data
          if (code !== SUCCESS_CODE) {
            return this.$message.error(message)
          }
          if (data.length > 0) {
            const dates = []
            const counts = []
            data.map((item) => {
              if (scope === this.years) dates.push(item.years)
              if (scope === this.months) dates.push(item.months)
              if (scope === this.weeks) dates.push(item.weeks)
              if (scope === this.days) dates.push(item.days)
              counts.push(item.count)
            })
            this.R600_PRO_KIT.labels = dates
            this.R600_PRO_KIT.datasets.push({
              label: 'R600_PRO_KIT',
              data: counts
            })
          }
        })
        .catch((err) => {
          this.$message.error(err.message)
        })
    }
  }
}
</script>

<style scoped>
.schart {
  width: 100%;
  height: 300px;
}
span {
  padding-right: 20px;
  font-size: 13px;
  cursor: pointer;
}
.el-row {
  padding-top: 30px;
}
</style>
