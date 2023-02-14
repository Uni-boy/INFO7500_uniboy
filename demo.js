function exchaneWine(price = 3, caps = 5, bottles = 2, money = 270) {
    // 防止死循环
    if (caps == 1 || bottles == 1) {
      return NaN;
    }
    // 3 5 2 270
    let buy = Math.floor(money / price);
    // 现在的酒， 瓶盖， 瓶子
    let wines = 0,
      nowCaps = 0,
      nowBottles = 0;
    (wines += buy), (nowBottles += buy), (nowCaps += buy);
    // 递归换酒
    function exchange(nowCaps, nowBottles) {
      // console.log("caps : ", nowCaps, "bottles: ", nowBottles, "wines: ", wines);
      // 递归出口, 瓶盖和瓶子都不够换
      if (nowBottles < bottles && nowCaps < caps) {
        return;
      }
      let exchangeNum1 = 0,
        exchangeNum2 = 0;
      exchangeNum1 = Math.floor(nowBottles / bottles);
      nowBottles %= bottles;
      exchangeNum2 = Math.floor(nowCaps / caps);
      nowCaps %= caps;
      wines += exchangeNum1 + exchangeNum2;
      exchange(
        nowCaps + exchangeNum1 + exchangeNum2,
        nowBottles + exchangeNum1 + exchangeNum2
      );
    }
    exchange(nowCaps, nowBottles);
    return wines;
  }
  
  console.log(exchaneWine(3, 5, 2, 270));