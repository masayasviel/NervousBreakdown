// phina.js をグローバル領域に展開
phina.globalize();

// 定数
var SCREEN_WIDTH = 640;            // 画面横サイズ
var SCREEN_HEIGHT = 960;           // 画面縦サイズ
var GRID_SIZE = SCREEN_WIDTH / 4;  // グリッドのサイズ
var PANEL_NUM = 4;              // 縦横のピース数
var PANEL_OFFSET = GRID_SIZE / 2;  // オフセット値

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
      .setPosition(this.gridX.center(),this.gridY.span(13))
      .tweener.fadeOut(1000).fadeIn(500).setLoop(true).play();
    // 変数
    // カラー
    var colorArr = ["#FF0000","#FF8000","#FFFF00","#00FF40","#2EFEF7","#0000FF","#A901DB","#FF00FF",
                    "#FF0000","#FF8000","#FFFF00","#00FF40","#2EFEF7","#0000FF","#A901DB","#FF00FF"];
    this.colorArrLength = colorArr.length;
    var n = this.colorArrLength;
    this.count = false; // パネルを一枚開けたかどうか
    this.panelFill = null; // 開けられたパネルの色情報

    // 背景パネルグループを作成
    this.backPanelGroup = DisplayElement().addChildTo(this);
    // カラーパネルグループ作成
    this.colorPanelGroup = DisplayElement().addChildTo(this);
    var self = this;
    this.shuffle(colorArr);
    // グリッド
    var grid = Grid(SCREEN_WIDTH, PANEL_NUM);
    // パネル配置
    var i = 0;
    PANEL_NUM.times(function(spanX) {
      PANEL_NUM.times(function(spanY) {
        BackPanel(grid.span(spanX) + PANEL_OFFSET, grid.span(spanY) + PANEL_OFFSET).addChildTo(self.backPanelGroup);
        var piece =  ColorPanel(colorArr[i], grid.span(spanX) + PANEL_OFFSET, grid.span(spanY) + PANEL_OFFSET).addChildTo(self.colorPanelGroup);
        // タッチされた時の処理
        piece.onpointend = function() {
          this.alpha = 1; // タッチされたパネルを現界
          // １枚目のパネルが開けられた場合
          if(!self.count){
            self.count = true;
            self.panelFill = this.fill;
            // タッチを無効にする
            this.setInteractive(false);
          // ２枚目のパネルが開けられた場合
          }else{
            // １枚目と２枚目のパネルの色が一致
            if(self.panelFill == this.fill){
              setTimeout(function(){
                self.exit();
              }.bind(this), 500);
            // １枚目と２枚目のパネルの色が不一致
            }else{
              self.count = false;
              self.invalid(false);
              // 1000ms遅らせて再び透明化
              setTimeout(function(){
                self.closed();
                self.invalid(true);
              }.bind(this), 1000);
            }
          }
          // console.log(self.count);
        };
        i++;
      });
    });
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
  },
  // 開いたパネルを全て閉じる
  closed:function() {
    this.colorPanelGroup.children.forEach(function(panel) {
      if(panel.alpha == 1) {
        panel.alpha = 0;
      }
    }.bind(this));
  },
  invalid:function(frag) {
    this.colorPanelGroup.children.forEach(function(panel) {
      panel.setInteractive(frag);
    }.bind(this));
  },
});

// パネルクラスを定義
phina.define('Panel',{
  superClass: 'RectangleShape',
  init:function(color, position_x, position_y) {
    this.superInit();
    // 位置
    this.x = position_x;
    this.y = position_y;
    // 大きさ
    var size = GRID_SIZE * 0.95;
    this.width = size;
    this.height = size;
    // 容姿
    this.fill = color;
    this.cornerRadius = 10;
  },
});

// カラーパネルクラスを定義
phina.define('ColorPanel',{
  superClass: 'Panel',
  init:function(color, position_x, position_y) {
    this.superInit(color, position_x, position_y);
    // 透明化
    this.alpha = 0;
    // タッチを有効にする
    this.setInteractive(true);
  },
});

// 背景パネルクラスを定義
phina.define('BackPanel',{
  superClass: 'Panel',
  init:function(position_x, position_y) {
    this.superInit('#BDBDBD', position_x, position_y);
  },
});

//resultScene クラスを定義
phina.define("ResultScene", {
  superClass: 'DisplayScene',
  init: function() {
    this.superInit();
    Label({
      text: 'お前マジで偉い！',
      fontSize: 60,
      fill: '#000000',
    }).addChildTo(this).setPosition(this.gridX.center(),this.gridY.span(4));
    this.restartButton = RestartButton().addChildTo(this).setPosition(320,800);
    var self = this;
    this.restartButton.onpointend = function() {
      self.exit();
    };
  },
});

// RestartButtoクラスを定義
phina.define('RestartButton', {
  superClass: 'Button',
  init: function() {
    this.superInit({
      width: 300, // 横サイズ
      height: 155, // 縦サイズ
      text: 'restart',  // 表示文字
      fontSize: 70, // 文字サイズ
      fontColor: '#000000', // 文字色
      cornerRadius: 5,  // 角丸み
      fill: '#FFFFFF', // ボタン色
      stroke: '#000000',  // 枠色
      strokeWidth: 5,   // 枠太さ
    });
  },
});

// メイン処理
phina.main(function() {
  // アプリケーション生成
  var app = GameApp({
    title: '神経衰弱',
    startLabel: location.search.substr(1).toObject().scene || 'title',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  });
  // アプリケーション実行
  app.run();
});