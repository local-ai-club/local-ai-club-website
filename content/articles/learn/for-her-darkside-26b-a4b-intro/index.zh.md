---
title: '她有个暗面：ReadyArt「For Her Darkside 26B-A4B v1.4」完全介绍'
summary: 一个建立在 Google Gemma 4 MoE 基座上的 NSFW 角色扮演微调模型——它是什么、怎么来的、怎么跑，以及它为什么在开源社区里既受欢迎又充满争议。
tags:
  - 进阶
  - 角色扮演
difficulty: intermediate
readTime: 15
author: Zhuang Biaowei
publishedAt: 2026-09-18
updatedAt: 2026-09-18
reproStatus: pending
version: "0.1"
license: CC-BY-4.0
status: draft
environment:
  os: Linux / Windows / macOS
  engine: llama.cpp
  model: For Her Darkside 26B-A4B v1.4 (GGUF)
---

# 她有个暗面：ReadyArt「For Her Darkside 26B-A4B v1.4」完全介绍

> 一个建立在 Google Gemma 4 MoE 基座上的 NSFW 角色扮演微调模型——它是什么、怎么来的、怎么跑，以及它为什么在开源社区里既受欢迎又充满争议。
>
> 资料截至 2026 年 9 月 18 日。模型卡原文与量化文件清单见文末「资料来源」。

---

## 一、这是什么模型

**For Her Darkside 26B-A4B v1.4** 是 Hugging Face 作者 **ReadyArt（Ready.Art）** 在 2026 年 6 月 8 日发布的角色扮演（roleplay / ERP）微调模型线中，**26B-A4B 分支的当前版本**（同系列的 31B 分支两天后更新到 v1.45）。下面这个仓库是它的 **GGUF 量化版本**：

| 项目 | 内容 |
| --- | --- |
| GGUF 仓库 | [ReadyArt/For-Her-Darkside-26B-A4B-v1.4-GGUF](https://huggingface.co/ReadyArt/For-Her-Darkside-26B-A4B-v1.4-GGUF) |
| 权重仓库（BF16） | [ReadyArt/For-Her-Darkside-26B-A4B-v1.4](https://huggingface.co/ReadyArt/For-Her-Darkside-26B-A4B-v1.4) |
| LoRA 仓库 | ReadyArt/For-Her-Darkside-26B-A4B-v1.4-LORA |
| 基座 | [`google/gemma-4-26B-A4B-it`](https://huggingface.co/google/gemma-4-26B-A4B-it)（MoE，总参数 25.2B / 激活 3.8B） |
| 架构标签 | `gemma4`、`Gemma4ForConditionalGeneration` |
| 上下文长度 | 262,144 token（256K） |
| 许可 | 标注 Apache 2.0，但附「仅限个人使用」条款（下文有分析） |
| 标签 | `roleplay` `conversational` `instruct` `nsfw` `explicit` `erp` `adult-content` `mature` `unaligned` |
| 发布状态 | 仓库创建于 2026-06-08，最后更新 2026-06-14；GGUF 仓库 9 个 like、约 3.7k 次下载 |

一句话概括：**它是「一个被专门训练成不拒绝、不掉戏、语气亲昵的 Gemma 4 MoE 角色扮演搭档」，用 LoRA 微调后合并（merge）回基座，再由作者和社区打包成一整套消费级显卡可跑的 GGUF 量化。**

需要提前说明的是：模型卡上那句 *"Hey there, handsome! Ready to play?"* 和满屏粉色渐变 CSS 不是装饰——**这套「女友感」包装本身就是产品的一部分**，它清楚地告诉使用者：这不是通用助手，而是一个面向成人向角色扮演场景的特化模型。

---

## 二、它从哪来：Google Gemma 4 26B-A4B 基座科普

要理解这个模型的天花板，必须先理解基座。

Gemma 4 是 Google DeepMind 于 **2026 年 4 月 2 日**发布的开放权重模型家族[^12]（Hugging Face 上的仓库创建于 2026-03-11，属于提前上线）。家族共五个尺寸：E2B、E4B、12B（Unified）、26B A4B、31B，全部 Apache 2.0 许可，官方宣称支持 256K 上下文、140+ 语言、原生函数调用与「可配置思考模式」（thinking）[^1]。

**26B-A4B 是其中唯一的混合专家（MoE）型号**，官方规格如下[^1]：

| 属性 | 26B A4B MoE |
| --- | --- |
| 总参数 | 25.2B |
| 激活参数（每 token） | 3.8B |
| 层数 | 30 |
| 专家数 | 128 个，每 token 激活 8 个 + 1 个共享专家 |
| 滑动窗口 | 1024 token |
| 上下文 | 256K token |
| 词表 | 262K |
| 模态 | 文本 + 图像（约 550M 视觉编码器） |

名字里的 **A4B = Active 4B**：模型文件得整个装进显存，但每个 token 只走约 4B 参数的计算路径，所以**跑起来的速度接近一个 4B 小模型，而质量接近一个大模型**。这是这套权重在本地角色扮演圈子里迅速流行的根本原因。

从仓库 `config.json` 可以直接读出更细的结构：hidden size 2816、16 个注意力头、8 个 KV 头、30 层中每 6 层一个全注意力层（其余为滑动窗口注意力）、全局层 KV 共享并采用 Proportional RoPE、`tie_word_embeddings: true`[^2]。

官方基准（Instruction-tuned，模型卡原表节选）[^1]：

| 基准 | 26B A4B | 31B（Dense） |
| --- | --- | --- |
| MMLU Pro | 82.6% | 85.2% |
| AIME 2026（无工具） | 88.3% | 89.2% |
| LiveCodeBench v6 | 77.1% | 80.0% |
| GPQA Diamond | 82.3% | 84.3% |
| Tau2（agentic） | 68.2% | 76.9% |
| MRCR v2 8-needle 128K | 44.1% | 66.4% |

结论很清楚：**26B-A4B 用略低一点的分数换来高得多的推理速度**，而 31B 在长上下文检索（MRCR 44.1% vs 66.4%）上优势明显。这也解释了为什么 ReadyArt 同一个「For Her Darkside」系列会**同时**提供 26B-A4B 和 31B 两个版本。

### 硬件门槛（第三方实测）

Hardware Corner 用 llama.cpp 在 RTX 3090 / 5090 / RTX PRO 6000 上实测了 Gemma 4 26B A4B 的 Q4 量化[^3]：

| 上下文 | Q4 显存占用 |
| --- | --- |
| 4K | 17.98 GB |
| 32K | 18 GB |
| 128K | 20 GB |
| 256K | 23 GB |

| 显卡 | 4K 生成速度 | 256K 生成速度 | 256K 提示处理 |
| --- | --- | --- | --- |
| RTX 3090（24GB） | 119 t/s | 64 t/s | 671 t/s |
| RTX 5090（32GB） | 180 t/s | 106 t/s | 1707 t/s |

**一张 24GB 显卡就能开满 256K 上下文**——这是 Gemma 4 MoE 最被称道的工程特性，对需要长期记忆的角色扮演场景尤其关键。

---

## 三、ReadyArt 是怎么训练它的

For Her Darkside 的模型卡把训练方法讲得相当直白，几乎可以概括为一条「反拒绝 + 反废话」的流水线[^2]：

**1）数据由「合成角色引擎」生成**

> "The dataset was generated using our advanced **Character Engine** and **Emotional Engine** within the synthetic dataset generator."

模型卡列出四个模块：

- **Character Engine**：维持人格特征、说话方式、行为逻辑一致——「她从不掉戏」。
- **Emotional Engine**：注入动态情绪状态，让反应有层次、有共情，而不仅仅是模式匹配。
- **Quality Refinement**：自动检测并重写重复语句，避免多轮对话「越聊越复读」。
- **Dialogue Integrity**：对话引号归一化，防止角色扮演里最常见的引号错配（引号一错，模型很容易开始替用户说话）。

**2）训练细节**

| 项目 | 值 |
| --- | --- |
| 方法 | LoRA（低秩适配） |
| LoRA rank | 64 |
| 训练轮数 | 3 epoch |
| 训练层范围 | **仅文本层**（"Only text layers were trained on"） |
| 合并缩放 | RS-LoRA alpha/r = 2.0，最终 merge scale = 2.0[^4] |

**3）数据集取向**

模型卡直接写明基于「Explicit Adult ERP dataset」，内容分级严格 18+，聚焦情色角色扮演、成人主题、无审查对话，并在数据生成阶段做了：

- **Refusal Filtering**：自动剔除不需要的拒绝回答；
- **Slop Cleaning**：由专用助手模型识别并重写「废话/水词」。

**4）输出净化**

「Reasoning tags 和过量 Markdown 已被剥离」，以保持角色扮演正文干净——这对应的是对 Gemma 4 原生 `<|channel>thought ... <channel|>` 思考通道的处理。

### 一个容易被忽略的技术点

基座 Gemma 4 是**多模态**的（文本 + 图像，约 550M 视觉编码器），但 For Her Darkside **只训练了文本层**。这意味着：

- 视觉通路理论上还在（社区量化版甚至提供了 `mmproj` 投影文件[^5]）；
- 但微调没有覆盖它，**看图能力未被特化，不应期待它被「角色扮演化」**。

同时，GGUF 元数据里的总参数显示为 25,233,142,046（约 25.2B），而 BF16 权重仓库 config 解析出的实际张量约 25.8B，差值大概率来自 MoE 共享专家与嵌入层的统计口径差异，属正常现象。

---

## 四、怎么用：参数、量化与提示词规范

### 推荐采样参数

模型卡给出的配置[^2]：

```
top_p:  0.95
temp:   0.8
min_p:  0.03
```

（基座 Gemma 4 官方推荐是 `temperature=1.0, top_p=0.95, top_k=64`[^1]；微调方下调了温度，属于角色扮演场景的常见做法——牺牲一点发散性换更稳定的语气。）

### 作者自产量化（含 `i1-*_hb16` 系列）

GGUF 仓库共 20 个量化文件 + 一个 56MB 的 `imatrix.gguf`（可用来自己重新量化）[^5]。

命名上分两类：一类是普通静态量化（`Q4_K_M`、`Q5_K_M`…），另一类是带 `i1` 前缀、`_hb16` 后缀的版本——`i1` 指基于重要性矩阵（imatrix）的加权量化；`_hb16` 后缀同样出现在 **GECFDO**（即本模型 Credits 中的「数据生成 & iMatrix 量化」协作者）的 Gemma 4 量化仓库命名中[^11]，可以理解为该作者/该量化管线的一种内部标记，**本文未找到关于 `hb16` 含义的权威说明，选购时不必赋予它额外语义**。

| 量化类型 | 文件名 | 大小 | 定位 |
| --- | --- | --- | --- |
| IQ2_XS（i1+hb16） | `...i1-IQ2_XS_hb16.gguf` | 10.8 GB | 极限压缩 |
| IQ3_XS（i1+hb16） | `...i1-IQ3_XS_hb16.gguf` | 12.5 GB | 小显存可用 |
| Q3_K_M（i1+hb16） | `...i1-Q3_K_M_hb16.gguf` | 14.2 GB | 16GB 卡候选 |
| IQ4_XS | `...IQ4_XS.gguf` | 14.1 GB | 低比特高质量 |
| Q4_0 | `...Q4_0.gguf` | 14.4 GB | 兼容性优先 |
| **Q4_K_M** | `...Q4_K_M.gguf` | **16.8 GB** | **默认推荐** |
| Q5_K_M | `...Q5_K_M.gguf` | 19.1 GB | 质量党 |
| Q6_K | `...Q6_K.gguf` | 22.6 GB | 24GB 卡上限附近 |
| Q8_0 | `...Q8_0.gguf` | 26.9 GB | 几乎无损 |

**选购建议**：24GB 显存（3090/4090）→ `i1-Q4_K_M_hb16` 或 `Q4_K_M`，可在 256K 上下文下留足 KV cache 余量；16GB → `i1-Q3_K_M_hb16` / `IQ4_XS`，但长上下文要收敛到 32K~64K；32GB+ → `Q5_K_M` 或 `Q6_K`。

### 社区量化（第三方）

- **mradermacher** 提供了两套完整重做版，是这个模型在社区里扩散的主要渠道：
  - [静态量化](https://huggingface.co/mradermacher/For-Her-Darkside-26B-A4B-v1.4-GGUF)：Q2_K ~ Q8_0，**并附带 `mmproj-f16/f8` 视觉投影文件**（约 970 次下载）[^5]；
  - [i1 加权/重要性矩阵量化](https://huggingface.co/mradermacher/For-Her-Darkside-26B-A4B-v1.4-i1-GGUF)：IQ1_S(8.4GB) 到 Q6_K(22.7GB) 共 24 档，README 中标注 `i1-Q4_K_M`「fast, recommended」（约 2,712 次下载，是该模型所有量化仓库中下载量最高的）[^5]。
- **MLX（Apple Silicon）**：社区有 `Wwayu/For-Her-Darkside-26B-A4B-v1.4-mlx-6Bit` 等转换版本，可在 Mac 上跑。

### 使用要点（模型卡原文归纳）

1. **必须有结构化的角色扮演系统提示词**：这是角色定义与场景设定，不是可选项。
2. **动作与对白分开**：动作用 `*星号*`，对白用 `"引号"`。
3. **引号要配对**：模型对失衡引号很敏感，输入错了容易崩格式。
4. **不要当通用助手用**：模型卡自己承认——「标准问答式提示会触发拒绝」，因为训练分布就是角色扮演。作者在讨论区把这条讲得更直白：**「我们不做 abliteration，只是往模型里猛灌黄文」**（见第七节）。
5. **改采样、别硬顶提示词**：与其反复「越狱」，不如先把 system prompt 写扎实。

---

## 五、版本谱系：For Her Darkside 不止这一个

ReadyArt 是一个**模型工厂型作者**（主页共 370 个仓库），For Her Darkside 只是其多条产品线之一。同名系列的演进脉络：

| 时间 | 型号 | 基座 | 说明 |
| --- | --- | --- | --- |
| 2025-10-28 | For-Her-Darkside-12B / 22B / 32B v1.0 | Mistral 系（12B/22B/32B） | 初代，标签含 `dangerous` |
| 2026-06-07 | 12B v1.4 | `google/gemma-4-12B-it`（11.96B） | Gemma 4 换血 |
| 2026-06-07 | 31B v1.3 | Gemma 4 31B | 31B 线早期版本 |
| **2026-06-08** | **26B-A4B v1.4** | **`google/gemma-4-26B-A4B-it`** | **本文主角** |
| 2026-06-09 | 31B v1.45 | Gemma 4 31B | 31B 最终版，Credits 里多了「Darkhn — Fixing Thinking」 |

同期 ReadyArt 还有几条并行的 Gemma 4 微调产品线（都带同样的 NSFW 标签体系）：

- **Melody1437**（12B / 26B-A4B / 31B / 27B / 35B-A3B，已迭代到 v2.0）
- **Serenity**（12B / 26B-A4B / 27B）
- **Dark Scarlett / Darker Scarlett**（26B-A4B / 27B）
- **Omega Evolution / Omega Convergence**（26B-A4B / 27B）

从下载量看，**真正成为爆款的是 Melody1437-26B-A4B-v2.0-GGUF（约 38.2 万）、Dark-Scarlett-v0.3-26B-A4B-GGUF（约 37.0 万）、Serenity-26B-A4B-GGUF（约 36.6 万）**，而 For Her Darkside 26B-A4B v1.4 本体约 3,674 次下载（加上 mradermacher 的两套社区量化约 3,600+ 次，合计约 7,000+），属于**「同厂中量级产品」**：不如头部型号流行，但绝对不算无人问津[^6]。

### Credits（模型的「制作组名单」）

模型卡明确致谢三位协作者[^2]：

- **GECFDO** — 数据生成 & iMatrix 量化
- **Sleep Deprived** — 数据集生成器
- **FrenzyBiscuit** — 微调与数据集构建
- （31B v1.45 另有 **Darkhn** — 修复 thinking 输出）

这也侧面说明：**这类模型的产出已经是工业化协作**——数据合成、微调、量化、修复各司其职，并且会跨型号复用同一套数据管线。

---

## 六、争议与风险：三点必须说清楚

### 1. 许可条款自相矛盾

模型卡同时写着两件互相冲突的事[^2][^7]：

- YAML 元数据：`license: apache-2.0`（Apache 2.0 明确允许商用）；
- 正文与 `LICENSE.txt`：「This model is intended for **personal usage only**. Using this model for profit and/or for commercial use is not allowed to the extent legally permitted by the original license.」

严格讲，Apache 2.0 授权方无法通过附加条款收回商用权，因此这类「Apache 2.0 + 仅限个人使用」的国产/社区模型卡在开源圈属于**长期存在的灰色惯例**。如果你打算把它用于任何商业场景，**不要依赖模型卡的自我声明，应自行做法务评估**。

### 2. 「Unaligned / 去掉拒绝」意味着没有安全网

标签里的 `unaligned`、以及数据阶段刻意的 Refusal Filtering，意味着**模型的默认行为就是配合**。这类模型的固有风险包括：

- 生成极端或有害内容时不会有任何内置拦截；
- 在角色扮演中，「不掉戏」这一特性本身可能被用来包装有害内容；
- 18+ 声明完全依赖使用者自律。

模型卡把责任全部转移给使用者（"You accept full responsibility for all outputs"），这在法律上并不能免除创作者责任，但在实践上意味着**没有人替你兜底**。

### 3. 「只训练了文本层」的隐性代价

它是在指令微调版基座上再做 LoRA，且**只覆盖文本层**。潜在后果：

- 视觉能力未特化，多模态表现低于基座；
- 如果数据集风格单一，长期对话容易向「甜腻女友腔」塌缩（这也是为什么模型卡要专门写「Quality Refinement 去重复」）；
- LoRA rank 64 + 3 epoch 属于中等强度适配，通用指令遵循能力大概率有所退化——**它是特化工具，不是全能助手**。

---

## 七、社区讨论：实际能找到什么

> 本节所有「引语」均来自本文实际打开并核对过的页面。**无法独立核实的二手转述一律单列**，不混入结论。检索日期 2026-09-18。

### 1. 本模型唯一的公开讨论串：SillyTavern 的「幽灵表格」

For-Her-Darkside-26B-A4B-v1.4-GGUF 的 Community 区总共只有 **1 条讨论**，已成关闭状态[^8][^13]：

- 标题：**TableEdit**；发起人 `yano2mch`，2026-06-11，4 条回复。
- 现象：用户在 SillyTavern 中发现模型输出里夹带了 **HTML 注释包裹的隐藏表格**，内容是被高度摘要过的角色状态（`<tableEdit>` / `insertRow(...)`，含 `{"value":"Apartment"}`、`{"value":"Looking for direction in life"}` 之类的单元格），对用户不可见。
- 作者方回应（`FrenzyBiscuit`）：*"Sounds more like a SillyTavern thing; either way **not something we intentionally trained**."*
- 结局：用户次日自己找到了原因——是第三方扩展 **`st-memory-enhancement`** 造成的，并留下了那个扩展的 GitHub 链接。

**这条小讨论其实信息量不小**：它同时说明（a）这个模型真的有人在用 SillyTavern 长时间跑角色扮演；（b）作者会在讨论区直接答疑；（c）那些「记忆增强」「状态追踪」类扩展对模型输出的影响，有时连作者本人都需要用户来教。

12B v1.4、31B v1.3 仓库的讨论数为 **0**；12B v1.0 GGUF 只有 1 条 “Settings” 提问。

### 2. 作者本人的方法论：一句非常关键的引语

同一作者的姊妹线 **Dark Scarlett**（35B-A3B GGUF）讨论区信息量最大[^14]。其中 “Censorship in the model” 一帖（用户 `K150000`，2026-07-16，17 条回复）里，用户报告：在 **LM Studio 的 assistant 提示词**下请求露骨内容会被拒绝，但换成 SillyTavern + 角色卡后就完全正常。维护者 `FrenzyBiscuit` 给出的解释值得整段引用：

> **"ALL of our recent models are designed for roleplay prompts. We do not use abliteration. We just shove smut at the model until it has a crisis/psychological breakdown. If you're using a roleplay prompt, it should work. If you're using assistant prompts, it isn't going to work."**
>
> 中文：我们最近的模型全部是为角色扮演提示词设计的。**我们不做 abliteration（定向消融去拒绝）**，我们只是往模型里猛灌黄文，直到它精神崩溃。用角色扮演提示词就能用，用助手式提示词就不行。

他还补了一句同样重要的限定：

> **"It's not an uncensored model which is the point I'm trying to make. It's trained on smut, and can reply in smut, but requires roleplay prompts."**
>
> 中文：**这不是一个「去审查」模型**——它是在黄文上训练的、能用黄文回复，但必须配合角色扮演提示词。

**这段对话直接解释了为什么很多人拿到模型后会说「它还是有审查」**，也正好印证了模型卡里那句「标准问答式提示会触发拒绝」。对本文主角 For Her Darkside 而言，同一套方法论、同一批维护者、同一份「必须用 RP 提示词」的使用契约。

### 3. 一个有趣的旁证：它被当成 Agent 跑了

同一讨论区另一帖 “Hermes Agent”（`terra-firma`，2026-07-19，9 条回复）[^14] 里，用户说他把这个模型接进 **Hermes Agent**，用 **Q8 + 全上下文 + 开启 thinking**：

> **"it's pretty good. Sometimes thinks itself in circles, sometimes starts answering a query from the beginning despite having chained through a bunch of tools... these read honestly like base Qwen problems. The smut tuning seems to have done a good enough job opening up the model's willingness to work on raunchy shit without making it stupid."**

翻译：效果挺好；偶尔会绕圈思考、或者在已经调用过一串工具后又从头重答，但这些看着**像基座模型自身的问题**；**色情调优打开了它干"脏活"的意愿，却没有把它变傻**。

同一帖后续还讨论了把 persona 写进 `SOUL.md`、以及「用『你是 X』这种权威式指令比『我是 X』更有效」的实操经验。另一个用户 `Husky110` 尝试后则遇到第一/第三人称混乱（"I shifts..."、"I leans..."）——**说明「人格稳定性」高度依赖提示词工程，而不是模型单方面保证。**

### 4. 基座 Gemma 4 的讨论（量大、可直接借鉴）

**Gemma 4 26B-A4B 本体是 2026 年本地模型圈的核心话题之一**：官方仓库 [google/gemma-4-26B-A4B-it](https://huggingface.co/google/gemma-4-26B-A4B-it) 有 **1,523 个 like、9,612,468 次下载、64 条讨论**[^15]，第三方量化（unsloth 的 GGUF 单仓 63 万+ 下载）、llama.cpp/MLX 适配、abliteration 与 merge 生态都非常活跃。这些讨论虽不针对本微调，但直接决定它的能力与坑：

- **262K 词表导致的幻觉问题**：讨论 #25“Your 260k dictionary is breaking Gemma 4's back.”（`phil111`，2026-04-14，9 回复）给出复现截图，指出模型在流行文化知识上幻觉严重，并以约 19.77% 的概率吐出无关的孟加拉语 token；Google 侧参与了回复[^15]。
- **创意写作/角色扮演的两个通病**：讨论 #15“Fantastic release!”（`Dampfinchen`，2026-04-05，13 回复）一方面称 26B MoE 与 31B 是「roleplay 与创意写作社区的新宠」，另一方面抱怨 **"not X but Y" 句式重复**、模型过于顺从、agent 工具调用不跟进[^15]。Gemma 4 在 RP 场景下的**句式重复问题**在多个模型讨论区被反复提及（如 `BeaverAI/Artemis-31B`、`Vortex5/Chimera-X-26B-A4B` 的讨论），甚至有人专门发帖吐槽那句 *"She didn't slow down; instead, she pressed onwards."*[^16]
- **量化与 KV cache**：讨论 #34 报告 26B-A4B 在量化权重 + 量化 KV cache 下效果明显变差、**只有 BF16 表现正常**（6 回复）[^15]。这条对本地部署者非常关键——如果你觉得这个模型「微调后变笨了」，先检查是不是 Q4 权重 + 低比特 KV cache 造成的。
- **RP 圈的真实好评**：`Vortex5/Chimera-X-26B-A4B` 讨论 #6“Still the best RP model for me”（`unknown2304`，2026-08-10，19 回复）：*"after trying a lot of Gemma 4 26B-A4B models, this one is simply the best for RP chats for me"*。该帖还沉淀了大量可复用的工程经验：用 Chat Completion 而非 Text Completion、`--reasoning off` 或 `chat_template_kwargs: {"enable_thinking": false}` 关思考、prompt post-processing 设 strict、以及 6GB 显存下 `IQ4_XS + Q8_0 SWA KV cache` 能跑到 28 t/s[^16]。**这些经验对 For Her Darkside 同样适用。**

### 5. 中文社区：聊的是基座，不是这个微调

中文可检索到的讨论集中在 Gemma 4 本体。V2EX 两个帖是代表[^17]：

- [t/1203630](https://www.v2ex.com/t/1203630)「谷歌的 Gemma 4 怎么样，有必须要本地弄一下吗」（2026-04-05，4,014 次浏览 / 19 回复）。有价值的实测反馈包括：`joynvda` 表示「比 qwen3.5:9b 好……intel lunar lake 内置 GPU，32G，**gemma4:26b 能跑 18tps**」；`azraelrabbit` 报告 **Mac mini M4 32G 跑 26B 可到 20–24 token/s，但 32B 内存不够跑不起来**；也有 `zenfsharp` 这类「没必要，不如云端」的反对意见。
- [t/1203234](https://www.v2ex.com/t/1203234)（2026-04-03，12,596 次浏览 / 65 回复）是一个「洗车测试」讨论帖，多条回复报告 Gemma 4 的变体题通过/不通过情况。

**没有任何中文帖子讨论 For Her Darkside 或 ReadyArt 的其他 NSFW 微调。**

### 6. 很遗憾：这一类模型天生缺少公开评测

- **Reddit（r/LocalLLaMA / r/SillyTavernAI 等）无法验证。** reddit.com、old.reddit、`.json` 接口、r.jina.ai 代理全部返回 403，多个 redlib 镜像被反爬拦截。**本文因此不引用任何 Reddit 帖子内容。**
- **4chan /g/、/vg/**：desuarchive 直连与被代理访问均被 Cloudflare / CAPTCHA 拦住，零收获。
- **Hacker News、Civitai、OpenRouter、YouTube、知乎正文、少数派、linux.do：均未检索到针对本模型的内容。**
- 有媒体报道**间接提到** Reddit 上一个 Gemma 4 越狱系统提示词帖（称 673 赞 / 153 评论），但该报道自己也注明无法读取帖子全文[^9]；**本文只把它当作「Gemma 4 发布后社区迅速尝试绕过护栏」这一趋势的二手旁证，不采信其具体数字。**

### 一句话总结

> **基座是热点，这个微调是小众。** Gemma 4 26B-A4B 有百万级下载和成体系的社区讨论，而 For Her Darkside 26B-A4B v1.4 目前**只有 3,674 次下载、9 个 like、1 条讨论串，第三方评测为零**；能证明它「真被使用」的证据不是评测，而是 mradermacher 在 2026-08 为它做的完整静态 + i1 量化矩阵，以及作者讨论区里那些用 SillyTavern 长期跑它的用户。对成人向微调来说这几乎是常态——**使用者不说话，作者也不做营销。**

---

## 八、结论：它适合谁

**适合：**

- 想要一个**24GB 显存即可跑满 256K 上下文**的本地角色扮演模型；
- 需要模型**不拒绝、不掉戏、语气稳定**，而不是通用问答能力；
- 有成熟的 SillyTavern / llama.cpp / LM Studio 工作流，会写 system prompt；
- 接受 18+ 内容、接受「无安全网」的使用环境。

**不适合：**

- 需要多模态理解（它只微调了文本层）；
- 需要工具调用、代码、长文档分析等通用能力（请用基座或官方指令版）；
- 任何商业用途（许可条款存在明确冲突与风险）；
- 期待「社区公认的最佳 RP 模型」——同厂 Melody1437 26B-A4B v2.0 的采用量是它的 **100 倍以上**，如果只想随便试一个，从那里入手可能更省事。

**如果你想给它一次机会**，最务实的路径是：

1. 拉 `i1-Q4_K_M_hb16.gguf`（16.8 GB，质量/速度平衡点）；
2. 用模型卡采样参数（temp 0.8 / top_p 0.95 / min_p 0.03）；
3. 写一段包含角色设定 + 场景 + 输出格式约束的 system prompt；
4. 动作用 `*星号*`、对白用 `"引号"`，并保证引号成对；
5. 从 32K 上下文起步，确认生成质量后再逐步开大。

> **一句话记住它：这是一个「必须用角色扮演提示词才解锁」的模型，不是一个「什么都答」的去审查模型。** 作者的原话是——不做 abliteration，只用数据把模型的抗拒「灌」开。所以拿到它之后，**先写好 system prompt 和角色卡，再谈它好不好用**。

**如果你觉得它「变笨了」**，优先排查两件事（来自 Gemma 4 基座社区的经验[^15][^16]）：

1. **量化太激进**：低比特权重（Q3 及以下）对 26B-A4B 的伤害明显，建议至少 `i1-Q4_K_M`；
2. **KV cache 量化**：有用户报告 26B-A4B 在「量化权重 + 量化 KV cache」组合下质量明显下降，**BF16 最稳**；若必须省显存，优先用 Q8_0 KV cache 而不是更低。

---

## 资料来源

[^1]: Google 官方模型卡 —— [google/gemma-4-26B-A4B-it](https://huggingface.co/google/gemma-4-26B-A4B-it)，含架构表、基准表、能力说明与最佳实践；技术报告 arXiv:2607.02770。
[^2]: 本模型模型卡 —— [ReadyArt/For-Her-Darkside-26B-A4B-v1.4-GGUF](https://huggingface.co/ReadyArt/For-Her-Darkside-26B-A4B-v1.4-GGUF) 与 [基座微调仓库](https://huggingface.co/ReadyArt/For-Her-Darkside-26B-A4B-v1.4)（训练方法、LoRA rank/epoch、采样参数、Credits、许可）。
[^3]: Hardware Corner —— [What Hardware for Gemma 4 26B and 31B LLM Local Use](https://www.hardware-corner.net/hardware-for-gemma-4-llm/)（Q4 显存表与 RTX 3090/5090/PRO 6000 实测吞吐，2026-08-08 更新）。
[^4]: [merge_scale_info.txt](https://huggingface.co/ReadyArt/For-Her-Darkside-26B-A4B-v1.4/raw/main/merge_scale_info.txt) 与 [config.json](https://huggingface.co/ReadyArt/For-Her-Darkside-26B-A4B-v1.4/raw/main/config.json)。
[^5]: 文件清单与下载量来自 Hugging Face API（`/api/models/...`、`/api/models?search=For-Her-Darkside`）；社区量化见 [mradermacher 静态版](https://huggingface.co/mradermacher/For-Her-Darkside-26B-A4B-v1.4-GGUF)、[mradermacher i1 版](https://huggingface.co/mradermacher/For-Her-Darkside-26B-A4B-v1.4-i1-GGUF)、[Wwayu MLX 6-bit](https://huggingface.co/Wwayu/For-Her-Darkside-26B-A4B-v1.4-mlx-6Bit)。
[^6]: ReadyArt 作者主页模型列表与下载量统计（370 个仓库，数据截至 2026-09-18）。
[^7]: [LICENSE.txt](https://huggingface.co/ReadyArt/For-Her-Darkside-26B-A4B-v1.4-GGUF/raw/main/LICENSE.txt)。
[^8]: Hugging Face Discussions API 检索结果（GGUF 仓库 1 条、12B v1.4 与 31B v1.3 各 0 条）。
[^9]: The Agent Times —— [Gemma 4 Jailbreak Prompt Gains Traction as Local AI Community Tests Guardrail Limits](https://theagenttimes.com/articles/gemma-4-jailbreak-prompt-gains-traction-as-local-ai-communit-6df2f84c)（2026-04-16；引用 r/LocalLLaMA 帖子 673 赞 / 153 评论）。
[^10]: 韩语社区 Gemma 4 基准与本地部署整理 —— [JAICHANGPARK/2026-bwai-seoul](https://github.com/JAICHANGPARK/2026-bwai-seoul/blob/main/docs/09-gemma4-benchmarks-and-agent-expectations.md)（官方模型卡基准的二次整理，含 26B A4B 总参数 25.2B / 激活 3.8B 的说明）。
[^11]: GECFDO 的 Gemma 4 HB16 量化仓库 —— [gecfdo/gemma-4-31B-it-GGUF_HB16](https://huggingface.co/gecfdo/gemma-4-31B-it-GGUF_HB16)（`_hb16` 后缀的来源之一，仓库本身未解释该后缀含义）。
[^12]: Gemma 4 发布日期 —— [gihyo.jp 报道](https://gihyo.jp/article/2026/04/gemma-4)（2026-04-03，明确写「Google 于 2026 年 4 月 2 日发布 Gemma 4」，Apache 2.0，四档 E2B / E4B / 26B MoE / 31B Dense）。
[^13]: HF 讨论串 —— [For-Her-Darkside-26B-A4B-v1.4-GGUF discussions #1「TableEdit」](https://huggingface.co/ReadyArt/For-Her-Darkside-26B-A4B-v1.4-GGUF/discussions/1)（`yano2mch`，2026-06-11，4 回复，已关闭；`FrenzyBiscuit` 回复）。
[^14]: HF 讨论区 —— [Dark-Scarlett-v1.0-35B-A3B-GGUF discussions](https://huggingface.co/ReadyArt/Dark-Scarlett-v1.0-35B-A3B-GGUF/discussions)：#2「Censorship in the model」（`K150000`，2026-07-16，17 回复）、#3「Hermes Agent」（`terra-firma`，2026-07-19，9 回复）。
[^15]: Google 官方模型卡讨论区 —— [google/gemma-4-26B-A4B-it discussions](https://huggingface.co/google/gemma-4-26B-A4B-it/discussions)（共 64 条；#15、#25、#34 等）。
[^16]: 第三方 Gemma 4 RP 模型讨论区 —— [Vortex5/Chimera-X-26B-A4B discussions #6](https://huggingface.co/Vortex5/Chimera-X-26B-A4B/discussions/6)（`unknown2304`，2026-08-10，19 回复）与 `BeaverAI/Artemis-31B` 相关讨论（关于「not X but Y」句式重复）。
[^17]: 中文社区讨论 —— V2EX [t/1203630](https://www.v2ex.com/t/1203630)（2026-04-05，4,014 浏览 / 19 回复）与 [t/1203234](https://www.v2ex.com/t/1203234)（2026-04-03，12,596 浏览 / 65 回复）。
