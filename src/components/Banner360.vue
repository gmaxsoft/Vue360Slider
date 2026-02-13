<template>
  <div class="banner-360">
    <img src="/images/square.png" alt="" class="square-decor" />
    <div class="title-container">
      <h1 class="title">Wsparcie i obsługa organizacji 360°</h1>
    </div>

    <div class="person-container">
      <transition name="person-switch" mode="out-in" :appear="false">
        <img :key="activeIdx" :src="currentSection.image" class="person-img" alt="Expert" loading="lazy" />
      </transition>
    </div>

    <div class="widget-360">
      <div class="circle-main-container">
        <img :src="currentSection.circle_bg" class="circle-bg-image" alt="Background Circle" loading="lazy" />

        <div v-for="(section, index) in sections" :key="index"
          :class="['nav-point', `pos-${index}`, { active: activeIdx === index }]" @click="activeIdx = index">
          <div class="dot" :style="activeIdx === index ? { backgroundColor: section.color } : {}"></div>
          <span class="label">{{ section.label }}</span>
        </div>

        <div class="content-overlay">
          <div class="inner-text">
            <img src="/images/logo_circle.png" alt="Logo" class="inner-logo" />
            <h2 class="section-title">
              {{ currentSection.label }}
            </h2>
            <div class="scroll-description">
              {{ currentSection.description }}
            </div>
          </div>
        </div>
      </div>

      <div class="text-below-circle">
        <h2 class="section-title">{{ currentSection.label }}</h2>
        <div class="scroll-description">{{ currentSection.description }}</div>
      </div>

      <div class="footer-link">
        <a href="#" class="more-link">poznaj naszą ofertę</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Banner360',
  data() {
    return {
      activeIdx: 0,
      sections: []
    };
  },
  computed: {
    currentSection() {
      return this.sections[this.activeIdx] || {};
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      // Najpierw próbujemy pobrać dane z API PHP
      const apiUrl = '/api/api.php';
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // Timeout 5 sekund
        
        const res = await fetch(apiUrl, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();
        
        // Sprawdzamy czy otrzymaliśmy prawidłowe dane
        if (Array.isArray(data) && data.length > 0) {
          this.sections = data;
          console.log('Dane pobrane z API PHP:', data.length, 'sekcji');
          return;
        } else {
          throw new Error('API zwróciło puste lub nieprawidłowe dane');
        }
      } catch (err) {
        console.warn('API PHP niedostępne, używam fallback do data.json:', err.message);
        
        // Fallback do data.json
        try {
          const fallbackUrl = '/data.json';
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);
          
          const fallbackRes = await fetch(fallbackUrl, {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json'
            }
          });
          
          clearTimeout(timeoutId);
          
          if (!fallbackRes.ok) {
            throw new Error(`HTTP ${fallbackRes.status}: ${fallbackRes.statusText}`);
          }
          
          const fallbackData = await fallbackRes.json();
          
          if (Array.isArray(fallbackData) && fallbackData.length > 0) {
            this.sections = fallbackData;
            console.log('Dane pobrane z fallback (data.json):', fallbackData.length, 'sekcji');
          } else {
            throw new Error('Fallback zwrócił puste lub nieprawidłowe dane');
          }
        } catch (fallbackErr) {
          console.error('Błąd pobierania danych z fallback:', fallbackErr.message);
          this.sections = [];
        }
      }
    }
  }
};
</script>

<style scoped>
/* --- ANIMACJE --- */
.person-switch-enter-active,
.person-switch-leave-active {
  transition: opacity 0.2s ease;
}

.person-switch-enter,
.person-switch-leave-to {
  opacity: 0;
}

.banner-360 {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: #f7f7f9;
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
  position: relative;
}

.square-decor {
  display: none;
  position: absolute;
  top: -4%;
  left: 0;
  transform: translateX(-50%);
  z-index: 0;
  pointer-events: none;
  max-width: 550px;
}

.title-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
  max-width: 320px;
}

.title {
  width: 100%;
  text-align: center;
  font-weight: 900;
  margin-bottom: 24px;
  font-size: 1.5rem;
  order: -1;
}

.person-container {
  display: none;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 1;
}

.person-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center top;
}

.widget-360 {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 340px;
}

.circle-main-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  max-width: 230px;
  margin: 0 auto;
}

.circle-bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.nav-point {
  position: absolute;
  cursor: pointer;
  display: flex;
  align-items: center;
  z-index: 5;
}

.dot {
  width: 32px;
  height: 32px;
  background: #e6e6e6;
  border-radius: 50%;
  transition: background-color 0.3s;
  cursor: pointer;
}

.label {
  position: absolute;
  white-space: nowrap;
  font-weight: bold;
  font-size: 12px;
}

.pos-0 { top: 9.1%; left: 7.7%; }
.pos-0 .label { right: 100%; margin-right: 18px; }
.pos-1 { top: 9.1%; right: 7.7%; }
.pos-1 .label { left: 100%; margin-left: 18px; }
.pos-2 { bottom: 9.1%; right: 7.7%; }
.pos-2 .label { left: 100%; margin-left: 18px; }
.pos-3 { bottom: 9.1%; left: 7.7%; }
.pos-3 .label { right: 100%; margin-right: 18px; }

.content-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 65%;
  height: 75%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.inner-text {
  padding: 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.inner-logo {
  display: block;
  max-width: 70%;
  height: auto;
  margin: 0 auto;
}

.text-below-circle {
  display: block;
  text-align: center;
  padding: 16px 20px;
  width: 100%;
  margin-top: 2rem;
}

.text-below-circle .section-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 8px;
}

.text-below-circle .scroll-description {
  max-height: 258px;
  overflow-y: auto;
  font-size: 12px;
  margin: 0 auto;
}

.text-below-circle .scroll-description::-webkit-scrollbar {
  width: 4px;
}

.text-below-circle .scroll-description::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.scroll-description {
  max-height: 80px;
  overflow-y: auto;
  font-size: 12px;
  color: #181818;
  margin: 5px 0;
}

.scroll-description::-webkit-scrollbar {
  width: 4px;
  text-align: center;
}

.scroll-description::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.inner-text .section-title,
.inner-text .scroll-description {
  display: none;
}

.footer-link {
  text-align: center;
  margin-top: 28px;
  margin-bottom: 8px;
  width: 100%;
}

.more-link {
  font-size: 14px;
  font-weight: 600;
  text-decoration: underline;
  color: #181818;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 8px;
  transition: color 0.3s ease;
}

/* ========== BREAKPOINT 479px ========== */
@media (min-width: 479px) {
  .widget-360 { max-width: 420px; }
  .circle-main-container {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    max-width: 320px;
    margin: 0 auto;
  }
  .title-container { margin-top: 40px; margin-bottom: 40px; max-width: 420px; }
  .title { font-size: 32px; font-weight: 900; text-align: center; }
  .dot { width: 32px; height: 32px; }
  .label { font-size: 13px; }
  .inner-text { padding: 20px; }
  .text-below-circle { margin-top: 1.5rem; }
  .text-below-circle .section-title { font-size: 20px; font-weight: 700; }
  .text-below-circle .scroll-description { font-size: 12px; font-weight: 400; max-width: 324px; }
  .pos-0 .label { margin-right: 20px; }
  .pos-1 .label { margin-left: 20px; }
  .pos-2 .label { margin-left: 20px; }
  .pos-3 .label { margin-right: 20px; }
  .pos-0 { top: 12.9%; }
  .pos-1 { top: 12.9%; }
  .pos-2 { bottom: 12.9%; }
  .pos-3 { bottom: 12.9%; }
}

/* ========== BREAKPOINT 767px ========== */
@media (min-width: 768px) {
  .widget-360 { max-width: 480px; }
  .circle-main-container { max-width: 480px; }
  .title-container { margin-top: 40px; margin-bottom: 40px; max-width: 420px; }
  .title { font-size: 32px; font-weight: 900; text-align: center; }
  .dot { width: 34px; height: 34px; }
  .label { font-size: 14px; }
  .inner-text { padding: 24px; }
  .text-below-circle { margin-top: 3rem; }
  .text-below-circle .section-title { font-size: 20px; font-weight: 700; }
  .text-below-circle .scroll-description { font-size: 12px; font-weight: 400; max-width: 640px; }
  .more-link { font-size: 18px; font-weight: 700; }
  .pos-0 .label { margin-right: 21px; }
  .pos-1 .label { margin-left: 21px; }
  .pos-2 .label { margin-left: 21px; }
  .pos-3 .label { margin-right: 21px; }
  .pos-0 { top: 14.6%; }
  .pos-1 { top: 14.6%; }
  .pos-2 { bottom: 14.9%; }
  .pos-3 { bottom: 14.9%; }
}

/* ========== BREAKPOINT 999px ========== */
@media (min-width: 999px) {
  .text-below-circle { display: none; }
  .widget-360 { max-width: 520px; }
  .circle-main-container { max-width: 520px; }
  .title-container { margin-top: 40px; max-width: 100%; }
  .title { font-size: 44px; margin-bottom: 36px; }
  .dot { width: 36px; height: 36px; }
  .label { font-size: 22px; font-weight: 700; }
  .inner-text { padding: 28px; }
  .scroll-description { max-height: 110px; font-size: 14px; }
  .footer-link { margin-top: 4rem; }
  .more-link { font-size: 20px; font-weight: 700; }
  .pos-0 .label { margin-right: 22px; }
  .pos-1 .label { margin-left: 22px; }
  .pos-2 .label { margin-left: 22px; }
  .pos-3 .label { margin-right: 22px; }
  .pos-2 { bottom: 14.9%; }
  .pos-3 { bottom: 14.9%; }
}

/* ========== BREAKPOINT 1440px ========== */
@media (min-width: 1440px) {
  .text-below-circle { display: none; }
  .footer-link { text-align: left; margin-top: 36px; }
  .square-decor { display: block; }
  .banner-360 {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: center;
    padding: 40px 5%;
    gap: 0;
  }
  .square-decor { top: -4%; max-width: 387px; }
  .title-container { margin-top: 0; max-width: 100%; }
  .title {
    width: 100%;
    height: 62px;
    text-align: center;
    font-size: 48px;
    font-weight: 900;
    margin-bottom: 40px;
    margin-top: 40px;
  }
  .person-container {
    display: block;
    position: relative;
    flex: 0 0 38%;
    max-width: 550px;
    height: 75vh;
    margin-right: 8%;
    margin-top: 0;
    align-self: flex-end;
  }
  .widget-360 { flex: 1; max-width: 580px; margin-left: 0; }
  .circle-main-container { max-width: 500px; width: 100%; margin-left: 0; }
  .content-overlay { width: 68%; height: 68%; }
  .dot { width: 40px; height: 40px; }
  .label { font-size: 22px; font-weight: 700; }
  .inner-text { padding: 32px; }
  .scroll-description { max-height: 130px; font-size: 14px; }
  .more-link { font-size: 22px; font-weight: 700; }
  .pos-0 .label { margin-right: 24px; }
  .pos-1 .label { margin-left: 24px; }
  .pos-2 .label { margin-left: 24px; }
  .pos-3 .label { margin-right: 24px; }
}

@media (min-width: 1441px) {
  .inner-text .section-title,
  .inner-text .scroll-description { display: block; }
  .inner-logo { display: none; }
}

/* ========== BREAKPOINT 1920px ========== */
@media (min-width: 1920px) {
  .banner-360 {
    padding: 50px 8%;
    max-width: 1920px;
    margin: 0 auto;
  }
  .person-container {
    flex: 0 0 40%;
    max-width: 650px;
    height: 100vh;
    margin-right: 8%;
    margin-top: 7%;
  }
  .square-decor { top: -4%; max-width: 550px; }
  .widget-360 { max-width: 784px; }
  .title-container { margin-top: 0; max-width: 100%; }
  .title { font-size: 66px; font-weight: 900; width: 1920px; height: 86px; margin-top: 85px; }
  .circle-main-container { max-width: 784px; }
  .content-overlay { width: 65%; height: 85%; }
  .inner-text { padding: 20px 65px; }
  .section-title { font-size: 26px; font-weight: 700; }
  .scroll-description { max-height: 235px; font-size: 15px; padding-left: 5px; padding-right: 5px; }
  .footer-link { margin-top: 24px; }
  .more-link { font-size: 22px; font-weight: 700; }
  .dot { width: 58px; height: 58px; }
  .label { font-size: 26px; font-weight: 700; }
  .pos-0 .label { margin-right: 20px; }
  .pos-1 .label { margin-left: 20px; }
  .pos-2 .label { margin-left: 20px; }
  .pos-3 .label { margin-right: 20px; }
}
</style>
