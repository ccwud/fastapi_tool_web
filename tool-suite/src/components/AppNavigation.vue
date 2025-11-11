<template>
  <nav class="app-navigation">
    <!-- 桌面端导航 -->
    <div class="desktop-nav md:flex hidden">
      <div class="nav-groups">
        <div 
          v-for="group in menuGroups" 
          :key="group.id"
          class="nav-group"
        >
          <!-- 分组标题（仅当有多个分组时显示） -->
          <div v-if="menuGroups.length > 1" class="group-title">
            {{ group.title }}
          </div>
          
          <!-- 菜单项 -->
          <div class="group-items">
            <router-link
              v-for="item in group.items"
              :key="item.id"
              :to="item.route"
              :class="[
                'nav-item',
                { 'nav-item--active': isActiveRoute(item.route) },
                { 'nav-item--disabled': item.disabled }
              ]"
              @click="handleItemClick(item)"
            >
              <el-icon class="nav-item__icon">
                <component :is="item.icon" />
              </el-icon>
              <span class="nav-item__text">{{ item.title }}</span>
              <span v-if="item.badge" class="nav-item__badge">{{ item.badge }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 移动端汉堡菜单按钮 -->
    <!-- 暂时隐藏移动菜单按钮，避免占位与遮挡 -->
    <button
      v-if="false"
      class="mobile-menu-toggle md:hidden flex"
      @click="toggleMobileMenu"
      :aria-label="isMobileMenuOpen ? '关闭菜单' : '打开菜单'"
    >
      <el-icon class="hamburger-icon" :class="{ 'hamburger-icon--active': isMobileMenuOpen }">
        <Menu v-if="!isMobileMenuOpen" />
        <Close v-else />
      </el-icon>
    </button>

    <!-- 移动端侧边栏遮罩 -->
    <transition name="overlay">
      <div
        v-if="isMobileMenuOpen"
        class="mobile-overlay md:hidden"
        @click="closeMobileMenu"
      ></div>
    </transition>

    <!-- 移动端侧边栏菜单 -->
    <transition name="sidebar">
      <div
        v-if="isMobileMenuOpen"
        class="mobile-sidebar md:hidden"
      >
        <div class="sidebar-header">
          <h2 class="sidebar-title">工具导航</h2>
          <button
            class="sidebar-close"
            @click="closeMobileMenu"
            aria-label="关闭菜单"
          >
            <el-icon><Close /></el-icon>
          </button>
        </div>
        
        <div class="sidebar-content">
          <div 
            v-for="group in menuGroups" 
            :key="group.id"
            class="sidebar-group"
          >
            <div v-if="menuGroups.length > 1" class="sidebar-group-title">
              {{ group.title }}
            </div>
            
            <div class="sidebar-group-items">
              <router-link
                v-for="item in group.items"
                :key="item.id"
                :to="item.route"
                :class="[
                  'sidebar-item',
                  { 'sidebar-item--active': isActiveRoute(item.route) },
                  { 'sidebar-item--disabled': item.disabled }
                ]"
                @click="handleMobileItemClick(item)"
              >
                <el-icon class="sidebar-item__icon">
                  <component :is="item.icon" />
                </el-icon>
                <span class="sidebar-item__text">{{ item.title }}</span>
                <span v-if="item.badge" class="sidebar-item__badge">{{ item.badge }}</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  Menu, 
  Close, 
  House, 
  Document, 
  ChatDotRound, 
  Lock, 
  Key, 
  DocumentCopy, 
  DataLine 
} from '@element-plus/icons-vue'

// 响应式状态
const isMobileMenuOpen = ref(false)
const route = useRoute()

// 菜单数据结构 - 按功能分组
const menuGroups = ref([
  {
    id: 'home',
    title: '首页',
    items: [
      { id: 'home', title: '工具首页', icon: 'House', route: '/' }
    ]
  },
  {
    id: 'text-tools',
    title: '文本处理',
    items: [
      { id: 'chinese-converter', title: '简繁体转换', icon: 'Document', route: '/chinese-converter' },
      { id: 'translator', title: '中英文翻译', icon: 'ChatDotRound', route: '/translator' }
    ]
  },
  {
    id: 'format-tools',
    title: '格式转换',
    items: [
      { id: 'json-formatter', title: 'JSON格式化', icon: 'DocumentCopy', route: '/json-formatter' },
      { id: 'markdown-converter', title: 'HTML转Markdown', icon: 'Document', route: '/markdown-converter' },
      { id: 'api-docs-to-markdown', title: 'hoppscotch转markdown', icon: 'Document', route: '/api-docs-to-markdown' },
      { id: 'java-to-json', title: 'Java转JSON', icon: 'DocumentCopy', route: '/java-to-json' },
      { id: 'sql-compressor', title: 'SQL压缩', icon: 'DataLine', route: '/sql-compressor' }
    ]
  },
  {
    id: 'encode-tools', 
    title: '编码解码',
    items: [
      { id: 'unicode-converter', title: 'Unicode转换', icon: 'Key', route: '/unicode-converter' },
      { id: 'des-encryption', title: 'DES加解密', icon: 'Lock', route: '/des-encryption' }
    ]
  }
])

// 计算属性
const isActiveRoute = (routePath) => {
  return route.path === routePath
}

// 方法
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleItemClick = (item) => {
  if (item.disabled) {
    return
  }
  // 可以在这里添加点击统计或其他逻辑
}

const handleMobileItemClick = (item) => {
  if (item.disabled) {
    return
  }
  // 移动端点击后关闭菜单
  closeMobileMenu()
}

// 监听 ESC 键关闭移动菜单
const handleEscKey = (event) => {
  if (event.key === 'Escape' && isMobileMenuOpen.value) {
    closeMobileMenu()
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('keydown', handleEscKey)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
})

// 暴露方法给父组件
defineExpose({
  closeMobileMenu
})
</script>

<style scoped>
/* 导航容器 */
.app-navigation {
  display: flex;
  align-items: center;
  flex: 1;
}

/* 桌面端导航 */
.desktop-nav {
  flex: 0 1 auto;
  justify-content: flex-start;
}

.nav-groups {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.nav-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
}

.group-title {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.group-items {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

/* 导航项样式 */
.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-lg);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  text-decoration: none;
  transition: var(--transition-bounce);
  position: relative;
  white-space: nowrap;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(24, 144, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.nav-item:hover::before {
  left: 100%;
}

.nav-item:hover {
  background-color: var(--bg-hover);
  color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.nav-item--active {
  background: linear-gradient(135deg, var(--bg-active), rgba(24, 144, 255, 0.05));
  color: var(--primary-color);
  font-weight: var(--font-weight-semibold);
  box-shadow: var(--shadow-sm);
}

.nav-item--active::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--primary-hover));
  border-radius: var(--radius-full);
  animation: activeIndicator 0.3s ease-out;
}

@keyframes activeIndicator {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 24px;
    opacity: 1;
  }
}

.nav-item--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.nav-item__icon {
  font-size: 16px;
  flex-shrink: 0;
}

.nav-item__text {
  flex: 1;
}

.nav-item__badge {
  background-color: var(--danger-color);
  color: var(--text-white);
  font-size: var(--font-size-xs);
  padding: 2px 6px;
  border-radius: var(--radius-full);
  min-width: 18px;
  text-align: center;
  line-height: 1;
}

/* 移动端汉堡菜单按钮 */
.mobile-menu-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  transition: var(--transition-normal);
}

.mobile-menu-toggle:hover {
  background-color: var(--bg-hover);
  color: var(--primary-color);
}

.hamburger-icon {
  font-size: 24px;
  transition: var(--transition-normal);
}

.hamburger-icon--active {
  transform: rotate(180deg);
}

/* 移动端遮罩 */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* 移动端侧边栏 */
.mobile-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 320px;
  background: linear-gradient(180deg, var(--bg-primary) 0%, rgba(250, 250, 250, 0.98) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: var(--shadow-xl);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--border-color);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg);
  border-bottom: 1px solid var(--border-color);
}

.sidebar-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
}

.sidebar-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-xs);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  transition: var(--transition-fast);
}

.sidebar-close:hover {
  background-color: var(--bg-hover);
  color: var(--primary-color);
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-md);
}

.sidebar-group {
  margin-bottom: var(--space-lg);
}

.sidebar-group:last-child {
  margin-bottom: 0;
}

.sidebar-group-title {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--space-sm);
  padding: 0 var(--space-sm);
}

.sidebar-group-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

/* 侧边栏菜单项 */
.sidebar-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  text-decoration: none;
  transition: var(--transition-fast);
  position: relative;
  margin: 0 var(--space-xs);
}

.sidebar-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  background-color: var(--primary-color);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  transition: all var(--transition-fast);
}

.sidebar-item:hover::before {
  width: 4px;
  height: 60%;
}

.sidebar-item:hover {
  background-color: var(--bg-hover);
  color: var(--primary-color);
  transform: translateX(4px);
}

.sidebar-item--active {
  background: linear-gradient(135deg, var(--bg-active), rgba(24, 144, 255, 0.08));
  color: var(--primary-color);
  font-weight: var(--font-weight-semibold);
  transform: translateX(4px);
}

.sidebar-item--active::before {
  width: 4px;
  height: 80%;
  background: linear-gradient(180deg, var(--primary-color), var(--primary-hover));
}

.sidebar-item--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.sidebar-item__icon {
  font-size: 18px;
  flex-shrink: 0;
}

.sidebar-item__text {
  flex: 1;
}

.sidebar-item__badge {
  background-color: var(--danger-color);
  color: var(--text-white);
  font-size: var(--font-size-xs);
  padding: 2px 6px;
  border-radius: var(--radius-full);
  min-width: 18px;
  text-align: center;
  line-height: 1;
}

/* 动画效果 */
.overlay-enter-active, .overlay-leave-active {
  transition: opacity var(--transition-normal);
}

.overlay-enter-from, .overlay-leave-to {
  opacity: 0;
}

.sidebar-enter-active {
  transition: all var(--transition-bounce);
}

.sidebar-leave-active {
  transition: all var(--transition-normal);
}

.sidebar-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.sidebar-leave-to {
  transform: translateX(100%);
  opacity: 0.8;
}

/* 菜单项动画 */
.nav-item {
  animation: slideInDown 0.6s ease-out;
  animation-fill-mode: both;
}

.nav-item:nth-child(1) { animation-delay: 0.1s; }
.nav-item:nth-child(2) { animation-delay: 0.2s; }
.nav-item:nth-child(3) { animation-delay: 0.3s; }
.nav-item:nth-child(4) { animation-delay: 0.4s; }
.nav-item:nth-child(5) { animation-delay: 0.5s; }
.nav-item:nth-child(6) { animation-delay: 0.6s; }
.nav-item:nth-child(7) { animation-delay: 0.7s; }
.nav-item:nth-child(8) { animation-delay: 0.8s; }
.nav-item:nth-child(9) { animation-delay: 0.9s; }

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 侧边栏菜单项动画 */
.sidebar-item {
  animation: slideInRight 0.4s ease-out;
  animation-fill-mode: both;
}

.sidebar-item:nth-child(1) { animation-delay: 0.1s; }
.sidebar-item:nth-child(2) { animation-delay: 0.15s; }
.sidebar-item:nth-child(3) { animation-delay: 0.2s; }
.sidebar-item:nth-child(4) { animation-delay: 0.25s; }
.sidebar-item:nth-child(5) { animation-delay: 0.3s; }
.sidebar-item:nth-child(6) { animation-delay: 0.35s; }
.sidebar-item:nth-child(7) { animation-delay: 0.4s; }
.sidebar-item:nth-child(8) { animation-delay: 0.45s; }
.sidebar-item:nth-child(9) { animation-delay: 0.5s; }

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 汉堡菜单按钮动画 */
.hamburger-icon {
  transition: transform var(--transition-normal), color var(--transition-fast);
}

.hamburger-icon--active {
  transform: rotate(90deg) scale(1.1);
}

/* 响应式增强动画 */
@media (prefers-reduced-motion: reduce) {
  .nav-item,
  .sidebar-item {
    animation: none;
  }
  
  .hamburger-icon,
  .nav-item,
  .sidebar-item {
    transition: none;
  }
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .nav-groups {
    gap: var(--space-lg);
  }
  
  .group-items {
    gap: var(--space-xs);
  }
  
  .nav-item {
    padding: var(--space-xs) var(--space-sm);
    font-size: var(--font-size-xs);
  }
}

@media (max-width: 380px) {
  .mobile-sidebar {
    width: 100vw;
  }
}
</style>