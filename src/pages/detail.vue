<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>订单详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <p class="title">基础信息</p>
            <el-table :data="basic" border style="width: 100%" ref="multipleTable">
                <el-table-column prop="name" label="借款人" sortable></el-table-column>
                <el-table-column prop="id_card" label="身份证"></el-table-column>
                <el-table-column prop="phone" label="手机号"></el-table-column>
                <el-table-column prop="is_auth" label="认证状态"></el-table-column>
            </el-table>
            <p class="title">银行卡数据</p>
            <el-table :data="bank" border style="width: 100%" ref="multipleTable">
                <el-table-column prop="created_at" label="日期" sortable></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="id_card" label="身份证"></el-table-column>
                <el-table-column prop="bank_card" label="银行卡号"></el-table-column>
                <el-table-column prop="bank_name" label="银行名称"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
            </el-table>
            <p class="title">身份证信息</p>
            <el-table :data="card" border style="width: 100%" ref="multipleTable">
                <el-table-column prop="created_at" label="日期" sortable></el-table-column>
                <el-table-column label="身份证正面">
                  <template slot-scope="props">
                    <img :src="props.row.front" alt="" style="width:100px;height:auto;cursor:pointer;" @click="checkImage(props.row.front)">
                  </template>
                </el-table-column>
                <el-table-column label="身份证反面">
                  <template slot-scope="props">
                    <img :src="props.row.back" alt="" style="width:100px;height:auto;cursor:pointer;" @click="checkImage(props.row.back)">
                  </template>
                </el-table-column>
                <el-table-column label="人身照">
                  <template slot-scope="props">
                    <img :src="props.row.people" alt="" style="width:100px;height:auto;cursor:pointer;" @click="checkImage(props.row.people)">
                  </template>
                </el-table-column>
            </el-table>
            <p class="title">运营商数据</p>
            <el-table :data="mobile" border style="width: 100%" ref="multipleTable">
                <el-table-column prop="created_at" label="日期" sortable></el-table-column>
                <el-table-column prop="carrier" label="运营商"></el-table-column>
            </el-table>
            <p class="title">支付宝信息</p>
            <el-table :data="ali_pay" border style="width: 100%">
                <el-table-column prop="created_at" label="日期" sortable></el-table-column>
                <el-table-column prop="nickname" label="昵称"></el-table-column>
                <el-table-column prop="account" label="账号"></el-table-column>
                <el-table-column prop="score" label="芝麻分"></el-table-column>
                <el-table-column prop="limit" label="花呗额度"></el-table-column>
            </el-table>
            <p class="title">认证信息</p>
            <el-table :data="examine" border style="width: 100%" ref="multipleTable">
                <el-table-column prop="created_at" label="日期" sortable></el-table-column>
                <el-table-column prop="front_remark" label="返回给 app 的意见"></el-table-column>
                <el-table-column prop="back_remark" label="后台意见"></el-table-column>
                <el-table-column prop="quota" label="额度"></el-table-column>
                <el-table-column prop="rate" label="费率"></el-table-column>
            </el-table>
            <p class="title">放款信息</p>
            <el-table :data="approve" border style="width: 100%" ref="multipleTable">
                <el-table-column prop="created_at" label="创建日期" sortable></el-table-column>
                <el-table-column prop="order_no" label="订单编号"></el-table-column>
                <el-table-column prop="state" label="审核状态"></el-table-column>
                <el-table-column prop="loan_amount" label="借款金额"></el-table-column>
                <el-table-column prop="into_amount" label="放款金额"></el-table-column>
                <el-table-column prop="rate" label="费率"></el-table-column>
                <el-table-column prop="repaymen_at" label="该还款日期"></el-table-column>
                <el-table-column prop="status_remark" label="审核不通过说明"></el-table-column>
                <el-table-column prop="loan_remark" label="放款说明"></el-table-column>
                <el-table-column prop="return_at" label="实际还款时间"></el-table-column>
                <el-table-column prop="is_late" label="是否逾期">
                  <template slot-scope="scope">
                    <span style="color:#f73e2f;" v-if="scope.row.is_late == 1">已逾期</span>
                    <span style="color:#00D1B2;" v-else>未逾期</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                   <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="primary"
                        @click="checkOrderAgreement(scope.row)" v-show="scope.row.status == 3 || scope.row.status == 4">查看借条</el-button>
                  </template>
                </el-table-column>
            </el-table>
            <p class="title">通讯录数据</p>
            <el-table :data="contacts" border style="width: 100%" ref="multipleTable">
                <el-table-column prop="created_at" label="日期" sortable></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="phone" label="电话"></el-table-column>
            </el-table>
            <el-button class="editor-btn" type="primary" @click="returnPage">返回</el-button>
        </div>


         <!-- 查看借条 -->
        <el-dialog title="借条信息" :visible.sync="dialogUpdate" width="600px" v-if="dialogUpdate">
            <div class="agreement-header">
                <div class="header-right">
                  <img src="/static/img/a.png" alt="">
                  <p style="font-size: 13px;color: #b5b6b7;transform: translateX(-13px);">TS.8729327821</p>
                </div>
                <p>贷款人: 陆海波</p>
                <p>贷款人身份证: 6205231985****0114</p>
                <div class="text">
                  <p>借款人:{{basic[0].name}}</p>
                  <p>借款人身份证号:{{idCard}}</p>
                  <p>今有借款人向贷款人借款人民币:{{argreementList.loan_amount}}元。借款时间为{{argreementList.loan_at}}期限为7天,如遇申请延迟还款,还款时间按期限自动延续。</p>
                  <img src="/static/img/c.png" alt="" class="limit-img" v-show="argreementList.status == 4">
                </div>
                <div class="flex-text">
                  <span style="position: relative;"><span style="position: relative;top:-19px;">贷款人:</span><img src="/static/img/b.png" alt="" class="bottom-img"><span style="font-size: 10px;position: absolute;bottom:-3px;left:95px;">{{randomNumber}}</span><span style="position: absolute;bottom:20px;left:95px;">陆海波</span></span>
                  <span style="position: relative;"><span style="position: relative;top:-19px;">借款人:</span><img src="/static/img/b.png" alt="" class="bottom-img"><span style="font-size: 10px;position: absolute;bottom:-3px;left:95px;">{{randomNumber}}</span><span style="position: absolute;bottom:20px;left:95px;">{{basic[0].name}}</span></span>
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import { apiOrderDetail } from '@/service'
    export default {
        name: 'editor',
        data: function(){
            return {
                dialogUpdate: false,
                content: '',
                tableData: [],
                basic: [],
                bank: [],
                card: [],
                mobile: [],
                ali_pay: [],
                contacts: [],
                examine: [],
                approve: [],
                argreementList: {},
                id: this.$route.query.id||''
            }
        },
        computed: {
          randomNumber(){
            return parseInt(100000000*Math.random())
          },
          idCard(){
            let arr = this.basic[0].id_card.split('')
            arr.fill('*',10,14)
            return arr.join('')
          }
        },
        watch:{
           $route(newValue, oldValue){
               if(newValue.path == '/detail'){
                 this.id = newValue.query.id
                 this.getOrderDetail()
               }
           }
        },
        mounted(){
            this.id = this.$route.query.id
            this.getOrderDetail()
        },
        methods: {
            returnPage(){
               this.$router.go(-1)
            },
            checkImage(url){
              window.open(url)
            },
            checkOrderAgreement(row){
               console.log(row)
               let params = JSON.parse(JSON.stringify(row))
               params.loan_at = params.loan_at.split(' ')[0]
               this.argreementList = params
               this.dialogUpdate = true
            },
            getOrderDetail(){
              this.basic = []
              this.bank = []
              this.card = []
              this.mobile = []
              this.examine = []
              this.ali_pay = []
              apiOrderDetail({
                customer_id: this.id
              })
              .then((res)=>{
                console.log('detail',res)
                let detail = res.data
                if(detail.is_auth == 0){
                  detail.is_auth = '未认证'
                }
                if(detail.is_auth == 1){
                  detail.is_auth = '已认证'
                }
                if(detail.is_auth == 2){
                  detail.is_auth = '审核不通过'
                }
                let basic = {
                  name: detail.name?detail.name:detail.phone,
                  phone: detail.phone,
                  id_card: detail.bank_card.id_card,
                  created_at: detail.created_at,
                  is_auth: detail.is_auth
                }
                this.basic.push(basic)
                console.log('basic',this.basic)
                if(detail.ali_pay){
                  this.ali_pay.push(detail.ali_pay)
                }
                if(detail.bank_card){
                    this.bank.push(detail.bank_card)
                }
                if(detail.id_card){
                   detail.id_card.front = 'http://47.100.9.215:8088'+detail.id_card.front
                   detail.id_card.back = 'http://47.100.9.215:8088'+detail.id_card.back
                   detail.id_card.people = 'http://47.100.9.215:8088'+detail.id_card.people
                   this.card.push(detail.id_card)
                }
                if(detail.mobile_carrier){
                    this.mobile.push(detail.mobile_carrier)
                }
                this.contacts = detail.phone_list
                if(detail.examine){
                    this.examine.push(detail.examine)
                }
                if(detail.loans){
                   detail.loans.forEach(function(item){
                      switch (item.status) {
                          case 0:
                              item.state = '待审核';
                              break;
                          case 1:
                              item.state = '审核通过待放款';
                              break;
                          case 2:
                              item.state = '审核不通过';
                              break;
                          case 3:
                              item.state = '已放款';
                              break;
                          default:
                              item.state = '已还款';
                              break;
                      }
                    })
                   this.approve = detail.loans
                }
              })
            }
        }
    }
</script>
<style scoped>
    .editor-btn{
        margin-top: 10px;
    }
    .title{
        margin-bottom: 20px;
        margin-top: 20px;
    }
    .agreement-header{
      width: 100%;
      background: #ffffff;
      padding:15px;
      box-sizing: border-box;
      font-size: 16px;
      line-height: 25px;
    }
    .text{
      margin-top: 3px;
      margin-bottom: 30px;
      color: #b5b6b7;
      position: relative;
    }
    .limit-img{
      position: absolute;
      bottom: -50px;
      right: 130px;
      width: 120px;
      height: 120px;
    }
    .flex-text{
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
    }
    .header-right{
      float: right;
    }
    .header-right img{
      width: 60px;
      height: 60px;
    }
    .bottom-img{
      width: auto;
      height: 50px;
      margin-left:10px;
      margin-right: 5px;
    }
</style>