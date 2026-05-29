---
title: "Morse Micro 文档中心"
description: "Morse Micro Wi-Fi HaLow 产品的技术文档"
---

<div style={{textAlign: "center", padding: "60px 24px 48px"}}>
  <img src="/images/LOGO_ICONBLACKFULL.png" alt="Morse Micro" style={{height: "56px", display: "block", margin: "0 auto 32px"}} className="block dark:hidden" />

  <img src="/images/LOGO_ICONWHITEEMPTY.png" alt="Morse Micro" style={{height: "56px", display: "block", margin: "0 auto 32px"}} className="hidden dark:block" />

  <h1 style={{fontSize: "2.75rem", fontWeight: "700", marginBottom: "16px", letterSpacing: "-0.02em"}}>Morse Micro 文档中心</h1>

  <p style={{fontSize: "1.2rem", color: "var(--colors-content-secondary)", maxWidth: "600px", margin: "0 auto 36px", lineHeight: "1.6"}}>
    设计、构建和部署 Wi-Fi HaLow 所需的全部资料 —— 全球领先的 Sub-1 GHz 物联网无线标准。
  </p>

  <div style={{display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap"}}>
    <a href="/cn/HaLowLink_User_Guide_0_1_4" style={{display: "inline-flex", alignItems: "center", backgroundColor: "var(--colors-accent-DEFAULT)", color: "white", padding: "12px 24px", borderRadius: "8px", fontWeight: "600", textDecoration: "none", fontSize: "0.95rem"}}>
      开始使用
    </a>

    <a href="https://community.morsemicro.com/" target="_blank" style={{display: "inline-flex", alignItems: "center", border: "1px solid var(--colors-border-DEFAULT)", color: "var(--colors-content-DEFAULT)", padding: "12px 24px", borderRadius: "8px", fontWeight: "600", textDecoration: "none", fontSize: "0.95rem"}}>
      社区
    </a>
  </div>
</div>

---

## 浏览文档

<CardGroup cols={3}>
  <Card title="用户指南" icon="book-open-cover" href="/cn/HaLowLink_User_Guide_0_1_4">
    HaLowLink、评估套件以及 Morse Micro 硬件入门的分步指南。
  </Card>

  <Card title="数据手册" icon="microchip" href="/cn/MM6108_Data_Sheet">
    Morse Micro SoC 与模组的完整技术规格,包括电气特性和封装信息。
  </Card>

  <Card title="应用笔记" icon="pencil-mechanical" href="/cn/AppNote_38_version_0_1_3">
    针对 Wi-Fi HaLow 实际应用场景的深入技术说明。
  </Card>

  <Card title="设计资源" icon="pencil" href="/cn/MM8108-MF15457_Hardware_Design_Guide_0_1_1">
    硬件设计指南、PCB 设计包、参考设计与载板资源。
  </Card>

  <Card title="软件发布" icon="keyboard" href="/cn/v3-4-1">
    Morse Micro 软件工具的发布说明与下载,包括 BCF 编辑器。
  </Card>

  <Card title="Linux" icon="book-blank">
    HaLowLink 与评估套件硬件的 Linux 驱动文档及操作系统镜像。
  </Card>
</CardGroup>

---

## 为何选择 Wi-Fi HaLow?

<CardGroup cols={2}>
  <Card title="更远距离" icon="signal">
    Wi-Fi HaLow 工作在 Sub-1 GHz 频段,通信距离可达传统 Wi-Fi 的 10 倍 —— 覆盖整栋建筑、园区及户外环境。
  </Card>

  <Card title="更低功耗" icon="battery-low">
    扩展休眠模式与高效的 MAC 协议带来以年为单位的电池续航 —— 是常开式物联网部署的理想选择。
  </Card>

  <Card title="大规模连接" icon="network-wired">
    通过 RAW 调度、TWT 省电及对最多 8191 个站点的支持,单个接入点即可连接数千台设备。
  </Card>

  <Card title="全球标准" icon="globe">
    IEEE 802.11ah 是开放且经全球认证的 Wi-Fi 标准 —— 无专有锁定、无月费,并完整支持 WFA HaLow 认证。
  </Card>
</CardGroup>

---

## 主打产品

<CardGroup cols={2}>
  <Card title="MM6108 SoC" icon="microchip" href="/cn/MM6108_Data_Sheet">
    **Wi-Fi HaLow MAC/PHY/射频 SoC**

    单芯片 IEEE 802.11ah 解决方案,集成射频、PHY 与 MAC。在 850–950 MHz 频段的 1/2/4/8 MHz 信道上数据速率最高可达 32.5 Mbps。支持 SDIO 2.0 / SPI 主机接口、WPA3 安全协议,休眠模式下电流低至 0.03 µA。
  </Card>

  <Card title="HaLowLink" icon="link-horizontal" href="/cn/HaLowLink_User_Guide_0_1_4">
    **Wi-Fi HaLow Linux 模组**

    紧凑、可投入量产的 Wi-Fi HaLow Linux 模组,专为快速原型开发与部署而设计。即插即用的 USB 连接、预构建的 Linux 驱动、AP 与 STA 模式支持,并兼容 OpenWrt。
  </Card>
</CardGroup>

---

## 快速链接

<CardGroup cols={4}>
  <Card title="MM6108 数据手册" icon="file-lines" href="/cn/MM6108_Data_Sheet">
    完整 SoC 规格
  </Card>

  <Card title="BCF 编辑器" icon="toolbox" href="/cn/v3-4-1">
    板载配置工具
  </Card>

  <Card title="GitHub" icon="github" href="https://github.com/MorseMicro/morse_cli">
    开源工具
  </Card>

  <Card title="社区" icon="users" href="https://community.morsemicro.com/">
    论坛与支持
  </Card>
</CardGroup>

---

<div style={{textAlign: "center", padding: "40px 24px"}}>
  <p style={{color: "var(--colors-content-secondary)", marginBottom: "16px"}}>没有找到所需内容?</p>

  <a href="https://www.morsemicro.com/contact/" target="_blank" style={{display: "inline-flex", alignItems: "center", backgroundColor: "var(--colors-accent-DEFAULT)", color: "white", padding: "10px 20px", borderRadius: "8px", fontWeight: "600", textDecoration: "none", fontSize: "0.9rem"}}>
    联系我们
  </a>
</div>
