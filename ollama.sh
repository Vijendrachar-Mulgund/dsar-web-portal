#!/bin/bash

# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Start Ollama service
ollama serve 

# Pull and run Llama2 model in the background
ollama pull llama3:8b

# Pull and run LLaVA model in the background
ollama run llava:7b