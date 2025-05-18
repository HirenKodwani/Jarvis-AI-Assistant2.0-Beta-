import React, { useEffect, useRef } from 'react';

export const VoiceVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let bars: { height: number; direction: number; speed: number }[] = [];
    
    // Initialize bars
    const barCount = 30;
    for (let i = 0; i < barCount; i++) {
      bars.push({
        height: Math.random() * 50 + 10,
        direction: Math.random() > 0.5 ? 1 : -1,
        speed: Math.random() * 0.7 + 0.3
      });
    }
    
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = canvas.width / barCount;
      const baseY = canvas.height / 2;
      
      bars.forEach((bar, i) => {
        // Update bar height
        bar.height += bar.direction * bar.speed;
        if (bar.height > 50 || bar.height < 10) {
          bar.direction *= -1;
        }
        
        // Draw bar
        const x = i * barWidth;
        
        ctx.beginPath();
        ctx.moveTo(x, baseY - bar.height / 2);
        ctx.lineTo(x, baseY + bar.height / 2);
        ctx.lineWidth = barWidth * 0.8;
        ctx.lineCap = 'round';
        
        const gradient = ctx.createLinearGradient(0, baseY - bar.height / 2, 0, baseY + bar.height / 2);
        gradient.addColorStop(0, '#1A56DB');
        gradient.addColorStop(1, '#7857FF');
        ctx.strokeStyle = gradient;
        
        ctx.stroke();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-20 my-2"
      style={{ touchAction: 'none' }}
    />
  );
};