#!/bin/bash

# Update all the packages
sudo apt update && sudo apt upgrade -y

# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Start Ollama service
ollama serve 

# Pull and run Llama2 model in the background
ollama pull llama3.1

# Pull and run LLaVA model in the background
ollama pull llava