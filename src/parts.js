/* 提花机部件建模与注册(13 件)。
   布局:机架沿 X(织口在中),经轴左,布轴右;花楼在后上方(挽花工位),
   纤绳下接 8 组经线提杆;梭子沿 X 往复;筘框前后摆。布面纹理 Canvas 生长。 */
(function (MECH) {
  var P = MECH.P, M3 = null, D = MECH.DIM;

  function group() { return new THREE.Group(); }

  function buildFrame() {   // 机架:两立柱 + 经轴 + 布轴
    var g = group();
    [-0.95, 0.95].forEach(function (x) {
      g.add(P.box(0.10, 1.30, 0.14, M3.woodD, x, 0.65, -0.30));
    });
    g.add(P.box(2.0, 0.10, 0.12, M3.woodD, 0, 1.32, -0.30));
    var warp = P.cyl(0.05, 0.05, 1.5, M3.wood, -0.72, 0.78, 0, 14);
    warp.rotation.z = P.ROTZ;
    g.add(warp);
    var clothRoll = P.cyl(0.055, 0.055, 1.5, M3.wood, 0.72, 0.60, 0, 14);
    clothRoll.rotation.z = P.ROTZ;
    g.add(clothRoll);
    g.add(P.box(1.9, 0.06, 0.5, M3.woodL, 0, 0.05, 0.1));
    return g;
  }

  function buildTower() {   // 花楼(后高架)
    var g = group();
    [-0.55, 0.55].forEach(function (x) {
      g.add(P.box(0.10, 2.05, 0.12, M3.woodD, x, 1.02, -0.72));
    });
    g.add(P.box(1.35, 0.10, 0.16, M3.woodD, 0, 2.05, -0.72));
    g.add(P.box(1.35, 0.02, 0.5, M3.woodL, 0, 2.06, -0.52));   // 楼板
    /* 挽花工位(坐凳示意) */
    g.add(P.box(0.3, 0.06, 0.3, M3.woodD, 0, 2.0, -0.35));
    return g;
  }

  function buildWarps() {   // 8 组经线(细线,提沉由 KINE)
    var g = group();
    var lines = [];
    for (var k = 0; k < D.warpN; k++) {
      var x = -0.55 + k * 0.14;
      var geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-0.72, 0.78, 0),
        new THREE.Vector3(x, 0.80, 0.12),
        new THREE.Vector3(x, 0.62, 0.14)
      ]);
      var line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xD8C08E }));
      g.add(line);
      lines.push(line);
    }
    g.userData.lines = lines;
    return { group: g };
  }

  function buildHarness() {  // 纤绳束(花楼→经线)
    var g = group();
    var ropes = [];
    for (var k = 0; k < D.warpN; k++) {
      var x = -0.55 + k * 0.14;
      var geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x * 0.9, 1.92, -0.60),
        new THREE.Vector3(x, 0.92, 0.10)
      ]);
      var rope = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xC76A5A, transparent: true, opacity: 0.85 }));
      g.add(rope);
      ropes.push(rope);
    }
    g.userData.ropes = ropes;
    return { group: g };
  }

  function buildShuttle() {  // 梭(船形)
    var g = group();
    var body = P.cyl(0.035, 0.02, 0.16, M3.brass, 0, 0, 0, 12);
    body.rotation.x = Math.PI / 2;
    g.add(body);
    [-1, 1].forEach(function (s) {
      var tip = P.mesh(new THREE.ConeGeometry(0.02, 0.05, 8), M3.brass, 0, 0, s * 0.10);
      tip.rotation.x = s > 0 ? -Math.PI / 2 : Math.PI / 2;
      g.add(tip);
    });
    return { group: g };
  }

  function buildReed() {  // 筘框(前后摆)
    var g = group();
    g.add(P.box(1.2, 0.10, 0.04, M3.woodD, 0, 0, 0));
    g.add(P.box(1.2, 0.02, 0.02, M3.steelD, 0, -0.06, 0));
    return { group: g };
  }

  function buildClothPlane() {  // 布面(纹理 Canvas 生长)
    var g = group();
    var c = document.createElement("canvas");
    c.width = D.clothMax; c.height = 8;
    var tex = new THREE.CanvasTexture(c);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    var plane = P.mesh(new THREE.PlaneGeometry(D.clothMax * D.weftGap * 2, 0.55),
      new THREE.MeshStandardMaterial({ map: tex, side: THREE.DoubleSide, roughness: 0.9 }), 0, 0, 0);
    plane.position.set(0.4, 0.62, 0.14);
    g.add(plane);
    g.userData.canvas = c;
    g.userData.tex = tex;
    return { group: g };
  }

  /* —— 注册 —— */
  MECH.PART_DEFS = function () {
    M3 = MECH.Scene3D.M;
    function def(o) { return MECH._def(o); }

    def({ id: "frame", name: "FRAME · 机架经轴布轴", sub: "两立柱 + 织口", phase: 0, at: 0.15, dur: 1.3,
      build: buildFrame, target: [0, 0, 0], start: [0, 4.2, 2.4], mid: [0, 2.4, 1.2], anchor: [0, 0.8, 0.3] });
    def({ id: "tower", name: "TOWER · 花楼(挽花位)", sub: "挽花工坐于楼上", phase: 0, at: 1.5, dur: 1.3, kind: "kine",
      build: buildTower, target: [0, 0, 0], off: [0, 1.6, 2.0] });
    def({ id: "warps", name: "WARPS · 经线 ×8", sub: "分组提沉", phase: 1, at: 3.6, dur: 1.2, kind: "kine",
      build: buildWarps, target: [0, 0, 0], off: [0, 1.4, 1.6] });
    def({ id: "harness", name: "HARNESS · 纤绳束", sub: "花楼提纤", phase: 1, at: 4.4, dur: 1.2, kind: "kine",
      build: buildHarness, target: [0, 0, 0], off: [0, 1.6, 1.6] });
    def({ id: "shuttle", name: "SHUTTLE · 梭", sub: "投梭引纬", phase: 2, at: 6.4, dur: 1.1, kind: "kine",
      build: buildShuttle, target: [0, 0.66, 0.13], off: [0, 1.3, 1.6] });
    def({ id: "reed", name: "REED · 筘框", sub: "打筘推纬", phase: 2, at: 7.2, dur: 1.0, kind: "kine",
      build: buildReed, target: [0, 0.70, 0.24], off: [0, 1.4, 1.5] });
    def({ id: "cloth", name: "CLOTH · 布面纹理", sub: "随织纬生长", phase: 3, at: 9.2, dur: 1.2, kind: "kine",
      build: buildClothPlane, target: [0, 0, 0], off: [0, 1.2, 1.6] });
  };

  /* —— 运动学分发 —— */
  var colors = [0xE9EEF2, 0xE86A9E, 0xE9C93C, 0x6FA8DC];
  MECH.KINE = function (st) {
    /* 经线提沉:提起组上移 lift×0.10 */
    var w = MECH.Parts.entry("warps");
    if (w && w.shown) {
      w.group.userData.lines.forEach(function (line, k) {
        var lifted = st.mode === "lift" ? (st.liftGroup === k + 1 ? st.lift : 0)
                   : (st.mode === "shuttle" && st.liftGroup === k + 1 ? 0.25 : 0);
        line.geometry.attributes.position.setY(1, 0.80 + lifted * 0.10);
        line.geometry.attributes.position.setY(2, 0.62 + lifted * 0.10);
        line.geometry.attributes.position.needsUpdate = true;
      });
    }
    /* 纤绳束同步缩放 */
    var h = MECH.Parts.entry("harness");
    if (h && h.shown) {
      h.group.userData.ropes.forEach(function (rope, k) {
        rope.material.opacity = 0.55 + st.lift * 0.35;
      });
    }
    /* 梭 */
    var s = MECH.Parts.entry("shuttle");
    if (s && s.shown) s.group.position.set(st.shuttleX * 1.15, 0.66 + (st.mode === "lift" ? 0.10 + st.lift * 0.06 : 0.02), 0.13);
    /* 筘 */
    var r = MECH.Parts.entry("reed");
    if (r && r.shown) r.group.position.z = 0.24 + st.beat * 0.16;
    /* 布面纹理:每纬画一行 */
    var c = MECH.Parts.entry("cloth");
    if (c && c.shown) {
      var cv = c.group.userData.canvas, tex = c.group.userData.tex;
      var ctx = cv.getContext("2d");
      var col = st.cloth.length;
      if (col > 0 && cv._lastCol !== col) {
        cv._lastCol = col;
        for (var y = 0; y < 8; y++) {
          var lifted = D.pattern[(col - 1) % D.pattern.length] === y + 1;
          ctx.fillStyle = lifted ? "#3A3E44" : (y % 2 ? "#D8C08E" : "#C8A96E");
          ctx.fillRect(col - 1, y, 1, 1);
        }
        tex.needsUpdate = true;
      }
    }
  };
})(window.MECH = window.MECH || {});
