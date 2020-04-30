<template>
  <div class="pagemain" id="pagemain">
    <div class="activity-container">
      <div class="bgimgs">
        <img v-for="(li,index) in imgs.bgimgs" :key="index" :src="li" alt />
        <img class="footer" :src="imgs.footer" alt />
      </div>
      <!-- 浮动按钮 -->
      <div @click="share" class="share-btn flex center center-line">
        <div class="text">分享</div>
      </div>
      <div class="logo bgbox" :style="{'background-image':`url(${imgs.logo})`}"></div>

      <!-- 优惠券分类 -->
      <div v-if="cates.length" class="activity-main">
        <div class="couponimg bgbox" :style="{'background-image':`url(${imgs.activity})`}"></div>
        <div class="cates flex space-between">
          <div
            class="item flex center center-line"
            @click="catesActive=index"
            v-for="(li,index) in cates"
            :key="index"
            :class="{active:catesActive==index}"
          >{{li.name}}</div>
        </div>
        <!-- 幻灯片 -->

        <div class="banner">
          <swiper
            v-if="cates[catesActive].display=='swiper'"
            ref="mySwiper"
            :options="swiperOptions"
          >
            <swiper-slide v-for="(li,index) in cates[0].list" :key="index">
              <div class="swiper-coupon flex space-between wrap">
                <!-- 图片列表 -->

                <div
                  v-for="(row,index_row) in li.list"
                  :key="index_row"
                  :class="`item item-${index} swiper-item-${index_row} ${row.class ||''}`"
                  :style="{'background-image':`url(${row.img})`}"
                >
                  <div class="title">{{row.title || ''}}</div>
                  <div v-if="row.desc" class="desc textover-2">{{row.desc}}</div>
                  <div v-if="row.type" class="coupon-text">{{row.type || ''}}</div>
                </div>
              </div>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>

          <div v-else class="banner-body flex space-between wrap">
            <!-- 普通图片展示栏目 -->
            <div
              :class="`item item-${index} ${row.class ||''}`"
              v-for="(row,index) in (cates[catesActive].list || [])"
              :key="index"
              :style="{'background-image':`url(${row.img})`}"
            >
              <div class="title">{{row.title || ''}}</div>
              <div v-if="row.desc" class="desc textover-2">{{row.desc}}</div>
              <div v-if="row.type" class="coupon-text">{{row.type || ''}}</div>
            </div>
          </div>
        </div>

        <div class="buy">
          <button @click="toBuy" class="btn">立即购买</button>
        </div>

        <div class="explain">
          <div class="img bgbox" :style="{'background-image':`url(${imgs.explain})`}"></div>
          <div class="content flex column space-between">
            <div class="item" v-for="(li,index) in explain" :key="index" v-html="li"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 弹出层 购买 -->
    <div v-if="detailVisible" class="shadow">
      <div class="celldata flex column" :class="{type2:detailType==2}">
        <div class="title flex center-line center">
          <span>{{detailType==1?'确认礼包清单':'购买获得的礼包券'}}</span>
          <div @click="closeDetail" class="icon icon-close icon-close-right-top"></div>
        </div>

        <div class="celldata-body">
          <div v-for="(cate,index) in cates" :key="'s1'+index" class="cell-panels">
            <div class="title">{{cate.name}}</div>

            <template v-if="cate.display=='swiper'">
              <template v-for="(li,index_cate) in cate.list">
                <div
                  v-for="(row,index2) in li.list"
                  :key="'s3'+index_cate + index2"
                  :class="`item ${row.class || ''}`"
                >
                  <div class="left">
                    <div class="title">{{row.title || ''}}</div>
                    <div v-if="row.desc" class="desc textover-2">{{row.desc}}</div>
                  </div>
                  <div class="right">
                    <div v-if="row.type" class="coupon-text">{{row.type || ''}}</div>
                  </div>
                </div>
              </template>
            </template>

            <template v-else>
              <div
                v-for="(row,index2) in cate.list"
                :key="'s2'+index2"
                :class="`item ${row.class || ''}`"
              >
                <div class="left">
                  <div class="title textover-2">{{row.title || ''}}</div>
                  <div v-if="row.desc" class="desc textover-2">{{row.desc}}</div>
                </div>
                <div class="right">
                  <div v-if="row.type" class="coupon-text">{{row.type || ''}}</div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <div
          class="celldata-footer flex center-line"
          :class="{center:detailType==2,'space-between':detailType!=2}"
        >
          <template v-if="detailType==1">
            <div class="left">
              <div class="price">
                <span class="icon-price">¥</span>
                <span>{{price}}</span>
              </div>
              <div class="tip">{{priceText}}</div>
            </div>
            <div class="right">
              <button @click="toPay" class="btn">去付款</button>
            </div>
          </template>

          <template v-else-if="detailType==2">
            <button @click="toZoolife" class="viewgzh btn">前往公众号查看</button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import weixinPayMixins from "./weixinPayMixins";
function preDev(e) {
  e.preventDefault();
}

function lockScroll() {}

let htmltop = 0;

export default {
  mixins: [weixinPayMixins],
  components: {},
  data() {
    return {
      wechat_notice: "请在微信打开",
      share_notice: "点击右上角图标在浏览器里打开",
      price: "38.00",
      priceText: "获得价值138元代金券",

      title: "标题",
      //配置图片链接
      zoolifeLink: "https://auth.zoocoffee.net/zoolife/member",
      imgs: {},
      cates: [],
      catesActive: 0,
      swiperOptions: {
        pagination: {
          el: ".swiper-pagination"
        }
        // Some Swiper option/callback...
      },
      //活动说明
      explain: [],
      //显示详情
      detailVisible: false,
      // 1普通 2弹出层
      detailType: 1,
      //已购买过
      isPayEd: false,
      //支付操作锁定
      toPayLock: false
    };
  },
  watch: {
    detailVisible(newValue, oldValue) {
      this.$popup.updateLockStatus(newValue, "laborday");
    }
  },
  created() {
    this.init();

    //门店id
    let restId = this.$route.query.restId || false;
    if (restId) {
      localStorage.restId = restId;
    }

    let code = this.$route.query.code || false;
    // console.log(code,restId);
    this.$auth.getOpenid(code);
  },
  methods: {
    init() {
      let {
        //是否开启缓存
        cache,
        
      } = window.activitySetting || {};

      let setData = res => {
        document.querySelector("title").innerHTML = res.data.title || "51活动";
        this.cates = res.data.cates;
        this.explain = res.data.explain;
        this.imgs = res.data.imgs;
        this.zoolifeLink = res.data.zoolifeLink;

        this.wechat_notice = res.data.wechat_notice;
        this.share_notice = res.data.share_notice;

        this.price = res.data.price;
        this.priceText = res.data.priceText;

        //初始化分享
        let { restId } = localStorage;
        let shareData = res.data.share;
        if (restId) {
          shareData.link += restId;
        }
        this.$share.wechatInit(shareData);
      };
      //加载缓存
      if (cache) {
        let { notes } = localStorage;
        if (notes) {
          try {
            notes = JSON.parse(notes);
          } catch (e) {}
          if (notes) {
            setData(notes);
            return;
          }
        }
      }

      this.$http.get("activity/notes", {}).then(res => {
        if (res.code != 200) {
          this.$toast(res.msg);
          return;
        }
        localStorage.setItem("notes", JSON.stringify(res));
        setData(res);
      });
    },
    name() {},
    toZoolife() {
      window.location.href = this.zoolifeLink;
    },
    share() {
      //打开分享
      this.$share.open({
        text: this.share_notice
      });
    },
    closeDetail() {
      this.detailVisible = false;
    },
    /**
     * 下单
     */
    order() {},
    toBuy() {
      this.detailType = 1;
      this.detailVisible = true;
    },
    move(e) {
      console.log("scroll", e);
    },
    pagemainMove(e) {
      console.log(e);
      // if(this.detailVisible){
      //   e.preventDefault();
      // }
    },
    toPay() {
      if (!this.isWeixin()) {
        this.$toast(this.wechat_notice);
        return;
      }
      // 未登录是否前往登录
      let isLogin = this.$auth.isLogin(true);
      if (isLogin) {
        let params = {};
        let { restId } = localStorage;

        if (restId) {
          params.restId = restId;
        }
        //下单
        this.$http
          .post("activity/creatOrder", {
            token: this.$auth.getToken(),
            ...params
          })
          .then(res => {
            if (res.code != 200) {
              this.$toast(res.msg);
              return;
            }

            let { order_id, order_number } = res.data;

            //
            this.$http
              .post("activity/pay", {
                token: this.$auth.getToken(),
                order_number: order_number
              })
              .then(res2 => {
                if (res2.code != 200) {
                  this.$toast(res.msg);
                  return;
                }

                this.weixinPayMixins_orderNumber = order_number;
                //jsapi参数
                this.weixinPayMixins_orderInfo = res2.data.payInfo;
                //唤起支付
                this.weixinPayMixins_callWeixinPay(() => {
                  this.isPayEd = true;
                  this.showOrder();
                });

                let payData = payData;
              });
          });
      }
    },
    /**
     * 购买完成 显示订单
     */
    showOrder() {
      this.detailType = 2;
      this.detailVisible = true;
    },
    //判断是否是微信浏览器的函数
    isWeixin() {
      //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
      //通过正则表达式匹配ua中是否含有MicroMessenger字符串
      var ua = navigator.userAgent.toLowerCase();
      var isWeixin = ua.indexOf("micromessenger") != -1;
      return isWeixin;
    }
  }
};
</script>

<style lang="scss">
$borderRadius: 0.5rem;
.swiper-pagination-bullet {
  background-color: #829f42;
  opacity: 0.3;
  &.swiper-pagination-bullet-active {
    opacity: 1;
  }
}

.bgbox {
  background-size: 100% 100%;
}

.activity-container {
  width: 18.75rem;
  overflow-x: hidden;
  // 分享按钮1
  .share-btn {
    position: absolute;
    top: 2.45rem;
    right: 0;

    width: 2.5rem;
    height: 1.4rem;
    background: rgba(239, 177, 77, 1);
    border: 0.03px solid rgba(255, 255, 255, 1);
    box-shadow: 1px 5px 5px 1px rgba(66, 66, 66, 0.73);
    border-radius: 1rem 0 0 1rem;
    border: 2px solid white;
    border-right: none;

    .text {
      font-size: 0.7rem;
      font-family: PingFang SC;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
    }
  }

  .logo {
    width: 3.5rem;
    height: 1.48rem;
    position: absolute;
    top: 0;
    right: 1.02rem;
  }

  //   背景图
  .bgimgs {
    position: relative;
    width: 100%;
    img {
      width: 100%;
    }
    .footer {
      position: absolute;
      left: 0;
      bottom: 0;
    }
  }
  $itemBottom: 0.47rem;
  .activity-main {
    position: absolute;
    width: 100%;
    overflow: hidden;
    top: 22.85rem;
    .couponimg {
      width: 15.25rem;
      height: 2.8rem;
      margin-left: 1.73rem;
    }
    > .img {
      width: 15.25rem;
      height: 2.8rem;
      position: absolute;
      top: 0.93rem;
    }
    // 分类
    .cates {
      padding: 0 1.78rem;
      margin-bottom: 0.98rem;
      margin-top: 1.1rem;
      .item {
        width: 4.43rem;
        height: 1.73rem;
        background: rgba(130, 159, 66, 1);
        border-radius: 1rem;

        font-size: 0.8rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        opacity: 0.5;
        &.active {
          opacity: 1;
        }
      }
    }
    // 幻灯片暂时
    .banner {
      width: 18.75rem;

      //赠送优惠券容器
      .swiper-coupon,
      .banner-body {
        padding: 0 0.63rem;
      }

      .item {
        height: 4.5rem;
        background-repeat: no-repeat;
        background-position: right bottom;
        background-size: auto 100%;
        width: 8.45rem;
        border-radius: $borderRadius;
        position: relative;
        background-color: white;
        padding: 0.53rem 0.48rem;
        margin-bottom: $itemBottom;

        // ## ui差异兼容
        //幻灯片第二页
        &.item-1 {
          .title {
            width: 8.8rem;
          }
          .coupon-text {
            top: 2.88rem;
          }
        }

        &.free {
          .coupon-text {
            font-size: 0.75rem;
          }
        }
        &.free.give {
          .coupon-text {
            font-size: 0.7rem;
          }
        }

        &.item-0.swiper-item-0 {
          .coupon-text {
            top: 1.6rem;
          }
        }
        &.item-0.swiper-item-3 {
          .coupon-text {
            top: 1.6rem;
          }
        }

        &.full {
          width: 100%;
        }

        .title {
          font-size: 0.65rem;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
        }

        &.full {
          .desc {
            width: 7.8rem;
          }
        }

        // ##

        .desc {
          position: absolute;
          left: 0.5rem;
          top: 1.48rem;
          font-size: 0.55rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          margin-bottom: 0.63rem;
          // margin-top: 0.33rem;
          width: 4.33rem;
        }

        .coupon-text {
          position: absolute;
          left: 0.5rem;
          top: 3.15rem;
          font-size: 0.7rem;
          font-family: PingFang SC;
          font-weight: bold;
          color: rgba(130, 159, 66, 1);
        }
      }
    }

    > .buy {
      margin-top: 2.08rem - $itemBottom;
      padding: 0 0.613rem;
      .btn {
      }
    }

    // 活动说明
    .explain {
      padding: 0.63rem;
      > .bgbox {
        width: 11.38rem;
        height: 1.1rem;
        margin-left: 3.7rem - 0.63rem;
        margin-top: 1.75rem;
        margin-bottom: 1.4rem;
      }
      .content {
        min-height: 13.13rem;
        font-size: 0.65rem;
        font-family: PingFang SC;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        text-align: justify;
        .item {
          width: 100%;
        }
      }
    }
  }
}

//点击区域优化 扩大选取
@mixin touchArea {
  position: relative;

  &:before {
    content: "";
    position: absolute;
    z-index: 180;
    left: -70%;
    right: -70%;
    top: -70%;
    bottom: -70%;
  }
}

.share {
  font-size: 28px;
  font-family: PingFang SC;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
}
.icon {
  width: 0.55rem;
  height: 0.55rem;
  background-size: cover;
  @include touchArea;

  &.icon-close {
    background-image: url(/coupon2051/static/img/laborday/close.png);
    &.icon-close-right-top {
      position: absolute;
      right: 0.9rem;
      top: 1.05rem;
    }
  }
}

@mixin transformToCenter {
  position: absolute;
  left: 50%;
  transform: translate(-50%);
}
//礼包清单数据
.celldata {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 83.95vh;
  background-color: #ffffff;

  //查看详情 弹出层模式
  &.type2 {
    @include transformToCenter;
    width: 14.68rem;
    top: 6vh;
    max-height: 89vh;
    border-radius: $borderRadius;
  }

  > .title {
    border-bottom: 1px solid #f4f4f4;
    font-size: 0.9rem;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(17, 17, 17, 1);
    min-height: 2.63rem;
    position: relative;
  }
  .celldata-body {
    overflow-y: scroll;

    padding: 0 0.83rem;

    .cell-panels {
      padding-bottom: 0.88rem;
      & + .cell-panels {
        border-top: 1px solid #f4f4f4;
      }
      > .title {
        font-size: 0.8rem;
        font-family: PingFang SC;
        font-weight: 600;
        color: rgba(131, 163, 61, 1);
        margin-bottom: 0.9rem;
        margin-top: 0.85rem;
        padding-left: 0.6rem;
        line-height: 1;
        position: relative;
        &:before {
          position: absolute;
          content: "";
          width: 0.2rem;
          height: 0.78rem;
          background: rgba(131, 163, 61, 1);
          border-radius: 0.1rem;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }

      .item {
        & + .item {
          margin-top: 0.73rem;
        }
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title {
          //   width: 6.03rem;
          width: 7.5rem;
          font-size: 0.65rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
        }
        .desc {
          font-size: 0.55rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          margin-top: 0.38rem;
        }
        .coupon-text {
          font-size: 0.65rem;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(131, 163, 61, 1);
        }
      }
    }
  }

  .celldata-footer {
    border-top: 0.3rem solid #fafafa;
    min-height: 3.33rem;
    background: rgba(255, 255, 255, 1);
    padding: 0 0.83rem;
    border-radius: 0rem 0rem $borderRadius $borderRadius;

    .viewgzh {
      // width: 7.6rem;
      width: unset;
      padding: 0rem 1.02rem;
      line-height: 1.75rem;
      background: rgba(239, 177, 77, 1);
      border-radius: 1rem;
    }

    .left {
      .price {
        .icon-price {
          font-size: 0.75rem;
        }
        font-size: 1.2rem;
        font-family: PingFang SC;
        font-weight: 600 !important;
        color: rgba(239, 177, 77, 1);
      }
      .tip {
        font-size: 0.7rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
      }
    }
    .right {
      .btn {
        line-height: 2.2rem;
        width: 7.6rem;
        background: rgba(239, 177, 77, 1);
        border-radius: 1rem;
      }
    }
  }
}

.swiper-container {
  overflow: visible !important;
}
.swiper-container-horizontal > .swiper-pagination-bullets {
  top: 9.6rem;
  bottom: unset;
}

.free {
  .coupon-text {
    color: #efb14d !important;
  }
}
// .pagemain{
//   position: fixed;
//   left: 0;
//   top: 0;
//   bottom: 0;
//   right: 0;
//   z-index: 100;
//   overflow-x: scroll;
// }
</style>