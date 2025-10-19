/* ふわっと */
window.addEventListener('DOMContentLoaded', function(){
  $(".inview").on("inview", function (event, isInView) {
    if (isInView) {
      $(this).stop().addClass("is-show");
	 }else{
        $(this).removeClass('is-show');
    }
  });
});

// 動きのきっかけの起点となるアニメーションの名前を定義
function BgFadeAnime(){

    // 背景色が伸びて出現（左から右）
	$('.bgLRextendTrigger').each(function(){ //bgLRextendTriggerというクラス名が
		var elemPos = $(this).offset().top-50;//要素より、50px上の
		var scroll = $(window).scrollTop();
		var windowHeight = $(window).height();
		if (scroll >= elemPos - windowHeight){
			$(this).addClass('bgLRextend');// 画面内に入ったらbgLRextendというクラス名を追記
		}else{
			$(this).removeClass('bgLRextend');// 画面外に出たらbgLRextendというクラス名を外す
		}
	});	

   // 文字列を囲う子要素
	$('.bgappearTrigger').each(function(){ //bgappearTriggerというクラス名が
		var elemPos = $(this).offset().top-50;//要素より、50px上の
		var scroll = $(window).scrollTop();
		var windowHeight = $(window).height();
		if (scroll >= elemPos - windowHeight){
			$(this).addClass('bgappear');// 画面内に入ったらbgappearというクラス名を追記
		}else{
			$(this).removeClass('bgappear');// 画面外に出たらbgappearというクラス名を外す
		}
	});		
}

// 画面をスクロールをしたら動かしたい場合の記述
	$(window).scroll(function (){
		BgFadeAnime();/* アニメーション用の関数を呼ぶ*/
	});// ここまで画面をスクロールをしたら動かしたい場合の記述

// 画面が読み込まれたらすぐに動かしたい場合の記述
	$(window).on('load', function(){
		BgFadeAnime();/* アニメーション用の関数を呼ぶ*/
	});// ここまで画面が読み込まれたらすぐに動かしたい場合の記述

// 動きのきっかけの起点となるアニメーションの名前を定義
function BgFadeAnime(){

    // 背景色が伸びて出現（上から下）
	$('.bgUDextendTrigger').each(function(){ //bgUDextendTriggerというクラス名が
		var elemPos = $(this).offset().top-50;//要素より、50px上の
		var scroll = $(window).scrollTop();
		var windowHeight = $(window).height();
		if (scroll >= elemPos - windowHeight){
			$(this).addClass('bgUDextend');// 画面内に入ったらbgUDextendというクラス名を追記
		}else{
			$(this).removeClass('bgUDextend');// 画面外に出たらbgUDextendというクラス名を外す
		}
	});	
   // 文字列を囲う子要素
	$('.bgappearTrigger').each(function(){ //bgappearTriggerというクラス名が
		var elemPos = $(this).offset().top-50;//要素より、50px上の
		var scroll = $(window).scrollTop();
		var windowHeight = $(window).height();
		if (scroll >= elemPos - windowHeight){
			$(this).addClass('bgappear');// 画面内に入ったらbgappearというクラス名を追記
		}else{
			$(this).removeClass('bgappear');// 画面外に出たらbgappearというクラス名を外す
		}
	});		
}

// 画面をスクロールをしたら動かしたい場合の記述
	$(window).scroll(function (){
		BgFadeAnime();/* アニメーション用の関数を呼ぶ*/
	});// ここまで画面をスクロールをしたら動かしたい場合の記述

// 画面が読み込まれたらすぐに動かしたい場合の記述
	$(window).on('load', function(){
		BgFadeAnime();/* アニメーション用の関数を呼ぶ*/
	});// ここまで画面が読み込まれたらすぐに動かしたい場合の記述


// TextTypingというクラス名がついている子要素（span）を表示から非表示にする定義
	function TextTypingAnime() {
		$('.TextTyping').each(function () {
			var elemPos = $(this).offset().top - 50;
			var scroll = $(window).scrollTop();
			var windowHeight = $(window).height();
			var thisChild = "";
			if (scroll >= elemPos - windowHeight) {
				thisChild = $(this).children(); //spanタグを取得
				//spanタグの要素の１つ１つ処理を追加
				thisChild.each(function (i) {
					var time = 100;
					//時差で表示する為にdelayを指定しその時間後にfadeInで表示させる
					$(this).delay(time * i).fadeIn(time);
				});
			} else {
				thisChild = $(this).children();
				thisChild.each(function () {
					$(this).stop(); //delay処理を止める
					$(this).css("display", "none"); //spanタグ非表示
				});
			}
		});
	}
	// 画面をスクロールをしたら動かしたい場合の記述
	$(window).scroll(function () {
		TextTypingAnime();/* アニメーション用の関数を呼ぶ*/
	});// ここまで画面をスクロールをしたら動かしたい場合の記述
	
	// 画面が読み込まれたらすぐに動かしたい場合の記述
	$(window).on('load', function () {
		//spanタグを追加する
		var element = $(".TextTyping");
		element.each(function () {
			var text = $(this).html();
			var textbox = "";
			text.split('').forEach(function (t) {
				if (t !== " ") {
					textbox += '<span>' + t + '</span>';
				} else {
					textbox += t;
				}
			});
			$(this).html(textbox);
	
		});
	
		TextTypingAnime();/* アニメーション用の関数を呼ぶ*/
	});// ここまで画面が読み込まれたらすぐに動かしたい場合の記述