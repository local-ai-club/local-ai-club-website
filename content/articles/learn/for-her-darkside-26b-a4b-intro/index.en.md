---
title: 'She Has a Dark Side: A Complete Introduction to ReadyArt "For Her Darkside 26B-A4B v1.4"'
summary: An NSFW roleplay fine-tuned model built on the Google Gemma 4 MoE base — what it is, where it came from, how to run it, and why it is both popular and controversial in the open-source community.
tags:
  - Intermediate
  - Roleplay
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

# She Has a Dark Side: A Complete Introduction to ReadyArt "For Her Darkside 26B-A4B v1.4"

> An NSFW roleplay fine-tuned model built on the Google Gemma 4 MoE base — what it is, where it came from, how to run it, and why it is both popular and controversial in the open-source community.
>
> Information current as of September 18, 2026. See "Sources" at the end for the original model card and the quantization file list.

---

## 1. What This Model Is

**For Her Darkside 26B-A4B v1.4** is the **current version of the 26B-A4B branch** of the roleplay (roleplay / ERP) fine-tuned model line released on June 8, 2026 by Hugging Face author **ReadyArt (Ready.Art)** (the 31B branch of the same series was updated to v1.45 two days later). The repository below is its **GGUF quantized version**:

| Item | Details |
| --- | --- |
| GGUF repository | [ReadyArt/For-Her-Darkside-26B-A4B-v1.4-GGUF](https://huggingface.co/ReadyArt/For-Her-Darkside-26B-A4B-v1.4-GGUF) |
| Weights repository (BF16) | [ReadyArt/For-Her-Darkside-26B-A4B-v1.4](https://huggingface.co/ReadyArt/For-Her-Darkside-26B-A4B-v1.4) |
| LoRA repository | ReadyArt/For-Her-Darkside-26B-A4B-v1.4-LORA |
| Base | [`google/gemma-4-26B-A4B-it`](https://huggingface.co/google/gemma-4-26B-A4B-it) (MoE, 25.2B total parameters / 3.8B active) |
| Architecture tags | `gemma4`, `Gemma4ForConditionalGeneration` |
| Context length | 262,144 tokens (256K) |
| License | Listed as Apache 2.0, but with an additional "personal use only" clause (analyzed below) |
| Tags | `roleplay` `conversational` `instruct` `nsfw` `explicit` `erp` `adult-content` `mature` `unaligned` |
| Release status | Repository created 2026-06-08, last updated 2026-06-14; the GGUF repository has 9 likes and about 3.7k downloads |

In one sentence: **it is "a Gemma 4 MoE roleplay companion specially trained to never refuse, never break character, and speak in an affectionate tone," fine-tuned with LoRA and then merged back into the base, and subsequently packaged by the author and the community into a full set of GGUF quantizations that consumer-grade GPUs can run.**

One thing to note up front: the line *"Hey there, handsome! Ready to play?"* on the model card, and the screen full of pink gradient CSS, are not decoration — **this "girlfriend vibe" packaging is itself part of the product.** It clearly tells the user: this is not a general-purpose assistant, but a specialized model aimed at adult-oriented roleplay scenarios.

---

## 2. Where It Comes From: A Primer on the Google Gemma 4 26B-A4B Base

To understand this model's ceiling, you must first understand the base.

Gemma 4 is an open-weight model family released by Google DeepMind on **April 2, 2026**[^12] (the Hugging Face repository was created on 2026-03-11, going up ahead of schedule). The family has five sizes — E2B, E4B, 12B (Unified), 26B A4B, 31B — all under the Apache 2.0 license. Google officially claims support for 256K context, 140+ languages, native function calling, and a "configurable thinking mode" (thinking)[^1].

**26B-A4B is the only mixture-of-experts (MoE) model in the family**, with the following official specifications[^1]:

| Attribute | 26B A4B MoE |
| --- | --- |
| Total parameters | 25.2B |
| Active parameters (per token) | 3.8B |
| Layers | 30 |
| Experts | 128, with 8 activated per token + 1 shared expert |
| Sliding window | 1024 tokens |
| Context | 256K tokens |
| Vocabulary | 262K |
| Modalities | Text + image (~550M vision encoder) |

The **A4B = Active 4B** in the name: the model files must be loaded entirely into VRAM, but each token only traverses a computational path of roughly 4B parameters, so **inference speed approaches a small 4B model while quality approaches a large model.** This is the fundamental reason these weights took off so quickly in the local roleplay community.

Finer structural details can be read directly from the repository's `config.json`: hidden size 2816, 16 attention heads, 8 KV heads, one full-attention layer every 6 layers out of the 30 (the rest use sliding-window attention), global-layer KV sharing with Proportional RoPE, and `tie_word_embeddings: true`[^2].

Official benchmarks (instruction-tuned, excerpt from the model card's original table)[^1]:

| Benchmark | 26B A4B | 31B (Dense) |
| --- | --- | --- |
| MMLU Pro | 82.6% | 85.2% |
| AIME 2026 (no tools) | 88.3% | 89.2% |
| LiveCodeBench v6 | 77.1% | 80.0% |
| GPQA Diamond | 82.3% | 84.3% |
| Tau2 (agentic) | 68.2% | 76.9% |
| MRCR v2 8-needle 128K | 44.1% | 66.4% |

The conclusion is clear: **26B-A4B trades slightly lower scores for much higher inference speed**, while 31B holds a significant advantage in long-context retrieval (MRCR 44.1% vs 66.4%). This also explains why ReadyArt offers **both** 26B-A4B and 31B versions of the same "For Her Darkside" series.

### Hardware Requirements (Third-Party Measurements)

Hardware Corner benchmarked the Q4 quantization of Gemma 4 26B A4B with llama.cpp on RTX 3090 / 5090 / RTX PRO 6000[^3]:

| Context | Q4 VRAM usage |
| --- | --- |
| 4K | 17.98 GB |
| 32K | 18 GB |
| 128K | 20 GB |
| 256K | 23 GB |

| GPU | 4K generation speed | 256K generation speed | 256K prompt processing |
| --- | --- | --- | --- |
| RTX 3090 (24GB) | 119 t/s | 64 t/s | 671 t/s |
| RTX 5090 (32GB) | 180 t/s | 106 t/s | 1707 t/s |

**A single 24GB GPU can run the full 256K context** — this is the most-praised engineering feature of the Gemma 4 MoE, and it is especially critical for roleplay scenarios that require long-term memory.

---

## 3. How ReadyArt Trained It

The For Her Darkside model card describes the training method quite candidly, and it can almost be summarized as a single "anti-refusal + anti-slop" pipeline[^2]:

**1) The data was generated by a "synthetic character engine"**

> "The dataset was generated using our advanced **Character Engine** and **Emotional Engine** within the synthetic dataset generator."

The model card lists four modules:

- **Character Engine**: maintains consistent personality traits, speech patterns, and behavioral logic — "she never breaks character."
- **Emotional Engine**: injects dynamic emotional states so that responses have layers and empathy, rather than mere pattern matching.
- **Quality Refinement**: automatically detects and rewrites repetitive sentences, preventing multi-turn conversations from "getting more repetitive the longer you chat."
- **Dialogue Integrity**: normalizes dialogue quotation marks, preventing the most common roleplay error of mismatched quotes (once the quotes go wrong, the model easily starts speaking on the user's behalf).

**2) Training details**

| Item | Value |
| --- | --- |
| Method | LoRA (low-rank adaptation) |
| LoRA rank | 64 |
| Training epochs | 3 |
| Trained layers | **Text layers only** ("Only text layers were trained on") |
| Merge scaling | RS-LoRA alpha/r = 2.0, final merge scale = 2.0[^4] |

**3) Dataset orientation**

The model card states outright that it is based on an "Explicit Adult ERP dataset," strictly 18+ in content rating, focused on erotic roleplay, adult themes, and uncensored dialogue, with the following done during the data generation stage:

- **Refusal Filtering**: automatically removes unwanted refusal responses;
- **Slop Cleaning**: a dedicated assistant model identifies and rewrites "slop/filler words."

**4) Output cleaning**

"Reasoning tags and excessive Markdown have been stripped" to keep the roleplay text clean — this corresponds to the handling of Gemma 4's native `<|channel>thought ... <channel|>` thinking channel.

### An Easily Overlooked Technical Point

The base Gemma 4 is **multimodal** (text + image, ~550M vision encoder), but For Her Darkside **only trained the text layers**. This means:

- The vision pathway theoretically still exists (community quantizations even provide `mmproj` projection files[^5]);
- But the fine-tuning did not cover it — **the vision capability was not specialized, and you should not expect it to have been "roleplay-ized."**

Also, the total parameter count in the GGUF metadata shows 25,233,142,046 (~25.2B), while the actual tensors parsed from the BF16 weights repository config come to about 25.8B. The discrepancy most likely comes from differences in how the MoE shared expert and embedding layers are counted, which is normal.

---

## 4. How to Use It: Parameters, Quantization, and Prompt Conventions

### Recommended Sampling Parameters

The configuration given in the model card[^2]:

```
top_p:  0.95
temp:   0.8
min_p:  0.03
```

(The base Gemma 4 officially recommends `temperature=1.0, top_p=0.95, top_k=64`[^1]; the fine-tuner lowered the temperature, a common practice in roleplay scenarios — sacrificing some divergence for a more stable tone.)

### Author's Own Quantizations (Including the `i1-*_hb16` Series)

The GGUF repository contains 20 quantization files plus one 56MB `imatrix.gguf` (which can be used to re-quantize on your own)[^5].

The naming falls into two categories: ordinary static quantizations (`Q4_K_M`, `Q5_K_M`…), and versions with the `i1` prefix and `_hb16` suffix — `i1` refers to importance-matrix (imatrix) weighted quantization; the `_hb16` suffix also appears in the Gemma 4 quantization repository naming of **GECFDO** (the "data generation & iMatrix quantization" collaborator listed in this model's Credits)[^11]. It can be understood as an internal marker of that author / that quantization pipeline, but **this article found no authoritative explanation of what `hb16` means, so there is no need to assign it any extra meaning when choosing a file**.

| Quant type | Filename | Size | Positioning |
| --- | --- | --- | --- |
| IQ2_XS (i1+hb16) | `...i1-IQ2_XS_hb16.gguf` | 10.8 GB | Extreme compression |
| IQ3_XS (i1+hb16) | `...i1-IQ3_XS_hb16.gguf` | 12.5 GB | Usable on small VRAM |
| Q3_K_M (i1+hb16) | `...i1-Q3_K_M_hb16.gguf` | 14.2 GB | Candidate for 16GB cards |
| IQ4_XS | `...IQ4_XS.gguf` | 14.1 GB | Low-bit high quality |
| Q4_0 | `...Q4_0.gguf` | 14.4 GB | Compatibility first |
| **Q4_K_M** | `...Q4_K_M.gguf` | **16.8 GB** | **Default recommendation** |
| Q5_K_M | `...Q5_K_M.gguf` | 19.1 GB | For quality enthusiasts |
| Q6_K | `...Q6_K.gguf` | 22.6 GB | Near the ceiling for 24GB cards |
| Q8_0 | `...Q8_0.gguf` | 26.9 GB | Nearly lossless |

**Buying advice**: 24GB VRAM (3090/4090) → `i1-Q4_K_M_hb16` or `Q4_K_M`, leaving ample KV cache headroom at 256K context; 16GB → `i1-Q3_K_M_hb16` / `IQ4_XS`, but long context should be reduced to 32K~64K; 32GB+ → `Q5_K_M` or `Q6_K`.

### Community Quantizations (Third-Party)

- **mradermacher** provides two complete re-quantized sets, which are the main channel through which this model spread through the community:
  - [Static quantization](https://huggingface.co/mradermacher/For-Her-Darkside-26B-A4B-v1.4-GGUF): Q2_K ~ Q8_0, **and comes with `mmproj-f16/f8` vision projection files** (about 970 downloads)[^5];
  - [i1 weighted / importance-matrix quantization](https://huggingface.co/mradermacher/For-Her-Darkside-26B-A4B-v1.4-i1-GGUF): IQ1_S (8.4GB) to Q6_K (22.7GB), 24 tiers total, with the README marking `i1-Q4_K_M` as "fast, recommended" (about 2,712 downloads — the highest download count among all quantization repositories for this model)[^5].
- **MLX (Apple Silicon)**: the community has conversion versions such as `Wwayu/For-Her-Darkside-26B-A4B-v1.4-mlx-6Bit` that can run on Macs.

### Usage Notes (Summarized from the Model Card)

1. **A structured roleplay system prompt is required**: it is the character definition and scene setting, not an optional extra.
2. **Separate actions from dialogue**: actions use `*asterisks*`, dialogue uses `"quotation marks"`.
3. **Quotes must be paired**: the model is sensitive to unbalanced quotes; wrong input easily breaks formatting.
4. **Don't use it as a general assistant**: the model card itself admits — "standard Q&A-style prompts will trigger refusals," because the training distribution is roleplay. The author put it even more bluntly in the discussions: **"We don't do abliteration, we just shove smut at the model"** (see section 7).
5. **Adjust sampling, don't brute-force the prompt**: rather than repeatedly "jailbreaking," it's better to write a solid system prompt first.

---

## 5. Version Lineage: For Her Darkside Is Not the Only One

ReadyArt is a **model-factory-type author** (370 repositories in total on their profile), and For Her Darkside is just one of several product lines. The evolution of the same-name series:

| Date | Model | Base | Notes |
| --- | --- | --- | --- |
| 2025-10-28 | For-Her-Darkside-12B / 22B / 32B v1.0 | Mistral-based (12B/22B/32B) | First generation, tagged `dangerous` |
| 2026-06-07 | 12B v1.4 | `google/gemma-4-12B-it` (11.96B) | Switched to Gemma 4 |
| 2026-06-07 | 31B v1.3 | Gemma 4 31B | Early 31B-line version |
| **2026-06-08** | **26B-A4B v1.4** | **`google/gemma-4-26B-A4B-it`** | **The subject of this article** |
| 2026-06-09 | 31B v1.45 | Gemma 4 31B | Final 31B version, with "Darkhn — Fixing Thinking" added to Credits |

In the same period, ReadyArt had several parallel Gemma 4 fine-tuning product lines (all carrying the same NSFW tag system):

- **Melody1437** (12B / 26B-A4B / 31B / 27B / 35B-A3B, iterated up to v2.0)
- **Serenity** (12B / 26B-A4B / 27B)
- **Dark Scarlett / Darker Scarlett** (26B-A4B / 27B)
- **Omega Evolution / Omega Convergence** (26B-A4B / 27B)

Judging by downloads, **the real hits are Melody1437-26B-A4B-v2.0-GGUF (~382k), Dark-Scarlett-v0.3-26B-A4B-GGUF (~370k), and Serenity-26B-A4B-GGUF (~366k)**, while For Her Darkside 26B-A4B v1.4 itself has about 3,674 downloads (plus about 3,600+ from mradermacher's two community quantizations, for roughly 7,000+ total). It is a **"mid-volume product from the same factory"**: not as popular as the top models, but by no means ignored[^6].

### Credits (the Model's "Production Credits")

The model card explicitly thanks three collaborators[^2]:

- **GECFDO** — data generation & iMatrix quantization
- **Sleep Deprived** — dataset generator
- **FrenzyBiscuit** — fine-tuning and dataset construction
- (31B v1.45 additionally has **Darkhn** — fixed thinking output)

This also indirectly illustrates that **the production of such models has become industrialized collaboration** — data synthesis, fine-tuning, quantization, and fixes each have their own specialists, and the same data pipeline is reused across models.

---

## 6. Controversy and Risk: Three Points That Must Be Made Clear

### 1. Self-Contradictory License Terms

The model card simultaneously states two conflicting things[^2][^7]:

- YAML metadata: `license: apache-2.0` (Apache 2.0 explicitly allows commercial use);
- The body text and `LICENSE.txt`: "This model is intended for **personal usage only**. Using this model for profit and/or for commercial use is not allowed to the extent legally permitted by the original license."

Strictly speaking, an Apache 2.0 licensor cannot revoke commercial-use rights through additional terms, so this kind of "Apache 2.0 + personal use only" domestic/community model card is a **long-standing gray convention** in the open-source world. If you intend to use it in any commercial scenario, **do not rely on the model card's self-declaration; you should do your own legal review**.

### 2. "Unaligned / Refusal Removed" Means There Is No Safety Net

The `unaligned` tag, and the deliberate Refusal Filtering at the data stage, mean that **the model's default behavior is to comply**. The inherent risks of this kind of model include:

- No built-in interception when generating extreme or harmful content;
- In roleplay, the "never breaks character" trait itself can be used to package harmful content;
- The 18+ declaration relies entirely on user self-discipline.

The model card transfers all responsibility to the user ("You accept full responsibility for all outputs"), which does not legally exempt the creator from liability, but in practice means **no one is covering for you**.

### 3. The Hidden Cost of "Only the Text Layers Were Trained"

It applies LoRA on top of an instruction-tuned base, and **only covers the text layers**. Potential consequences:

- Vision capability is not specialized; multimodal performance is below the base;
- If the dataset style is monotonous, long conversations tend to collapse toward a "sweet girlfriend tone" (which is why the model card specifically mentions "Quality Refinement to remove repetition");
- LoRA rank 64 + 3 epochs is a medium-intensity adaptation, and general instruction-following ability has likely degraded somewhat — **it is a specialized tool, not an all-purpose assistant**.

---

## 7. Community Discussion: What Can Actually Be Found

> All "quotes" in this section come from pages that this article actually opened and verified. **Secondhand accounts that cannot be independently verified are listed separately** and are not mixed into the conclusions. Search date 2026-09-18.

### 1. The Model's Only Public Discussion Thread: SillyTavern's "Ghost Table"

For-Her-Darkside-26B-A4B-v1.4-GGUF's Community section has only **1 discussion** in total, now closed[^8][^13]:

- Title: **TableEdit**; started by `yano2mch`, 2026-06-11, 4 replies.
- Phenomenon: the user found that in SillyTavern, the model's output contained **hidden tables wrapped in HTML comments**, with contents being highly summarized character states (`<tableEdit>` / `insertRow(...)`, containing cells like `{"value":"Apartment"}`, `{"value":"Looking for direction in life"}`), invisible to the user.
- Author-side response (`FrenzyBiscuit`): *"Sounds more like a SillyTavern thing; either way **not something we intentionally trained**."*
- Outcome: the user found the cause themselves the next day — it was caused by the third-party extension **`st-memory-enhancement`**, and they left a GitHub link to that extension.

**This small discussion is actually quite informative**: it simultaneously shows that (a) people really are using this model to run long roleplay sessions in SillyTavern; (b) the author answers questions directly in the discussions; (c) the impact of "memory enhancement" and "state tracking" extensions on model output can be something even the author themselves needs the user to explain.

The 12B v1.4 and 31B v1.3 repositories have **0** discussions; the 12B v1.0 GGUF has only 1 "Settings" question.

### 2. The Author's Own Methodology: A Very Key Quote

The most informative discussion section belongs to the same author's sister line **Dark Scarlett** (35B-A3B GGUF)[^14]. In the thread "Censorship in the model" (user `K150000`, 2026-07-16, 17 replies), a user reported that requesting explicit content under **LM Studio's assistant prompt** gets refused, but switching to SillyTavern + a character card works completely normally. The maintainer `FrenzyBiscuit`'s explanation is worth quoting in full:

> **"ALL of our recent models are designed for roleplay prompts. We do not use abliteration. We just shove smut at the model until it has a crisis/psychological breakdown. If you're using a roleplay prompt, it should work. If you're using assistant prompts, it isn't going to work."**

He added an equally important qualification:

> **"It's not an uncensored model which is the point I'm trying to make. It's trained on smut, and can reply in smut, but requires roleplay prompts."**

**This exchange directly explains why many people, after getting the model, say "it's still censored,"** and it also corroborates the model card's line that "standard Q&A-style prompts trigger refusals." For the subject of this article, For Her Darkside, it is the same methodology, the same maintainers, and the same "must use RP prompts" usage contract.

### 3. An Interesting Side Note: It Was Run as an Agent

In another thread in the same discussion section, "Hermes Agent" (`terra-firma`, 2026-07-19, 9 replies)[^14], a user said they hooked the model into **Hermes Agent**, using **Q8 + full context + thinking enabled**:

> **"it's pretty good. Sometimes thinks itself in circles, sometimes starts answering a query from the beginning despite having chained through a bunch of tools... these read honestly like base Qwen problems. The smut tuning seems to have done a good enough job opening up the model's willingness to work on raunchy shit without making it stupid."**

The same thread later discussed writing the persona into `SOUL.md`, and the practical tip that "authoritative instructions like 'You are X' are more effective than 'I am X'." Another user, `Husky110`, tried it and ran into first/third-person confusion ("I shifts...", "I leans...") — **showing that "personality stability" depends heavily on prompt engineering rather than being unilaterally guaranteed by the model.**

### 4. Base Gemma 4 Discussions (Large Volume, Directly Borrowable)

**Gemma 4 26B-A4B itself is one of the core topics in the 2026 local-model community**: the official repository [google/gemma-4-26B-A4B-it](https://huggingface.co/google/gemma-4-26B-A4B-it) has **1,523 likes, 9,612,468 downloads, and 64 discussions**[^15], and third-party quantizations (unsloth's GGUF single repository has 630k+ downloads), llama.cpp/MLX adaptations, abliteration, and merge ecosystems are all very active. These discussions are not about this fine-tune specifically, but they directly determine its capabilities and pitfalls:

- **The 262K-vocabulary hallucination problem**: discussion #25 "Your 260k dictionary is breaking Gemma 4's back." (`phil111`, 2026-04-14, 9 replies) provides reproduction screenshots, pointing out that the model hallucinates severely on pop-culture knowledge and spits out irrelevant Bengali tokens at about 19.77% probability; Google's side participated in the replies[^15].
- **Two common ailments in creative writing / roleplay**: discussion #15 "Fantastic release!" (`Dampfinchen`, 2026-04-05, 13 replies) calls the 26B MoE and 31B "new favorites of the roleplay and creative writing community" on the one hand, but on the other complains about **repetitive "not X but Y" sentence patterns**, the model being too compliant, and agent tool-calling not following through[^15]. Gemma 4's **sentence-repetition problem** in RP scenarios is repeatedly mentioned across multiple model discussion sections (such as `BeaverAI/Artemis-31B` and `Vortex5/Chimera-X-26B-A4B`), and someone even made a dedicated post complaining about the line *"She didn't slow down; instead, she pressed onwards."*[^16]
- **Quantization and KV cache**: discussion #34 reports that 26B-A4B performs noticeably worse under quantized weights + quantized KV cache, and that **only BF16 behaves normally** (6 replies)[^15]. This is critical for local deployers — if you feel this model "got dumber after fine-tuning," first check whether it's caused by Q4 weights + low-bit KV cache.
- **Genuine praise from the RP community**: `Vortex5/Chimera-X-26B-A4B` discussion #6 "Still the best RP model for me" (`unknown2304`, 2026-08-10, 19 replies): *"after trying a lot of Gemma 4 26B-A4B models, this one is simply the best for RP chats for me"*. That thread also accumulated a lot of reusable engineering experience: use Chat Completion rather than Text Completion, `--reasoning off` or `chat_template_kwargs: {"enable_thinking": false}` to disable thinking, set prompt post-processing to strict, and that with 6GB VRAM, `IQ4_XS + Q8_0 SWA KV cache` can reach 28 t/s[^16]. **These lessons apply to For Her Darkside as well.**

### 5. The Chinese Community: Discussing the Base, Not This Fine-Tune

The Chinese-language discussions that can be found are concentrated on Gemma 4 itself. Two V2EX threads are representative[^17]:

- [t/1203630](https://www.v2ex.com/t/1203630) "How is Google's Gemma 4? Is it necessary to set it up locally?" (2026-04-05, 4,014 views / 19 replies). Valuable hands-on feedback includes: `joynvda` says "better than qwen3.5:9b... Intel Lunar Lake's integrated GPU, 32G, **gemma4:26b can run at 18 tps**"; `azraelrabbit` reports **a Mac mini M4 32G running the 26B can reach 20–24 token/s, but the 32B won't run due to insufficient memory**; there are also objections like `zenfsharp`'s "not necessary, cloud is better."
- [t/1203234](https://www.v2ex.com/t/1203234) (2026-04-03, 12,596 views / 65 replies) is a "car-wash test" discussion thread, with multiple replies reporting pass/fail on Gemma 4's variant questions.

**No Chinese posts discuss For Her Darkside or ReadyArt's other NSFW fine-tunes.**

### 6. Unfortunately: This Class of Model Inherently Lacks Public Benchmarks

- **Reddit (r/LocalLLaMA / r/SillyTavernAI, etc.) could not be verified.** reddit.com, old.reddit, the `.json` interface, and the r.jina.ai proxy all returned 403, and multiple redlib mirrors were blocked by anti-scraping measures. **This article therefore does not cite any Reddit post content.**
- **4chan /g/, /vg/**: both direct and proxied access to desuarchive was blocked by Cloudflare / CAPTCHA; zero results.
- **Hacker News, Civitai, OpenRouter, YouTube, Zhihu article bodies, SSPAI, linux.do: no content about this model was found in any of them.**
- One media report **indirectly mentions** a Reddit post about a Gemma 4 jailbreak system prompt (claiming 673 upvotes / 153 comments), but that report itself notes it could not read the full post[^9]; **this article treats it only as a secondhand indication of the trend that "the community quickly tried to bypass guardrails after Gemma 4's release," and does not accept its specific numbers.**

### One-Sentence Summary

> **The base is a hot topic; this fine-tune is niche.** Gemma 4 26B-A4B has millions of downloads and a well-developed body of community discussion, while For Her Darkside 26B-A4B v1.4 currently has **only 3,674 downloads, 9 likes, 1 discussion thread, and zero third-party benchmarks**; the evidence that it is "really being used" is not benchmarks, but the complete static + i1 quantization matrix that mradermacher made for it in 2026-08, and the users in the author's discussion section who have been running it long-term in SillyTavern. For adult-oriented fine-tunes this is almost the norm — **the users stay silent, and the author does no marketing.**

---

## 8. Conclusion: Who It's For

**Good for:**

- Anyone who wants a local roleplay model that can **run the full 256K context on 24GB of VRAM**;
- Anyone who needs a model that **doesn't refuse, doesn't break character, and keeps a stable tone**, rather than general Q&A ability;
- Anyone with a mature SillyTavern / llama.cpp / LM Studio workflow who can write system prompts;
- Anyone who accepts 18+ content and a "no safety net" usage environment.

**Not good for:**

- Anyone needing multimodal understanding (it only fine-tuned the text layers);
- Anyone needing general capabilities like tool calling, coding, or long-document analysis (use the base or official instruction version);
- Any commercial use (the license terms have clear conflicts and risks);
- Anyone expecting "the community-recognized best RP model" — the adoption of the same factory's Melody1437 26B-A4B v2.0 is **over 100x** higher; if you just want to try one at random, starting there may be easier.

**If you want to give it a chance**, the most practical path is:

1. Pull `i1-Q4_K_M_hb16.gguf` (16.8 GB, the quality/speed sweet spot);
2. Use the model card's sampling parameters (temp 0.8 / top_p 0.95 / min_p 0.03);
3. Write a system prompt containing character setting + scene + output format constraints;
4. Actions in `*asterisks*`, dialogue in `"quotes"`, and keep the quotes paired;
5. Start from 32K context, confirm generation quality, then gradually increase it.

> **To remember it in one sentence: this is a model that "must be unlocked with roleplay prompts," not an uncensored model that "answers everything."** The author's own words are — no abliteration, just using data to "pry open" the model's resistance. So once you have it, **write a good system prompt and character card first, and only then judge whether it's good or not**.

**If you feel it "got dumber,"** prioritize checking two things (from the Gemma 4 base community's experience[^15][^16]):

1. **Too-aggressive quantization**: low-bit weights (Q3 and below) noticeably hurt 26B-A4B; at least `i1-Q4_K_M` is recommended;
2. **KV cache quantization**: some users report that 26B-A4B's quality drops noticeably under "quantized weights + quantized KV cache"; **BF16 is the most stable**; if you must save VRAM, prefer Q8_0 KV cache over lower.

---

## Sources

[^1]: Google official model card — [google/gemma-4-26B-A4B-it](https://huggingface.co/google/gemma-4-26B-A4B-it), containing the architecture table, benchmark table, capability description, and best practices; technical report arXiv:2607.02770.
[^2]: This model's model card — [ReadyArt/For-Her-Darkside-26B-A4B-v1.4-GGUF](https://huggingface.co/ReadyArt/For-Her-Darkside-26B-A4B-v1.4-GGUF) and the [base fine-tune repository](https://huggingface.co/ReadyArt/For-Her-Darkside-26B-A4B-v1.4) (training method, LoRA rank/epochs, sampling parameters, Credits, license).
[^3]: Hardware Corner — [What Hardware for Gemma 4 26B and 31B LLM Local Use](https://www.hardware-corner.net/hardware-for-gemma-4-llm/) (Q4 VRAM table and measured RTX 3090/5090/PRO 6000 throughput, updated 2026-08-08).
[^4]: [merge_scale_info.txt](https://huggingface.co/ReadyArt/For-Her-Darkside-26B-A4B-v1.4/raw/main/merge_scale_info.txt) and [config.json](https://huggingface.co/ReadyArt/For-Her-Darkside-26B-A4B-v1.4/raw/main/config.json).
[^5]: File list and download counts from the Hugging Face API (`/api/models/...`, `/api/models?search=For-Her-Darkside`); community quantizations at [mradermacher static version](https://huggingface.co/mradermacher/For-Her-Darkside-26B-A4B-v1.4-GGUF), [mradermacher i1 version](https://huggingface.co/mradermacher/For-Her-Darkside-26B-A4B-v1.4-i1-GGUF), [Wwayu MLX 6-bit](https://huggingface.co/Wwayu/For-Her-Darkside-26B-A4B-v1.4-mlx-6Bit).
[^6]: ReadyArt's author profile model list and download statistics (370 repositories, data as of 2026-09-18).
[^7]: [LICENSE.txt](https://huggingface.co/ReadyArt/For-Her-Darkside-26B-A4B-v1.4-GGUF/raw/main/LICENSE.txt).
[^8]: Hugging Face Discussions API search results (1 thread for the GGUF repository, 0 each for 12B v1.4 and 31B v1.3).
[^9]: The Agent Times — [Gemma 4 Jailbreak Prompt Gains Traction as Local AI Community Tests Guardrail Limits](https://theagenttimes.com/articles/gemma-4-jailbreak-prompt-gains-traction-as-local-ai-communit-6df2f84c) (2026-04-16; citing an r/LocalLLaMA post with 673 upvotes / 153 comments).
[^10]: Korean-community compilation of Gemma 4 benchmarks and local deployment — [JAICHANGPARK/2026-bwai-seoul](https://github.com/JAICHANGPARK/2026-bwai-seoul/blob/main/docs/09-gemma4-benchmarks-and-agent-expectations.md) (a secondary compilation of the official model card benchmarks, including the note that 26B A4B has 25.2B total / 3.8B active parameters).
[^11]: GECFDO's Gemma 4 HB16 quantization repository — [gecfdo/gemma-4-31B-it-GGUF_HB16](https://huggingface.co/gecfdo/gemma-4-31B-it-GGUF_HB16) (one source of the `_hb16` suffix; the repository itself does not explain the meaning of the suffix).
[^12]: Gemma 4 release date — [gihyo.jp report](https://gihyo.jp/article/2026/04/gemma-4) (2026-04-03, explicitly stating "Google released Gemma 4 on April 2, 2026," Apache 2.0, four tiers E2B / E4B / 26B MoE / 31B Dense).
[^13]: HF discussion thread — [For-Her-Darkside-26B-A4B-v1.4-GGUF discussions #1 "TableEdit"](https://huggingface.co/ReadyArt/For-Her-Darkside-26B-A4B-v1.4-GGUF/discussions/1) (`yano2mch`, 2026-06-11, 4 replies, closed; `FrenzyBiscuit` replied).
[^14]: HF discussion section — [Dark-Scarlett-v1.0-35B-A3B-GGUF discussions](https://huggingface.co/ReadyArt/Dark-Scarlett-v1.0-35B-A3B-GGUF/discussions): #2 "Censorship in the model" (`K150000`, 2026-07-16, 17 replies), #3 "Hermes Agent" (`terra-firma`, 2026-07-19, 9 replies).
[^15]: Google official model card discussion section — [google/gemma-4-26B-A4B-it discussions](https://huggingface.co/google/gemma-4-26B-A4B-it/discussions) (64 total; #15, #25, #34, etc.).
[^16]: Third-party Gemma 4 RP model discussion sections — [Vortex5/Chimera-X-26B-A4B discussions #6](https://huggingface.co/Vortex5/Chimera-X-26B-A4B/discussions/6) (`unknown2304`, 2026-08-10, 19 replies) and related `BeaverAI/Artemis-31B` discussions (regarding "not X but Y" sentence repetition).
[^17]: Chinese-community discussions — V2EX [t/1203630](https://www.v2ex.com/t/1203630) (2026-04-05, 4,014 views / 19 replies) and [t/1203234](https://www.v2ex.com/t/1203234) (2026-04-03, 12,596 views / 65 replies).
