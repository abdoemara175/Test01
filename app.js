/* ==========================================================================
   PIXEL COMMUNITY - JAVASCRIPT APPLICATION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // Initial Mock Data
  const initialPosts = [
    {
      id: 1,
      author: 'عمر الخولي',
      avatar: 'ع',
      category: 'uiux',
      categoryLabel: 'UI/UX Design',
      badgeClass: 'badge-purple',
      time: 'منذ ساعتين',
      title: 'كيف تبني نظام ألوان إمكانيات الوصول (WCAG 2.2) بدون التضحية بالجماليات؟',
      excerpt: 'في التحديثات الأخيرة لتطبيقات الهواتف، أصبح تباين الألوان جزءاً أساسياً من تجربة المستخدم. مشاركة بعض النصائح والتوليفات البرمجية لتصميم ثيمات داكنة جذابة ومقروءة.',
      likes: 34,
      comments: 12
    },
    {
      id: 2,
      author: 'سارة المهندس',
      avatar: 'س',
      category: 'frontend',
      categoryLabel: 'Frontend Dev',
      badgeClass: 'badge-cyan',
      time: 'منذ 5 ساعات',
      title: 'مقارنة بين CSS Container Queries و Media Queries لربط المكونات',
      excerpt: 'استخدام الحاويات الحاوية (Container Queries) يتيح استجابة العنصر حسب حجم حاويته وليس حجم الشاشة فقط. تجربة عملية واستعراض لحالات الاستخدام.',
      likes: 58,
      comments: 19
    },
    {
      id: 3,
      author: 'أحمد عمارة',
      avatar: 'أ',
      category: 'feedback',
      categoryLabel: 'طلب نقد (Feedback)',
      badgeClass: 'badge-pink',
      time: 'منذ يوم واحد',
      title: 'نقد واجهة منصة تعلم تفاعلية جديدة مستوحاة من Pixel Theme',
      excerpt: 'أعمل حالياً على إعادة تصميم واجهة المستخدم لمنصة تعليمية. أرجو مشاركتي ملاحظاتكم حول اختيار الخطوط وتوزيع العناصر البصرية.',
      likes: 42,
      comments: 27
    }
  ];

  const showcaseData = [
    { title: 'Neon Glass Dashboard UI', author: 'أحمد عمارة', likes: 142, icon: 'fa-chart-pie' },
    { title: 'Mobile Banking App Micro-interactions', author: 'مريم طارق', likes: 98, icon: 'fa-mobile-screen-button' },
    { title: 'AI Code Assistant Interface Concept', author: 'كريم حسن', likes: 115, icon: 'fa-brain' }
  ];

  const eventsData = [
    { title: 'ورشة عمل: بناء Design System متكامل بـ Figma', date: 'الخميس 15 أغسطس | 8:00 مساءً', speaker: 'المهندسة دينا عصام' },
    { title: 'لقاء مفتوح: أسرار تحسين أداء تطبيقات React 19', date: 'الإثنين 20 أغسطس | 9:00 مساءً', speaker: 'المهندس ياسر فؤاد' }
  ];

  const leaderboardData = [
    { rank: 1, name: 'عبد الرحمن عمارة', points: '1,850 نقطة', badge: 'rank-1' },
    { rank: 2, name: 'سارة المهندس', points: '1,420 نقطة', badge: 'rank-2' },
    { rank: 3, name: 'محمد فاروق', points: '1,190 نقطة', badge: 'rank-3' },
    { rank: 4, name: 'آية محمود', points: '980 نقطة', badge: '' }
  ];

  let postsState = [...initialPosts];
  let activeCategory = 'all';

  // DOM Elements
  const discussionsContainer = document.getElementById('discussions-container');
  const showcaseContainer = document.getElementById('showcase-container');
  const eventsContainer = document.getElementById('events-container');
  const leaderboardContainer = document.getElementById('leaderboard-container');
  
  const navLinks = document.querySelectorAll('.nav-link');
  const contentTabs = document.querySelectorAll('.content-tab');
  const categoryChips = document.querySelectorAll('.chip');
  const globalSearchInput = document.getElementById('global-search-input');
  
  const postModal = document.getElementById('post-modal');
  const openPostModalBtn = document.getElementById('open-post-modal-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const cancelPostBtn = document.getElementById('cancel-post-btn');
  const createPostForm = document.getElementById('create-post-form');
  const toastContainer = document.getElementById('toast-container');

  // Render Discussions Feed
  function renderPosts(postsToRender) {
    if (!discussionsContainer) return;
    
    if (postsToRender.length === 0) {
      discussionsContainer.innerHTML = `
        <div class="glass-card post-card" style="text-align: center; padding: 3rem;">
          <i class="fa-solid fa-folder-open" style="font-size: 3rem; color: var(--text-dim); margin-bottom: 1rem;"></i>
          <h3>لا توجد منشورات مطابقة للبحث</h3>
          <p style="color: var(--text-muted);">جرب البحث بتصنيف آخر أو كلمة مفتاحية مختلفة.</p>
        </div>
      `;
      return;
    }

    discussionsContainer.innerHTML = postsToRender.map(post => `
      <article class="glass-card post-card" data-id="${post.id}">
        <div class="post-header">
          <div class="user-info">
            <div class="user-avatar">${post.avatar}</div>
            <div class="user-details">
              <h4>${post.author}</h4>
              <span class="post-time">${post.time}</span>
            </div>
          </div>
          <span class="badge ${post.badgeClass}">${post.categoryLabel}</span>
        </div>
        <h3 class="post-title">${post.title}</h3>
        <p class="post-excerpt">${post.excerpt}</p>
        <div class="post-footer">
          <button class="action-btn like-btn ${post.liked ? 'liked' : ''}" onclick="toggleLike(${post.id})">
            <i class="${post.liked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
            <span>${post.likes}</span>
          </button>
          <button class="action-btn">
            <i class="fa-regular fa-comment"></i>
            <span>${post.comments} تعليق</span>
          </button>
          <button class="action-btn" onclick="sharePost('${post.title}')">
            <i class="fa-regular fa-share-from-square"></i>
            <span>مشاركة</span>
          </button>
        </div>
      </article>
    `).join('');
  }

  // Render Showcase Grid
  function renderShowcase() {
    if (!showcaseContainer) return;
    showcaseContainer.innerHTML = showcaseData.map(item => `
      <div class="glass-card showcase-card">
        <div class="showcase-img">
          <i class="fa-solid ${item.icon}"></i>
        </div>
        <div class="showcase-body">
          <h3 style="font-size: 1.1rem; margin-bottom: 0.4rem;">${item.title}</h3>
          <div style="display: flex; justify-content: space-between; align-items: center; color: var(--text-muted); font-size: 0.85rem;">
            <span>بواسطة ${item.author}</span>
            <span><i class="fa-solid fa-heart text-pink" style="color: var(--accent-pink);"></i> ${item.likes}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Render Events Grid
  function renderEvents() {
    if (!eventsContainer) return;
    eventsContainer.innerHTML = eventsData.map(ev => `
      <div class="glass-card event-card">
        <div>
          <span class="event-date"><i class="fa-regular fa-clock"></i> ${ev.date}</span>
          <h3 style="margin: 0.5rem 0 0.75rem; font-size: 1.15rem;">${ev.title}</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem;"><i class="fa-solid fa-user-tie"></i> المحاضر: ${ev.speaker}</p>
        </div>
        <button class="btn btn-secondary btn-sm" style="margin-top: 1.25rem;" onclick="showToast('تم التسجيل في الفعالية بنجاح!')">
          <i class="fa-solid fa-ticket"></i> حجز مقعد
        </button>
      </div>
    `).join('');
  }

  // Render Leaderboard
  function renderLeaderboard() {
    if (!leaderboardContainer) return;
    leaderboardContainer.innerHTML = `
      <table class="leaderboard-table">
        <thead>
          <tr>
            <th>المركز</th>
            <th>العضو</th>
            <th>نقاط التفاعل</th>
          </tr>
        </thead>
        <tbody>
          ${leaderboardData.map(row => `
            <tr>
              <td><span class="rank-badge ${row.badge}">${row.rank}</span></td>
              <td style="font-weight: 600;">${row.name}</td>
              <td style="color: var(--primary-glow); font-weight: 700;">${row.points}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  // Like Toggle Function
  window.toggleLike = function(id) {
    const post = postsState.find(p => p.id === id);
    if (post) {
      if (post.liked) {
        post.likes--;
        post.liked = false;
      } else {
        post.likes++;
        post.liked = true;
        showToast('تمت إعجاب بالمنشور');
      }
      filterAndRenderPosts();
    }
  };

  // Share Post Function
  window.sharePost = function(title) {
    if (navigator.share) {
      navigator.share({ title: title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('تم نسخ رابط المنشور بنجاح!');
    }
  };

  // Toast Notification Utility
  window.showToast = function(msg) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--primary-glow);"></i> <span>${msg}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3500);
  };

  // Tab Navigation Switching
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = link.getAttribute('data-tab');

      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      contentTabs.forEach(tab => {
        if (tab.id === `tab-${targetTab}`) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });
    });
  });

  // Category Filtering
  categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      categoryChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.getAttribute('data-category');
      filterAndRenderPosts();
    });
  });

  // Global Search Filter
  if (globalSearchInput) {
    globalSearchInput.addEventListener('input', () => {
      filterAndRenderPosts();
    });
  }

  function filterAndRenderPosts() {
    const query = globalSearchInput ? globalSearchInput.value.toLowerCase().trim() : '';
    const filtered = postsState.filter(post => {
      const matchCat = activeCategory === 'all' || post.category === activeCategory;
      const matchSearch = post.title.toLowerCase().includes(query) || post.excerpt.toLowerCase().includes(query);
      return matchCat && matchSearch;
    });
    renderPosts(filtered);
  }

  // Modal Handlers
  if (openPostModalBtn) openPostModalBtn.addEventListener('click', () => postModal.classList.add('active'));
  if (closeModalBtn) closeModalBtn.addEventListener('click', () => postModal.classList.remove('active'));
  if (cancelPostBtn) cancelPostBtn.addEventListener('click', () => postModal.classList.remove('active'));

  if (createPostForm) {
    createPostForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('post-title').value;
      const category = document.getElementById('post-category').value;
      const content = document.getElementById('post-content').value;

      const categoryLabels = {
        uiux: 'UI/UX Design',
        frontend: 'Frontend Dev',
        feedback: 'طلب نقد (Feedback)',
        tools: 'أدوات وتقنيات'
      };

      const categoryBadges = {
        uiux: 'badge-purple',
        frontend: 'badge-cyan',
        feedback: 'badge-pink',
        tools: 'badge-orange'
      };

      const newPost = {
        id: Date.now(),
        author: 'عبد الرحمن عمارة',
        avatar: 'ع',
        category: category,
        categoryLabel: categoryLabels[category] || category,
        badgeClass: categoryBadges[category] || 'badge-purple',
        time: 'الآن',
        title: title,
        excerpt: content,
        likes: 0,
        comments: 0
      };

      postsState.unshift(newPost);
      filterAndRenderPosts();
      createPostForm.reset();
      postModal.classList.remove('active');
      showToast('تم نشر موضوعك بنجاح في المجتمـع!');
    });
  }

  // Initial Executions
  renderPosts(postsState);
  renderShowcase();
  renderEvents();
  renderLeaderboard();
});
