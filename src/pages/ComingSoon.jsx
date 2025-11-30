import React, { useState, useEffect } from 'react';
import design1 from '../assets/design1.jpg';

const ComingSoon = () => {
  // ⏳ Compte à rebours = 3 semaines (21 jours) à partir de maintenant pour la démo
  // Dans un cas réel, remplacez par une date fixe : new Date("2025-12-05T00:00:00").getTime()
  const [endDate] = useState(() => {
    // Utiliser une date fixe pour que le timer soit cohérent entre les rechargements si on veut
    // Pour l'exemple demandé : 2025-12-05
    return new Date("2025-12-05T00:00:00").getTime();
  });

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const diff = endDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes: mins, seconds: secs });
    };

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call

    return () => clearInterval(interval);
  }, [endDate]);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div style={{
      backgroundColor: '#050c14',
      fontFamily: "'Inter', sans-serif",
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      overflow: 'hidden',
      textAlign: 'center',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;600;800&display=swap');
          
          :root {
            --accent: #7EE787;
            --muted: rgba(255,255,255,0.75);
          }

          .image-container {
            position: relative;
            width: 90%;
            max-width: 900px;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 80px rgba(0,0,0,0.6), 0 0 40px rgba(126,231,135,0.15);
            transform: perspective(900px) rotateX(6deg) rotateY(-2deg);
            transition: transform 0.8s ease;
            margin: 25px 0;
          }

          .image-container:hover {
            transform: perspective(900px) rotateX(0deg) rotateY(0deg) scale(1.02);
          }

          .image-container img {
            width: 100%;
            display: block;
            filter: brightness(1.02) contrast(1.02);
            min-height: 300px;
            background-color: #1a202c;
            object-fit: cover;
          }

          .overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-end;
            padding: 40px 20px;
            border-radius: inherit;
          }

          .time-box {
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 12px 20px;
            min-width: 80px;
            backdrop-filter: blur(6px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            margin: 5px;
          }

          .cta-button {
            background: #7EE787;
            color: #031707;
            border: none;
            border-radius: 10px;
            font-weight: 700;
            font-size: 1rem;
            padding: 12px 30px;
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            box-shadow: 0 8px 20px rgba(126,231,135,0.3);
            margin-top: 30px;
          }

          .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 25px rgba(126,231,135,0.4);
          }
        `}
      </style>

      <h1 style={{
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: 800,
        marginBottom: '10px',
        letterSpacing: '-0.03em'
      }}>
        🚀 Lancement Imminent
      </h1>
      
      <p style={{
        color: 'rgba(255,255,255,0.75)',
        maxWidth: '600px',
        margin: '0 auto 25px',
        fontSize: '1rem'
      }}>
        Une nouvelle ère de l’analyse et des données arrive. Découvrez bientôt notre plateforme.
      </p>

      <div className="image-container">
        {/* Placeholder image since design1.jpg is not available */}
        <img 
          src={design1} 
          alt="Aperçu du futur site" 
        />
        <div className="overlay">
          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '10px'
          }}>
            <div className="time-box">
              <strong style={{ display: 'block', fontSize: '1.5rem', fontWeight: 700, color: '#7EE787' }}>
                {pad(timeLeft.days)}
              </strong>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)', letterSpacing: '0.5px', marginTop: '4px', textTransform: 'uppercase' }}>
                Jours
              </span>
            </div>
            <div className="time-box">
              <strong style={{ display: 'block', fontSize: '1.5rem', fontWeight: 700, color: '#7EE787' }}>
                {pad(timeLeft.hours)}
              </strong>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)', letterSpacing: '0.5px', marginTop: '4px', textTransform: 'uppercase' }}>
                Heures
              </span>
            </div>
            <div className="time-box">
              <strong style={{ display: 'block', fontSize: '1.5rem', fontWeight: 700, color: '#7EE787' }}>
                {pad(timeLeft.minutes)}
              </strong>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)', letterSpacing: '0.5px', marginTop: '4px', textTransform: 'uppercase' }}>
                Minutes
              </span>
            </div>
            <div className="time-box">
              <strong style={{ display: 'block', fontSize: '1.5rem', fontWeight: 700, color: '#7EE787' }}>
                {pad(timeLeft.seconds)}
              </strong>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)', letterSpacing: '0.5px', marginTop: '4px', textTransform: 'uppercase' }}>
                Secondes
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="cta">
        <button 
          className="cta-button"
          onClick={() => alert('Tu seras notifié dès la sortie !')}
        >
          Me prévenir au lancement
        </button>
      </div>

      <footer style={{
         fontSize: '0.8rem',
        color: 'rgba(255,255,255,0.75)',
        margin: '20px'
      }}>
        © 2025 - Votre projet arrive bientôt
      </footer>
    </div>
  );
};

export default ComingSoon;
