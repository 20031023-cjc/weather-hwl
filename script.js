const form = document.getElementById('form');
const input = document.getElementById('input');
const errorDiv = document.getElementById('error');
const weatherDiv = document.getElementById('weather');
const suggestionsDiv = document.getElementById('suggestions');

const API_KEY = '你的API_KEY'; // 替换为你的 OpenWeatherMap API Key

const cities = {
  ja: ['Tokyo', 'Osaka', 'Kyoto'],
  en: ['New York', 'Los Angeles', 'Chicago'],
  zh: ['北京', '上海', '广州']
};

const lang = 'ja'; // 设置当前语言，'ja'、'en' 或 'zh'

particlesJS.load('particles-js', 'particles.json', function() {
  console.log('particles.js config loaded');
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = input.value.trim();
  if (!city) {
    errorDiv.textContent = '请输入城市名';
    weatherDiv.textContent = '';
    return;
  }
  errorDiv.textContent = '';
  weatherDiv.textContent = '加载中...';

  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=zh_cn`);
    const data = await res.json();
    if (data.cod !== 200) {
      errorDiv.textContent = `错误：${data.message}`;
      weatherDiv.textContent = '';
      return;
    }
    errorDiv.textContent = '';
    weatherDiv.innerHTML = `
      <h2>${data.name} (${data.sys.country})</h2>
      <p>天气：${data.weather[0].description}</p>
      <p>温度：${data.main.temp} ℃</p>
      <p>湿度：${data.main.humidity}%</p>
      <p>风速：${data.wind.speed} m/s</p>
    `;
  } catch {
    errorDiv.textContent = '网络错误';
    weatherDiv.textContent = '';
  }
});

input.addEventListener('input', () => {
  const query = input.value.trim().toLowerCase();
  if (!query) {
    suggestionsDiv.innerHTML = '';
    return;
  }
  const matches = cities[lang].filter(city => city.toLowerCase().includes(query));
  suggestionsDiv.innerHTML = matches.map(city => `<div class="suggestion-item">${city}</div>`).join('');
  document.querySelectorAll('.suggestion-item').forEach(item => {
    item.addEventListener('click', () => {
      input.value = item.textContent;
      suggestionsDiv.innerHTML = '';
      form.dispatchEvent(new Event('submit'));
    });
  });
});
