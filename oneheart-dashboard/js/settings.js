// 🌍 GLOBAL TRANSLATIONS
const translations = {
  en: {
    settings: "Settings",
    dashboard: "Dashboard",
    language: "Language",
    logout: "Logout",
    events_section: "Events",
    website_section: "Website",
    communication_section: "Communication",
    system_section: "System",
    event_manager: "Event Manager",
    past_events: "Past Events",
    holiday_themes: "Holiday Themes",
    contact_responses: "Contact Responses",
    whatsapp_chat: "WhatsApp Chat",
    search: "Search...",
    "search.placeholder": "Search...",
    "nav.dashboard": "Dashboard",
    "nav.section.events": "Events",
    "nav.eventManager": "Event Manager",
    "nav.pastEvents": "Past Events",
    "nav.section.website": "Website",
    "nav.holidayThemes": "Holiday Themes",
    "nav.section.communication": "Communication",
    "nav.contactResponses": "Contact Responses",
    "nav.whatsappChat": "WhatsApp Chat",
    "nav.section.system": "System",
    "nav.settings": "Settings",
    "brand.name": "ONEHEART",
    "brand.tag": "COMMAND",
    "actions.syncToWebsite": "SYNC TO WEBSITE",
    "actions.syncNow": "SYNC NOW",
    "actions.activateTheme": "Activate Theme",
    "actions.currentlyActive": "Currently Active",
    "action.addEvent": "Add Event",
    "action.featureEvent": "Feature Event",
    "action.sendNotification": "Send Notification",
    "action.apply": "APPLY",
    // Common buttons and UI labels
    "add_event": "Add Event",
    "btn.viewResponses": "View Responses",
    "btn.changeLanguage": "Change Language",
    "btn.send": "Send",
    "btn.delete": "Delete",
    "btn.edit": "Edit",
    "btn.upload": "Upload",
    "btn.addPhotos": "Add Photos",
    "btn.deletePhoto": "Delete Photo",
    "chat.selectContact": "Select a contact",
    "chat.welcome": "Select a contact to start chatting",
    "chat.typeMessage": "Type a message...",
    "chat.search": "Search chats...",
    "chat.status.online": "Online",
    "action.sync": "Sync",
    "status.uploading": "Uploading...",
    "page.dashboard.title": "DASHBOARD",
    "page.dashboard.subtitle": "MASTER CONTROL CENTER",
    "section.quickActions": "QUICK ACTIONS",
    "section.upcomingEvents": "UPCOMING EVENTS",
    "link.viewAll": "View All",
    "status.system": "SYSTEM STATUS:",
    "status.operational": "OPERATIONAL",
    "status.detail": "All systems running smoothly. No critical issues.",
    "metric.unread": "Unread",
    "metric.pending": "Pending",
    "metric.lastSync": "Last Sync",
    "kpi.totalEvents": "TOTAL EVENTS",
    "kpi.contactRequests": "CONTACT REQUESTS",
    "kpi.featuredEvents": "FEATURED EVENTS",
    "kpi.messages": "MESSAGES",
    "kpi.trend.fromLastMonth": "12% from last month",
    "kpi.trend.fromLastWeek": "8% from last week",
    "section.recentInquiries": "RECENT INQUIRIES",
    "badge.new": "NEW",
    "table.from": "From",
    "table.subject": "Subject",
    "table.date": "Date",
    "table.status": "Status",
    "table.action": "Action",
    "badge.unread": "UNREAD",
    "badge.replied": "REPLIED",
    "badge.archived": "ARCHIVED",
    "inquiry.user.johnDoe": "John Doe",
    "inquiry.msg.corporatePackage": "Interested in Corporate Event Package",
    "section.activityFeed": "ACTIVITY FEED",
    "page.contactResponses.title": "CONTACT RESPONSES",
    "page.contactResponses.subtitle": "INBOX FOR WEBSITE FORMS",
    "activity.featuredCreated": "Featured event created",
    "activity.eventUpdated": "Event updated",
    "activity.newContact": "New contact message",
    "activity.fromSarah": "From Sarah Johnson",
    "activity.websiteSynced": "Website synced successfully",
    "activity.allPublished": "All changes published",
    "activity.newUser": "New user added",
    "website.status": "WEBSITE STATUS",
    "website.live": "Your website is live and visible",
    "website.lastSync": "Last Sync: 2 minutes ago",
    "btn.viewDetails": "View Details",
    "btn.uploadCover": "Upload Cover",
    "btn.viewDetailsGallery": "View Details & Gallery",
    "btn.removeCover": "Remove Cover",
    "loading": "Loading...",
    "uploading": "Uploading...",
    "click_to_upload": "Click to upload photos",
    "no_featured_events": "No featured events",
    "no_past_events": "No past events",
    "no_photos_uploaded": "No photos uploaded yet",
    "failed_load_gallery": "Failed to load gallery. Check console.",
    "confirm.delete_photo": "Delete this photo?",
    "failed_delete_photo": "Failed to delete photo",
    "failed_upload_cover": "Failed to upload cover",
    "failed_upload": "Failed to upload file",
    "failed_to_read": "Failed to read file",
    "file_too_large": "File is too large (max 5MB)",
    "holiday_themes": "Holiday Themes",
    "manage_themes": "Manage seasonal website overlays",
    "add_theme": "Add Custom Theme",
    "theme_name": "Theme Name",
    "theme_name_placeholder": "e.g. Spring Festival",
    "category": "Category",
    "icon": "Icon (Emoji)",
    "description": "Description",
    "description_placeholder": "Brief description of the theme...",
    "primary_color": "Primary Color",
    "accent_color": "Accent Color",
    "overlay_effect": "Overlay Effect",
    "overlay_placeholder": "linear-gradient(...)",
    "cancel": "Cancel",
    "save": "Save Theme",
    "failed_to_load_themes": "Failed to load themes",
    "failed_to_update_theme": "Failed to update theme",
    "theme_activated_successfully": "Theme activated",
    "failed_to_save_theme": "Failed to save theme",
    "custom_theme_added_successfully": "Custom theme added",
    "error.fill_required": "Please fill all required fields",
    "error.image_too_large": "Image must be under 5MB",
    "error.title_date_required": "Title and Date are required",
    "status.syncing": "SYNCING...",
    "status.synced": "SYNCED",
    "status.active": "ACTIVE",
    "badge.featured": "⭐ Featured",
    "visibility.public": "Public",
    "visibility.internal": "Internal",
    "no_roles_found": "No roles found. Create one to get started.",
    "error.failed_load_roles": "Failed to load roles",
     // Page
    "page.contactResponses.title": "Contact Responses",
    "page.contactResponses.subtitle": "Inbox for Website Forms",
    
    // Table headers
    "table.from": "From",
    "table.email": "Email",
    "table.date": "Date Received",
    "table.status": "Status",
    "table.actions": "Actions",
    
    // Status badges
    "status.unread": "UNREAD",
    "status.read": "READ",
    
    // Actions
    "action.view": "View message",
    
    // Empty state
    "contact.empty": "No contact messages yet.",
    
    // Modal
    "modal.title": "Message Details",
    "modal.close": "Close",
    "modal.orgName": "Org Name:",
    "modal.email": "Email:",
    "modal.phone": "Phone:",
    "modal.budget": "Budget:",
    "modal.eventDate": "Event Date:",
    "modal.message": "Message:"
  },
  ar: {
    settings: "الإعدادات",
    dashboard: "الرئيسية",
    language: "اللغة",
    logout: "تسجيل الخروج",
    events_section: "الفعاليات",
    website_section: "الموقع",
    communication_section: "التواصل",
    system_section: "النظام",
    event_manager: "إدارة الفعاليات",
    past_events: "الفعاليات السابقة",
    holiday_themes: "المناسبات",
    contact_responses: "الرسائل",
    whatsapp_chat: "واتساب",
    search: "ابحث...",
    "search.placeholder": "ابحث...",
    "nav.dashboard": "الرئيسية",
    "nav.section.events": "الفعاليات",
    "nav.eventManager": "إدارة الفعاليات",
    "nav.pastEvents": "الفعاليات السابقة",
    "nav.section.website": "الموقع",
    "nav.holidayThemes": "المناسبات",
    "nav.section.communication": "التواصل",
    "nav.contactResponses": "الرسائل",
    "nav.whatsappChat": "واتساب",
    "nav.section.system": "النظام",
    "nav.settings": "الإعدادات",
    "brand.name": "ONEHEART",
    "brand.tag": "COMMAND",
    "actions.syncToWebsite": "مزامنة مع الموقع",
    "actions.syncNow": "مزامنة الآن",
    "actions.activateTheme": "تفعيل السمة",
    "actions.currentlyActive": "نشط حاليا",
    "action.addEvent": "إضافة فعالية",
    "action.featureEvent": "تمييز الفعالية",
    "action.sendNotification": "إرسال إشعار",
    "action.apply": "تطبيق",
    // Common buttons and UI labels
    "add_event": "إضافة فعالية",
    "btn.viewResponses": "عرض الردود",
    "btn.changeLanguage": "تغيير اللغة",
    "btn.send": "إرسال",
    "btn.delete": "حذف",
    "btn.edit": "تعديل",
    "btn.upload": "رفع",
    "btn.addPhotos": "إضافة صور",
    "btn.deletePhoto": "حذف الصورة",
    "chat.selectContact": "اختر جهة اتصال",
    "chat.welcome": "اختر جهة اتصال لبدء المحادثة",
    "chat.typeMessage": "اكتب رسالة...",
    "chat.search": "ابحث في المحادثات...",
    "chat.status.online": "متصل",
    "action.sync": "مزامنة",
    "status.uploading": "جارٍ الرفع...",
    "page.dashboard.title": "لوحة التحكم",
    "page.dashboard.subtitle": "مركز التحكم الرئيسي",
    "section.quickActions": "إجراءات سريعة",
    "section.upcomingEvents": "الفعاليات القادمة",
    "link.viewAll": "عرض الكل",
    "status.system": "حالة النظام:",
    "status.operational": "قيد التشغيل",
    "status.detail": "جميع الأنظمة تعمل بسلاسة. لا توجد مشاكل حرجة.",
    "metric.unread": "غير مقروء",
    "metric.pending": "قيد الانتظار",
    "metric.lastSync": "آخر مزامنة",
    "kpi.totalEvents": "إجمالي الفعاليات",
    "kpi.contactRequests": "طلبات التواصل",
    "kpi.featuredEvents": "الفعاليات المميزة",
    "kpi.messages": "الرسائل",
    "kpi.trend.fromLastMonth": "12% منذ الشهر الماضي",
    "kpi.trend.fromLastWeek": "8% منذ الأسبوع الماضي",
    "section.recentInquiries": "الاستفسارات الأخيرة",
    "badge.new": "جديد",
    "table.from": "من",
    "table.subject": "الموضوع",
    "table.date": "التاريخ",
    "table.status": "الحالة",
    "table.action": "الإجراء",
    "badge.unread": "غير مقروء",
    "badge.replied": "تم الرد",
    "badge.archived": "مؤرشف",
    "inquiry.user.johnDoe": "جون دو",
    "inquiry.msg.corporatePackage": "مهتم بحزمة الفعاليات للشركات",
    "section.activityFeed": "سجل النشاط",
    "page.contactResponses.title": "الرسائل",
    "page.contactResponses.subtitle": "صندوق الرسائل من الموقع",
    "activity.featuredCreated": "تم إنشاء فعالية مميزة",
    "activity.eventUpdated": "تم تحديث الفعالية",
    "activity.newContact": "رسالة جديدة",
    "activity.fromSarah": "من سارة جونسون",
    "activity.websiteSynced": "تمت مزامنة الموقع بنجاح",
    "activity.allPublished": "تم نشر جميع التغييرات",
    "activity.newUser": "تم إضافة مستخدم جديد",
    "website.status": "حالة الموقع",
    "website.live": "موقعك مباشر ومرئي",
    "website.lastSync": "آخر مزامنة: منذ دقيقتين",
    "holiday_themes": "المناسبات",
    "manage_themes": "إدارة تراكبات الموقع الموسمية",
    "add_theme": "إضافة سمة مخصصة",
    "theme_name": "اسم السمة",
    "theme_name_placeholder": "مثل Spring Festival",
    "category": "الفئة",
    "icon": "الأيقونة (رمز تعبيري)",
    "description": "الوصف",
    "description_placeholder": "وصف مختصر عن السمة...",
    "primary_color": "اللون الأساسي",
    "accent_color": "لون التمييز",
    "overlay_effect": "تأثير التراكب",
    "overlay_placeholder": "linear-gradient(...)",
    "cancel": "إلغاء",
    "save": "حفظ السمة",
    "failed_to_load_themes": "فشل في تحميل السمات",
    "failed_to_update_theme": "فشل في تحديث السمة",
    "theme_activated_successfully": "تم تفعيل السمة",
    "failed_to_save_theme": "فشل في حفظ السمة",
    "custom_theme_added_successfully": "تمت إضافة السمة المخصصة",
    "error.fill_required": "يرجى ملء جميع الحقول المطلوبة",
    "btn.viewDetails": "عرض التفاصيل",
    "btn.uploadCover": "رفع صورة الغلاف",
    "btn.viewDetailsGallery": "عرض التفاصيل والمعرض",
    "btn.removeCover": "إزالة الغلاف",
    "loading": "جارٍ التحميل...",
    "uploading": "جارٍ الرفع...",
    "click_to_upload": "انقر لرفع الصور",
    "no_featured_events": "لا توجد فعاليات مميزة",
    "no_past_events": "لا توجد فعاليات سابقة",
    "no_photos_uploaded": "لم يتم رفع أي صور بعد",
    "failed_load_gallery": "فشل في تحميل المعرض. تحقق من وحدة التحكم.",
    "confirm.delete_photo": "حذف هذه الصورة؟",
    "failed_delete_photo": "فشل في حذف الصورة",
    "failed_upload_cover": "فشل في رفع صورة الغلاف",
    "failed_upload": "فشل في رفع الملف",
    "failed_to_read": "فشل في قراءة الملف",
    "file_too_large": "حجم الملف كبير جدًا (الحد الأقصى 5 ميغابايت)",
    "error.image_too_large": "يجب أن تكون الصورة أقل من 5 ميغابايت",
    "error.title_date_required": "يجب ملء العنوان والتاريخ",
    "status.syncing": "جارٍ المزامنة...",
    "status.synced": "تمت المزامنة",
    "status.active": "نشط",
    "badge.featured": "⭐ مميز",
    "visibility.public": "عام",
    "visibility.internal": "داخلي",
    "no_roles_found": "لا توجد صلاحيات. أنشئ واحدة للبدء.",
    "error.failed_load_roles": "فشل في تحميل الصلاحيات",
     "page.contactResponses.title": "ردود الاتصال",
    "page.contactResponses.subtitle": "صندوق ورود نماذج الموقع",
    "table.from": "من",
    "table.email": "البريد الإلكتروني",
    "table.date": "تاريخ الاستلام",
    "table.status": "الحالة",
    "table.actions": "الإجراءات",
    "status.unread": "غير مقروء",
    "status.read": "مقروء",
    "action.view": "عرض الرسالة",
    "contact.empty": "لا توجد رسائل اتصال حتى الآن.",
    "modal.title": "تفاصيل الرسالة",
    "modal.close": "إغلاق",
    "modal.orgName": "اسم المؤسسة:",
    "modal.email": "البريد الإلكتروني:",
    "modal.phone": "الهاتف:",
    "modal.budget": "الميزانية:",
    "modal.eventDate": "تاريخ الفعالية:",
    "modal.message": "الرسالة:"
  }
};

// 🌍 APPLY LANGUAGE (GLOBAL)
function applyLanguage(lang) {
  const t = translations[lang] || translations.en;

  // direction
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;

  // text (safe, keeps icons)
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const value = t[key];
    if (!value) return;

    const span = el.querySelector('span');
    if (span) span.textContent = value;
    else el.textContent = value;
  });

  // placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (t[key]) el.placeholder = t[key];
  });
}

// 👤 USER INFO (SAFE)
function setUserInfo() {
  if (!window.currentUser) return;

  const name = window.currentUser.name || window.currentUser.email;
  const role = window.currentUser.role || 'User';

  const nameEl = document.getElementById('headerUserName');
  const roleEl = document.getElementById('headerUserRole');
  const avatar = document.getElementById('headerAvatar');

  if (nameEl) nameEl.textContent = name;
  if (roleEl) roleEl.textContent = role;

  if (avatar && name) {
    avatar.textContent = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}

// ⏳ WAIT FOR USER (OPTIONAL BUT SAFE)
async function waitForUser() {
  let tries = 0;
  while (!window.currentUser && tries < 20) {
    await new Promise(r => setTimeout(r, 50));
    tries++;
  }
}

// 🚀 GLOBAL INIT (RUNS ON ALL PAGES)
document.addEventListener('DOMContentLoaded', async () => {

  // Apply language globally
  const savedLang = localStorage.getItem('lang') || 'en';
  applyLanguage(savedLang);

  // User info (if exists on page)
  await waitForUser();
  setUserInfo();

  // 👇 ONLY runs on settings page (if elements exist)

  const switcher = document.getElementById('languageSwitcher');
  if (switcher) {
    switcher.value = savedLang;

    switcher.addEventListener('change', (e) => {
      const lang = e.target.value;
      localStorage.setItem('lang', lang);
      applyLanguage(lang);
    });
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      if (window.logout) {
        window.logout();
      } else {
        // fallback
        try { localStorage.removeItem('oneheart_session'); } catch(e){}
        window.location.href = '../auth/login.html';
      }
    };
  }

  // Global i18n active
});

// Global helper to fetch translations from other scripts
window.t = function(key) {
  try {
    const lang = localStorage.getItem('lang') || 'en';
    if (translations && translations[lang] && translations[lang][key]) return translations[lang][key];
  } catch (e) {}
  return key;
};

window.currentLang = localStorage.getItem('lang') || 'en';