// 神奇寶貝圖案配置
// 使用實際的神奇寶貝圖片

export const pokemonSymbols = [
  {
    id: 'bulbasaur',
    name: '妙蛙種子',
    image: require('./妙蛙種子.png'),
    color: '#4CAF50' // 綠色
  },
  {
    id: 'charmander',
    name: '小火龍',
    image: require('./小火龍.png'),
    color: '#FF6B35' // 橙紅色
  },
  {
    id: 'squirtle',
    name: '傑尼龜',
    image: require('./傑尼龜.png'),
    color: '#4A90E2' // 藍色
  }
];

// 輔助函數：根據索引獲取神奇寶貝
export const getPokemonByIndex = (index) => {
  return pokemonSymbols[index] || pokemonSymbols[0];
};

// 輔助函數：獲取所有神奇寶貝
export const getAllPokemon = () => {
  return pokemonSymbols;
}; 