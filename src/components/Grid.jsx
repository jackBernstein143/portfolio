import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MykuGridItem from './MykuGridItem';

const LofiGame = () => {
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  const gameState = useRef({
    player: {
      y: 0,
      velocity: 0,
      isJumping: false
    },
    obstacles: [],
    animationFrame: null,
    lastTimestamp: 0,
    gameLoop: null
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    const state = gameState.current;
    const GROUND_Y = canvas.height - 40;
    state.player.y = GROUND_Y - 30;

    const resetGame = () => {
      state.player.y = GROUND_Y - 30;
      state.player.velocity = 0;
      state.player.isJumping = false;
      state.obstacles = [];
      setScore(0);
      setGameOver(false);
    };

    const drawEmoji = (emoji, x, y, size = 30) => {
      ctx.font = `${size}px Arial`;
      ctx.textBaseline = 'bottom';
      ctx.textAlign = 'center';
      ctx.fillText(emoji, x, y + size);
    };

    state.gameLoop = (timestamp) => {
      if (!gameStarted) return;
      
      console.log('Game loop running');
      const deltaTime = timestamp - state.lastTimestamp;
      state.lastTimestamp = timestamp;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw ground
      ctx.fillStyle = '#333';
      ctx.fillRect(0, GROUND_Y, canvas.width, 2);

      // Update and draw player
      if (state.player.isJumping) {
        state.player.velocity += 0.8; // gravity
        state.player.y += state.player.velocity;

        if (state.player.y >= GROUND_Y - 30) {
          state.player.y = GROUND_Y - 30;
          state.player.isJumping = false;
          state.player.velocity = 0;
        }
      }

      // Draw player emoji
      drawEmoji('🏃', 50, state.player.y);

      // Generate obstacles
      if (Math.random() < 0.02) {
        state.obstacles.push({
          x: canvas.width,
          width: 30, // emoji width
          height: 30 // emoji height
        });
      }

      // Update and draw obstacles
      state.obstacles = state.obstacles.filter(obstacle => {
        obstacle.x -= 5;
        drawEmoji('🌵', obstacle.x, GROUND_Y - obstacle.height);

        // Collision detection (with smaller hitbox for better gameplay)
        if (
          30 < obstacle.x + obstacle.width - 10 &&
          70 > obstacle.x + 10 &&
          state.player.y + 25 > GROUND_Y - obstacle.height
        ) {
          setGameOver(true);
          setGameStarted(false);
          return false;
        }

        return obstacle.x > -obstacle.width;
      });

      // Update score
      setScore(prev => prev + 1);

      if (!gameOver) {
        state.animationFrame = requestAnimationFrame(state.gameLoop);
      }
    };

    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameOver) {
          resetGame();
          setGameStarted(true);
          state.animationFrame = requestAnimationFrame(state.gameLoop);
        } else if (!state.player.isJumping) {
          state.player.isJumping = true;
          state.player.velocity = -15;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      cancelAnimationFrame(state.animationFrame);
    };
  }, [gameStarted, gameOver]);

  return (
    <div style={{ 
      backgroundColor: '#f5f5f5',
      padding: '20px',
      borderRadius: '12px',
      textAlign: 'center'
    }}>
      <h3 style={{
        fontSize: 'clamp(0.8rem, 5cqi, 1.2rem)',
        marginBottom: '15px'
      }}>
        Take a break and play a game 🎮
      </h3>
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        style={{ 
          backgroundColor: '#fff',
          borderRadius: '8px',
          cursor: 'pointer',
          border: '1px solid black'
        }}
        onClick={() => {
          if (!gameStarted && !gameOver) {
            setGameStarted(true);
            gameState.current.animationFrame = requestAnimationFrame(gameState.current.gameLoop);
          }
        }}
      />
      <div style={{
        marginTop: '10px',
        fontSize: 'clamp(0.5rem, 3.5cqi, 0.8rem)',
        color: '#666'
      }}>
        {!gameStarted && !gameOver && 'Click to start • Space to jump'}
        {gameStarted && `Score: ${score}`}
        {gameOver && `Game Over! Score: ${score} • Space to restart`}
      </div>
    </div>
  );
};

const Grid = () => {
  const [isMykuFlipped, setIsMykuFlipped] = useState(false);
  const [isGifCreatorFlipped, setIsGifCreatorFlipped] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const placeholderGif = "https://firebasestorage.googleapis.com/v0/b/weow-b57fc.firebasestorage.app/o/Randop%2Fquicksnapgiff.gif?alt=media&token=6f586be9-b133-43b2-a1c4-f63def856590";

  const styles = `
    @media (max-width: 800px) {
      .grid-container {
        grid-template-columns: 1fr !important;
      }
      
      .span-2 {
        grid-column: auto !important;
      }

      /* Hide all grid items except 1,2,3,5 */
      .grid-container > *:not(:nth-child(1)):not(:nth-child(2)) {
        display: none !important;
      }

      /* Show the message at the end */
      .grid-container:after {
        content: "open the page on ur desktop cmon 🙄 im worth it!";
        display: block;
        background-color: #f5f5f5;
        padding: 2rem;
        text-align: center;
        font-size: clamp(0.8rem, 5cqi, 1.2rem);
        color: #333;
        margin-top: 1rem;
        border-radius: 12px;
      }
    }
  `;

  // Add this style tag to your document head
  const styleSheet = document.createElement('style');
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);

  return (
    <div className="grid-container" style={{ padding: 'clamp(1rem, 3vw, 2rem)' }}>
      {/* First item - Jack */}
      <motion.div 
        className="grid-item"
        style={{ 
          backgroundColor: '#FF6B4A',
          containerType: 'inline-size',
          padding: 'clamp(1rem, 3vw, 2rem)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        <span style={{ 
          color: '#FFFFFF',
          position: 'absolute',
          top: 'clamp(0.6rem, 8cqi, 2rem)',
          left: 'clamp(0.6rem, 8cqi, 2rem)',
          fontSize: 'clamp(0.6rem, 8cqi, 2rem)',
          whiteSpace: 'nowrap'
        }}>
          Hi! I'm JJJJack.
        </span>
        <div style={{ position: 'relative' }}>
          <img 
            src="https://firebasestorage.googleapis.com/v0/b/weow-b57fc.firebasestorage.app/o/Randop%2FJackfacegif.gif?alt=media&token=92d752d8-34b4-487e-bf36-75d98ec1591a"
            alt="Jack face animation"
            style={{
              width: '50%',
              height: 'auto',
              borderRadius: '24px',
              maxWidth: '100%',
              display: 'block',
              margin: '3rem auto 2rem',
              cursor: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none'
            }}
            onMouseEnter={(e) => {
              const tooltip = e.currentTarget.nextElementSibling;
              if (tooltip) tooltip.style.display = 'block';
            }}
            onMouseLeave={(e) => {
              const tooltip = e.currentTarget.nextElementSibling;
              if (tooltip) tooltip.style.display = 'none';
            }}
            onMouseMove={(e) => {
              const tooltip = e.currentTarget.nextElementSibling;
              if (tooltip) {
                tooltip.style.left = `${e.clientX + 10}px`;
                tooltip.style.top = `${e.clientY + 10}px`;
              }
            }}
          />
          <div
            style={{
              position: 'fixed',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: '#fff',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: 'clamp(0.5rem, 3.5cqi, 0.8rem)',
              pointerEvents: 'none',
              zIndex: 1000,
              display: 'none',
              maxWidth: '200px',
              width: '200px',
              whiteSpace: 'normal',
              lineHeight: '1.2',
              wordWrap: 'break-word'
            }}
          >
            Made this with an app I built in Swift using Apple's segmentation tools 👀
          </div>
        </div>
      </motion.div>

      {/* Second item - Menu */}
      <motion.div 
        className="grid-item"
        style={{ 
          backgroundColor: '#3843D0', 
          padding: '36px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          containerType: 'inline-size'
        }}
      >
        {/* Pills Container */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '36px'
        }}>
          <a 
            href="https://firebasestorage.googleapis.com/v0/b/weow-b57fc.firebasestorage.app/o/Randop%2FJack%20PD%20Resume%20_%202024%20(3).pdf?alt=media&token=8a80495d-60a0-441f-abf8-90e997554e37" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '8px 16px',
              borderRadius: '20px',
              color: '#FFFFFF',
              textDecoration: 'none',
              fontSize: 'clamp(0.5rem, 3.5cqi, 0.8rem)',
              transition: 'background-color 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          >
            Resume
          </a>
          <a 
            href="https://www.linkedin.com/in/jack-bernstein-909578104/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '8px 16px',
              borderRadius: '20px',
              color: '#FFFFFF',
              textDecoration: 'none',
              fontSize: 'clamp(0.5rem, 3.5cqi, 0.8rem)',
              transition: 'background-color 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          >
            LinkedIn
          </a>
          <button
            onClick={() => {
              navigator.clipboard.writeText('jackwolfebernstein@gmail.com');
              const button = document.getElementById('email-button');
              const icon = document.getElementById('email-icon');
              if (button) button.textContent = 'Copied!';
              if (icon) icon.textContent = '📋';
              setTimeout(() => {
                if (button) button.textContent = 'Email';
                if (icon) icon.textContent = '📋';
              }, 2000);
            }}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '8px 16px',
              borderRadius: '20px',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: 'clamp(0.5rem, 3.5cqi, 0.8rem)',
              transition: 'background-color 0.2s ease',
              fontWeight: 'normal',
              userSelect: 'none'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          >
            <span id="email-button" style={{ fontWeight: 'normal' }}>Email</span>
            <span id="email-icon" style={{ fontSize: '0.9em' }}>📋</span>
          </button>
        </div>

        <p style={{
          color: '#FFFFFF',
          fontSize: 'clamp(0.5rem, 4cqi, 0.9rem)',
          width: '100%',
          textAlign: 'left',
          lineHeight: '1.5',
          margin: 0
        }}>
          I build social apps that make people smile.  In the past, I've worked for companies like{' '}
          <a href="#snapchat" style={{color: '#FFFFFF', textDecoration: 'underline'}}>Snapchat</a>{' '}
          <iframe 
            src="https://giphy.com/embed/hQjUn3eHihczu" 
            width="20" 
            height="20" 
            frameBorder="0" 
            className="giphy-embed" 
            allowFullScreenx
            style={{
              verticalAlign: 'middle',
              marginLeft: '2px',
              marginRight: '2px',
              borderRadius: '4px'
            }}
          />{'. '}
          Currently I'm leading product at{' '}
          <a href="#favs" style={{color: '#FFFFFF', textDecoration: 'underline'}}>Favs</a>.<br /><br />On the side, I made{' '}
          <a 
            href="#myku" 
            style={{color: '#FFFFFF', textDecoration: 'underline'}}
            onClick={(e) => {
              e.preventDefault();
              setIsMykuFlipped(prev => !prev);
            }}
          >Myku</a>, a web app that got 2K users in its first week. 
          I also built an{' '}
          <a href="#imessage" style={{color: '#FFFFFF', textDecoration: 'underline'}}>iMessage extension</a> for making gifs that thousands of people use :)
        </p>
      </motion.div>

      {/* Third item - Intro with links (Snap section) */}
      <motion.div 
        id="snap-section"
        className="grid-item"
        style={{ 
          backgroundColor: '#FFFFFF',
          padding: '2rem',
          containerType: 'inline-size',
          position: 'relative',
          zIndex: 1,
          transition: 'z-index 0s'
        }}
      >
        <div className="feature-content">
          <h2 style={{
            fontSize: 'clamp(1rem, 6cqi, 1.5rem)',
            marginBottom: 'clamp(0.5rem, 3cqi, 1rem)'
          }}>My time at Snap ��</h2>
          <p 
            onMouseEnter={() => {
              const gif = document.getElementById('hover-gif');
              const overlay = document.getElementById('dim-overlay');
              const gridItem = document.getElementById('snap-section');
              if (gif) gif.style.opacity = '1';
              if (overlay) overlay.style.opacity = '1';
              if (gridItem) gridItem.style.zIndex = '1000';
            }}
            onMouseLeave={() => {
              const gif = document.getElementById('hover-gif');
              const overlay = document.getElementById('dim-overlay');
              const gridItem = document.getElementById('snap-section');
              if (gif) gif.style.opacity = '0';
              if (overlay) overlay.style.opacity = '0';
              if (gridItem) gridItem.style.zIndex = '1';
            }}
            style={{
              fontSize: 'clamp(0.5rem, 4cqi, 0.9rem)',
              lineHeight: '1.5',
              color: '#333',
              cursor: 'default'
            }}
          >
            I was part of the core product team, dreaming up new ways to make the camera more fun! My job was to prototype ideas and pitch them directly to Evan (the CEO). 
            <br/><br/>
            Out of the 12 projects that got the green light, we pushed 3 into internal testing. Think fun camera tricks and tools that make sharing moments more magical 
            <iframe 
              src="https://giphy.com/embed/3o7ZeQBhbVGnELP4bK" 
              width="20" 
              height="20" 
              frameBorder="0" 
              className="giphy-embed" 
              allowFullScreen
              style={{
                verticalAlign: 'middle',
                marginLeft: '4px',
                borderRadius: '4px'
              }}
            />
          </p>
          
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            whiteSpace: 'nowrap'
          }}>
            <p style={{
              fontSize: 'clamp(0.2rem, 4cqi, 0.9rem)',
              color: '#333',
              marginBottom: '0.8rem',
              fontWeight: 'bold'
            }}>
              Tap 👆 the slides to see my work
            </p>
            <motion.div
              animate={{
                y: [0, -10, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span style={{
                fontSize: '24px'
              }}>↓</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <img 
        id="hover-gif"
        src="https://firebasestorage.googleapis.com/v0/b/weow-b57fc.firebasestorage.app/o/Randop%2Fquicksnapgiff.gif?alt=media&token=6f586be9-b133-43b2-a1c4-f63def856590"
        alt="Snapchat demo"
        style={{
          position: 'fixed',
          width: '250px',
          height: 'auto',
          top: '60%',
          right: 'calc(35% - 100px)',
          transform: 'translateY(-50%)',
          zIndex: 1000,
          opacity: 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          borderRadius: '40px'
        }}
      />

      {/* Fourth item - Myku */}
      <MykuGridItem 
        isFlipped={isMykuFlipped} 
        onFlip={setIsMykuFlipped}
      />

      {/* Fifth item - Snapchat Presentation (spans 2 columns) */}
      <motion.div 
        className="grid-item span-2"
        style={{ 
          backgroundColor: '#f4b02a',
          width: '100%',
          height: 'auto',
          aspectRatio: '16/9',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '24px',
        }}
      >
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}>
          <iframe 
            src="https://docs.google.com/presentation/d/e/2PACX-1vSxF5O5fgzxa8DhK5f_NC4nb2Hr1-gEaNdCHYkFtzu4Y4dO56YeNQf40GipOCeH2SyIUWudP1-pKJHQ/embed?start=false&loop=false&delayms=60000&rm=minimal"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '102.5%',
              height: '102.5%',
              transform: 'translate(-50%, -50%)',
              border: 'none',
            }}
            allowFullScreen
            mozallowfullscreen="true"
            webkitallowfullscreen="true"
          />
        </div>
      </motion.div>

      {/* Sixth item - Favs (spans 2 columns) */}
      <motion.div 
        className="grid-item span-2"
        style={{ 
          backgroundColor: '#FFD1DC',
          padding: '2rem',
          containerType: 'inline-size',
          position: 'relative'
        }}
      >
        <h2 style={{
          fontSize: 'clamp(1rem, 6cqi, 1.5rem)',
          marginBottom: 'clamp(0.5rem, 3cqi, 1rem)',
          color: '#333'
        }}>
          Building Favs 💫
        </h2>
        <p style={{
          fontSize: 'clamp(0.5rem, 4cqi, 0.9rem)',
          lineHeight: '1.5',
          color: '#333',
          marginBottom: '2rem'
        }}>
          As founding designer and head of product, I reimagined and launched the new Favs vision in just two months. 
          We're trying to create a close friends experience so great that people will actually pay for it (TBD if that's possible 😅).
        </p>

        {/* Features showcase container */}
        <div style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'flex-start'
        }}>
          {/* Pills container */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            flex: '1',
            maxWidth: '300px'
          }}>
            <h3 style={{
              fontSize: 'clamp(0.7rem, 5cqi, 1.2rem)',
              color: '#333',
              marginBottom: '0.5rem'
            }}>
              Features 👀
            </h3>
            
            {[
              {
                title: 'Reaction Bar',
                description: 'Dreamed up the reaction bar to purposefully add friction to top-level reactions, bringing them more meaning and direction 💭',
                gif: "https://firebasestorage.googleapis.com/v0/b/weow-b57fc.firebasestorage.app/o/Randop%2FSelflove%20reaction.gif?alt=media&token=672937f1-d222-4cf0-a4ac-01a1455b2ac0"
              },
              {
                title: 'Custom Reactions',
                description: 'Built a playful way for friends to react with GIFs and captions, evolving from a fun web app I built as a side project 🎬',
                gif: "https://firebasestorage.googleapis.com/v0/b/weow-b57fc.firebasestorage.app/o/Randop%2FMiss%20you%20Gif.gif?alt=media&token=50e52710-1b3d-41ae-9069-168a66aa1bfe"
              },
              {
                title: 'Off Platform Sharing',
                description: 'Designed a fun way to share Favs posts to high traffic platfoforms driving people back to Favs from other social Social apps. Flywheels!',
                gif: "https://firebasestorage.googleapis.com/v0/b/weow-b57fc.firebasestorage.app/o/Randop%2FOff%20platoform2.gif?alt=media&token=1cfeacb1-aef8-4e9d-8906-cd1e86edf630"
              },
              {
                title: 'iMessage App',
                description: 'The evolution of custom reactions. I wanted to bring this experience as close as possible to the highest traffic communication tool on iPhone, iMessage. I built the MVP in Swift for vapor testing 📱',
                gif: "https://firebasestorage.googleapis.com/v0/b/weow-b57fc.firebasestorage.app/o/Randop%2FiMessage%20app1.gif?alt=media&token=45d8d500-1b67-4b4d-a9f4-397364e2d6e7"
              }
            ].map((feature, index) => (
              <div key={feature.title}>
                <button
                  onClick={(e) => {
                    const description = e.currentTarget.nextElementSibling;
                    const isExpanded = description.style.maxHeight !== '0px' && description.style.maxHeight !== '';
                    
                    // Update selected feature
                    setSelectedFeature(isExpanded ? null : feature.title);
                    
                    // Update channel number
                    const channelNumber = document.querySelector('.channel-number');
                    if (channelNumber) {
                      channelNumber.textContent = isExpanded ? 'CH 0' : `CH ${index + 1}`;
                    }
                    
                    // Collapse all descriptions first
                    document.querySelectorAll('.feature-description').forEach(desc => {
                      desc.style.maxHeight = '0px';
                      desc.style.opacity = '0';
                      desc.style.marginTop = '0px';
                    });
                    
                    // Expand clicked description
                    if (!isExpanded) {
                      description.style.maxHeight = description.scrollHeight + 'px';
                      description.style.opacity = '1';
                      description.style.marginTop = '0.5rem';
                    }
                    
                    // Add TV channel change effect
                    const tvScreen = document.querySelector('.tv-screen');
                    if (tvScreen) {
                      tvScreen.style.transform = 'scale(0.98)';
                      setTimeout(() => {
                        tvScreen.style.transform = 'scale(1)';
                      }, 300);
                    }
                  }}
                  style={{
                    backgroundColor: selectedFeature === feature.title 
                      ? 'rgba(51, 51, 51, 0.25)' 
                      : 'rgba(51, 51, 51, 0.1)',
                    padding: '12px 24px',
                    borderRadius: '30px',
                    border: 'none',
                    color: '#333',
                    cursor: 'pointer',
                    fontSize: 'clamp(0.5rem, 3.5cqi, 0.8rem)',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    width: 'fit-content',
                    fontWeight: selectedFeature === feature.title ? '500' : 'normal',
                    boxShadow: selectedFeature === feature.title 
                      ? '0 2px 4px rgba(0,0,0,0.1)' 
                      : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => {
                    if (selectedFeature !== feature.title) {
                      e.target.style.backgroundColor = 'rgba(51, 51, 51, 0.2)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedFeature !== feature.title) {
                      e.target.style.backgroundColor = 'rgba(51, 51, 51, 0.1)';
                    }
                  }}
                >
                  <span style={{ 
                    backgroundColor: selectedFeature === feature.title ? '#333' : 'rgba(51, 51, 51, 0.3)',
                    color: '#fff',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7em'
                  }}>
                    {index + 1}
                  </span>
                  {feature.title}
                </button>
                <div 
                  className="feature-description"
                  style={{
                    maxHeight: '0px',
                    opacity: '0',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease-out',
                    fontSize: 'clamp(0.4rem, 3cqi, 0.7rem)',
                    color: '#333',
                    paddingLeft: '24px',
                    marginTop: '0px'
                  }}
                >
                  {feature.description}
                </div>
              </div>
            ))}
          </div>

          {/* TV Screen container */}
          <div className="tv-container" style={{
            position: 'relative',
            height: '640px',
            width: '315px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000',
            borderRadius: '57px',
            overflow: 'hidden',
            position: 'absolute',
            right: 'calc(8% - 100px)',
            transform: 'translateX(-50%)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            padding: '20px'
          }}>
            {/* TV Screen */}
            <div className="tv-screen" style={{
              width: '275px',
              height: '600px',
              position: 'relative',
              borderRadius: '40px',
              overflow: 'hidden',
              transition: 'transform 0.3s ease'
            }}>
              {/* Default state */}
              <div className="default-state" style={{
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                color: '#fff',
                zIndex: 2,
                width: '275px',
                height: '600px',
                background: 'linear-gradient(45deg, #1a1a1a, #2a2a2a)',
                transition: 'opacity 0.3s ease',
                opacity: selectedFeature ? '0' : '1',
                padding: '20px'
              }}>
                <div className="channel-number" style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  fontSize: '0.8em',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>
                  CH 0
                </div>
                <p style={{
                  fontSize: 'clamp(0.5rem, 4cqi, 0.9rem)',
                  textAlign: 'center',
                  marginTop: '40%'
                }}>
                  Select a feature
                </p>
                <motion.div
                  animate={{
                    x: [-10, -20, -10]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    fontSize: '24px'
                  }}
                >
                  ←
                </motion.div>
              </div>

              {/* Pre-loaded feature GIFs */}
              {[
                {
                  title: 'Reaction Bar',
                  gif: "https://firebasestorage.googleapis.com/v0/b/weow-b57fc.firebasestorage.app/o/Randop%2FSelflove%20reaction.gif?alt=media&token=672937f1-d222-4cf0-a4ac-01a1455b2ac0"
                },
                {
                  title: 'Custom Reactions',
                  gif: "https://firebasestorage.googleapis.com/v0/b/weow-b57fc.firebasestorage.app/o/Randop%2FMiss%20you%20Gif.gif?alt=media&token=50e52710-1b3d-41ae-9069-168a66aa1bfe"
                },
                {
                  title: 'Off Platform Sharing',
                  gif: "https://firebasestorage.googleapis.com/v0/b/weow-b57fc.firebasestorage.app/o/Randop%2FOff%20platoform2.gif?alt=media&token=1cfeacb1-aef8-4e9d-8906-cd1e86edf630"
                },
                {
                  title: 'iMessage App',
                  gif: "https://firebasestorage.googleapis.com/v0/b/weow-b57fc.firebasestorage.app/o/Randop%2FiMessage%20app1.gif?alt=media&token=45d8d500-1b67-4b4d-a9f4-397364e2d6e7"
                }
              ].map((feature, index) => (
                <img 
                  key={feature.title}
                  src={feature.gif}
                  alt={`${feature.title} demo`}
                  style={{
                    position: 'absolute',
                    width: '275px',
                    height: '600px',
                    objectFit: 'cover',
                    transition: 'opacity 0.3s ease',
                    opacity: selectedFeature === feature.title ? 1 : 0,
                    zIndex: 1
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Baro text section */}
      <motion.div 
        className="grid-item"
        style={{ 
          backgroundColor: '#FFFFFF',
          padding: '2rem',
          containerType: 'inline-size',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div className="feature-content">
          <h2 style={{
            fontSize: 'clamp(1rem, 6cqi, 1.5rem)',
            marginBottom: 'clamp(0.5rem, 3cqi, 1rem)'
          }}>
            Baro 👗
          </h2>
          <p style={{
            fontSize: 'clamp(0.5rem, 4cqi, 0.9rem)',
            lineHeight: '1.5',
            color: '#333'
          }}>
            I worked with Baro's co-founders to launch their mobile app in the App Store. 
            Our focus was on maximizing usability while minimizing engineering spend - finding that 
            sweet spot between happy users and happy budgets ✨
          </p>
          
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            whiteSpace: 'nowrap'
          }}>
            <p style={{
              fontSize: 'clamp(0.2rem, 4cqi, 0.9rem)',
              color: '#333',
              marginBottom: '0.8rem',
              fontWeight: 'bold'
            }}>
              Watch the visual case study below 👀
            </p>
            <motion.div
              animate={{
                y: [0, -10, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span style={{
                fontSize: '24px'
              }}>↓</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* GIF Creator grid item */}
      <motion.div 
        className="grid-item"
        style={{ 
          backgroundColor: '#04CA95',
          padding: '2rem',
          containerType: 'inline-size',
          position: 'relative',
          perspective: '1000px',
          cursor: isGifCreatorFlipped ? 'default' : 'pointer',
          borderRadius: '24px',
          overflow: 'hidden'
        }}
        onClick={() => !isGifCreatorFlipped && setIsGifCreatorFlipped(true)}
      >
        <AnimatePresence>
          {!isGifCreatorFlipped ? (
            <motion.div
              initial={{ rotateY: 180 }}
              animate={{ rotateY: 0 }}
              exit={{ rotateY: 180 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                padding: '2rem',
                backfaceVisibility: 'hidden'
              }}
            >
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#FFFFFF',
                textAlign: 'center'
              }}>
                <h2 style={{
                  fontSize: 'clamp(1rem, 6cqi, 1.5rem)',
                  marginBottom: '1rem'
                }}>
                  Bored yet? make a gif, its fun :)
                </h2>
                <p style={{
                  fontSize: 'clamp(0.5rem, 4cqi, 0.9rem)',
                  marginBottom: '1.5rem',
                  lineHeight: '1.5',
                  maxWidth: '80%'
                }}>
                  I created this web app using HTML, CSS, and JavaScript. It turned into custom reactions in Favs!
                </p>
                <button
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#04CA95',
                    border: 'none',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '100px',
                    fontSize: 'clamp(0.5rem, 4cqi, 0.9rem)',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsGifCreatorFlipped(true);
                  }}
                >
                  Try it out
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ rotateY: -180 }}
              animate={{ rotateY: 0 }}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                backfaceVisibility: 'hidden'
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsGifCreatorFlipped(false);
                  }}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    zIndex: 10,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: '18px'
                  }}
                >
                  ×
                </button>
                <iframe
                  src="/gif-creator/index.html"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    borderRadius: '12px'
                  }}
                  title="GIF Creator"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Video container - span-2 */}
      <motion.div 
        className="grid-item span-2"
        style={{ 
          backgroundColor: '#f5f5f5',
          width: '100%',
          height: 'auto',
          aspectRatio: '16/9',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '24px',
        }}
      >
        <iframe
          src="https://player.vimeo.com/video/814826626?h=814826626&title=0&byline=0&portrait=0"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none'
          }}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="Baro Case Study"
        />
      </motion.div>
    </div>
  );
};

export default Grid; 