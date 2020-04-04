<!-- 客户详情 -->
<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>订单详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <p class="title">基础信息</p>
            <el-table :data="basic" border style="width: 100%">
                <el-table-column prop="created_at" label="日期" sortable></el-table-column>
                <el-table-column prop="name" label="用户名" sortable></el-table-column>
                <el-table-column prop="phone" label="手机号"></el-table-column>
                <el-table-column prop="is_auth" label="认证状态"></el-table-column>
                <el-table-column prop="agent" label="操作系统"></el-table-column>
            </el-table>
            <p class="title">银行卡数据</p>
            <el-table :data="bank" border style="width: 100%">
                <el-table-column prop="created_at" label="日期" sortable></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="id_card" label="身份证"></el-table-column>
                <el-table-column prop="bank_card" label="银行卡号"></el-table-column>
                <el-table-column prop="bank_name" label="银行名称"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
            </el-table>
            <p class="title">身份证信息</p>
            <el-table :data="card" border style="width: 100%">
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
            <el-table :data="mobile" border style="width: 100%">
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
            <el-table :data="examine" border style="width: 100%">
                <el-table-column prop="created_at" label="日期" sortable></el-table-column>
                <el-table-column prop="front_remark" label="返回给 app 的意见"></el-table-column>
                <el-table-column prop="back_remark" label="后台意见"></el-table-column>
                <el-table-column prop="quota" label="额度"></el-table-column>
                <el-table-column prop="rate" label="费率"></el-table-column>
            </el-table>
            <p class="title">通讯录数据</p>
            <el-table :data="contacts" border style="width: 100%">
                <el-table-column prop="created_at" label="日期" sortable></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="phone" label="电话"></el-table-column>
            </el-table>
            <p class="title">通话记录</p>
            <el-table :data="recordList" border style="width: 100%">
                <el-table-column prop="time" label="通话时间" sortable></el-table-column>
                <el-table-column prop="name" label="通话人"></el-table-column>
                <el-table-column prop="phone" label="通话电话"></el-table-column>
                <el-table-column prop="type" label="通话类型"></el-table-column>
            </el-table>
            <el-button class="editor-btn" type="primary" @click="returnPage">返回</el-button>
        </div>
    </div>
</template>

<script>
    import {apiAccountDetail} from '@/service'
    export default {
        name: 'editor',
        data: function(){
            return {
                content: '',
                basic: [],
                bank: [],
                card: [],
                mobile: [],
                ali_pay: [],
                contacts: [],
                id: this.$route.query.id||'',
                examine: [],
                recordList: []
            }
        },
        watch:{
            $route(newValue, oldValue){
                if(newValue.path == '/account-detail'){
                  this.id = newValue.query.id
                  this.getAccountDetail()
                }
            }
        },
        mounted(){
            this.id = this.$route.query.id
            this.getAccountDetail()
        },
        methods: {
            returnPage(){
               this.$router.go(-1)
            },
            checkImage(url){
              window.open(url)
            },
            getAccountDetail(){
              this.basic = []
              this.bank = []
              this.card = []
              this.mobile = []
              this.examine = []
              this.ali_pay = []
              apiAccountDetail({
                customer_id: this.id
              })
              .then((res)=>{
                console.log('detail',res)
                let detail = res.data
                let basic = {
                  name: detail.name?detail.name:detail.phone,
                  phone: detail.phone,
                  created_at: detail.created_at,
                  is_auth: detail.is_auth,
                  agent: detail.agent
                }
                if(basic.is_auth == 0){
                  basic.is_auth = '未认证'
                }
                if(basic.is_auth == 1){
                  basic.is_auth = '已认证'
                }
                if(basic.is_auth == 2){
                  basic.is_auth = '审核不通过'
                }
                this.basic.push(basic)
                if(detail.bank_card){
                  this.bank.push(detail.bank_card)
                }
                if(detail.call_record && detail.call_record.length){
                  this.recordList = detail.call_record
                }
                if(detail.ali_pay){
                  this.ali_pay.push(detail.ali_pay[0])
                }
                if(detail.id_card){
                  detail.id_card.front = 'http://47.100.9.215:8088'+detail.id_card.front
                  detail.id_card.back = 'http://47.100.9.215:8088'+detail.id_card.back
                  detail.id_card.people = 'http://47.100.9.215:8088'+detail.id_card.people
                  this.card.push(detail.id_card)
                }
                if(detail.mobile_carrier){
                  this.mobile.push(detail.mobile_carrier[0])
                }
                if(detail.phone_list){
                  this.contacts = detail.phone_list
                }
                if(detail.examine){
                    this.examine.push(detail.examine)
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
</style>