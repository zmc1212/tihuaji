/* 仪表盘:①纬数+循环相位 ②经线提沉图 ③梭位置 ④布面纹样 */
(function (MECH) {
  var el = {}, D = MECH.DIM;
  var soft = "rgba(233,238,242,0.5)";

  MECH.DASH = { panels: [
    { title: "WEFT · 纬数相位", meta: "一纬三段", dot: "teal",
      html: '<div class="big" id="d-weft">0</div><div class="k">已织纬数</div>' +
            '<div class="bar"><i id="d-bar"></i></div>' +
            '<div class="rowline"><span>段</span><b id="d-mode">—</b></div>',
      init: initWeft, draw: drawWeft },
    { title: "HARNESS · 经线提沉", meta: "8 组实时", dot: "blue", canvasH: 96, draw: drawHarness },
    { title: "SHUTTLE · 梭位置", meta: "±0.5 往复", dot: "yellow", canvasH: 96, draw: drawShuttle },
    { title: "PATTERN · 布面纹样", meta: "8 纬循环", dot: "green", canvasH: 96, draw: drawPattern }
  ] };

  function initWeft(sec) {
    el.weft = sec.querySelector("#d-weft");
    el.bar = sec.querySelector("#d-bar");
    el.mode = sec.querySelector("#d-mode");
  }

  function drawWeft(st, ph, pt, ctx, w, h) {
    if (el.weft) el.weft.textContent = String(st.weft);
    if (el.bar) el.bar.style.width = (st.tCyc / D.cycleT * 100) + "%";
    if (el.mode) el.mode.textContent = { lift: "提纤", shuttle: "投梭", beat: "打筘" }[st.mode] || "—";
  }

  /* ② 经线提沉:8 根小柱 */
  function drawHarness(st, ph, pt, ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    var base = h - 14;
    for (var k = 0; k < D.warpN; k++) {
      var x = 10 + k * (w - 20) / D.warpN;
      var lifted = (st.mode === "lift" && st.liftGroup === k + 1) || (st.mode !== "lift" && st.liftGroup === k + 1 && st.mode === "shuttle");
      var hh = lifted ? 10 + st.lift * 40 : 8;
      ctx.fillStyle = lifted ? "#7FD8D8" : "rgba(233,238,242,0.3)";
      ctx.fillRect(x, base - hh, (w - 20) / D.warpN - 6, hh);
      ctx.fillStyle = soft;
      ctx.font = "600 7px Menlo, monospace";
      ctx.textAlign = "center";
      ctx.fillText(k + 1, x + (w - 20) / D.warpN / 2 - 3, base + 10);
    }
    ctx.fillStyle = soft;
    ctx.font = "600 7.5px Menlo, monospace";
    ctx.textAlign = "left";
    ctx.fillText("提起组 " + st.liftGroup + "(纹样第 " + (st.weft % 8 + 1) + " 纬)", 4, 10);
  }

  /* ③ 梭位置条 */
  function drawShuttle(st, ph, pt, ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    var mid = h / 2;
    ctx.strokeStyle = "rgba(233,238,242,0.3)";
    ctx.beginPath(); ctx.moveTo(8, mid); ctx.lineTo(w - 8, mid); ctx.stroke();
    var px = 8 + (st.shuttleX + 0.5) * (w - 16);
    ctx.fillStyle = "#B08D57";
    ctx.beginPath();
    ctx.ellipse(px, mid, 10, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = soft;
    ctx.font = "600 7.5px Menlo, monospace";
    ctx.textAlign = "left";
    ctx.fillText("x = " + (st.shuttleX * 100).toFixed(0) + "%", 4, 10);
  }

  /* ④ 布面纹样:重绘 cloth 记录 */
  function drawPattern(st, ph, pt, ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    var colors = { 0: "#D8C08E", 1: "#7FD8D8", 2: "#E86A9E", 3: "#E9C93C" };
    for (var k = 0; k < st.cloth.length; k++) {
      var g = st.cloth[k];
      for (var y = 0; y < 8; y++) {
        var lifted = D.pattern[k % D.pattern.length] === y + 1;
        ctx.fillStyle = lifted ? "#3A3E44" : (y % 2 ? "#D8C08E" : "#C8A96E");
        ctx.fillRect(8 + k * (w - 16) / D.clothMax, 12 + y * 7, Math.max(1, (w - 16) / D.clothMax - 1), 6);
        if (lifted) {
          ctx.fillStyle = "#E9C93C";
          ctx.fillRect(8 + k * (w - 16) / D.clothMax, 12 + y * 7, Math.max(1, (w - 16) / D.clothMax - 1), 1);
        }
      }
    }
    ctx.fillStyle = soft;
    ctx.font = "600 7.5px Menlo, monospace";
    ctx.textAlign = "left";
    ctx.fillText("黄标 = 该纬提起的经线(花纹)", 4, h - 4);
  }
})(window.MECH = window.MECH || {});
