'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Minimize2, MessageCircle, Maximize2, Trash2 } from 'lucide-react';

const MoveiBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Halo! Saya MoveiBot, asisten AI MoveiHub. Saya bisa membantu Anda menemukan film dan serial TV favorit, memberikan rekomendasi, atau menjawab pertanyaan seputar dunia hiburan. Apa yang bisa saya bantu?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatWindowRef = useRef(null);

  // Pre-programmed responses for fallback mode
  const fallbackResponses = {
    'rekomendasi': [
      'Berdasarkan preferensi Anda, saya merekomendasikan:\n\n1. **Inception** (2010) - Sci-fi thriller yang mind-bending\n2. **The Dark Knight** (2008) - Superhero film terbaik sepanjang masa\n3. **Interstellar** (2014) - Petualangan luar angkasa yang epik\n4. **Parasite** (2019) - Thriller sosial yang memenangkan Oscar\n5. **Mad Max: Fury Road** (2015) - Action film yang spektakuler\n\nSemua film ini memiliki rating tinggi dan ulasan yang sangat positif!',
      'Berikut rekomendasi film terbaik untuk Anda:\n\n1. **La La Land** (2016) - Musical romantis yang indah\n2. **Get Out** (2017) - Horror-thriller yang cerdas\n3. **Spider-Man: Into the Spider-Verse** (2018) - Animasi superhero terbaik\n4. **The Grand Budapest Hotel** (2014) - Komedi yang unik dan menghibur\n5. **Whiplash** (2014) - Drama musik yang intens\n\nFilm-film ini sangat direkomendasikan oleh kritikus dan penonton!'
    ],
    'action': [
      'Film action terbaik yang saya rekomendasikan:\n\n1. **John Wick** (2014) - Action choreography terbaik\n2. **Mad Max: Fury Road** (2015) - Spektakuler dan intens\n3. **The Raid** (2011) - Martial arts action yang brutal\n4. **Mission: Impossible - Fallout** (2018) - Stunt yang menakjubkan\n5. **Die Hard** (1988) - Classic action yang tak terlupakan\n\nSemua film ini memiliki action sequence yang luar biasa!',
      'Film action terbaru yang patut ditonton:\n\n1. **Top Gun: Maverick** (2022) - Sequel yang lebih baik dari original\n2. **The Batman** (2022) - Dark dan atmospheric\n3. **Bullet Train** (2022) - Action comedy yang seru\n4. **Everything Everywhere All at Once** (2022) - Multiverse action\n5. **RRR** (2022) - Epic action dari India\n\nFilm-film ini membawa genre action ke level baru!'
    ],
    'drama': [
      'Film drama terbaik sepanjang masa:\n\n1. **The Shawshank Redemption** (1994) - Kisah persahabatan dan harapan\n2. **Forrest Gump** (1994) - Drama kehidupan yang menyentuh\n3. **The Green Mile** (1999) - Drama supernatural yang emosional\n4. **Schindler\'s List** (1993) - Drama sejarah yang powerful\n5. **Goodfellas** (1990) - Crime drama yang realistis\n\nFilm-film ini akan membuat Anda terharu dan terinspirasi!',
      'Drama kontemporer yang wajib ditonton:\n\n1. **Parasite** (2019) - Satire sosial yang cerdas\n2. **Joker** (2019) - Character study yang gelap\n3. **Marriage Story** (2019) - Drama pernikahan yang realistis\n4. **The Irishman** (2019) - Crime drama yang epik\n5. **Little Women** (2019) - Period drama yang indah\n\nDrama-drama ini menampilkan storytelling yang luar biasa!'
    ],
    'komedi': [
      'Film komedi terbaik untuk menghibur Anda:\n\n1. **The Grand Budapest Hotel** (2014) - Komedi yang unik dan cerdas\n2. **Superbad** (2007) - Coming-of-age comedy yang lucu\n3. **Bridesmaids** (2011) - Komedi wanita yang jenaka\n4. **Shaun of the Dead** (2004) - Zombie comedy yang brilliant\n5. **The Big Lebowski** (1998) - Cult comedy yang timeless\n\nFilm-film ini akan membuat Anda tertawa terbahak-bahak!',
      'Komedi romantis yang menghibur:\n\n1. **La La Land** (2016) - Musical romantis yang indah\n2. **Crazy Rich Asians** (2018) - Rom-com yang fresh\n3. **The Proposal** (2009) - Rom-com klasik yang lucu\n4. **500 Days of Summer** (2009) - Rom-com yang realistis\n5. **About Time** (2013) - Rom-com dengan twist time travel\n\nKomedi-komedi ini sempurna untuk date night!'
    ],
    'horror': [
      'Film horror terbaik yang akan membuat Anda ketakutan:\n\n1. **The Shining** (1980) - Psychological horror masterpiece\n2. **Hereditary** (2018) - Horror keluarga yang disturbing\n3. **Get Out** (2017) - Social horror yang cerdas\n4. **A Quiet Place** (2018) - Horror yang unik dan menegangkan\n5. **The Conjuring** (2013) - Supernatural horror yang efektif\n\nFilm-film ini akan membuat Anda tidak bisa tidur!',
      'Horror modern yang patut ditonton:\n\n1. **Midsommar** (2019) - Folk horror yang disturbing\n2. **Us** (2019) - Psychological horror yang cerdas\n3. **The Babadook** (2014) - Metaphorical horror yang dalam\n4. **It Follows** (2014) - Horror konseptual yang unik\n5. **The Witch** (2015) - Period horror yang atmospheric\n\nHorror-horor ini membawa genre ke level baru!'
    ],
    'sci-fi': [
      'Film sci-fi terbaik yang akan membawa Anda ke masa depan:\n\n1. **Blade Runner 2049** (2017) - Sci-fi noir yang visually stunning\n2. **Arrival** (2016) - Sci-fi yang fokus pada komunikasi\n3. **Ex Machina** (2014) - AI sci-fi yang thought-provoking\n4. **Her** (2013) - Romantic sci-fi yang unik\n5. **Edge of Tomorrow** (2014) - Action sci-fi yang seru\n\nFilm-film ini mengeksplorasi masa depan dengan cara yang unik!',
      'Sci-fi klasik yang wajib ditonton:\n\n1. **2001: A Space Odyssey** (1968) - Masterpiece sci-fi\n2. **Alien** (1979) - Horror sci-fi yang perfect\n3. **The Matrix** (1999) - Revolutionary sci-fi action\n4. **Back to the Future** (1985) - Time travel yang fun\n5. **E.T. the Extra-Terrestrial** (1982) - Family sci-fi yang menyentuh\n\nFilm-film ini adalah fondasi genre sci-fi!'
    ]
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle fullscreen on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to get fallback response
  const getFallbackResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Check for specific keywords with better pattern matching
    if (message.includes('rekomendasi') || message.includes('saran') || message.includes('recommend') || message.includes('apa yang bagus')) {
      const responses = fallbackResponses.rekomendasi;
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (message.includes('action') || message.includes('petualangan') || message.includes('laga') || message.includes('fight') || message.includes('perang')) {
      const responses = fallbackResponses.action;
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (message.includes('drama') || message.includes('serius') || message.includes('emosional') || message.includes('sedih') || message.includes('touching')) {
      const responses = fallbackResponses.drama;
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (message.includes('komedi') || message.includes('lucu') || message.includes('humor') || message.includes('comedy') || message.includes('funny') || message.includes('tawa')) {
      const responses = fallbackResponses.komedi;
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (message.includes('horror') || message.includes('seram') || message.includes('menakutkan') || message.includes('scary') || message.includes('hantu')) {
      const responses = fallbackResponses.horror;
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (message.includes('sci-fi') || message.includes('fiksi ilmiah') || message.includes('futuristik') || message.includes('space') || message.includes('robot') || message.includes('alien')) {
      const responses = fallbackResponses['sci-fi'];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Check for specific movie requests
    if (message.includes('inception') || message.includes('nolan')) {
      return '**Inception** (2010) adalah masterpiece dari Christopher Nolan. Film ini menggabungkan sci-fi dengan thriller psikologis yang kompleks. Plot tentang mimpi dalam mimpi akan membuat Anda berpikir keras. Rating IMDb: 8.8/10. Sangat direkomendasikan untuk pecinta film yang menantang!';
    }
    
    if (message.includes('dark knight') || message.includes('batman')) {
      return '**The Dark Knight** (2008) dianggap sebagai film superhero terbaik sepanjang masa. Performa Heath Ledger sebagai Joker sangat legendaris dan memenangkan Oscar. Film ini mengangkat tema moralitas yang dalam. Rating IMDb: 9.0/10. Wajib ditonton!';
    }
    
    if (message.includes('parasite') || message.includes('bong joon-ho')) {
      return '**Parasite** (2019) adalah film Korea Selatan yang memenangkan Oscar Best Picture. Film ini adalah satire sosial yang cerdas tentang kesenjangan ekonomi. Plot twist yang mengejutkan dan simbolisme yang dalam. Rating IMDb: 8.6/10. Film yang mengubah perspektif!';
    }
    
    if (message.includes('interstellar') || message.includes('space')) {
      return '**Interstellar** (2014) adalah epic sci-fi tentang perjalanan luar angkasa untuk menyelamatkan umat manusia. Visual effects yang menakjubkan dan skor musik Hans Zimmer yang epik. Film ini mengeksplorasi cinta, waktu, dan survival. Rating IMDb: 8.7/10. Pengalaman menonton yang luar biasa!';
    }
    
    // Check for rating questions
    if (message.includes('rating') || message.includes('score') || message.includes('imdb')) {
      return 'Film dengan rating tertinggi di IMDb:\n\n1. **The Shawshank Redemption** (1994) - 9.3/10\n2. **The Godfather** (1972) - 9.2/10\n3. **The Dark Knight** (2008) - 9.0/10\n4. **The Godfather Part II** (1974) - 9.0/10\n5. **12 Angry Men** (1957) - 9.0/10\n\nFilm-film ini dianggap sebagai masterpiece sepanjang masa!';
    }
    
    // Check for new movies
    if (message.includes('terbaru') || message.includes('baru') || message.includes('2024') || message.includes('2023')) {
      return 'Film terbaru yang patut ditonton:\n\n1. **Dune: Part Two** (2024) - Epic sci-fi yang spektakuler\n2. **Poor Things** (2023) - Dark comedy yang unik\n3. **Oppenheimer** (2023) - Biopic yang powerful\n4. **Barbie** (2023) - Satire yang menghibur\n5. **Killers of the Flower Moon** (2023) - Drama sejarah yang mendalam\n\nFilm-film ini mendapat ulasan sangat positif!';
    }
    
    // Check for series/TV shows
    if (message.includes('serial') || message.includes('tv') || message.includes('series') || message.includes('show')) {
      return 'Serial TV terbaik yang wajib ditonton:\n\n1. **Breaking Bad** (2008-2013) - Drama kriminal masterpiece\n2. **Game of Thrones** (2011-2019) - Fantasy epic yang epik\n3. **Stranger Things** (2016-sekarang) - Sci-fi horror yang nostalgic\n4. **The Crown** (2016-2023) - Drama sejarah yang elegan\n5. **Wednesday** (2022-sekarang) - Dark comedy yang fresh\n\nSerial-serial ini memiliki storytelling yang luar biasa!';
    }
    
    // Check for actor questions
    if (message.includes('aktor') || message.includes('actor') || message.includes('pemeran') || message.includes('leonardo') || message.includes('tom hanks')) {
      return 'Aktor terbaik Hollywood:\n\n1. **Leonardo DiCaprio** - Film terbaik: Inception, The Revenant, The Wolf of Wall Street\n2. **Tom Hanks** - Film terbaik: Forrest Gump, Cast Away, Saving Private Ryan\n3. **Robert De Niro** - Film terbaik: Taxi Driver, Goodfellas, The Godfather Part II\n4. **Al Pacino** - Film terbaik: The Godfather, Scarface, Heat\n5. **Morgan Freeman** - Film terbaik: The Shawshank Redemption, Se7en, Million Dollar Baby\n\nAktor-aktor ini memiliki filmografi yang mengesankan!';
    }
    
    // Check for director questions
    if (message.includes('sutradara') || message.includes('director') || message.includes('nolan') || message.includes('spielberg')) {
      return 'Sutradara terbaik Hollywood:\n\n1. **Christopher Nolan** - Inception, The Dark Knight, Interstellar\n2. **Steven Spielberg** - Jurassic Park, Schindler\'s List, Saving Private Ryan\n3. **Martin Scorsese** - Goodfellas, Taxi Driver, The Departed\n4. **Quentin Tarantino** - Pulp Fiction, Kill Bill, Django Unchained\n5. **James Cameron** - Titanic, Avatar, Terminator 2\n\nSutradara-sutradara ini menciptakan film-film legendaris!';
    }
    
    // Default responses for general questions
    const defaultResponses = [
      'Saya bisa membantu Anda menemukan film dan serial TV yang sesuai dengan selera Anda. Coba tanyakan tentang genre favorit Anda atau film yang sedang populer!',
      'Untuk rekomendasi yang lebih spesifik, coba tanyakan tentang genre tertentu seperti action, drama, komedi, horror, atau sci-fi. Saya akan memberikan saran yang tepat!',
      'Saya memiliki database film dan serial TV yang luas. Tanyakan tentang film terbaru, rating tertinggi, atau genre tertentu yang Anda sukai!',
      'Ingin tahu film terbaik? Saya bisa merekomendasikan berdasarkan genre, tahun, atau rating. Apa yang sedang Anda cari?',
      'Saya siap membantu Anda menemukan hiburan terbaik! Coba tanyakan tentang film action terbaru, drama yang menyentuh, atau komedi yang lucu.',
      'Tidak yakin film apa yang ingin ditonton? Coba tanyakan tentang film dengan rating tertinggi, film terbaru, atau genre tertentu. Saya akan membantu!',
      'Saya bisa memberikan rekomendasi film berdasarkan preferensi Anda. Tanyakan tentang film action, drama, komedi, horror, atau sci-fi!',
      'Ingin tahu film yang sedang trending? Atau mungkin film klasik yang wajib ditonton? Saya siap membantu Anda menemukan film yang tepat!'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Try OpenAI API first
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: messages.slice(-10)
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        // Fallback to pre-programmed responses
        const fallbackResponse = getFallbackResponse(userMessage.content);
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: fallbackResponse,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      // Fallback to pre-programmed responses
      const fallbackResponse = getFallbackResponse(userMessage.content);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: fallbackResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Optimized function to clear chat history
  const clearChat = () => {
    if (isClearing) return;
    
    setIsClearing(true);
    
    // Simple fade out effect for the entire messages container
    const messagesContainer = document.querySelector('.messages-container');
    if (messagesContainer) {
      messagesContainer.style.transition = 'opacity 0.3s ease-out';
      messagesContainer.style.opacity = '0';
    }

    // Clear messages after fade out
    setTimeout(() => {
      setMessages([
        {
          id: Date.now(),
          type: 'bot',
          content: 'Halo! Saya MoveiBot, asisten AI MoveiHub. Saya bisa membantu Anda menemukan film dan serial TV favorit, memberikan rekomendasi, atau menjawab pertanyaan seputar dunia hiburan. Apa yang bisa saya bantu?',
          timestamp: new Date()
        }
      ]);
      setInputValue('');
      setIsClearing(false);
      
      // Reset opacity
      if (messagesContainer) {
        messagesContainer.style.opacity = '1';
      }
    }, 300);
  };

  // Improved function to handle close with smooth animation
  const handleClose = () => {
    if (isClosing) return;
    
    setIsClosing(true);
    
    // Add exit animation to chat window
    if (chatWindowRef.current) {
      chatWindowRef.current.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      chatWindowRef.current.style.transform = 'translateX(100%) scale(0.95)';
      chatWindowRef.current.style.opacity = '0';
    }

    // Close after animation completes
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      
      // Reset transform for next open
      if (chatWindowRef.current) {
        chatWindowRef.current.style.transform = '';
        chatWindowRef.current.style.opacity = '';
        chatWindowRef.current.style.transition = '';
      }
    }, 300);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group animate-slide-in-up chat-button-hover"
          aria-label="Open MoveiBot"
        >
          <div className="relative">
            <MessageCircle className="h-6 w-6" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse online-indicator"></div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          ref={chatWindowRef}
          className={`fixed z-50 bg-gray-900 border border-purple-500/30 rounded-2xl shadow-2xl backdrop-blur-sm animate-slide-in-right ${
            isFullscreen 
              ? 'inset-4 md:inset-6' 
              : 'bottom-6 right-6 w-80 h-96 md:w-96 md:h-[500px]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full animate-pulse">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">MoveiBot</h3>
                <p className="text-purple-200 text-xs">AI Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Clear chat button */}
              <button
                onClick={clearChat}
                disabled={isClearing}
                className={`text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded ${isClearing ? 'clear-button-pulse' : ''}`}
                aria-label="Clear chat"
                title="Clear chat"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              {/* Fullscreen toggle for mobile */}
              <button
                onClick={toggleFullscreen}
                className="text-white/80 hover:text-white transition-colors md:hidden"
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={handleClose}
                disabled={isClosing}
                className="text-white/80 hover:text-white transition-colors hover:bg-white/10 rounded p-1"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-4 messages-container ${
            isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-64 md:h-80'
          }`}>
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} message-container ${
                  message.type === 'user' ? 'user-message-slide-in' : 'message-slide-in'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-100 border border-gray-700'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'bot' && (
                      <Bot className="h-4 w-4 text-purple-400 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-purple-200' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                    {message.type === 'user' && (
                      <User className="h-4 w-4 text-purple-200 mt-1 flex-shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-gray-800 text-gray-100 border border-gray-700 rounded-2xl px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-purple-400" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full typing-dot"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full typing-dot"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full typing-dot"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-end space-x-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ketik pesan Anda..."
                  className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-purple-500 transition-colors"
                  rows="1"
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors hover:scale-105 active:scale-95"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MoveiBot; 