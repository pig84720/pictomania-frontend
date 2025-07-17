import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './CardSlot.css';

const CardSlot = ({ pokemon, card, isActive, index }) => {
  const [selectedPrompts, setSelectedPrompts] = useState([]);

  const togglePrompt = (promptIndex) => {
    setSelectedPrompts(prev => 
      prev.includes(promptIndex) 
        ? prev.filter(i => i !== promptIndex)
        : [...prev, promptIndex]
    );
  };

  if (!isActive || !card) {
    return (
      <div className="card-slot inactive">
        <div className="card-symbol" style={{ backgroundColor: pokemon.color }}>
          <img src={pokemon.image} alt={pokemon.name} className="pokemon-image" />
        </div>
        <div className="empty-card">
          <div className="empty-card-icon">📝</div>
          <div className="empty-card-text">等待卡片...</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="card-slot"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {/* 神奇寶貝符號 */}
      <div className="card-symbol" style={{ backgroundColor: pokemon.color }}>
        <img src={pokemon.image} alt={pokemon.name} className="pokemon-image" />
      </div>

      {/* 卡片內容 */}
      <div className="card-content">
        <div className="card-prompts">
          {card.prompts.map((prompt, promptIndex) => (
            <motion.div
              key={promptIndex}
              className={`prompt-item ${selectedPrompts.includes(promptIndex) ? 'selected' : ''}`}
              onClick={() => togglePrompt(promptIndex)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="prompt-number">{promptIndex + 1}</div>
              <div className="prompt-text">{prompt.prompt}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CardSlot; 