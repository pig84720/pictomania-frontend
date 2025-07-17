import React from 'react';
import { motion } from 'framer-motion';
import './Lobby.css';

const Lobby = ({
  difficulties,
  selectedDifficulty,
  setSelectedDifficulty,
  startGame,
  isLoading,
  error,
  usedCardsCount,
  onResetAll
}) => {
  // 動畫配置
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
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

  const buttonHover = {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  };

  const buttonTap = {
    scale: 0.95
  };

  return (
    <motion.div
      className="lobby"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 遊戲Logo */}
      <motion.div className="game-logo" variants={itemVariants}>
        <div className="logo-icon">🎨</div>
        <h1 className="game-title">神來一筆</h1>
        <p className="game-subtitle">(SLTJC特製版)</p>
      </motion.div>

      {/* 使用統計顯示 */}
      {usedCardsCount > 0 && (
        <motion.div className="usage-display" variants={itemVariants}>
          <div className="usage-info">
            <span className="usage-icon">📈</span>
            <span className="usage-text">已使用題目：{usedCardsCount} 張</span>
          </div>
          <button 
            className="reset-all-link"
            onClick={onResetAll}
            title="完全重置遊戲"
          >
            🔄 完全重置
          </button>
        </motion.div>
      )}

      {/* 難度選擇 */}
      <motion.div className="difficulty-section" variants={itemVariants}>
        <h2>選擇難度</h2>
        <div className="difficulty-buttons">
          {Object.entries(difficulties).map(([key, difficulty]) => (
            <motion.button
              key={key}
              className={`difficulty-btn ${selectedDifficulty === key ? 'selected' : ''}`}
              onClick={() => setSelectedDifficulty(key)}
              style={{
                '--difficulty-color': difficulty.color,
                borderColor: selectedDifficulty === key ? difficulty.color : 'transparent'
              }}
              whileHover={buttonHover}
              whileTap={buttonTap}
            >
              <span className="difficulty-emoji">{difficulty.emoji}</span>
              <span className="difficulty-name">{difficulty.name}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* 錯誤訊息 */}
      {error && (
        <motion.div
          className="error-message"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <span className="error-icon">⚠️</span>
          {error}
        </motion.div>
      )}

      {/* 開始遊戲按鈕 */}
      <motion.div className="start-game-section" variants={itemVariants}>
        <motion.button
          className="start-game-btn"
          onClick={startGame}
          disabled={isLoading || !selectedDifficulty}
          whileHover={!isLoading && selectedDifficulty ? buttonHover : {}}
          whileTap={!isLoading && selectedDifficulty ? buttonTap : {}}
        >
          {isLoading ? (
            <>
              <div className="loading-spinner"></div>
              載入中...
            </>
          ) : (
            <>
              <span className="start-icon">🚀</span>
              開始遊戲
            </>
          )}
        </motion.button>
      </motion.div>

      {/* 遊戲說明 */}
      <motion.div className="game-description" variants={itemVariants}>
        <p>選擇難度後，系統會隨機抽取3張卡片</p>
        <p>已使用的題目不會重複出現</p>
        <p>準備好開始這場創意十足的繪畫遊戲了嗎？</p>
      </motion.div>
    </motion.div>
  );
};

export default Lobby; 