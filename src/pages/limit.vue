<!-- 逾期订单 -->
<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>逾期订单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
              <el-input v-model="searchName" clearable placeholder="请输入姓名" style="width:200px;"></el-input>
              <el-input v-model="searchMobile" clearable placeholder="请输入手机号" style="width:200px;"></el-input>
              <div style="margin-left:10px;display:inline-block;"></div>
              <span>日期筛选:</span>
              <el-date-picker
                v-model="startTime"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
              <el-button type="primary" plain @click="serarchPage">搜索</el-button>
              <el-button type="primary" plain @click="exportOrderList">导出</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="created_at" label="订单日期" sortable></el-table-column>
                <el-table-column prop="order_no" label="订单编号"></el-table-column>
                <el-table-column prop="customer.name" label="借款人"></el-table-column>
                <el-table-column prop="customer.phone" label="手机号"></el-table-column>
                <el-table-column prop="loan_amount" label="借款金额"></el-table-column>
                <el-table-column prop="into_amount" label="放款金额"></el-table-column>
                <el-table-column prop="rate" label="费率"></el-table-column>
                <el-table-column prop="loan_at" label="放款时间"></el-table-column>
                <el-table-column prop="repaymen_at" label="该还款日期"></el-table-column>
                <el-table-column prop="return_at" label="实际还款时间"></el-table-column>
                <el-table-column prop="late_day" label="逾期天数"></el-table-column>
                <el-table-column prop="late_fee" label="逾期费用"></el-table-column>
                <el-table-column prop="state" label="状态"></el-table-column>
                <el-table-column label="操作" width="230">
                   <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="primary"
                        @click="setUserState(scope.row)" v-show="scope.row.status == 3">还款</el-button>
                      <el-button
                        size="mini"
                        type="primary"
                        @click="delayOrder(scope.row)">延期</el-button>
                      <el-button
                        size="mini"
                        type="primary"
                        @click="ordreDetailPage(scope.row)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button
            size="mini"
            type="primary"
            @click="sendMessage" style="margin-top:10px;">群发信息</el-button>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" :page-size="pageSize" layout="prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </div>
        
        <!-- 延期 -->
        <el-dialog title="延期确认" :visible.sync="dialogDelay" width="500px">
            <el-form label-width="100px">
                <el-form-item label="延期时间">
                  <el-date-picker
                    v-model="delay_to"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="延期费用">
                    <!-- <span>{{delayFee}}元</span> -->
                    <el-input v-model="delay_fee" style="width:160px;marign-right:3px;"></el-input>元
                </el-form-item>
                <!-- <el-form-item label="延期数">
                   <el-input-number v-model="period" @change="handleChange" :min="1" :max="10"></el-input-number>
                </el-form-item> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogDelay = false">取消</el-button>
                <el-button type="primary" @click="comfirmDelayOrder">确认延期</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { apiOrderDelay, apiOrderList,apiOrderCheck,apiOrdersendMessage } from '@/service'
    export default {
        data() {
            return {
                dialogUpdate: false,
                status: '',
                searchName: '',
                searchMobile: '',
                startTime: '',
                typeId: 1,
                tableData: [{
                  created_at: '2018-10-03'
                }],
                cur_page: 1,
                pageSize: 10,
                total: 0,
                select_cate: '',
                select_word: '',
                is_search: false,
                form: {
                  remark: ''
                },
                updateId: '',
                multipleSelection: [],
                delay_to: '',
                delay_fee: '',
                periodId: '',
                dialogDelay: false
            }
        },
        created() {
            this.getData();
        },
        computed: {

        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            delayOrder(row){   //延期还款
              this.dialogDelay = true
              this.periodId = row.id
            },
            comfirmDelayOrder(){
               apiOrderDelay({
                 id: this.periodId,
                 delay_fee: this.delay_fee,
                 delay_to: this.delay_to
               })
               .then((res)=>{
                if(res.code == 200){
                   this.$message.success('操作成功')
                   this.dialogDelay = false
                   this.getData()
                }else{
                  this.$message.error(res.message)
                }
              })
            },
            serarchPage(){
              this.getData()
            },
            exportOrderList(){
              let return_at_start = this.startTime[0] || ''
              let return_at_end = this.startTime[1] || ''
              window.location.href = 'http://wallet.hxgtech.com'+'/api/admin/loan/excel?token='+`${localStorage.getItem('admin-token')}`+'&is_late=1'
            },
            handleSelectionChange(val){
              this.multipleSelection = val
            },
            sendMessage(){ //群发信息
              console.log(this.multipleSelection)
              if(!this.multipleSelection.length){
                this.$message('请先选择群发用户')
                return
              }
              let ids = []
              this.multipleSelection.forEach(function(item){
                ids.push(item.id)
              })
              this.$confirm('确认给选择用户群发信息?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    apiOrdersendMessage({
                      id: ids.join(',')
                    })
                    .then((res)=>{
                       if(res.code == 200){
                          this.$message.success('群发成功')
                       }else{
                         this.$message.error(res.message)
                       }
                    })
                  }).catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消群发操作'
                    });          
              });
            },
            getData() {
                const data = {
                  size: this.pageSize,
                  page: this.cur_page,
                  is_late: 1
                }
                if(this.startTime){
                  data.return_at_start = this.startTime[0]
                  data.return_at_end = this.startTime[1]
                }
                if(this.searchName){
                    data.name = this.searchName
                }
                if(this.searchMobile){
                    data.mobile = this.searchMobile
                }
                apiOrderList(data)
                .then((res) => {
                    this.tableData = res.data.list
                    this.tableData.forEach(function(item){
                      item.state = item.status == 3?'未还款':'已还款'
                      item.customer.name = item.customer.name?item.customer.name:item.customer.phone
                    })
                    console.log('res-order',this.tableData)
                    this.total = res.data.total
                })
            },
            setUserState(row){
              this.$confirm('确认用户已经完成还款?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    apiOrderCheck({
                      id: row.id,
                      status: 4
                    })
                    .then((res)=>{
                      if(res.code == 200){
                         this.$message.success('操作成功')
                         this.getData()
                      }else{
                        this.$message.error(res.message)
                      }
                    })
                  }).catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消还款操作'
                    });          
              });
            },
            checkInfo(row){
              console.log('row',row)
              this.updateId = row.id
              this.dialogUpdate = true
            },
            ordreDetailPage(row){
               this.$router.push({
                 path: 'detail?id='+row.customer_id
               })
            },
            search() {
                this.is_search = true;
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
</style>
