/* 提花机(花机) — 尺寸常量与提沉-投梭循环
   文献依据:《天工开物·乃服》花机图(“凡织花纹,必用提花机……挽花工
   坐于花楼,以下提纤线”);八段子母循环纹样。
   循环:①挽花工提纤(经线组按纹样提沉)②投梭引纬③打筘推纬成布。
   载入断言:每纬提沉组 = pattern[k mod 8];布长 = 纬数 × 纬距。 */
(function (MECH) {
  var CHI = 0.3;
  var D = {
    CHI: CHI,
    warpN: 8,               // 经线 8 组(演示)
    pattern: [1, 0, 2, 0, 3, 0, 2, 1],   // 每纬提起的经线组号(0=平织)
    weftGap: 0.045,         // 纬距
    cycleT: 2.4,            // 一纬循环
    shuttleT: 0.9,          // 投梭时长
    clothMax: 48            // 布面最大纬数(纹理缓存)
  };
  D.phases = [               // 一纬循环三段
    { id: "lift", t: 0.7 },      // 提纤(经线提沉)
    { id: "shuttle", t: 0.9 },   // 投梭
    { id: "beat", t: 0.8 }       // 打筘
  ];

  function newState() {
    return {
      time: 0, tCyc: 0, weft: 0,          // 已织纬数
      mode: "lift", modeT: 0, _pi: 0, _logged: false, _shuttleDir: 1,
      lift: 0,                             // 提沉量 0..1
      liftGroup: D.pattern[0],             // 当前提起组(首纬=纹样[0])
      shuttleX: -0.5,                      // 梭位置 -0.5..+0.5
      beat: 0,                             // 打筘量
      cloth: [],                           // 布面纹样记录 [liftGroup,...]
      lastPhase: "", manual: false, _key: false
    };
  }

  function step(st, dt) {
    st.time += dt;
    st.modeT += dt;
    var ph = D.phases[st._pi || 0];
    /* 状态机 */
    if (st.modeT >= ph.t) {
      st.modeT = 0;
      st._pi = ((st._pi || 0) + 1) % 3;
      ph = D.phases[st._pi];
      st.mode = ph.id;
      if (ph.id === "lift") {              // 新一纬:换纹样组
        st.liftGroup = D.pattern[st.weft % D.pattern.length];
        st._logged = false;
      }
      if (ph.id === "shuttle") st._shuttleDir = st._shuttleDir === -1 ? 1 : -1;
      if (ph.id === "lift" && st._prevWeft !== undefined && st.weft === st._prevWeft) { /* no-op */ }
    }
    st.mode = D.phases[st._pi || 0].id;
    /* 分段量 */
    var f = Math.min(1, st.modeT / ph.t);
    if (ph.id === "lift") {
      st.lift = 1 - f;                     // 提起→放下
    } else if (ph.id === "shuttle") {
      st.lift = 0.25;
      st.shuttleX = (st._shuttleDir || 1) * (f * 2 - 1) * 0.5;
    } else {
      st.lift = 0.15;
      st.shuttleX = (st._shuttleDir || 1) * -0.5;
      st.beat = Math.sin(f * Math.PI);
      /* 打筘末记录布纹 */
      if (f > 0.95 && !st._logged) {
        st._logged = true;
        st.weft += 1;
        st.cloth.push(st.liftGroup);
        if (st.cloth.length > D.clothMax) st.cloth.shift();
      }
    }
  }

  MECH.DIM = D;
  MECH.KS = { newState: newState, step: step };

  (function selfCheck() {
    var errs = [];
    var st = newState();
    for (var i = 0; i < 5000 && st.weft < 24; i++) step(st, 1 / 120);
    if (st.weft !== 24) errs.push("织纬计数异常: " + st.weft);
    /* 花纹循环一致性:cloth[k] = pattern[k mod 8] */
    for (var k = 0; k < st.cloth.length; k++) {
      if (st.cloth[k] !== D.pattern[k % D.pattern.length]) { errs.push("纹样错位 @" + k); break; }
    }
    if (errs.length) {
      if (window.MECH_SHOW_BOOT_ERROR) window.MECH_SHOW_BOOT_ERROR("提花机自检失败: " + errs.join(";"));
      throw new Error(errs.join(";"));
    }
  })();
})(window.MECH = window.MECH || {});
