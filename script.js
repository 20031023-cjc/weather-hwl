// 城市库 — 请根据需要补充
const cityData = {
  zh: ['福州', '北京', '上海', '广州', '深圳', '杭州', '成都'],
  ja: ['東京', '大阪', '京都', '札幌', '名古屋', '福岡'],
  en: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio']
};

const input = document.getElementById('city-input');
const suggestions = document.getElementById('suggestions');
const weatherDiv = document.getElementById('weather');
const errorDiv = document.getElementById('error');
const langSelect = document.getElementById('lang-select');
const searchBtn = document.getElementById('search-btn');

let currentLang = langSelect.value;
const API_KEY = '你的API_KEY';  // 替换成你自己的API Key

// 粒子动画初始化
tsParticles.load('tsparticles', {
  fpsLimit: 60,
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: '#ffd700' },
    shape: { type: 'circle' },
    opacity: { value: 0.6, random: true },
    size: { value: 3, random: true },
    move: {
      enable: true,
      speed: 3,
      direction: 'none',
      random: false,
      straight: false,
      outModes: { default: 'out' },
      attract: { enable: true, rotateX: 600, rotateY: 1200 }
    },
    links: {
      enable: true,
      distance: 120,
      color: '#ffcc00',
      opacity: 0.4,
      width: 1
    }
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: 'grab' },
      onClick: { enable: true, mode: 'push' },
      resize: true
    },
    modes: {
      grab: { distance: 200, links: { opacity: 0.7 } },
      push: { quantity: 4 }
    }
  },
  detectRetina: true
});

langSelect.addEventListener('change', () => {
  currentLang = langSelect.value;
  suggestions.innerHTML = '';
  weatherDiv.innerHTML = '';
  errorDiv.textContent = '';
  input.value = '';
});

// 模糊搜索函数，大小写忽略，支持多语言
function fuzzySearch(query, lang) {
  query = query.toLowerCase();
  return cityData[lang].filter(city => city.toLowerCase().includes(query));
}

// 展示联想词
input.addEventListener('input', () => {
  const val = input.value.trim();
  suggestions.innerHTML = '';
  if (!val) return;
  const matched = fuzzySearch(val, currentLang);
  if (matched.length === 0) {
    suggestions.innerHTML = '<div class="suggestion-item">无匹配结果</div>';
    return;
  }
  matched.forEach(city => {
    const div = document.createElement('div');
    div.textContent = city;
    div.classList.add('suggestion-item');
    div.addEventListener('click', () => {
      input.value = city;
      suggestions.innerHTML = '';
      fetchWeather(city, currentLang);
    });
    suggestions.appendChild(div);
  });
});

// 点击查询按钮
searchBtn.addEventListener('click', () => {
  const city = input.value.trim();
  if (!city) {
    errorDiv.textContent = '请输入城市名！';
    weatherDiv.innerHTML = '';
    return;
  }
  fetchWeather(city, currentLang);
  suggestions.innerHTML = '';
});

function fetchWeather(city, lang) {
  errorDiv.textContent = '';
  weatherDiv.innerHTML = '正在加载...';

  // 使用 OpenWeatherMap API 查询天气
  // 根据语言和城市名构造URL（单位设为摄氏度）
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=${lang}`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error('城市未找到或请求错误');
      return res.json();
    })
    .then(data => {
      // 解析并显示天气信息
      const desc = data.weather[0].description;
      const temp = data.main.temp;
      const feels = data.main.feels_like;
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;

      let resultHTML = `
        <h2>${city}</h2>
        <p><strong>天气：</strong> ${desc}</p>
        <p><strong>温度：</strong> ${temp} °C (体感 ${feels} °C)</p>
        <p><strong>湿度：</strong> ${humidity}%</p>
        <p><strong>风速：</strong> ${windSpeed} m/s</p>
      `;

      weatherDiv.innerHTML = resultHTML;
    })
    .catch(err => {
      weatherDiv.innerHTML = '';
      errorDiv.textContent = err.message;
    });
}
