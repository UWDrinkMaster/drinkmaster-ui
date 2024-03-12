<template>
  <div>
      <el-table
        :data="historyOrders"
        :row-class-name="tableRowClassName"
        max-height="50%"
        :default-sort="defaultSort"
        style="width: 100%; white-space: normal;"
      >
        <el-table-column
          sortable
          prop="drink_name"
          label="Drink"
          width="150"
        style=" white-space: normal">
        </el-table-column>
        <el-table-column
          sortable
          prop="status"
          label="Status"
          width="110">
        </el-table-column>
        <el-table-column
          sortable
          prop="created_at"
          label="Order Time"
          width="180">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.created_at }}</span>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          prop="quantity"
          label="Quantity"
          width="110">
        </el-table-column>
      </el-table>
    <el-button @click="getOrderHistory" class="refresh-button" icon="el-icon-refresh"></el-button>
  </div>
</template>

<script>
  import axios from 'axios'
  import moment from 'moment';

  export default {
    name: 'Profile', data() {
      return {
        historyOrdersRaw: [], historyOrders: [], defaultSort: {prop: "created_at", order: "descending"},
      }
    },

    methods: {
      tableRowClassName({row, rowIndex}) {
        //console.log(row)
        if(row){
          if (row.status == "PENDING") {
            return 'warning-row';
          } else if (row.status == "COMPLETED") {
            return 'success-row';
          } else if (row.status == "CANCELLED") {
            return 'danger-row';
          } else if (row.status == "CREATED") {
            return 'info-row';
          }
        }

        return '';
      }, getOrderHistoryRaw() {
        let userId = -1;
        if (this.$store.getters.getUser) {
          userId = this.$store.getters.getUser.id;
        }
        this.$orderApi.getUserOrders(userId).then(res => {
          if (res.status === 200) {
            //console.log(res.data)
           return res.data
          }
        }).catch(err => {
          console.log(err.response)
          this.$message.error(err.response.data.message)
        })

      }, async getOrderHistory() {
        let userId = -1;
        if (this.$store.getters.getUser) {
          userId = this.$store.getters.getUser.id;
        }
        await this.$orderApi.getUserOrders(userId).then(res => {
          if (res.status === 200) {
            //console.log(res.data)
            this.historyOrdersRaw = res.data;
          }
        }).catch(err => {
          console.log(err.response)
          this.$message.error(err.response.data.message)
        })
       // this.historyOrdersRaw = await this.getOrderHistoryRaw();
        this.historyOrdersRaw = this.historyOrdersRaw.map(item => {
          if (item.status === "CREATED") {
            item.status = "PENDING";
          }
          let createdAt = moment(item.createdAt);
          let modifiedAt = moment(item.modifiedAt);
          let tntcreatedAt = createdAt.subtract(4, 'hours');
          let tntmodifiedAt = modifiedAt.subtract(4, 'hours');
          item.createdAt = tntcreatedAt.format('YYYY-MM-DDTHH:mm:ss');
          item.modifiedAt = tntmodifiedAt.format('YYYY-MM-DDTHH:mm:ss');
          return item;
        });
        if(this.historyOrdersRaw.length>0){
          this.historyOrders = await Promise.all(this.historyOrdersRaw.map( async(item) => {
            //console.log("new")
            //console.log(item)
            let drinkName = "";
            await this.$drinkApi.getDrinkById(item.drink_id).then(res => {
              if (res.status === 200) {
                drinkName = res.data.name;
                //console.log({...item, drink_name: drinkName})
                return {...item, drink_name: drinkName};
              }
            }).catch(err => {
              console.log(err.response);
              this.$message.error(err.response.data.message);
              //return {...item, drink_name: drinkName};
            });

            return {...item, drink_name: drinkName};
          }));
        }

      }


    },
    mounted() {
      this.getOrderHistory();
    }
  }
</script>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

  .el-table .danger-row {
    background: #F56C6C;
  }

  .el-table .info-row {
    background: #F2F6FC;
  }
  .refresh-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000; /* Ensure it's above other content */
  }
</style>
