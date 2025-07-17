import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Game.css';
import CardSlot from './CardSlot';
import { pokemonSymbols, getPokemonByIndex } from '../assets/images/pokemon';

const Game = ({
  cards,
  difficulty,
  difficulties,
  resetGame
}) => {
  const [showCardAnimation, setShowCardAnimation] = useState(true);
  const [animationPhase, setAnimationPhase] = useState('deck'); // 'deck' -> 'dealing' -> 'finished'
  const [visibleCards, setVisibleCards] = useState([]);

  useEffect(() => {
    // 開始抽卡動畫序列
    const startCardAnimation = () => {
      // 第一階段：顯示牌堆
      setTimeout(() => {
        setAnimationPhase('dealing');
      }, 1000);
  
      // 第二階段：逐張發牌
      setTimeout(() => {
        const dealCards = () => {
          cards.forEach((card, index) => {
            setTimeout(() => {
              const pokemon = getPokemonByIndex(index);
              setVisibleCards(prev => [...prev, { ...card, pokemon }]);
              
              // 如果是最後一張卡片，結束動畫
              if (index === cards.length - 1) {
                setTimeout(() => {
                  setAnimationPhase('finished');
                  setShowCardAnimation(false);
                }, 500);
              }
            }, index * 300);
          });
        };
        dealCards();
      }, 1500);
    };

    startCardAnimation();
  }, [cards]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      className="game"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 遊戲標題 */}
      <motion.div className="game-header" variants={itemVariants}>
        <h1 className="game-title">神來一筆</h1>
        <div className="game-info">
          <span className="difficulty-indicator">
            {difficulties[difficulty].emoji} {difficulties[difficulty].name}難度
          </span>
        </div>
      </motion.div>

      {/* 抽卡動畫區域 */}
      <AnimatePresence>
        {showCardAnimation && (
          <motion.div
            className="card-animation-area"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            {/* 牌堆 */}
            {animationPhase === 'deck' && (
              <motion.div
                className="card-deck"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="deck-stack">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="deck-card"
                      style={{ transform: `translateY(${i * -2}px)` }}
                    />
                  ))}
                </div>
                <p className="deck-text">正在抽取卡片...</p>
              </motion.div>
            )}

            {/* 發牌動畫 */}
            {animationPhase === 'dealing' && (
              <motion.div
                className="dealing-area"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="dealing-text">分配卡片到神奇寶貝槽...</p>
                <div className="dealing-animation">
                  {[...Array(3)].map((_, i) => {
                    const pokemon = getPokemonByIndex(i);
                    return (
                      <motion.div
                        key={i}
                        className="dealing-card"
                        style={{ backgroundColor: pokemon.color }}
                        initial={{ scale: 0, rotate: 180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: i * 0.2, duration: 0.3 }}
                      >
                        <span className="pokemon-symbol">
                          <img src={pokemon.image} alt={pokemon.name} />
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 卡片槽位區域 */}
      {!showCardAnimation && (
        <motion.div
          className="card-slots-area"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="slots-container">
            {pokemonSymbols.map((pokemon, index) => (
              <CardSlot
                key={pokemon.id}
                pokemon={pokemon}
                card={visibleCards[index]}
                isActive={true}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* 重新遊戲按鈕 */}
      {!showCardAnimation && (
        <motion.div
          className="game-controls"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className="reset-game-btn"
            onClick={resetGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="reset-icon">🔄</span>
            重新遊戲
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Game; 