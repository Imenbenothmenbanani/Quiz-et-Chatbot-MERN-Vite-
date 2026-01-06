import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IoSend, IoClose, IoRefresh } from 'react-icons/io5';
import { FaRobot } from 'react-icons/fa';
import Button from './Button';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Bonjour ! Je suis votre assistant juridique. Posez-moi des questions sur les infractions et le droit tunisien.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sources, setSources] = useState([]);
  const messagesEndRef = useRef(null);
  const { token } = useSelector(state => state.auth);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Ajouter le message utilisateur
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    setSources([]);

    try {
      const response = await fetch('http://localhost:4000/api/v1/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages.slice(-6) // Garder les 6 derniers messages
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la communication avec le serveur');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      // Ajouter un message assistant vide
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.content) {
                assistantMessage += data.content;
                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = {
                    role: 'assistant',
                    content: assistantMessage
                  };
                  return newMessages;
                });
              }

              if (data.done && data.sources) {
                setSources(data.sources);
              }
            } catch (e) {
              console.error('Erreur parsing JSON:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: '❌ Désolé, une erreur est survenue. Veuillez réessayer.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Conversation effacée. Comment puis-je vous aider ?'
      }
    ]);
    setSources([]);
  };

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50"
      >
        {isOpen ? <IoClose size={24} /> : <FaRobot size={24} />}
      </button>

      {/* Fenêtre du chatbot */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-slate-900 border border-slate-600 rounded-lg shadow-2xl flex flex-col z-50">
          {/* Header */}
          <div className="bg-green-700 p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FaRobot size={20} />
              <h3 className="font-semibold">Assistant Juridique</h3>
            </div>
            <button
              onClick={handleClear}
              className="hover:bg-green-800 p-2 rounded"
              title="Effacer la conversation"
            >
              <IoRefresh size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-green-700 text-white'
                      : 'bg-slate-800 text-slate-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {/* Sources */}
            {sources.length > 0 && (
              <div className="bg-slate-800 p-3 rounded-lg">
                <p className="text-xs text-slate-400 mb-2">📚 Sources:</p>
                {sources.map((source, idx) => (
                  <div key={idx} className="text-xs text-slate-300 mb-1">
                    • {source.categorie} - {source.infraction} ({source.article})
                  </div>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-600">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Posez votre question..."
                className="flex-1 bg-slate-800 text-white px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-600"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:bg-slate-700 text-white p-2 rounded-lg transition-colors"
              >
                <IoSend size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;