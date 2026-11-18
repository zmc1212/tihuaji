/* 时间线(44s):机架 → 花楼 → 经线纤绳 → 梭筘 → 布面 → 连织演示 → 特写 → 手动单纬 */
(function (MECH) {
  var KS = MECH.KS, D = MECH.DIM;

  MECH.PHASES = [
    { id: "frame", name: "FRAME · 机架经轴布轴", dur: 4, dot: "yellow", mode: "ASSEMBLING",
      cam: { theta: 0.55, phi: 1.20, r: 5.0, target: [0, 0.9, 0] }, drift: 0.03 },
    { id: "tower", name: "TOWER · 花楼", dur: 4, dot: "teal", mode: "ASSEMBLING",
      cam: { theta: -0.4, phi: 1.22, r: 4.6, target: [0, 1.3, -0.4] }, drift: 0.01 },
    { id: "warps", name: "WARPS · 经线纤绳", dur: 5, dot: "orange", mode: "ASSEMBLING",
      cam: { theta: 0.15, phi: 1.24, r: 3.4, target: [0, 1.0, 0] }, drift: 0.008 },
    { id: "shuttle", name: "SHUTTLE · 梭与筘", dur: 4, dot: "blue", mode: "ASSEMBLING",
      cam: { theta: 0.65, phi: 1.22, r: 3.0, target: [0, 0.75, 0.1] }, drift: 0.01 },
    { id: "cloth", name: "CLOTH · 布面成纹", dur: 3, dot: "pink", mode: "READY",
      cam: { theta: 0.20, phi: 1.10, r: 3.0, target: [0.4, 0.7, 0.2] }, drift: 0.008 },
    { id: "weave", name: "WEAVE · 连织演示(8 纬循环)", dur: 10, dot: "green", mode: "WEAVING",
      cam: { theta: 0.60, phi: 1.20, r: 4.6, target: [0, 0.9, 0.1] }, drift: 0.01 },
    { id: "closeup", name: "CLOSE · 提沉投梭特写", dur: 8, dot: "yellow", mode: "CLOSE-UP",
      cam: { theta: 0.20, phi: 1.28, r: 2.4, target: [-0.2, 0.9, 0.15] }, drift: 0.006 },
    { id: "summary", name: "SUMMARY · 纹样布面", dur: 6, dot: "green", mode: "REVIEW",
      cam: { theta: 0.10, phi: 1.10, r: 3.4, target: [0.4, 0.75, 0.2] }, drift: 0.03 }
  ];
  MECH.PHASE_IDS = ["frame", "tower", "warps", "shuttle", "cloth", "weave", "closeup", "summary"];

  MECH.newState = KS.newState;

  MECH.tick = function (st, ph, pt, dt) {
    if (ph.id !== st.lastPhase) {
      st.lastPhase = ph.id;
      var run = ph.id === "weave" || ph.id === "closeup";
      if (!run) st._pi = 0;                  // 装配段状态机复位
      st._hold = !run;
    }
    if (!st._hold) {
      KS.step(st, dt);
    }
    /* 投梭 → 梭尾尘 */
    if (st.mode === "shuttle" && st.modeT < 0.05 && Math.random() < 0.4) {
      MECH.Scene3D.spawnPuff(st._shuttleDir * -0.6, 0.68, 0.13, {
        max: 0.4, base: 0.10, vx: st._shuttleDir * 0.4, vy: 0.1, vz: 0, opacity: 0.5, tint: 0xBFD8E8, grow: 1.2
      });
    }
  };

  MECH.status = function (st, ph, pt) {
    var pill = ph.name;
    if (ph.id === "weave" || ph.id === "closeup") {
      pill = ph.name + " · 第 " + st.weft + " 纬 · " + st.mode;
    }
    return {
      mode: ph.mode,
      hot: st.mode === "shuttle",
      pill: pill,
      a: "纬 " + st.weft,
      b: "提组 " + (st.mode === "lift" ? st.liftGroup : st.cloth.length ? st.cloth[st.cloth.length - 1] : st.liftGroup),
      c: "布 " + (st.weft * D.weftGap * 100).toFixed(0) + " cm"
    };
  };

  MECH.pinnedFor = function (ph) {
    function E(id) { var e = MECH.Parts.entry(id); return e ? (e.anchor || e.group) : null; }
    if (ph.id === "tower") return [{ id: "p-tw", obj: E("tower"), text: "花楼 · 挽花工提纤" }];
    if (ph.id === "warps") return [
      { id: "p-wp", obj: E("warps"), text: "经线 8 组 · 分组提沉" },
      { id: "p-h", obj: E("harness"), text: "纤绳束 · 花楼连经线", tone: "white" }
    ];
    if (ph.id === "shuttle") return [
      { id: "p-sh", obj: E("shuttle"), text: "梭 · 投梭引纬" },
      { id: "p-rd", obj: E("reed"), text: "筘 · 打筘推纬", tone: "white" }
    ];
    if (ph.id === "weave" || ph.id === "closeup" || ph.id === "summary") return [
      { id: "p-tw", obj: E("tower"), text: "挽花提纤 → 投梭 → 打筘", tone: "white" },
      { id: "p-c", obj: E("cloth"), text: "布面纹样 8 纬循环" }
    ];
    return [];
  };
})(window.MECH = window.MECH || {});
