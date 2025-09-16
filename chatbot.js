// Chatbot functionality
class Chatbot {
    constructor() {
        this.isOpen = false;
        this.conversationHistory = [];
        this.isTyping = false;
        
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        this.chatToggle = document.getElementById('chat-toggle');
        this.chatWindow = document.getElementById('chat-window');
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.sendButton = document.getElementById('send-button');
        this.chatIcon = document.getElementById('chat-icon');
        this.closeIcon = document.getElementById('close-icon');
    }

    attachEventListeners() {
        // Toggle chat window
        this.chatToggle.addEventListener('click', () => this.toggleChat());
        
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
