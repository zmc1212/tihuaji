/* 图纸面板(B 键):花机侧视总图 + 循环状态机 + 尺寸表 */
(function (MECH) {
  var red = "#8C2F1E";

  MECH.BP = {
    no: "Fig. 12 · 复原总图",
    title: "提花机(花机) · 挽花提沉 · 投梭打筘",
    src: "《天工开物·乃服》花机图 · 双层结构(挽花工楼上 · 织工楼下)",
    draw: function (ctx, w, h) {
      var D = MECH.DIM;
      ctx.clearRect(0, 0, w, h);
      var chainH = 44, chainY = h - chainH - 12, topY = 34;
      var ink = "#2A2620";
      ctx.fillStyle = red;
      ctx.font = "700 11px Menlo, monospace";
      ctx.textAlign = "left";
      ctx.fillText("一纬循环 = 挽花提纤(经线按纹样提沉)→ 投梭引纬 → 打筘推纬 · 8 纬循环纹样", w * 0.045, topY - 10);

      /* ============ 左:侧视图 ============ */
      var S = Math.min(w * 0.44 / 3.2, (chainY - topY - 26) / 2.6);
      var ox = w * 0.05, oy = chainY - 16;
      var X = function (m) { return ox + (m + 1.4) * S; }, Y = function (m) { return oy - m * S; };
      ctx.strokeStyle = ink;
      ctx.fillStyle = ink;
      ctx.lineWidth = 1.4;
      ctx.font = "700 11px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("侧视 SIDE", ox, Y(2.5));
      /* 机架立柱 + 织口 */
      ctx.beginPath();
      ctx.moveTo(X(-0.95), Y(0.1)); ctx.lineTo(X(-0.95), Y(1.30));
      ctx.moveTo(X(0.95), Y(0.1)); ctx.lineTo(X(0.95), Y(1.30));
      ctx.stroke();
      ctx.strokeRect(X(-0.72), Y(0.73), 0.1 * S, 0.1 * S);
      ctx.strokeRect(X(0.72), Y(0.55), 0.1 * S, 0.1 * S);
      /* 经线(到织口) */
      ctx.beginPath();
      ctx.moveTo(X(-0.72), Y(0.78));
      ctx.lineTo(X(-0.2), Y(0.80));
      ctx.lineTo(X(-0.2), Y(0.62));
      ctx.stroke();
      /* 花楼 */
      ctx.strokeRect(X(-0.55), Y(1.05), 1.1 * S, 1.0 * S);
      ctx.font = "600 8px sans-serif";
      ctx.fillStyle = "rgba(42,38,32,0.6)";
      ctx.fillText("花楼(挽花工)", X(-0.55) + 4, Y(1.05) - 4);
      /* 纤绳 */
      ctx.strokeStyle = "rgba(42,38,32,0.5)";
      ctx.beginPath();
      ctx.moveTo(X(-0.3), Y(1.9));
      ctx.lineTo(X(-0.2), Y(0.92));
      ctx.moveTo(X(0.2), Y(1.9));
      ctx.lineTo(X(0.2), Y(0.92));
      ctx.stroke();
      /* 梭 + 筘 */
      ctx.beginPath(); ctx.ellipse(X(0.2), Y(0.68), 8, 3.5, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeRect(X(0.3), Y(0.60), 5, 14);
      ctx.fillText("梭", X(0.2) + 12, Y(0.68) - 4);
      ctx.fillText("筘", X(0.3) + 8, Y(0.60) - 4);
      /* 布面 */
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(X(-0.2), Y(0.64));
      ctx.lineTo(X(0.72), Y(0.60));
      ctx.stroke();
      ctx.setLineDash([]);

      /* ============ 右:循环状态机 ============ */
      var ox2 = w * 0.55;
      ctx.font = "700 11px sans-serif";
      ctx.fillStyle = ink;
      ctx.fillText("一纬循环 CYCLE", ox2, topY + 18);
      var gx = ox2, gy = topY + 32, gw = w - ox2 - 24, gh = chainY - gy - 44;
      ctx.strokeStyle = "rgba(42,38,32,0.5)";
      ctx.strokeRect(gx, gy, gw, gh);
      var steps = ["挽花提纤", "投梭引纬", "打筘成布"];
      for (var k = 0; k < 3; k++) {
        var y = gy + 12 + k * 22;
        ctx.strokeStyle = ink;
        ctx.strokeRect(gx + 10, y, 24, 16);
        ctx.font = "700 9px sans-serif";
        ctx.fillText(String(k + 1), gx + 19, y + 12);
        ctx.font = "700 10px sans-serif";
        ctx.fillText(steps[k], gx + 44, y + 12);
        ctx.font = "600 8.5px Menlo, monospace";
        ctx.fillStyle = "rgba(42,38,32,0.55)";
        var notes = ["纹样组经线提起 0.10", "梭 ±0.5 引纬 0.9s", "筘推纬入布口 0.8s"];
        ctx.fillText(notes[k], gx + 132, y + 12);
        ctx.fillStyle = ink;
        if (k < 2) {
          ctx.beginPath(); ctx.moveTo(gx + 22, y + 16); ctx.lineTo(gx + 22, y + 22); ctx.stroke();
        }
      }
      ctx.fillStyle = red;
      ctx.font = "700 9.5px Menlo, monospace";
      ctx.fillText("纹样 8 纬循环(载入断言:布纹[k]=pattern[k%8])", gx + 10, gy + gh - 8);

      /* ============ 底部:参数链 ============ */
      var boxes = [
        ["花楼挽花", "提纤沉纤"], ["经线 8 组", "分组提沉"], ["投梭引纬", "梭 ±0.5"],
        ["打筘推纬", "成布口"], ["布面生长", "纬距 0.045"], ["纹样循环", "8 纬一花"]
      ];
      var bwid = (w * 0.91) / boxes.length;
      for (var b = 0; b < boxes.length; b++) {
        var bx2 = w * 0.045 + b * bwid;
        ctx.strokeStyle = ink;
        ctx.fillStyle = ink;
        ctx.strokeRect(bx2, chainY, bwid - 10, chainH);
        ctx.font = "700 10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(boxes[b][0], bx2 + (bwid - 10) / 2, chainY + 17);
        ctx.font = "600 8.5px Menlo, monospace";
        ctx.fillStyle = "rgba(42,38,32,0.55)";
        ctx.fillText(boxes[b][1], bx2 + (bwid - 10) / 2, chainY + 32);
        if (b < boxes.length - 1) {
          ctx.beginPath();
          ctx.moveTo(bx2 + bwid - 10, chainY + 20);
          ctx.lineTo(bx2 + bwid - 2, chainY + 20);
          ctx.stroke();
        }
      }
    },
    table:
      '<h4>机架</h4><table>' +
      '<tr><th>机架</th><td>两立柱 + 经轴/布轴</td><td>织口在中</td></tr>' +
      '<tr><th>花楼</th><td>后高架 2.05 · 挽花工位</td><td>—</td></tr>' +
      '<tr><th>经线(×8)</th><td>分组提沉(演示 8 组)</td><td>—</td></tr>' +
      '</table><h4>循环</h4><table>' +
      '<tr><th>挽花提纤</th><td>纹样组提起 0.10 m · 0.7s</td><td>—</td></tr>' +
      '<tr><th>投梭引纬</th><td>梭 ±0.5 往复 · 0.9s</td><td>—</td></tr>' +
      '<tr><th>打筘推纬</th><td>筘摆 0.16 · 0.8s</td><td>—</td></tr>' +
      '<tr><th>纬距</th><td>0.045 m/纬</td><td>—</td></tr>' +
      '<tr><th>纹样</th><td>[1,0,2,0,3,0,2,1] 八纬循环</td><td>载入断言</td></tr>' +
      '</table><h4>运行期自检</h4>' +
      '<p>载入模拟 24 纬:织纬计数恰 24、布纹[k] = pattern[k%8] 逐位对照,否则拒绝启动。</p>' +
      '<h4>文献</h4>' +
      '<p>《天工开物·乃服》:「凡织花纹,必用提花机……其 towering 花楼,高及于屋,挽花工坐其上,力提纤线,以下者随提随织。」</p>'
  };
})(window.MECH = window.MECH || {});
