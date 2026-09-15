---
title: Run your first local model on an ordinary computer
summary: From checking your device and choosing a model to your first chat — no dedicated GPU required.
tags:
  - Beginner
  - Inference engines
difficulty: beginner
readTime: 12
author: Local AI Club
publishedAt: 2026-09-15
updatedAt: 2026-09-15
reproStatus: pending
version: "0.1"
license: CC-BY-4.0
status: published
environment:
  os: macOS / Windows / Linux
  engine: Ollama
  model: 7B-class open model
---

This is Local AI Club's first publishable hands-on guide. It has one goal: run a local chat on your own computer, without needing a dedicated GPU.

The steps use [Ollama](https://ollama.com/) because it is widely available and the commands stay short. The same path works with llama.cpp or LM Studio. Choose a tool based on whether you want a GUI and whether you want to manage model files yourself.

## Check the machine first

Look at three things:

1. **Memory**: 16GB can load a 7B-class quantized model; 32GB is more comfortable.
2. **Disk**: Keep at least 8GB free for the runtime and the model.
3. **Network**: The first model download needs the internet. After that, chat can stay offline.

No discrete GPU is fine. Generation will be slower, but a first conversation is still realistic.

## Install the runtime

Download the installer for your OS from the Ollama site, or follow the official package-manager instructions. Then confirm the command exists:

```bash
ollama --version
```

A version string means the runtime is on your PATH.

## Pull a starter model

A 7B-class open model is a good first try: the file is manageable, and most laptops can load it. Use the current name from Ollama's model library, for example:

```bash
ollama pull qwen2.5:7b
```

Once the download finishes, the weights stay on disk. You can chat later without a network.

## Run the first conversation

```bash
ollama run qwen2.5:7b
```

Ask a short question, such as “Explain local large language models in three sentences.” If tokens start appearing, the inference path works.

Type `/bye` to leave.

## What counts as success

Treat the experiment as complete when all three are true:

- The model loads instead of exiting immediately for lack of memory
- It finishes at least one full reply
- You know where the runtime and model files live on this machine

Slow tokens and a loud fan are not failures. The first run is about completing the loop, not setting a benchmark.

## Common stuck points

- **Not enough memory**: Switch to a smaller quantization, or close the browser and other heavy apps.
- **Command not found**: Open a new terminal, or confirm the installer added `ollama` to PATH.
- **Download interrupted**: Run `pull` again. Clients usually resume.

## Next

After this works, compare Ollama, llama.cpp and LM Studio, or write down memory use and generation speed on this machine. Later Local AI Club guides will organize those notes by device, engine and reproduction status.
