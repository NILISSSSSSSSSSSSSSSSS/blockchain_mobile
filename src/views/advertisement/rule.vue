<template>
  <div class="rule">
    <ul v-if="ruleInfo.trade">
      <li v-if="ruleInfo.trade === 'sell'">
         {{$t("advertisement.chuShou")}} <strong>{{ruleInfo.currency}}</strong>
         {{$t("advertisement.guangGaoZuiDiYuE")}} <strong>{{ruleInfo.minAmount}}</strong>,
         {{$t("advertisement.pleaseSureHasEnough")}} <strong>{{ruleInfo.currency}}</strong>
      </li>
      <li v-if="ruleInfo.adverFee === 'self'">
        {{$t("advertisement.faBu")}} <strong>{{ruleInfo.currency}}</strong>
        {{$t("advertisement.guangGaoShouQu")}} <strong>{{ruleInfo.advertiseCostAmount}}</strong>
        <strong>{{ruleInfo.currency}}</strong> {{$t("advertisement.guangGaoFei")}}
      </li>
      <li v-if="ruleInfo.adverFee === 'official'">
           {{$t("advertisement.faBu")}} <strong>{{ruleInfo.currency}}</strong>
           {{$t("advertisement.guangGaoShouQuJiaZhi")}}<strong>{{ruleInfo.advertiseCostAmount}}</strong>
          <strong>{{ruleInfo.currency}}</strong>  {{$t("advertisement.de")}}
          <strong>{{ruleInfo.officialFee}}</strong>
      </li>
      <li v-if="ruleInfo.adverFee === 'optional'">
        {{$t("advertisement.faBu")}} <strong>{{ruleInfo.currency}}</strong>
        {{$t("advertisement.guangGaoShouQu")}} <strong>{{ruleInfo.advertiseCostAmount}}</strong>
        <strong>{{ruleInfo.currency}}</strong> {{$t("advertisement.guangGaoFei")}}，
        {{$t("advertisement.youCanUse")}} <strong>{{ruleInfo.officialFee}}</strong>
        {{$t("advertisement.zhiFu")}} {{ruleInfo.officialFeePercent}}% {{$t("advertisement.zeKou")}}）
      </li>
      <li v-if="ruleInfo.orderFee === 'self' || ruleInfo.currency === ruleInfo.officialFee">
        <strong>{{ruleInfo.currency}}</strong> {{$t("advertisement.adShouXuFei")}}
        <strong>{{ruleInfo.orderFeePercent}}%</strong>，
       {{$t("advertisement.adShouXuFei2")}}
      </li>
      <li v-else-if="ruleInfo.orderFee === 'official'">
          <strong>{{ruleInfo.currency}}</strong>  {{$t("advertisement.adShouXuFei3")}}
          <strong>{{ruleInfo.orderFeePercent}}%</strong>
          <strong>{{ruleInfo.currency}}</strong> {{$t("advertisement.de")}}
          <strong>{{ruleInfo.officialFee}}</strong>，
          {{$t("advertisement.adShouXuFei2")}}
      </li>
      <li v-else-if="ruleInfo.orderFee === 'optional'" >
          <strong>{{ruleInfo.currency}}</strong>  {{$t("advertisement.adShouXuFei")}}
          <strong>{{ruleInfo.orderFeePercent}}%</strong>，
           {{$t("advertisement.adShouXuFei2")}}
          {{$t("advertisement.youCanUse")}} <strong>{{ruleInfo.officialFee}}</strong>
          {{$t("advertisement.zhiFu")}} （{{ruleInfo.officialFeePercent}}%   {{$t("advertisement.zeKou")}}）
      </li>
      <li>
         {{$t("advertisement.guangGaoYouXiaoQi")}}
        <strong>{{ruleInfo.adVisibleTime / (1000 * 60 * 60 * 24)}}</strong>
        {{$t("advertisement.adShouXuFei4")}}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    ruleInfo: Object
  }
}
</script>

<style lang="scss" scoped>
  .rule {
    background-color: #fff6ce;
    li {
      padding: 6px;
      color: #f60;
      strong {
        font-weight: 700;
        color: red;
      }
    }
  }
</style>
