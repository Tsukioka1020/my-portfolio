// 1. すべての対象要素をクラス名で取得
const headerTextBoxes = document.querySelectorAll('.header-text-box');

// 見出しのオープニングアニメーション関数
function playHeaderAnimation(headerTextBox) {
    // 対象要素内のタイトル表示要素を取得
    const headerTitleText = headerTextBox.querySelector('.header-title-text');
    // data-title 属性から表示したいテキストを取得
    const pageTitle = headerTextBox.getAttribute('data-title'); 

    // 1. チカチカ点灯 (1.0秒間)
    headerTextBox.style.animation = 'glitchEffect 0.1s steps(2, end) infinite'; 
    headerTextBox.style.opacity = 1;

    setTimeout(() => {
        headerTextBox.style.animation = 'none'; // グリッチアニメーションを停止
        headerTextBox.style.opacity = 1;
        
        // 2. ボックスが左から右に伸びる (0.8秒間)
        headerTextBox.style.width = '0'; 
        headerTextBox.style.animation = `expandWidth 0.8s ease-out forwards`;
        
        // 3. タイピング表示 (ボックスが伸び終わる少し前)
        setTimeout(() => {
            // タイピング表示を開始
            typeText(headerTitleText, pageTitle, 70); 
        }, 700); // ボックスが伸びきる0.8秒の700ms後
        
    }, 1000); // チカチカは1秒間
}

// タイピング表示関数
function typeText(element, text, speed) {
    let i = 0;
    element.textContent = ''; // 初期化
    element.classList.add('typing'); // タイピング中はクラスを追加してテキストを表示

    // カーソルを表示
    element.style.setProperty('--caret-opacity', '1'); 
    element.style.setProperty('--caret-animation', 'blinkCaret 0.75s step-end infinite');

    function typing() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        } else {
            // タイピング終了後、カーソルを点滅状態に維持
            element.style.setProperty('--caret-animation', 'blinkCaret 0.75s step-end infinite'); 
        }
    }
    typing();
}

// ページ読み込み完了後に、すべての見出しに対してアニメーションを開始
// forEachを使ってすべての要素をループ処理
headerTextBoxes.forEach((box, index) => {
    // すべて同時に開始すると見づらいので、少しずつ遅延させて開始
    setTimeout(() => {
        playHeaderAnimation(box);
    }, index * 1000); // 1秒ずつ遅延させて開始 (例: 1つ目 0ms, 2つ目 1000ms, 3つ目 2000ms)
});