import { readFileSync, writeFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectsDir = resolve(__dirname, "../src/data/projects");

// Video data from YouTube playlists (yt-dlp output)
// Format: { year, program, videos: [{ id, title }] }
const playlists = [
  {
    year: 2024,
    program: "it",
    videos: [
      {
        id: "ZuuZMLYRMW8",
        title: "機械学習に基づく中山間地域向け農業用散布ドローン群",
      },
      {
        id: "_vVV_mvjg5s",
        title: "量産可能な4Dファブリケーションテキスタイルの開発",
      },
      {
        id: "MrbRHXsaTeI",
        title: "粘菌ファブリケーションのための粘菌の自動培養システム",
      },
      {
        id: "qckeZlz1am4",
        title: "ジェネラティブVJソフトウェアの開発を容易にするシステム",
      },
      {
        id: "xSGXZGMO5oA",
        title:
          "ゼロトラストネットワークアクセスの導入を容易にするクラウド型プロキシの開発",
      },
      { id: "L8MG3noBca0", title: "トラックボール型3Dマウス" },
      {
        id: "Vg4aPNoEdvA",
        title:
          "スマートフォンを活用して理想のデジタルペットを作成するためのプラットフォーム",
      },
      {
        id: "opx6b2ZmEOo",
        title: "RISC-Vの拡張を仮想化できるハイパーバイザの開発",
      },
      {
        id: "9YFLkEQfzfk",
        title: "ゼロデイ攻撃の対象となるIoT機器を早期特定するシステムの開発",
      },
      {
        id: "WB_PErdcf3w",
        title: "ソースコードとGUIで編集可能なシナリオテスト作成ツールの開発",
      },
      {
        id: "KSkFV1ALJHo",
        title: "ユーザとモノのネットワーク体験を創作するためのARシステム",
      },
      { id: "pIi4T6_1vWM", title: "家族の腸内環境を改善する排便分析デバイス" },
      { id: "gAKGn0zs4AE", title: "バーチャル空間における飛翔体験の構築" },
      {
        id: "DNLurQkVA8s",
        title: "自分自身と気を交わすためのMRによる剣道稽古システムの開発",
      },
      {
        id: "VMZI8by73as",
        title: "ニューラル言語モデルによる個人最適な日本語入力システムの開発",
      },
      {
        id: "53rUKodOWPE",
        title: "認知症当事者の意思決定支援のためのエージェントシステムの開発",
      },
      {
        id: "LUG1fG5y1xo",
        title: "スムーズな多言語交流を実現するためのARによる会話支援システム",
      },
      {
        id: "kHRy4OIq5JE",
        title: "機械学習を用いた語源的英単語分割手法の開発",
      },
      { id: "qxnRlHZwxuI", title: "人工遺伝子回路設計のための統合開発環境" },
      {
        id: "02JVAbefxi4",
        title: "型安全でクロスプラットフォームな次世代MLライブラリの開発",
      },
      {
        id: "YG5ikc-X_Kg",
        title:
          "Capability-Based Microkernelによるセキュアなユーザレベルメモリ管理システム",
      },
    ],
  },
  {
    year: 2024,
    program: "advanced",
    videos: [
      { id: "28ci15nTODU", title: "いつでもLLMと対話できるインタフェース" },
      { id: "s31cVJK095g", title: "盆栽のデジタルツイン化と樹形美の科学" },
      { id: "Wpwm3T6zEcw", title: "生成AI型3Dプリント製造システムの開発" },
      {
        id: "UELqhpIKpgo",
        title: "冷熱蓄熱を活用した大型冷凍機の自動制御システムの開発",
      },
      {
        id: "XmW4Xi3hYn0",
        title: "文章をマンガに自動変換するAIサービスの開発",
      },
      { id: "hIeLgxlt-Nk", title: "多軸3Dプリンタ用汎用スライサーの開発" },
      {
        id: "zMBt1LPEBRk",
        title:
          "高精度な物理モデルベースのフライトコントローラプラットフォームの開発",
      },
      {
        id: "wh6wMcCH5TY",
        title:
          "シイタケほ場のデジタルツインに基づいた栽培管理支援システムの開発",
      },
      {
        id: "tYRk1SbUXfU",
        title: "組合せ最適化とBIMを用いた省エネ建築設計支援サービスの開発",
      },
      {
        id: "WOhltJ1PZYo",
        title: "術具トラッキングを用いた医療手技の動作評価システムの開発",
      },
      {
        id: "bX0XRP-qpxs",
        title: "農家ごとに学習可能な農作物選別システムの開発",
      },
      {
        id: "ipsFsC5D1VQ",
        title: "様々な環境に導入可能な重さ計測プラットフォームの実現",
      },
      {
        id: "VFu2WELgzhQ",
        title: "ゲーミフィケーションを活用した内視鏡トレーニングシステムの開発",
      },
      {
        id: "xKj0sQotazY",
        title: "組織の主体的な価値創出を促進する社内提案システムの開発",
      },
      {
        id: "w8qqplESBWg",
        title:
          "月経中のストレス緩和を目的としたショーツ型経血測定デバイスの開発",
      },
      {
        id: "Fkl0hNPJOlQ",
        title: "スポーツの指導体験と視聴体験が向上するAI駆動型映像システム",
      },
      {
        id: "Xx353fhmsP8",
        title: "HSIライブラリ構築と森林火災未然防止システムの開発",
      },
      { id: "GGLY3tivhVA", title: "AIを活用した統合型採用システムの開発" },
      {
        id: "Id6k7tjMa2w",
        title: "日本アニメの世界観を崩さない吹き替え制作AIプラットフォーム",
      },
    ],
  },
  {
    year: 2023,
    program: "it",
    videos: [
      {
        id: "RSxgegO3bbk",
        title: "GPSと合成音声による防犯スマートフォンアプリケーションの開発",
      },
      {
        id: "ifOPDeCvm0A",
        title: "月経中のストレス緩和を目的としたショーツ型経血量測定デバイス",
      },
      {
        id: "DE9tzE_iZuE",
        title:
          "テーマパークでの満足度を最大化するためのプラン作成支援アプリケーション",
      },
      { id: "3hgzUoNSJIw", title: "空間を奏でる電子楽器の開発" },
      {
        id: "FXtZBt62yik",
        title: "Pythonにトランスパイル可能な静的型付けプログラミング言語の開発",
      },
      {
        id: "qsItvs4B4yQ",
        title: "TEEを用いたセキュアかつ高性能なデータベースシステムの開発",
      },
      {
        id: "3AcfOtc0Mec",
        title: "RISC-Vベースのプロセッサを自動生成するシステムの開発",
      },
      { id: "eLpxjKCsuIA", title: "自作マイコンの開発を容易にする開発環境" },
      { id: "wODUqwW48P0", title: "Capabilityを主軸とするマイクロカーネル" },
      {
        id: "zPyegl8kdKQ",
        title: "魚群や動物プランクトンの空間分布を可視化するシステムの開発",
      },
      {
        id: "zjbG5VL5nTc",
        title: "生成AIを使った制作システムで実現する循環型プラットフォーム",
      },
      { id: "0AfWFMxQdf4", title: "Wasmを実行するunikernelとWasmコンパイラ" },
      {
        id: "cDIMDjhZd88",
        title: "五感情報を記録・共有するセンサリーマップの開発",
      },
      {
        id: "ckLskr-GHRY",
        title: "ぬいぐるみ専用の組み込みAIモジュールの開発",
      },
      {
        id: "yTvs-BfgKTc",
        title: "手話認識による逆引き検索が可能なクラウド型手話辞典の開発",
      },
      {
        id: "mjT5zfGjYXQ",
        title: "視線とキーボードで完結する高速なGUIポインティングシステム",
      },
      { id: "n-nCcXnvAAI", title: "対話可能な選択的機械除草ロボットの開発" },
      {
        id: "Ol6Wko-c7e8",
        title: "乳化量最大化を目指したエスプレッソ抽出制御システムの開発",
      },
      {
        id: "2AKuOxyUSBs",
        title: "サッカーのゴールキーパーのための練習データ分析システム",
      },
      { id: "WbmUJ0A5w4M", title: "みんなで遊べる競技かるた" },
      {
        id: "EwvyAt8-VAg",
        title: "ロボット記述言語に基づくドローン開発支援ツール",
      },
    ],
  },
  {
    year: 2023,
    program: "advanced",
    videos: [
      {
        id: "Ch83Sm1ko4M",
        title: "カメラ映像から自動構築される人流デジタルツインの開発",
      },
      {
        id: "D_nVp5uPD68",
        title: "力覚遍在化技術の社会実装のためのプラットフォームの実現",
      },
      {
        id: "qStEJ2czR8o",
        title: "グッズ交換アプリケーションの開発による推し活革命",
      },
      {
        id: "kWTuLZE3cBo",
        title: "アニメ制作工程のデータ資産を有効活用するAI管理システム",
      },
      {
        id: "oSAVsvv069s",
        title: "HMDを用いた疲労推定及び疲労軽減システムの開発",
      },
      {
        id: "L40OTnuShGA",
        title: "胸骨圧迫の質を向上させるフィードバックデバイスの開発",
      },
      { id: "qjwS8BGQfSY", title: "胎児超音波検査の自動化システム開発" },
      {
        id: "6NguNPMOcNo",
        title: "スポーツにおけるアダプティブラーニングシステムの開発",
      },
      {
        id: "0OQiOohXLWc",
        title: 'AGV群運用計画最適化システム"BLACK STONE BRAIN"の開発',
      },
      {
        id: "jLF5ofdhlH8",
        title: "既存設備へ適応する、低導入コスト資源ごみ小型AI選別機の開発",
      },
      {
        id: "ByiXYLxQqx8",
        title:
          "AIでアパレル二次流通ECの購買体験を最適化するアプリケーションの開発",
      },
      {
        id: "hvNlWYvYofs",
        title: "テレプレゼンス技術のための低遅延IP映像伝送システムの開発",
      },
      { id: "iOrjym3wjF0", title: "映像制作におけるAIとの共創の実現" },
      { id: "PyYKb5-pcas", title: "洪水浸水予報アプリケーションの構築" },
      {
        id: "aSNLYxtxvX0",
        title: "機械学習を用いたダンサー向けARエフェクト合成アプリ",
      },
    ],
  },
  {
    year: 2022,
    program: "it",
    videos: [
      { id: "dU6ShoLCKvk", title: "麻雀プロのためのAI牌譜解析ツール" },
      { id: "5qxBEbpamJw", title: "ハードウェアを意識しない組み込み開発環境" },
      { id: "pqGAdbg22xk", title: "祭り運営を支援するアプリケーションの開発" },
      {
        id: "4A67BPPRaVg",
        title: "VRと電動トレーニング機器を用いた筋力トレーニングシステム",
      },
      {
        id: "r3iwEQDLN2k",
        title: "動画でフィギュアスケートの練習を支援するシステム",
      },
      { id: "W1TqnxcJ-8k", title: "疲労を推定する体重計型デバイスの開発" },
      {
        id: "scmLEPxbTBc",
        title:
          "内部処理分析を基にしたWebアプリケーションのセキュリティSaaSの開発",
      },
      {
        id: "I3WiVrsAyJU",
        title: "HDCアクセラレータとRISC-Vを組み合わせたエッジサーバの開発",
      },
      { id: "xmalCgWNdUk", title: "翻訳IMEとInput Method抽象化レイヤの開発" },
      {
        id: "rjTye94fUv8",
        title:
          "直和型の代わりにユニオン型を持つ静的型付け関数型プログラミング言語の開発",
      },
      {
        id: "7b9AdYMguIs",
        title: "抜かない型を前提とした型設計支援ツールによる物作りの自在化",
      },
      {
        id: "4gPW2IlhhfA",
        title: "トラッキング技術を用いたサッカー試合映像の検索・分析システム",
      },
      {
        id: "t-LsvEtecfE",
        title: "建築土木の鋼構造体工事における膜厚管理システムの開発",
      },
      {
        id: "svwE0yPJ5is",
        title:
          "スマートフォン向けにカスタマイズが可能なサイレントスピーチインタフェース",
      },
      {
        id: "wRjyjhY1Sgs",
        title: "ハイブリット会議のためのマイクシステムの開発",
      },
      {
        id: "9Nmr27HwiXQ",
        title:
          "レイアウトの自由度とキー操作性を両立したノートテイキングアプリケーションの開発",
      },
      {
        id: "8VatUMhZDzg",
        title: "UVプリンタを用いたラインストーン造形システムの開発",
      },
      {
        id: "lqn0lwJcm_8",
        title: "切磋琢磨を促すリモートフィットネスアプリケーションの開発",
      },
      { id: "KsEddl5ni3M", title: "ラップバトル対話システムの開発" },
      {
        id: "QeFuQeYY5TQ",
        title: "リアルタイムな動画内物体認識技術を用いた物探しシステム",
      },
      {
        id: "BPSkASK__Sg",
        title: "複数のARMマシンを一つに集約するハードウェア仮想化レイヤ",
      },
    ],
  },
  {
    year: 2022,
    program: "advanced",
    videos: [
      {
        id: "K7XGT_LUdd0",
        title: "感情共有を促進する心拍フィードバック装置の開発",
      },
      {
        id: "3IS5vrI4VL4",
        title: "個人に最適化するフリーウェイト指導システムの開発",
      },
      {
        id: "CL1ZEVtufBw",
        title: "C++によるWebアプリ開発を普及させるフレームワークの開発",
      },
      {
        id: "znDihIyWbyQ",
        title: "貢献を可視化する意見交換プラットフォームの開発",
      },
      {
        id: "Z8c1kJfEx3Y",
        title: "3Dスキャンによる空き家改修の支援ツール開発",
      },
      { id: "yS6kJgclavs", title: "ZIGEN: XR Windowing System" },
      {
        id: "yCyHEdJXr8I",
        title: "少量多品種の包装箱詰め作業を省人化するロボットシステムの開発",
      },
      {
        id: "VF9sEyxb3EA",
        title: "あらゆる衣服をバーチャル試着可能にする3Dモデリングシステム",
      },
    ],
  },
  {
    year: 2021,
    program: "it",
    videos: [
      {
        id: "2Jkw0Eufz-A",
        title: "合気道の体の使い方の習得を支援するソフトウェア群の開発",
      },
      { id: "5nKYl287BZU", title: "実世界植物検索システム" },
      { id: "cpSXGRfCkT4", title: "微細加工技術によるWebカメラのToFカメラ化" },
      { id: "0ZLPk6E-4tY", title: "3Dプリンタで創る音の触感" },
      {
        id: "M1KSTg_Fnlo",
        title:
          "服のサイズ感がインタラクティブに分かるAR試着モバイルアプリケーション",
      },
      {
        id: "3sCU7MpD6ww",
        title: "チャット型インタフェースを用いた集団発想法支援ツールの開発",
      },
      {
        id: "ah2Gi4ti4-Y",
        title: "動画認識を用いたテニスの戦術コーチングシステム",
      },
      {
        id: "HgyQnrx9kwY",
        title:
          "自律分散的に展開される遊び場を実現するための遊びの制作支援ツールの開発",
      },
      {
        id: "Q7kedu26a7g",
        title: "風呂を掃除するタコ型ロボットとシミュレータの開発",
      },
      {
        id: "pQqoNL53Ksw",
        title:
          "シェルスクリプトへのコンパイルを行う静的型付けスクリプト言語の開発",
      },
      { id: "q93qugqaTDQ", title: "釣りのサイバーフィジカルシステムの開発" },
      {
        id: "A_yW0XsrDdc",
        title: "全身の姿勢推定が可能なイヤーアクセサリの開発",
      },
      {
        id: "_ipJ6CROaO0",
        title: "寝ながらの使用に最適化したVRシステムの開発",
      },
      {
        id: "RYcjW1U4hoE",
        title: "Web技術を活用したプログラミング学習基盤の開発",
      },
      {
        id: "_dVsp-HNPL4",
        title: "構造化会議による効果的な会議の実現のためのプラットフォーム開発",
      },
      {
        id: "R2S6vWgz5Wo",
        title:
          "ソースコードの注釈をプログラミングの知見として共有するソフトウェア",
      },
      { id: "g_MvbwKp8Uk", title: "XR向けWindow System" },
      {
        id: "y8eGZhNu6nQ",
        title: "スマートグラスではじめる日頃のヘルスケアの新常識",
      },
      {
        id: "4hfS73tbDNY",
        title: "筋力トレーニングを全自動で記録するシステムとデバイスの開発",
      },
    ],
  },
  {
    year: 2021,
    program: "advanced",
    videos: [
      {
        id: "kLwL15Gzvrk",
        title: "自分の声を自在に操るウェアラブル音声変換機の開発",
      },
      {
        id: "2C9FLTEOk-s",
        title: "海洋資源探査を効率化するための3次元海洋観測システムの開発",
      },
      {
        id: "94jfduKaIfE",
        title: "姿勢推定技術を用いたかけっこ指導システムIDATENの開発",
      },
      {
        id: "suSeH_NC2Bo",
        title:
          "高速なネイティブアプリ開発を可能にするノーコードプラットフォーム",
      },
      {
        id: "QsbUwUAX5mo",
        title:
          "生体データに基づき個人に最適化する乳幼児向け音楽推薦サービスの開発",
      },
      {
        id: "e3a5eEp6xlY",
        title: "建築現場を巡回しデータ収集・分析するロボットサービスの実現",
      },
      {
        id: "SoNKV61KtlI",
        title: "低コスト・高成功率な自動体外受精ロボットEmbrioの開発",
      },
    ],
  },
  {
    year: 2020,
    program: "it",
    videos: [
      {
        id: "tutvZCxkDl4",
        title: "高速な自動立体造形を実現する手軽で安価なカット加工機の開発",
      },
      {
        id: "X-t-NRowOhI",
        title: "送迎バスの位置情報・到着予想時刻情報提供アプリケーション",
      },
      {
        id: "edRI1DoqWao",
        title:
          "次世代分散型アプリケーションプラットフォームのためのプロトコル開発支援システム",
      },
      {
        id: "w0fNAY5vY3M",
        title: "シェーダライブコーディング・アーカイブシステムの作成",
      },
      {
        id: "bhIfAXsztTw",
        title:
          "非専門家でも手軽に使えるデータ駆動型深層強化学習ライブラリの開発",
      },
      {
        id: "XB_-PsnZgF8",
        title: "ソフトウェアのインストールを必要としないNIC型セキュリティ機構",
      },
      { id: "FU7ounALr_g", title: "布製ウェアラブル手書き入力デバイスの開発" },
      { id: "BUW-9oaiu-I", title: "パックツアーコンサルティングシステム" },
      {
        id: "5uzl97feeLQ",
        title: "オープン・柔軟・セキュアなオンラインVRシステム",
      },
      {
        id: "Kh7BR43hBvs",
        title: "強力なグラフィック機能を備えた日本語組版処理システムの開発",
      },
      { id: "0hNTEWkAJuM", title: "アルゴリズミック・ロボットデザインの開発" },
      {
        id: "RIEE8yU3tB0",
        title: "ハードウェアセキュリティ検査システムの開発",
      },
      {
        id: "O8-9Dke-wro",
        title: "宇宙ごみの運動推定システムと実証衛星の開発",
      },
      {
        id: "0vSBMoNKd-A",
        title: "ARフィルタを用いたヘアアイロン使用補助システムの開発",
      },
      {
        id: "4JmVlJY19C8",
        title:
          "機械学習を活用してデザインからモバイルアプリのコードを自動生成するソフトウェア",
      },
      {
        id: "vAjEwdalUKA",
        title: "VRを用いた野球球審ジャッジトレーニングシステムの開発",
      },
      {
        id: "TwgXdFejsbc",
        title: "文脈に基づいたemoji推薦とその選択インタフェースの開発",
      },
      { id: "71Is6vGYCQ4", title: "聴覚障がい者向けスポーツ上達支援デバイス" },
      { id: "KJPUou05kPQ", title: "時間を操作する映像型ノートの開発" },
    ],
  },
  {
    year: 2020,
    program: "advanced",
    videos: [
      {
        id: "JteJim-8zFs",
        title: "個性を考慮して行動変容を支援するソフトウェアの開発",
      },
      {
        id: "TZBAFXr-AbQ",
        title:
          "高い柔軟性と信頼性を備えた自律移動ロボットを実現する遠隔制御サービスの開発",
      },
      {
        id: "wVCEuv71qaA",
        title: "気象観測気球を用いる高高度観測システムの開発",
      },
      {
        id: "cGTmGnl5EMw",
        title:
          "電気自動車をエネルギーストレージ化する充放電システムYanekaraの開発",
      },
      {
        id: "vn1W0lL6q3A",
        title:
          "暗号資産の健全な取引を促すための法令遵守支援ソリューションの開発",
      },
      {
        id: "hFEwSelAoxo",
        title: "非クリエータが簡単にテロップを製作できるモバイルアプリ",
      },
      {
        id: "jALHmYUz4mE",
        title: "救急外傷全身CT診断における「重症度評価装置」の開発",
      },
      {
        id: "GaAMzPrzdDg",
        title: "ドライブレコーダー型路面性状検査システムの開発",
      },
      {
        id: "rPlwnxZ0Y-I",
        title: "画像解析技術を用いた鉄スクラップの自動解析システム(EMMA)の開発",
      },
      { id: "_N5GFo7YyxA", title: "治癒状態共有webサービスの開発" },
    ],
  },
];

interface Project {
  id: string;
  title: string;
  year: number;
  programType: string;
  links: {
    ipa?: string;
    website?: string;
    demoVideo?: string;
    [key: string]: string | undefined;
  };
  [key: string]: unknown;
}

function similarity(a: string, b: string): number {
  // Simple substring matching score
  const shorter = a.length < b.length ? a : b;
  const longer = a.length < b.length ? b : a;

  // Check if shorter is a substring
  if (longer.includes(shorter)) return shorter.length;

  // Check overlapping substrings
  let maxLen = 0;
  for (let len = Math.min(shorter.length, 20); len >= 8; len--) {
    for (let i = 0; i <= shorter.length - len; i++) {
      const sub = shorter.slice(i, i + len);
      if (longer.includes(sub) && len > maxLen) {
        maxLen = len;
      }
    }
    if (maxLen > 0) break;
  }
  return maxLen;
}

let totalMatched = 0;
let totalUnmatched = 0;

for (const playlist of playlists) {
  const filename = `${playlist.year}-${playlist.program}.json`;
  const filePath = resolve(projectsDir, filename);

  let projects: Project[];
  try {
    projects = JSON.parse(readFileSync(filePath, "utf-8"));
  } catch {
    console.warn(`⚠️ File not found: ${filename}`);
    continue;
  }

  console.log(
    `\n📋 ${filename} (${projects.length} projects, ${playlist.videos.length} videos)`,
  );

  let matched = 0;
  for (const video of playlist.videos) {
    let bestMatch: Project | null = null;
    let bestScore = 0;

    for (const project of projects) {
      const score = similarity(video.title, project.title);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = project;
      }
    }

    if (bestMatch && bestScore >= 8) {
      bestMatch.links.demoVideo = `https://www.youtube.com/watch?v=${video.id}`;
      matched++;
      console.log(`  ✅ ${bestMatch.id}: ${video.title.slice(0, 40)}...`);
    } else {
      console.log(`  ❌ No match for: ${video.title.slice(0, 50)}`);
      totalUnmatched++;
    }
  }

  totalMatched += matched;

  writeFileSync(filePath, JSON.stringify(projects, null, 2) + "\n", "utf-8");
  console.log(`  → Matched ${matched}/${playlist.videos.length}`);
}

console.log(
  `\n✅ Total matched: ${totalMatched}, unmatched: ${totalUnmatched}`,
);
