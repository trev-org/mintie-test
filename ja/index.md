---
title: "Morse Micro ドキュメント"
description: "Morse Micro Wi-Fi HaLow 製品向けの技術ドキュメント"
---

<div style={{textAlign: "center", padding: "60px 24px 48px"}}>
  <img src="/images/LOGO_ICONBLACKFULL.png" alt="Morse Micro" style={{height: "56px", display: "block", margin: "0 auto 32px"}} className="block dark:hidden" />

  <img src="/images/LOGO_ICONWHITEEMPTY.png" alt="Morse Micro" style={{height: "56px", display: "block", margin: "0 auto 32px"}} className="hidden dark:block" />

  <h1 style={{fontSize: "2.75rem", fontWeight: "700", marginBottom: "16px", letterSpacing: "-0.02em"}}>Morse Micro ドキュメント</h1>

  <p style={{fontSize: "1.2rem", color: "var(--colors-content-secondary)", maxWidth: "600px", margin: "0 auto 36px", lineHeight: "1.6"}}>
    Wi-Fi HaLow の設計、構築、展開に必要なすべて — 世界をリードする Sub-1 GHz IoT 向け無線規格です。
  </p>

  <div style={{display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap"}}>
    <a href="/ja/HaLowLink_User_Guide_0_1_4" style={{display: "inline-flex", alignItems: "center", backgroundColor: "var(--colors-accent-DEFAULT)", color: "white", padding: "12px 24px", borderRadius: "8px", fontWeight: "600", textDecoration: "none", fontSize: "0.95rem"}}>
      はじめる
    </a>

    <a href="https://community.morsemicro.com/" target="_blank" style={{display: "inline-flex", alignItems: "center", border: "1px solid var(--colors-border-DEFAULT)", color: "var(--colors-content-DEFAULT)", padding: "12px 24px", borderRadius: "8px", fontWeight: "600", textDecoration: "none", fontSize: "0.95rem"}}>
      コミュニティ
    </a>
  </div>
</div>

---

## ドキュメントを探す

<CardGroup cols={3}>
  <Card title="ユーザーガイド" icon="book-open-cover" href="/ja/HaLowLink_User_Guide_0_1_4">
    HaLowLink、評価キット、Morse Micro ハードウェアを使い始めるためのステップバイステップガイドです。
  </Card>

  <Card title="データシート" icon="microchip" href="/ja/MM6108_Data_Sheet">
    Morse Micro SoC とモジュールの完全な技術仕様。電気的特性とパッケージ情報を含みます。
  </Card>

  <Card title="アプリケーションノート" icon="pencil-mechanical" href="/ja/AppNote_38_version_0_1_3">
    実際の Wi-Fi HaLow 実装シナリオを扱う詳細な技術ノート。
  </Card>

  <Card title="設計リソース" icon="pencil" href="/ja/MM8108-MF15457_Hardware_Design_Guide_0_1_1">
    ハードウェア設計ガイド、PCB 設計パッケージ、リファレンスデザイン、キャリアボードリソース。
  </Card>

  <Card title="ソフトウェアリリース" icon="keyboard" href="/ja/v3-4-1">
    BCF エディターを含む Morse Micro ソフトウェアツールのリリースノートとダウンロード。
  </Card>

  <Card title="Linux" icon="book-blank">
    HaLowLink および評価キットハードウェア向けの Linux ドライバードキュメントと OS イメージ。
  </Card>
</CardGroup>

---

## なぜ Wi-Fi HaLow か?

<CardGroup cols={2}>
  <Card title="より長い通信距離" icon="signal">
    Wi-Fi HaLow は Sub-1 GHz 帯で動作し、従来の Wi-Fi の最大 10 倍の通信距離を実現します — ビル全体、キャンパス、屋外環境までカバーします。
  </Card>

  <Card title="より低い消費電力" icon="battery-low">
    拡張スリープモードと効率的な MAC プロトコルにより、年単位のバッテリー寿命を実現 — 常時稼働の IoT 展開に最適です。
  </Card>

  <Card title="大規模接続" icon="network-wired">
    RAW スケジューリング、TWT 省電力、最大 8191 ステーションのサポートにより、単一のアクセスポイントに数千台のデバイスを接続できます。
  </Card>

  <Card title="グローバル規格" icon="globe">
    IEEE 802.11ah はオープンで世界的に認証された Wi-Fi 規格です — 独自仕様によるロックインや月額料金はなく、WFA HaLow 認証を完全サポートします。
  </Card>
</CardGroup>

---

## 注目の製品

<CardGroup cols={2}>
  <Card title="MM6108 SoC" icon="microchip" href="/ja/MM6108_Data_Sheet">
    **Wi-Fi HaLow MAC/PHY/Radio SoC**

    無線、PHY、MAC を統合したシングルチップ IEEE 802.11ah ソリューション。850–950 MHz 帯の 1/2/4/8 MHz チャネルで最大 32.5 Mbps。SDIO 2.0 / SPI ホストインターフェース、WPA3 セキュリティ、ハイバネートモードで最小 0.03 µA。
  </Card>

  <Card title="HaLowLink" icon="link-horizontal" href="/ja/HaLowLink_User_Guide_0_1_4">
    **Wi-Fi HaLow Linux モジュール**

    迅速なプロトタイピングと展開のために設計された、コンパクトで量産対応の Wi-Fi HaLow Linux モジュール。プラグアンドプレイの USB 接続、事前構築済みの Linux ドライバー、AP/STA モード対応、OpenWrt 互換。
  </Card>
</CardGroup>

---

## クイックリンク

<CardGroup cols={4}>
  <Card title="MM6108 データシート" icon="file-lines" href="/ja/MM6108_Data_Sheet">
    SoC 全仕様
  </Card>

  <Card title="BCF エディター" icon="toolbox" href="/ja/v3-4-1">
    ボード構成ツール
  </Card>

  <Card title="GitHub" icon="github" href="https://github.com/MorseMicro/morse_cli">
    オープンソースツール
  </Card>

  <Card title="コミュニティ" icon="users" href="https://community.morsemicro.com/">
    フォーラムとサポート
  </Card>
</CardGroup>

---

<div style={{textAlign: "center", padding: "40px 24px"}}>
  <p style={{color: "var(--colors-content-secondary)", marginBottom: "16px"}}>お探しのものが見つかりませんか?</p>

  <a href="https://www.morsemicro.com/contact/" target="_blank" style={{display: "inline-flex", alignItems: "center", backgroundColor: "var(--colors-accent-DEFAULT)", color: "white", padding: "10px 20px", borderRadius: "8px", fontWeight: "600", textDecoration: "none", fontSize: "0.9rem"}}>
    お問い合わせ
  </a>
</div>
