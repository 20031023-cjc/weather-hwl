// 粒子动画配置
particlesJS('particles-js', {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: '#f39c12' },
    shape: { type: 'circle' },
    opacity: { value: 0.5, random: false },
    size: { value: 3, random: true },
    line_linked: {
      enable: true,
      distance: 150,
      color: '#f39c12',
      opacity: 0.4,
      width: 1,
    },
    move: { enable: true, speed: 3, direction: 'none', random: false, straight: false },
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: { enable: true, mode: 'grab' },
      onclick: { enable: true, mode: 'push' },
    },
    modes: {
      grab: { distance: 140, line_linked: { opacity: 1 } },
      push: { particles_nb: 4 },
    },
  },
  retina_detect: true,
});

const apiKey = 'YOUR_API_KEY_HERE'; // 替换为你的API Key

const langTexts = {
  ja: {
    title: '天気検索',
    placeholder: '都市名を入力してください',
    searchBtn: '検索',
    error: '天気情報が見つかりません。正しい都市名を入力してください。',
  },
  en: {
    title: 'Weather Search',
    placeholder: 'Enter city name',
    searchBtn: 'Search',
    error: 'Weather data not found. Please enter a valid city name.',
  },
  zh_cn: {
    title: '天气查询',
    placeholder: '请输入城市名称',
    searchBtn: '查询',
    error: '未找到天气信息，请输入正确的城市名称。',
  },
};

let currentLang = 'ja';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherResult = document.getElementById('weatherResult');
const cityNameEl = document.getElementById('cityName');
const weatherIconEl = document.getElementById('weatherIcon');
const descriptionEl = document.getElementById('description');
const temperatureEl = document.getElementById('temperature');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');
const titleEl = document.getElementById('title');
const langButtons = document.querySelectorAll('.lang-switcher button');

function updateLangUI() {
  const texts = langTexts[currentLang];
  titleEl.textContent = texts.title;
  cityInput.placeholder = texts.placeholder;
  searchBtn.textContent = texts.searchBtn;

  langButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
}

function getWeatherIconClass(id) {
  // OpenWeatherMap天气代码对照weather-icons图标
  if (id >= 200 && id < 300) return 'wi-thunderstorm';
  if (id >= 300 && id < 500) return 'wi-sprinkle';
  if (id >= 500 && id < 600) return 'wi-rain';
  if (id >= 600 && id < 700) return 'wi-snow';
  if (id >= 700 && id < 800) return 'wi-fog';
  if (id === 800) return 'wi-day-sunny';
  if (id === 801) return 'wi-day-cloudy';
  if (id === 802) return 'wi-cloudy';
  if (id === 803 || id === 804) return 'wi-cloudy-windy';
  return 'wi-na';
}

async function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${apiKey}&units=metric&lang=${currentLang === 'zh_cn' ? 'zh_cn' : currentLang}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('No data');
    const data = await res.json();

    cityNameEl.textContent = `${data.name}, ${data.sys.country}`;
    const iconClass = getWeatherIconClass(data.weather[0].id);
    weatherIconEl.className = `wi ${iconClass}`;
    descriptionEl.textContent = data.weather[0].description;
    temperatureEl.textContent = `🌡️ ${data.main.temp.toFixed(1)} °C`;
    humidityEl.textContent = `💧 ${data.main.humidity} %`;
    windEl.textContent = `🌬️ ${data.wind.speed} m/s`;

    weatherResult.classList.add('show');
    weatherResult.classList.remove('hidden');
  } catch (e) {
    alert(langTexts[currentLang].error);
    weatherResult.classList.remove('show');
    weatherResult.classList.add('hidden');
  }
}

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
});

cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchBtn.click();
  }
});

langButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (btn.dataset.lang === currentLang) return;
    currentLang = btn.dataset.lang;
    updateLangUI();
    weatherResult.classList.remove('show');
    weatherResult.classList.add('hidden');
    cityInput.value = '';
  });
});

// 初始化界面语言
updateLangUI();
