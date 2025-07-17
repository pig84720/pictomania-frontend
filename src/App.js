import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import Lobby from './components/Lobby';
import Game from './components/Game';
import { getRandomCards } from './services/api';

const DIFFICULTIES = {
  easy: { name: '簡單', color: '#4CAF50', emoji: '😊', apiKey: 'green' },
  normal: { name: '普通', color: '#FF9800', emoji: '😐', apiKey: 'orange' },
  hard: { name: '難', color: '#f44336', emoji: '😰', apiKey: 'blue' },
  extreme: { name: '爆炸難', color: '#9C27B0', emoji: '💥', apiKey: 'yellow' }
};

// 初始化六組分數
const INITIAL_SCORES = {
  team1: 0,
  team2: 0,
  team3: 0,
  team4: 0,
  team5: 0,
  team6: 0
};

const TEAM_NAMES = {
  team1: '第一組',
  team2: '第二組',
  team3: '第三組',
  team4: '第四組',
  team5: '第五組',
  team6: '第六組'
};

// LocalStorage 鍵名
const STORAGE_KEYS = {
  USED_CARDS: 'pictomania_used_cards',
  SCORES: 'pictomania_scores'
};

function App() {
  const [currentPage, setCurrentPage] = useState('lobby'); // 'lobby' or 'game'
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRules, setShowRules] = useState(false);
  
  // 計分相關狀態
  const [scores, setScores] = useState(INITIAL_SCORES);
  const [showScores, setShowScores] = useState(false);
  
  // 已使用題目追踪
  const [usedCards, setUsedCards] = useState(new Set());

  // 初始化：從 localStorage 讀取已使用的題目和分數
  useEffect(() => {
    try {
      // 讀取已使用的題目
      const savedUsedCards = localStorage.getItem(STORAGE_KEYS.USED_CARDS);
      if (savedUsedCards) {
        setUsedCards(new Set(JSON.parse(savedUsedCards)));
      }

      // 讀取分數
      const savedScores = localStorage.getItem(STORAGE_KEYS.SCORES);
      if (savedScores) {
        setScores(JSON.parse(savedScores));
      }
    } catch (error) {
      console.error('讀取 localStorage 失敗:', error);
    }
  }, []);

  // 保存已使用題目到 localStorage
  const saveUsedCards = (newUsedCards) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USED_CARDS, JSON.stringify([...newUsedCards]));
    } catch (error) {
      console.error('保存已使用題目失敗:', error);
    }
  };

  // 保存分數到 localStorage
  const saveScores = (newScores) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(newScores));
    } catch (error) {
      console.error('保存分數失敗:', error);
    }
  };

  // 檢查題目是否已使用
  const isCardUsed = (card) => {
    // 使用卡片的唯一標識符（可以是 ID 或題目內容的組合）
    const cardId = card.id || `${card.difficulty}_${JSON.stringify(card.prompts)}`;
    return usedCards.has(cardId);
  };

  // 標記題目為已使用
  const markCardsAsUsed = (cards) => {
    const newUsedCards = new Set(usedCards);
    cards.forEach(card => {
      const cardId = card.id || `${card.difficulty}_${JSON.stringify(card.prompts)}`;
      newUsedCards.add(cardId);
    });
    setUsedCards(newUsedCards);
    saveUsedCards(newUsedCards);
  };

  // 過濾已使用的題目
  const filterUnusedCards = (cards) => {
    return cards.filter(card => !isCardUsed(card));
  };

  // 開始遊戲
  const startGame = async () => {
    if (!selectedDifficulty) {
      setError('請選擇難度！');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 使用apiKey與後端API通信
      const apiKey = DIFFICULTIES[selectedDifficulty].apiKey;
      const allCards = await getRandomCards(apiKey);
      
      // 過濾已使用的題目
      const availableCards = filterUnusedCards(allCards);
      
      if (availableCards.length === 0) {
        setError('該難度的題目已全部使用完畢！您可以重置遊戲或選擇其他難度。');
        return;
      }

      // 如果可用題目少於需求數量，提示用戶
      if (availableCards.length < 3) {
        const confirmed = window.confirm(
          `該難度僅剩 ${availableCards.length} 張未使用的題目卡，是否繼續？`
        );
        if (!confirmed) {
          return;
        }
      }

      // 取前3張或所有可用的卡片
      const selectedCards = availableCards.slice(0, 3);
      
      // 標記這些卡片為已使用
      markCardsAsUsed(selectedCards);
      
      setCards(selectedCards);
      setCurrentPage('game');
    } catch (err) {
      setError('無法載入卡片，請稍後再試');
      console.error('Error fetching cards:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 重新開始遊戲
  const resetGame = () => {
    setCurrentPage('lobby');
    setSelectedDifficulty('');
    setCards([]);
    setError('');
  };

  // 完全重置遊戲（清除所有使用記錄）
  const resetAllGame = () => {
    const confirmed = window.confirm(
      '確定要完全重置遊戲嗎？這將清除所有已使用的題目記錄和分數，此操作無法復原。'
    );
    if (confirmed) {
      // 清除已使用題目
      setUsedCards(new Set());
      localStorage.removeItem(STORAGE_KEYS.USED_CARDS);
      
      // 重置分數
      setScores(INITIAL_SCORES);
      localStorage.removeItem(STORAGE_KEYS.SCORES);
      
      // 重置遊戲狀態
      resetGame();
      alert('遊戲已完全重置！');
    }
  };

  // 更新分數
  const updateScore = (teamId, newScore) => {
    const newScores = {
      ...scores,
      [teamId]: newScore
    };
    setScores(newScores);
    saveScores(newScores);
  };

  // 重置分數
  const resetScores = () => {
    const confirmed = window.confirm('確定要重置所有分數嗎？此操作無法復原。');
    if (confirmed) {
      setScores(INITIAL_SCORES);
      saveScores(INITIAL_SCORES);
      alert('所有分數已重置！');
    }
  };

  // 頁面切換動畫配置
  const pageVariants = {
    initial: { opacity: 0, scale: 0.8 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 1.2 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  };

  return (
    <div className="app">
      <div className="background">
        <div className="bg-shapes">
          <div className="shape shape1"></div>
          <div className="shape shape2"></div>
          <div className="shape shape3"></div>
          <div className="shape shape4"></div>
        </div>
      </div>
      
      <div className="app-container">
        {/* 問號按鈕容器 - 專門處理問號按鈕定位 */}
        <div className="help-button-container">
          <motion.button
            className="rules-button"
            onClick={() => setShowRules(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="rules-icon">?</span>
          </motion.button>
        </div>

        {/* 計分按鈕容器 */}
        <div className="score-button-container">
          <motion.button
            className="score-button"
            onClick={() => setShowScores(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <span className="score-icon">📊</span>
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {currentPage === 'lobby' && (
            <motion.div
              key="lobby"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Lobby
                difficulties={DIFFICULTIES}
                selectedDifficulty={selectedDifficulty}
                setSelectedDifficulty={setSelectedDifficulty}
                startGame={startGame}
                isLoading={isLoading}
                error={error}
                usedCardsCount={usedCards.size}
                totalCards={Object.keys(DIFFICULTIES).length * 10} // 假設每個難度有10張卡
                onResetAll={resetAllGame}
              />
            </motion.div>
          )}
          
          {currentPage === 'game' && (
            <motion.div
              key="game"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Game
                cards={cards}
                difficulty={selectedDifficulty}
                difficulties={DIFFICULTIES}
                resetGame={resetGame}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 遊戲規則 Popup */}
        <AnimatePresence>
          {showRules && (
            <motion.div
              className="rules-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRules(false)}
            >
              <motion.div
                className="rules-popup"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="rules-header">
                  <h3>🎨 遊戲規則</h3>
                  <button 
                    className="close-btn"
                    onClick={() => setShowRules(false)}
                  >
                    ×
                  </button>
                </div>
                
                <div className="rules-content">
                  <div className="rules-section">
                    <h4>🎯 遊戲設定</h4>
                    <ul>
                      <li><strong>參與人數：</strong>分為六組進行遊戲</li>
                      <li><strong>每組裝備：</strong>白板 + 白板筆 + 數字卡牌(1~6) + 分數卡(3分1張、2分2張、1分2張)</li>
                    </ul>
                  </div>

                  <div className="rules-section">
                    <h4>🎮 遊戲流程</h4>
                    <ol>
                      <li><strong>難度順序：</strong>簡單 → 普通 → 難 → 爆炸難 依序進行</li>
                      <li><strong>抽題階段：</strong>選擇難度後進入抽題目卡階段</li>
                      <li><strong>題目分配：</strong>每張題目卡有6道題目(標號1~6)，對應不同符號</li>
                      <li><strong>個人抽卡：</strong>每組抽一張符號卡 + 一張題號卡，決定要畫的題目</li>
                    </ol>
                  </div>

                  <div className="rules-section">
                    <h4>⏰ 作畫階段</h4>
                    <ul>
                      <li><strong>時間限制：</strong>
                        <ul>
                          <li>簡單：1分鐘</li>
                          <li>普通：1分15秒</li>
                          <li>困難：1分30秒</li>
                          <li>爆炸難：2分鐘</li>
                        </ul>
                      </li>
                      <li><strong>作畫規則：</strong>不可直接寫文字或數字，其他都可以畫</li>
                      <li><strong>計時結束：</strong>統一停筆，公布畫作</li>
                    </ul>
                  </div>

                  <div className="rules-section">
                    <h4>🎯 猜題與計分</h4>
                    <ol>
                      <li><strong>猜題階段：</strong>根據他人畫作猜測題目，將數字卡放到該人面前</li>
                      <li><strong>速度競賽：</strong>按猜題速度排序，有先後順序</li>
                      <li><strong>計分規則：</strong>
                        <ul>
                          <li>第一個猜中：3分</li>
                          <li>第二個猜中：2分</li>
                          <li>依此類推...</li>
                        </ul>
                      </li>
                      <li><strong>扣分規則：</strong>剩餘分數卡每張扣1分</li>
                    </ol>
                  </div>

                  <div className="rules-section">
                    <h4>🏆 遊戲結束</h4>
                    <p>各組結算分數後結束該輪，繼續下一輪遊戲，直到完成所有難度。</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 計分板 Popup */}
        <AnimatePresence>
          {showScores && (
            <motion.div
              className="scores-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowScores(false)}
            >
              <motion.div
                className="scores-popup"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="scores-header">
                  <h3>📊 計分板</h3>
                  <button 
                    className="close-btn"
                    onClick={() => setShowScores(false)}
                  >
                    ×
                  </button>
                </div>
                
                <div className="scores-content">
                  <div className="scores-grid">
                    {Object.entries(scores).map(([teamId, score]) => (
                      <div key={teamId} className="score-item">
                        <div className="team-name">{TEAM_NAMES[teamId]}</div>
                        <input
                          type="number"
                          className="score-input"
                          value={score}
                          onChange={(e) => {
                            const value = e.target.value;
                            // 允許輸入框暫時清空，但在 state 中存儲為 0
                            const newScore = value === '' ? 0 : parseInt(value, 10);
                            // 確保不會寫入 NaN
                            if (!isNaN(newScore)) {
                              updateScore(teamId, newScore);
                            }
                          }}
                          min="0"
                          max="999"
                        />
                        <div className="score-label">分</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="scores-summary">
                    <div className="total-score">
                      總分：{Object.values(scores).reduce((sum, score) => sum + score, 0)} 分
                    </div>
                    <div className="highest-score">
                      領先：{Object.entries(scores).reduce((max, [teamId, score]) => 
                        score > max.score ? { teamId, score } : max, 
                        { teamId: '', score: -1 }
                      ).score > 0 ? 
                        `${TEAM_NAMES[Object.entries(scores).reduce((max, [teamId, score]) => 
                          score > max.score ? { teamId, score } : max, 
                          { teamId: '', score: -1 }
                        ).teamId]} (${Object.entries(scores).reduce((max, [teamId, score]) => 
                          score > max.score ? { teamId, score } : max, 
                          { teamId: '', score: -1 }
                        ).score}分)` : 
                        '暫無'
                      }
                    </div>
                  </div>
                  
                  <div className="usage-stats">
                    <div className="stats-item">
                      已使用題目：{usedCards.size} 張
                    </div>
                    <button 
                      className="reset-all-btn"
                      onClick={resetScores}
                      title="重置所有分數"
                    >
                      🔄 重置分數
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App; 