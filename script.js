const apiKey = 'b6a115c488c68c44e392006a499361f5';

const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');

const cityName = document.getElementById('cityName');
const description = document.getElementById('description');
const temp = document.getElementById('temp');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');

const title = document.getElementById('title');
const tempLabel = document.getElementById('tempLabel');
const humidityLabel = document.getElementById('humidityLabel');
const windLabel = document.getElementById('windLabel');

const langButtons = document.querySelectorAll('.lang-switcher button');

let currentLang = 'ja'; // 默认日语

// 页面文案对应表
const texts = {
  ja: {
    title: '天気検索',
    placeholder: '都市名を入力してください',
    searchBtn: '検索',
    tempLabel: '気温',
    humidityLabel: '湿度',
    windLabel: '風速',
    alertEmpty: '都市名を入力してください',
    alertNotFound: '都市が見つかりません',
  },
  en: {
    title: 'Weather Search',
    placeholder: 'Enter city name',
    searchBtn: 'Search',
    tempLabel: 'Temperature',
    humidityLabel: 'Humidity',
    windLabel: 'Wind Speed',
    alertEmpty: 'Please enter city name',
    alertNotFound: 'City not found',
  },
  zh_cn: {
    title: '天气查询',
    placeholder: '请输入城市名称',
    searchBtn: '查询',
    tempLabel: '温度',
    humidityLabel: '湿度',
    windLabel: '风速',
    alertEmpty: '请输入城市名称',
    alertNotFound: '城市未找到',
  },
};

// 切换界面文字
function updateTexts(lang) {
  title.textContent = texts[lang].title;
  cityInput.placeholder = texts[lang].placeholder;
  searchBtn.textContent = texts[lang].searchBtn;
  tempLabel.textContent = texts[lang].tempLabel;
  humidityLabel.textContent = texts[lang].humidityLabel;
  windLabel.textContent = texts[lang].windLabel;
}

// 切换语言按钮点击事件
langButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    currentLang = btn.dataset.lang;
    updateTexts(currentLang);
    weatherResult.classList.add('hidden'); // 切语言时隐藏结果
  });
});

// 查询按钮点击事件
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (!city) {
    alert(texts[currentLang].alertEmpty);
    return;
  }
  getWeather(city, currentLang);
});

async function getWeather(city, lang) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric&lang=${lang}`
    );
    if (!response.ok) throw new Error(texts[lang].alertNotFound);
    const data = await response.json();

    cityName.textContent = `${data.name}，${data.sys.country}`;
    description.textContent = data.weather[0].description;
    temp.textContent = Math.round(data.main.temp);
    humidity.textContent = data.main.humidity;
    wind.textContent = data.wind.speed;

    weatherResult.classList.remove('hidden');
  } catch (error) {
    alert(error.message);
    weatherResult.classList.add('hidden');
  }
}

// 初始化页面为默认语言
updateTexts(currentLang);
