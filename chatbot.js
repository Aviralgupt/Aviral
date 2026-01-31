// Chatbot functionality with Voice-to-Voice (STT + TTS)
class Chatbot {
    constructor() {
        this.isOpen = false;
        this.conversationHistory = [];
        this.isTyping = false;
        this.voiceMode = false;
        this.isListening = false;
        this.speechRecognition = null;
        this.speakResponses = true;
        this.lastMessageWasVoice = false; // Only speak reply when user used mic
        
        this.initializeElements();
        this.attachEventListeners();
        this.initSpeech();
    }

    initializeElements() {
        this.chatToggle = document.getElementById('chat-toggle');
        this.chatWindow = document.getElementById('chat-window');
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.sendButton = document.getElementById('send-button');
        this.chatIcon = document.getElementById('chat-icon');
        this.closeIcon = document.getElementById('close-icon');
        this.voiceToggle = document.getElementById('voice-toggle');
        this.voiceStatus = document.getElementById('voice-status');
    }

    initSpeech() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.speechRecognition = new SpeechRecognition();
            this.speechRecognition.continuous = false;
            this.speechRecognition.interimResults = false;
            this.speechRecognition.lang = 'en-US';
            this.speechRecognition.onresult = (e) => {
                const transcript = e.results[0][0].transcript;
                this.chatInput.value = transcript;
                this.sendButton.disabled = false;
                this.setVoiceStatus('');
                this.isListening = false;
                this.lastMessageWasVoice = true;
                this.sendMessage();
            };
            this.speechRecognition.onerror = (e) => {
                this.setVoiceStatus(e.error === 'no-speech' ? 'No speech heard. Try again.' : 'Voice error. Try again.');
                this.isListening = false;
            };
            this.speechRecognition.onend = () => {
                if (this.isListening) this.isListening = false;
            };
        } else {
            if (this.voiceStatus) this.voiceStatus.textContent = 'Voice not supported in this browser';
        }
    }

    setVoiceStatus(text) {
        if (this.voiceStatus) this.voiceStatus.textContent = text;
    }

    startListening() {
        if (!this.speechRecognition) {
            this.setVoiceStatus('Voice input not supported. Use Chrome or Edge.');
            return;
        }
        if (this.isListening) return;
        this.isListening = true;
        this.setVoiceStatus('Listening...');
        try {
            this.speechRecognition.start();
        } catch (e) {
            this.setVoiceStatus('Could not start mic.');
            this.isListening = false;
        }
    }

    speakText(text) {
        if (!window.speechSynthesis || !text) return;
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text.substring(0, 500)); // Limit length for TTS
        u.rate = 0.95;
        u.pitch = 1;
        u.volume = 1;
        const voices = window.speechSynthesis.getVoices();
        const en = voices.find(v => v.lang.startsWith('en'));
        if (en) u.voice = en;
        window.speechSynthesis.speak(u);
    }

    attachEventListeners() {
        // Toggle chat window
        this.chatToggle.addEventListener('click', () => this.toggleChat());
        
        // Voice toggle: click to speak (STT then send)
        if (this.voiceToggle) {
            this.voiceToggle.addEventListener('click', () => this.startListening());
        }
        
        // Send message on button click
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Send message on Enter key
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Enable/disable send button based on input
        this.chatInput.addEventListener('input', () => {
            const hasText = this.chatInput.value.trim().length > 0;
            this.sendButton.disabled = !hasText || this.isTyping;
        });

        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            if (!document.getElementById('chatbot-container').contains(e.target) && this.isOpen) {
                this.closeChat();
            }
        });
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.isOpen = true;
        this.chatWindow.classList.remove('hidden');
        this.chatWindow.style.animation = 'slideIn 0.3s ease-out';
        this.chatIcon.classList.add('hidden');
        this.closeIcon.classList.remove('hidden');
        this.chatInput.focus();
    }

    closeChat() {
        this.isOpen = false;
        this.chatWindow.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            this.chatWindow.classList.add('hidden');
        }, 300);
        this.chatIcon.classList.remove('hidden');
        this.closeIcon.classList.add('hidden');
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message || this.isTyping) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        this.chatInput.value = '';
        this.sendButton.disabled = true;

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Send to API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    conversationHistory: this.conversationHistory
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add AI response to chat
            this.addMessage(data.response, 'assistant');
            
            // Voice-to-voice: speak the response only when user asked via mic
            if (this.lastMessageWasVoice && this.speakResponses && data.response) {
                this.speakText(data.response);
            }
            this.lastMessageWasVoice = false;
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.hideTypingIndicator();
            this.addMessage(
                "Sorry, I'm having trouble connecting right now. Please try again later or contact Aviral directly at aviralgupta@usf.edu",
                'assistant',
                true
            );
        }
    }

    addMessage(content, role, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex items-start space-x-3 chat-message';

        if (role === 'user') {
            messageDiv.innerHTML = `
                <div class="flex-1"></div>
                <div class="bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg p-3 text-white text-sm max-w-xs">
                    ${this.escapeHtml(content)}
                </div>
                <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                </div>
            `;
        } else {
            const bgColor = isError ? 'bg-red-600/20 border border-red-500/30' : 'bg-dark-700/50';
            const textColor = isError ? 'text-red-300' : 'text-gray-300';
            
            messageDiv.innerHTML = `
                <div class="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                </div>
                <div class="${bgColor} rounded-lg p-3 ${textColor} text-sm max-w-xs">
                    ${this.formatMessage(content)}
                </div>
            `;
        }

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();

        // Add to conversation history (but not error messages)
        if (!isError) {
            this.conversationHistory.push({
                role: role,
                content: content
            });

            // Keep only last 10 messages to manage token usage
            if (this.conversationHistory.length > 10) {
                this.conversationHistory = this.conversationHistory.slice(-10);
            }
        }
    }

    showTypingIndicator() {
        this.isTyping = true;
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'flex items-start space-x-3 chat-message';
        typingDiv.innerHTML = `
            <div class="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
            </div>
            <div class="bg-dark-700/50 rounded-lg p-3 text-gray-300 text-sm">
                <div class="typing-indicator flex items-center space-x-1">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <span class="ml-2">AI is thinking...</span>
                </div>
            </div>
        `;

        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        this.sendButton.disabled = this.chatInput.value.trim().length === 0;
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatMessage(content) {
        // Convert newlines to HTML breaks
        let formatted = this.escapeHtml(content);
        formatted = formatted.replace(/\n/g, '<br>');
        
        // Make URLs clickable
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        formatted = formatted.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-primary-400 underline hover:text-primary-300">$1</a>');
        
        // Make email addresses clickable
        const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
        formatted = formatted.replace(emailRegex, '<a href="mailto:$1" class="text-primary-400 underline hover:text-primary-300">$1</a>');
        
        return formatted;
    }
}

// Load TTS voices (Chrome needs this before getVoices() returns)
if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add slide animations to head
    if (!document.querySelector('#chatbot-animations')) {
        const style = document.createElement('style');
        style.id = 'chatbot-animations';
        style.textContent = `
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(20px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            @keyframes slideOut {
                from {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                to {
                    opacity: 0;
                    transform: translateY(20px) scale(0.95);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize chatbot
    window.chatbot = new Chatbot();
    
    console.log('🤖 AI Chatbot initialized and ready!');
});
