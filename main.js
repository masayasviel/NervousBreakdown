// phina.js をグローバル領域に展開
phina.globalize();

// 定数
var SCREEN_WIDTH  = 640; // 画面横サイズ
var SCREEN_HEIGHT = 960; // 画面縦サイズ

// MainScene クラスを定義
phina.define('MainScene', {
  superClass: 'DisplayScene',
  init: function() {
    this.superInit();
       Label({
      text:"同じ色を二枚揃えるのだ！",
      fontSize:45,
      fill:'#000000',
    }).addChildTo(this)
      .setPosition(this.gridX.center(),this.gridY.span(4))
      .tweener.fadeOut(1000).fadeIn(500).setLoop(true).play();
      
    var located = [
                    [120, 450],[241, 450],[362, 450],[483, 450],
                    [120, 571],[241, 571],[362, 571],[483, 571],
                    [120, 692],[241, 692],[362, 692],[483, 692],
                    [120, 813],[241, 813],[362, 813],[483, 813],
                  ];
  },
});

// パネルクラスを定義
phina.define('Panel',{
  superClass: 'RectangleShape',
  init:function(position_x, position_y) {
    this.superInit();
    // 位置
    this.x = position_x;
    this.y = position_y;
    // 大きさ
    var sideLength = 120;
    this.width = sideLength;
    this.height = sideLength;
    // タッチ可能にする
    this.setInteractive(true);
    // 色
    var colorArr = ["#FF0000","#FF8000","#FFFF00","#00FF40","#2EFEF7","#0000FF","#A901DB","#FF00FF",
    "#FF0000","#FF8000","#FFFF00","#00FF40","#2EFEF7","#0000FF","#A901DB","#FF00FF"];
    this.colorArrLength = colorArr.length;
    var n = this.colorArrLength;
    this.shuffle(colorArr);
    for(var i = 0;i < n;i++) {
      this.fill = colorArr[i];
    }
  },
  //フィッシャーイェーツのシャッフル
  shuffle:function(colorArr) {
    var n = this.colorArrLength;
    while(n) {
      var i = Math.floor(Math.random() * n--);
      var temp = colorArr[n];
      colorArr[n] = colorArr[i];
      colorArr[i] = temp;
    }
    return colorArr;
  }
});

// メイン処理
phina.main(function() {
  // アプリケーション生成
  var app = GameApp({
    startLabel: 'main',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  });
  // アプリケーション実行
  app.run();
});