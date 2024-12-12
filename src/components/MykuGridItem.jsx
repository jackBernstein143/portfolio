import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const MykuGridItem = ({ isFlipped, onFlip }) => {
  console.log('MykuGridItem props:', { isFlipped, onFlip });

  const [isTyping, setIsTyping] = useState(true);
  const [typedText, setTypedText] = useState('');
  const [showDeploy, setShowDeploy] = useState(false);
  const [haiku, setHaiku] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const codeSnippet = `const generateHaiku = async (image) => {
  const response = await openai.analyze(image);
  return response.haiku;
};`;

  const technologies = ['HTML', 'CSS', 'JavaScript', 'OpenAI API'];

  useEffect(() => {
    if (isTyping && typedText.length < codeSnippet.length) {
      const timeout = setTimeout(() => {
        setTypedText(codeSnippet.slice(0, typedText.length + 1));
      }, 15);
      return () => clearTimeout(timeout);
    } else if (typedText.length === codeSnippet.length) {
      setTimeout(() => setShowDeploy(true), 200);
    }
  }, [typedText, isTyping]);

  useEffect(() => {
    if (isFlipped) {
      initCamera();
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isFlipped]);

  const flipAnimation = {
    initial: {
      transform: 'rotateY(0deg)',
      transition: { duration: 0.5, ease: [0.32, 0.94, 0.61, 1] }
    },
    flipped: {
      transform: 'rotateY(180deg)',
      transition: {
        duration: 0.5,
        ease: [0.32, 0.94, 0.61, 1]
      }
    }
  };

  const renderColorizedCode = (code) => {
    return code
      .split(/(const|async|await|return|document)/)
      .map((part, index) => {
        switch (part) {
          case 'const':
            return <span key={index} style={{ color: '#569CD6' }}>{part}</span>;
          case 'async':
          case 'await':
            return <span key={index} style={{ color: '#C586C0' }}>{part}</span>;
          case 'return':
            return <span key={index} style={{ color: '#C586C0' }}>{part}</span>;
          case 'document':
            return <span key={index} style={{ color: '#9CDCFE' }}>{part}</span>;
          default:
            return part.split(/(generateHaiku|analyze|haiku|captureImage|createElement|getContext|toDataURL)/).map((subPart, subIndex) => {
              if (['generateHaiku', 'analyze', 'haiku', 'captureImage', 'createElement', 'getContext', 'toDataURL'].includes(subPart)) {
                return <span key={`${index}-${subIndex}`} style={{ color: '#DCDCAA' }}>{subPart}</span>;
              }
              return <span key={`${index}-${subIndex}`} style={{ color: '#9CDCFE' }}>{subPart}</span>;
            });
        }
      });
  };

  const handleDeploy = () => {
    console.log('Deploy clicked, calling onFlip(true)');
    onFlip(true);
    initCamera();
  };

  const resetCamera = () => {
    setHaiku('');
    setCapturedImage(null);
    initCamera();
  };

  const initCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera error:', err);
    }
  };

  const generateHaikuFromImage = async (imageDataUrl) => {
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: "Generate a haiku very specifically based on this image capturing the little details. Make it cute and fun. Return exactly 3 lines separated by newlines, following the 5-7-5 syllable pattern:" 
              },
              {
                type: "image_url",
                image_url: {
                  url: imageDataUrl,
                  detail: "low"
                }
              }
            ]
          }
        ],
        max_tokens: 60
      }, {
        headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
      });

      let haikuText = response.data.choices[0].message.content.trim();
      let lines = haikuText.split('\n').filter(line => line.trim() !== '');
      
      while (lines.length < 3) {
        lines.push('...');
      }
      if (lines.length > 3) {
        lines = lines.slice(0, 3);
      }
      return lines.join('\n');
    } catch (error) {
      console.error('Failed to generate haiku:', error);
      throw error;
    }
  };

  const capturePicture = async () => {
    setIsCapturing(true);
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    
    try {
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      console.log('Image captured:', imageDataUrl.substring(0, 100) + '...');
      setCapturedImage(imageDataUrl);

      const overlay = document.createElement('div');
      overlay.style.position = 'absolute';
      overlay.style.inset = '0';
      overlay.style.backgroundColor = 'white';
      overlay.style.opacity = '0.4';
      video.parentElement.appendChild(overlay);
      
      setTimeout(() => overlay.remove(), 150);

      try {
        const generatedHaiku = await generateHaikuFromImage(imageDataUrl);
        console.log('Generated Haiku:', generatedHaiku);
        setHaiku(generatedHaiku);
      } catch (haikuError) {
        console.error('Haiku generation failed:', haikuError);
        setHaiku('Could not generate haiku. Please try again.');
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    } catch (err) {
      console.error('Error in capture process:', err);
      setHaiku('Failed to capture image. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div 
      className="grid-item"
      style={{
        width: '100%',
        aspectRatio: '1',
        perspective: '1000px'
      }}
    >
      <motion.div
        initial="initial"
        animate={isFlipped ? "flipped" : "initial"}
        variants={flipAnimation}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Front side */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            backgroundColor: '#1E1E1E',
            borderRadius: '2rem',
            padding: '2rem',
            color: '#fff',
            fontFamily: 'Monaco, monospace',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <div>
            <h2 style={{
              margin: 0,
              marginBottom: 'clamp(0.5rem, 2cqi, 0.75rem)',
              fontSize: 'clamp(1.2rem, 5cqi, 1.8rem)',
              fontWeight: '600'
            }}>
              Myku.app
            </h2>
            <div style={{
              display: 'flex',
              gap: 'clamp(0.3rem, 1.2cqi, 0.4rem)',
              flexWrap: 'wrap'
            }}>
              {technologies.map((tech, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: '#2D2D2D',
                    padding: 'clamp(0.15rem, 0.6cqi, 0.2rem) clamp(0.4rem, 1.6cqi, 0.6rem)',
                    borderRadius: 'clamp(0.3rem, 1.2cqi, 0.4rem)',
                    fontSize: 'clamp(0.6rem, 2.2cqi, 0.75rem)',
                    color: '#9CDCFE'
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div style={{
            backgroundColor: '#2D2D2D',
            borderRadius: 'clamp(0.5rem, 2cqi, 0.75rem)',
            padding: 'clamp(1rem, 4cqi, 1.5rem)',
            flex: '0 1 auto',
            position: 'relative',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #3D3D3D',
            marginBottom: 'clamp(3.5rem, 12cqi, 4.5rem)'
          }}>
            <div style={{
              position: 'absolute',
              top: 'clamp(0.5rem, 2cqi, 0.75rem)',
              left: 'clamp(0.5rem, 2cqi, 0.75rem)',
              display: 'flex',
              gap: 'clamp(0.25rem, 1cqi, 0.4rem)'
            }}>
              {['#FF5F56', '#FFBD2E', '#27C93F'].map((color, index) => (
                <div
                  key={index}
                  style={{
                    width: 'clamp(0.5rem, 2cqi, 0.75rem)',
                    height: 'clamp(0.5rem, 2cqi, 0.75rem)',
                    borderRadius: '50%',
                    backgroundColor: color
                  }}
                />
              ))}
            </div>
            <pre style={{ 
              margin: 'clamp(1.5rem, 6cqi, 2rem) 0 0 0',
              fontSize: 'clamp(0.5rem, 2.8cqi, 0.85rem)',
              lineHeight: '1.5',
              overflow: 'hidden'
            }}>
              <code>{renderColorizedCode(typedText)}</code>
            </pre>
          </div>
          
          {showDeploy && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  position: 'absolute',
                  bottom: 'clamp(2rem, 8cqi, 2.8rem)',
                  right: 'clamp(8rem, 28cqi, 10rem)',
                  color: '#9CDCFE',
                  fontSize: 'clamp(0.7rem, 2.4cqi, 0.9rem)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(0.3rem, 1.2cqi, 0.5rem)',
                  whiteSpace: 'nowrap',
                  height: 'clamp(28px, 5cqi, 36px)',
                }}
              >
                test it out <span>→</span>
              </motion.div>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleDeploy}
                style={{
                  position: 'absolute',
                  bottom: 'clamp(2rem, 8cqi, 2.8rem)',
                  right: 'clamp(2rem, 8cqi, 2.5rem)',
                  padding: '0 clamp(12px, 3cqi, 20px)',
                  backgroundColor: '#3D9ACC',
                  border: 'none',
                  borderRadius: 'clamp(8px, 1.2cqi, 12px)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: 'clamp(0.7rem, 2.4cqi, 0.9rem)',
                  fontWeight: '500',
                  height: 'clamp(28px, 5cqi, 36px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                whileHover={{ scale: 1.05 }}
              >
                deploy
              </motion.button>
            </>
          )}
        </div>

        {/* Back side */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            backgroundColor: '#f0f0f0',
            borderRadius: '2rem',
            overflow: 'hidden',
            transform: 'rotateY(180deg)',
            transformStyle: 'preserve-3d'
          }}
        >
          <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '1rem',
            position: 'relative'
          }}>
            <div style={{
              fontSize: 'clamp(0.8rem, 3cqi, 1rem)',
              marginBottom: '0.5rem',
              textAlign: 'center'
            }}>
              {haiku ? 'Your Ku is ready!' : 'Take a picture to make your Ku ❤️'}
            </div>
            
            <div style={{
              flex: 1,
              position: 'relative',
              borderRadius: '1rem',
              overflow: 'hidden',
              backgroundColor: '#000'
            }}>
              {capturedImage ? (
                <img 
                  src={capturedImage}
                  alt="Captured"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scaleX(-1)'
                  }}
                />
              )}
              
              {haiku && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    padding: '0.5rem',
                    zIndex: 10
                  }}
                >
                  {haiku.split('\n').map((line, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: 'clamp(0.7rem, 2.4cqi, 0.9rem)',
                        whiteSpace: 'nowrap',
                        textAlign: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{
              marginTop: '1rem',
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '60px'
            }}>
              <motion.button
                onClick={() => {
                  console.log('X clicked, calling onFlip(false)');
                  onFlip(false);
                  setTimeout(() => {
                    setHaiku('');
                    setCapturedImage(null);
                    if (streamRef.current) {
                      streamRef.current.getTracks().forEach(track => track.stop());
                    }
                  }, 500);
                }}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  padding: 'clamp(8px, 1.5cqi, 12px)',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '100px',
                  width: '60px',
                  height: '60px',
                  cursor: 'pointer',
                  outline: 'none',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '4px solid rgba(255, 255, 255, 0)',
                  fontSize: '24px',
                  color: '#666',
                  transition: 'transform 0.2s'
                }}
                whileHover={{ scale: 1.05 }}
              >
                ×
              </motion.button>
              
              <motion.button
                onClick={haiku ? resetCamera : (!isCapturing ? capturePicture : null)}
                disabled={isCapturing}
                style={{
                  padding: 'clamp(8px, 1.5cqi, 12px)',
                  backgroundColor: isCapturing ? '#ccc' : '#3D9ACC',
                  borderRadius: '100px',
                  width: '60px',
                  height: '60px',
                  cursor: isCapturing ? 'default' : 'pointer',
                  outline: 'none',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: haiku ? 'none' : '4px solid #fff',
                  fontSize: '24px',
                  color: 'white',
                  transition: 'transform 0.2s'
                }}
                whileHover={!isCapturing ? { scale: 1.05 } : {}}
              >
                {haiku ? '↺' : null}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MykuGridItem;