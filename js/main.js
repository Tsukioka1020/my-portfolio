document.addEventListener('DOMContentLoaded', () => {
    // --- 要素の取得 ---
    const character = document.getElementById('character');
    const speechBubble = document.getElementById('speechBubble');
    const speechText = document.getElementById('speechText');
    const background = document.getElementById('background');
    const middle = document.getElementById('middle');
    const app = document.getElementById('app');
    const talkButton = document.getElementById('talkButton');
    const timeDisplay = document.getElementById('time-display');
    const badgesContainer = document.getElementById('badges');
    const dialogueBox = document.getElementById('dialogueBox');
    const dialogueText = document.getElementById('dialogueText');
    const nextDialogueBtn = document.getElementById('nextDialogueBtn');
    const closeTalkBtn = document.getElementById('closeTalkBtn');
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    const resetButton = document.getElementById('resetButton');
    const resetModal = document.getElementById('resetModal');
    const confirmResetBtn = document.getElementById('confirmResetBtn');
    const cancelResetBtn = document.getElementById('cancelResetBtn');
    const profileImage = document.getElementById('profileImage');
    const profileComment = document.getElementById('profileComment'); 
    const closeButtons = document.querySelectorAll('.content-section .batsu');


    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // クリックされたボタンの親である content-section を取得
            const section = button.closest('.content-section');

            if (section) {
                // 1. セクションを非表示にする
                section.style.display = 'none';

                // 2. アニメーション用のクラスを削除 (前回までの修正内容を考慮)
                section.classList.remove('is-active'); 

                // 3. 対応するヘッダーも非表示にする (チカチカヘッダーのクリーンアップ)
                const headerId = section.id + 'HeaderContainer';
                const headerContainer = document.getElementById(headerId);
                if (headerContainer) {
                    headerContainer.style.display = 'none';
                }

                // 4. 開いているコンテンツIDをリセット (トグル機能の復元)
                // ※ currentOpenContentId が定義されている前提ですが、定義がない場合はこの行は削除してください。
                // currentOpenContentId = null; 
            }
        });
    });

    // プロフィール要素を汎用的に取得
    const profileContentElements = {
        name: document.getElementById('name'),
        skill: document.getElementById('skill'),
        hobby: document.getElementById('hobby'),
        favoriteGame: document.getElementById('favoriteGame'),
        concept: document.getElementById('concept')
    };
    

    // --- データと状態管理 ---
    const sayings = [
        "ポートフォリオへようこそ！",
        "何か面白いことはあるかな？",
        "僕をクリックしてみる？",
        "新しい作品、見て行ってね！"
    ];
    let lastIndex = -1;
    let clickCount = 0;

    const profileData = {
        name: "月丘",
        skill: "HTML, CSS,JavaScript(苦手)",
        hobby: "絵を描くこと、映画鑑賞",
        favoriteGame: "ペルソナ3",
        concept:"人を助けることができるシステムを作る、趣味にも活かす"
    };

    const conversations = {
        name: [
            "そういえば、管理者の名前をまだ教えていなかったね。",
            "彼はとてもシャイだから、僕が代わりに代理人として彼を紹介しているんだよ。",
            "彼の名前は月丘。少しだけ覚えてくれたらいいよ。"
        ],
        skill: [
            "スキルっていうと大袈裟だけど・・・",
            "HTMLとCSSを使ってWEBサイトを制作するのが好きなんだって",
            "動きのあるサイトにしたいからJavaScriptを使うんだけど",
            "あんまり得意ってわけじゃないらしい",
            "自在に扱えるようになりたいからまだまだ勉強しなきゃだね"
        ],
        hobby: [
            "管理者が休みの日は何してるかって？",
            "絵を描くことや、映画を観るのが好きなんだって",
            "「創作する時間は精神統一」",
            "・・・なんて言ったりしていたね。",
            "僕を作ったのももちろん管理者だよ",
            "本当はずーっと絵を描いていたいけど、なかなかできないみたい",
            "あなたは映画は好き？",
            "たまに映画館に行くのっていいよね",
            "映画館でしか味わえない空気というか、雰囲気があって…おなかもすいてないのにポップコーンを買いたくなっちゃわない？"
        ],
        favoriteGame: [
            "お気に入りのゲームはね、",
            "特に思い出深いゲームが『ペルソナ3』だよ",
            "あのクールでスタイリッシュな雰囲気と、キャラクターたちの葛藤、そしてデザイン、なんと言っても音楽が素晴らしい！",
            "管理者の人生において大きく影響を与えたと言ってもいい作品だね",
            "他にも色々とゲームはするけど、なかなか時間がないとできないから詰みすぎている状態なんだよ・・・いつかゲームをさばけるかな・・・？"
        ],
        concept:[
            "管理者がいつか叶えたいものがあるんだけど、",
            "ざっくり言えば「人を助けるシステムを作る」かな",
            "…ちょっとおおげさになっちゃったね",
            "例えば、印刷物のデータ化で読み込んだらテキストになって、必要な項目に自動で登録されていくとか…世の中にはすでにあるだろうけど、現場にはなかなか導入しづらいし、知らない人も多いでしょ？",
            "……本人が今一番欲しいってだけかもしれないけどね",
            "正直、管理者自身が欲しい！と思ったものを自由にカスタマイズして作れたらいいなってところに全て行き着くかな",
            "あと、創作が好きだからそれに関連したアプリとか作れるようになったらきっとこれからも楽しいだろうね",
            "好きなことにも、仕事にも使えるスキル・・・頑張って勉強してもらわないといけないね"
        ]
    };

    

    const profileKeys = Object.keys(profileData);
    //localStorageからrevealedKeysを読み込む
    let revealedKeys = JSON.parse(localStorage.getItem('revealedKeys')) || [];

    //ページ読み込み時にプロフィールを更新する
    revealedKeys.forEach(key => {
        if (profileContentElements[key]) {
            profileContentElements[key].textContent = profileData[key];
        }
    });

    let currentConversation = null;
    let currentStep = 0;
    let profileUnlocked = false; 

    
    // --- 吹き出し更新関数 ---
    function updateSpeechBubble(text, duration = 5000) {
        speechText.textContent = text;
        speechBubble.style.opacity = 1;
        setTimeout(() => {
            speechBubble.style.opacity = 0;
        }, duration);
    }

    // --- 通知表示関数 ---
    function showNotification(message) {
        notificationText.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000); // 3秒後に非表示
    }
    
    // --- 通常時のクリックイベント ---
    function handleCharacterClick() {
        if (app.classList.contains('talk-mode')) return; // 会話中は反応しない
        clickCount++;
        let reactionText;
        if (clickCount === 1) {
            reactionText = "どうしたかい？";
        } else if (clickCount === 5) {
            reactionText = "もしかして、僕に興味がある？";
        } else if (clickCount === 10) {
            reactionText = "そろそろ飽きてきた頃じゃない？";
        } else {
            const normalReactions = ["ん？", "なに？", "ふふっ","管理者の情報を収集してみた？"];
            const randomIndex = Math.floor(Math.random() * normalReactions.length);
            reactionText = normalReactions[randomIndex];
        }
        updateSpeechBubble(reactionText, 3000);
    }

    // --- 会話モードのロジック ---
    function startConversation(type) {
        app.classList.add('talk-mode');
        character.removeEventListener('click', handleCharacterClick);
        // nextDialogueBtnの代わりにdialogueBoxにイベントを追加
        dialogueBox.addEventListener('click', proceedConversation); 
        
        currentConversation = {
            type: type,
            script: conversations[type]
        };
        currentStep = 0;
        dialogueText.textContent = currentConversation.script[currentStep];
    }

    function proceedConversation() {
        currentStep++;
        if (currentStep < currentConversation.script.length) {
            dialogueText.textContent = currentConversation.script[currentStep];
        } else {
            endConversation();
        }
    }

    function endConversation() {
        // プロフィールを更新
        const keyToReveal = currentConversation.type;
        if (profileContentElements[keyToReveal]) {
            profileContentElements[keyToReveal].textContent = profileData[keyToReveal];
            revealedKeys.push(keyToReveal);
            // ローカルストレージに保存 ★★★
            localStorage.setItem('revealedKeys', JSON.stringify(revealedKeys));
            // 吹き出しではなく、通知を表示
            showNotification(`公開情報が追加されました！`);
        }
        
       // アチーブメント判定
       if (revealedKeys.length === profileKeys.length) {
        showNotification("全ての情報がアンロックされました！");
        const badge = document.createElement('span');
        badge.textContent = "🥇";
        badge.style.fontSize = '3em';
        badgesContainer.appendChild(badge);

        if (profileImage) {
            // 画像要素のsrc属性を、2番目の画像に切り替える
            profileImage.src = "./img/my_800_2.webp";
            
            // 画像をリフレッシュする効果を追加
            profileImage.style.opacity = 0;
            setTimeout(() => {
                profileImage.style.opacity = 1; // 0.5秒かけて表示
            }, 500); 
        }
        if (profileComment) {
            const newCommentText = 'すべての見ていただき、ありがとうございます。月岡と申します。<br>現在、仕事をしながらRUNTEQでエンジニアの勉強をさせていただきます。<br>かなりの「うっかり」な人間のため、手入力、手作業の業務が苦手だったため、エクセルの関数、マクロを使って入力する工程を減らしたり、ミスを減らすように工夫するようにしています。周囲で発生している小さな悩みなどを聞いて調べたり、解決するということで喜んでもらえた体験をして、「誰かを助けるシステムを作れるようになりたい」と考えています。<br>私のように意外と単純なミスをしてしまいがちでできない作業など、少し補助するツールを使うことでできるようになる、ということはきっと「できないと思っていた仕事ができるようになる人が増える」と思っています。現在の職場も、アナログからデータ化のための人間でする作業の負担が多く、これが例えば「このデータを読み込んだら、こっちのデータに整形されて読み込み可能なデータに変換される」なんてものがあれば、3人必要だった作業が1人で完結するようになる…こんな小さな悩みがきっといろんな職場にもあるのだと思いました。今、労働者不足や人口減少など叫ばれていますが、きっとそれを解決できるものが此処にあるのではないか、と考えます。<br>少し話が変わりますが、私はSF映画が好きです。「アイ,ロボット」「ウォーリー」「アイランド」など、ロボットやシステム化された社会の世界観の描写にいつもワクワクします。ディストピアで少し物悲しい印象があるかもしれませんが、やはり昔からいろんな人が「コンピュータシステムが人々の生活を助ける」という進化に希望を感じているのかなと勝手に思っています。映画のような世界になるにはまだまだ遠いですが、今その進化を肌で体験していると思うと、私もその進化に関われたらいいなあと思ってしまうのは仕方ないのかもしれません。'; 
            profileComment.innerHTML = newCommentText;
            
            // ローカルストレージに新しいテキストを保存
            localStorage.setItem('unlockedComment', newCommentText);
        }
    }

    // ここから下の処理はそのまま
    dialogueBox.removeEventListener('click', proceedConversation);
    character.addEventListener('click', handleCharacterClick);

    setTimeout(() => {
        app.classList.remove('talk-mode');
        character.addEventListener('click', handleCharacterClick);
        updateSpeechBubble("また話しかけてね！");
    }, 3000);
}


    // --- 初期イベントリスナーと呼び出し ---
    character.addEventListener('click', handleCharacterClick);
    talkButton.addEventListener('click', () => {
        const unrevealedKeys = profileKeys.filter(key => !revealedKeys.includes(key));

        if (unrevealedKeys.length > 0) {
            const randomKey = unrevealedKeys[Math.floor(Math.random() * unrevealedKeys.length)];
            startConversation(randomKey);
        } else {
            updateSpeechBubble("もう話すことはないみたいだ。", 3000);
        }
    });

    closeTalkBtn.addEventListener('click', () => {
        app.classList.remove('talk-mode');
        character.addEventListener('click', handleCharacterClick);
        dialogueBox.removeEventListener('click', proceedConversation); // dialogueBoxに修正
    });

    // ★★★ リセットボタンのイベントリスナーを追加（ご要望の挿入位置） ★★★
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            // モーダルウィンドウを表示
            resetModal.classList.add('active');
        });
    }

    // ★★★ モーダルウィンドウの制御ロジックを追加 ★★★

    // 「はい」が押されたときの処理 (リセット実行)
    confirmResetBtn.addEventListener('click', () => {
        // ローカルストレージの 'revealedKeys' を削除
        localStorage.removeItem('revealedKeys');
        
        // ページ全体をリロードして初期状態に戻す
        location.reload();
    });

    // 「いいえ」が押されたときの処理 (キャンセル)
    cancelResetBtn.addEventListener('click', () => {
        // モーダルウィンドウを非表示
        resetModal.classList.remove('active');
    });

    // --- 定期的なセリフ表示 ---
    setInterval(() => {
        if (!app.classList.contains('talk-mode')) {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * sayings.length);
            } while (newIndex === lastIndex);
            lastIndex = newIndex;
            updateSpeechBubble(sayings[newIndex]);
        }
    }, 30000);
        
    // --- パララックス効果 ---
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    const easing = 0.08;

    document.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth - 0.5);
        const mouseY = (e.clientY / window.innerHeight - 0.5);
        targetX = mouseX;
        targetY = mouseY;
    });

    function animateParallax() {
        currentX += (targetX - currentX) * easing;
        currentY += (targetY - currentY) * easing;
        background.style.transform = `translate(${currentX * -10}px, ${currentY * -5}px)`;
        middle.style.transform = `translate(${currentX * -20}px, ${currentY * -20}px)`;
        character.style.transform = `translate(${currentX * -30}px, ${currentY * -10}px)`;
        requestAnimationFrame(animateParallax);
    }
    animateParallax();

    // --- メニューとコンテンツ ---
    const menuItems = document.querySelectorAll('.menu-item');
    const contentSections = document.querySelectorAll('.content-section');

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            contentSections.forEach(section => {
                section.style.display = 'none';
            });
            document.getElementById(targetId).style.display = 'block';
        });
    });

    contentSections.forEach(section => {
        section.addEventListener('click', (e) => {
            if (e.target === section) {
                section.style.display = 'none';
            }
        });
    });

    // --- 時間表示 ---
    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }
    updateTime();
    setInterval(updateTime, 1000);

        // --- ページロード時の状態復元 ---
        function restoreStateOnLoad() {
            // 1. プロフィールキーの総数とアンロック済みのキーの数を比較
            // profileKeys が正しく定義されていることを前提とします
            if (revealedKeys.length === profileKeys.length) {
                
                // 2. 画像の切り替え
                if (profileImage) {
                    profileImage.src = "./img/my_800_2.webp";
                }
                const storedComment = localStorage.getItem('unlockedComment');
                if (profileComment && storedComment) {
                    profileComment.innerHTML = storedComment; 
                }
            }
            
            // 4. プロフィール情報の表示をローカルストレージの状態に合わせる
            profileKeys.forEach(key => {
                if (revealedKeys.includes(key) && profileContentElements[key]) {
                    profileContentElements[key].textContent = profileData[key];
                }
            });
        }
    
        // DOMContentLoaded の最後に実行
        restoreStateOnLoad();
});
    // 1. すべての対象要素をクラス名で取得
    const headerTextBoxes = document.querySelectorAll('.header-text-box');

    // 見出しのオープニングアニメーション関数
    function playHeaderAnimation(headerTextBox) {
        // 対象要素内のタイトル表示要素を取得
        const headerTitleText = headerTextBox.querySelector('.header-title-text');
        // data-title 属性から表示したいテキストを取得
        const pageTitle = headerTextBox.getAttribute('data-title'); 

        // 1. チカチカ点灯 (1.0秒間)
        headerTextBox.style.animation = 'glitchEffect 0,1s steps(2, end) infinite'; 
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