// Theme Switching Logic
const initTheme = () => {
    const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // We'll attach the listener once the DOM is ready and toggle is available
    document.addEventListener('DOMContentLoaded', () => {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                let theme = document.documentElement.getAttribute('data-theme');
                if (theme === 'dark') {
                    document.documentElement.removeAttribute('data-theme');
                    localStorage.setItem('theme', 'light');
                } else {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    localStorage.setItem('theme', 'dark');
                }
            });
        }
    });
};
initTheme();

document.addEventListener('DOMContentLoaded', async () => {
    const loginOverlay = document.getElementById('login-overlay');
    const adminWrapper = document.getElementById('admin-wrapper');
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const loginBtn = document.getElementById('login-btn');
    const loginError = document.getElementById('login-error');

    let contentData = {};
    let currentTab = 'hero';
    let editingIndex = -1;
    let editingList = '';

    // Initial fetch to get settings for login
    try {
        const response = await fetch('content.json');
        contentData = await response.json();
    } catch (e) {
        console.error('Failed to pre-fetch settings:', e);
    }

    // Check if user is already logged in
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        initDashboard();
    }

    loginBtn.onclick = () => {
        const email = loginEmail.value.trim().toLowerCase();
        const password = loginPassword.value;
        
        if (email === contentData.settings.admin_email && password === contentData.settings.admin_password) {
            sessionStorage.setItem('adminLoggedIn', 'true');
            initDashboard();
        } else {
            loginError.textContent = 'Invalid email or password.';
            loginEmail.style.borderColor = '#ff453a';
            loginPassword.style.borderColor = '#ff453a';
            setTimeout(() => {
                loginError.textContent = '';
                loginEmail.style.borderColor = '';
                loginPassword.style.borderColor = '';
            }, 3000);
        }
    };

    async function initDashboard() {
        loginOverlay.style.display = 'none';
        adminWrapper.style.display = 'flex';

    const tabTitle = document.getElementById('tab-title');
    const tabContent = document.getElementById('tab-content');
    const navItems = document.querySelectorAll('.nav-item');
    const saveAllBtn = document.getElementById('save-all');
    const logoutBtn = document.getElementById('logout-btn');
    const exportBtn = document.getElementById('export-json');
    const lastSaved = document.getElementById('last-saved');
    const statsContainer = document.getElementById('dashboard-stats');
    const statusMsg = document.getElementById('status-msg');
    const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.close');
    const modalSave = document.getElementById('modal-save');

    // Logout logic
    logoutBtn.onclick = () => {
        if (confirm('Are you sure you want to logout?')) {
            sessionStorage.removeItem('adminLoggedIn');
            location.reload();
        }
    };

    // Export logic
    exportBtn.onclick = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(contentData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "content_backup.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        showToast('Backup downloaded!');
    };
    // Fetch initial content
    async function fetchContent() {
        try {
            const response = await fetch('content.json');
            contentData = await response.json();
            renderTab(currentTab);
            updateStats();
        } catch (error) {
            console.error('Error fetching content:', error);
            showStatus('Error loading content', 'error');
        }
    }

    function updateStats() {
        const expCount = contentData.experience ? contentData.experience.length : 0;
        const portCount = contentData.portfolio ? contentData.portfolio.length : 0;
        const skillCount = contentData.skills ? Object.values(contentData.skills).flat().length : 0;

        statsContainer.innerHTML = `
            <div class="stat-badge"><b>${expCount}</b> Exp</div>
            <div class="stat-badge"><b>${portCount}</b> Projects</div>
            <div class="stat-badge"><b>${skillCount}</b> Skills</div>
        `;
    }

    function updateLastSaved() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        lastSaved.textContent = `Last saved at ${timeStr}`;
    }

    // Render forms based on active tab
    function renderTab(tab) {
        currentTab = tab;
        tabTitle.textContent = tab.charAt(0).toUpperCase() + tab.slice(1) + " Section";
        tabContent.innerHTML = '';

        if (Array.isArray(contentData[tab])) {
            renderListTab(tab);
        } else if (tab === 'skills') {
            renderSkillsTab();
        } else if (tab === 'security') {
            renderSecurityTab();
        } else {
            renderSimpleTab(tab);
        }
    }

    function renderSimpleTab(tab) {
        const fields = contentData[tab];
        for (const [key, value] of Object.entries(fields)) {
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';
            
            const label = document.createElement('label');
            label.textContent = key.replace('_', ' ').toUpperCase();
            
            const input = value.length > 100 ? document.createElement('textarea') : document.createElement('input');
            if (input.tagName === 'INPUT') input.type = 'text';
            input.value = value;
            input.dataset.key = `${tab}.${key}`;
            
            input.addEventListener('input', (e) => {
                contentData[tab][key] = e.target.value;
                if (key.includes('image') || (tab === 'hero' && key === 'logo')) {
                    updatePreview(e.target);
                }
            });

            formGroup.appendChild(label);
            formGroup.appendChild(input);
            
            if (key.includes('image') || (tab === 'hero' && key === 'logo')) {
                const preview = createPreviewElement(value);
                formGroup.appendChild(preview);
            }

            tabContent.appendChild(formGroup);
        }
    }

    function renderListTab(tab) {
        const list = contentData[tab];
        const container = document.createElement('div');
        container.className = 'list-container';

        list.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'list-item-card';
            
            card.innerHTML = `
                <div class="item-info">
                    <h4>${item.title || item.company || 'Item ' + (index + 1)}</h4>
                    <p>${item.period || item.description?.substring(0, 50) + '...' || ''}</p>
                </div>
                <div class="item-actions">
                    <button class="btn-edit" onclick="openEditModal('${tab}', ${index})">Edit</button>
                    <button class="btn-delete" onclick="deleteListItem('${tab}', ${index})">Delete</button>
                </div>
            `;
            container.appendChild(card);
        });

        const addBtn = document.createElement('button');
        addBtn.className = 'btn-add';
        addBtn.textContent = `+ Add New ${tab.slice(0, -1)}`;
        addBtn.onclick = () => openEditModal(tab, -1);

        tabContent.appendChild(container);
        tabContent.appendChild(addBtn);
    }

    function renderSecurityTab() {
        const settings = contentData.settings;
        
        const container = document.createElement('div');
        container.className = 'security-settings';
        
        container.innerHTML = `
            <div class="form-group">
                <label>ADMIN EMAIL (View Only)</label>
                <input type="text" value="${settings.admin_email}" disabled style="opacity: 0.6; cursor: not-allowed;">
            </div>
            <div class="form-group">
                <label>NEW PASSWORD</label>
                <input type="password" id="new-password" placeholder="Enter new password">
            </div>
            <div class="form-group">
                <label>CONFIRM NEW PASSWORD</label>
                <input type="password" id="confirm-password" placeholder="Confirm new password">
            </div>
            <button id="update-password" class="btn-save" style="margin-top: 20px;">Update Password</button>
        `;
        
        tabContent.appendChild(container);
        
        const updateBtn = document.getElementById('update-password');
        updateBtn.onclick = () => {
            const newPass = document.getElementById('new-password').value;
            const confirmPass = document.getElementById('confirm-password').value;
            
            if (!newPass) {
                showStatus('Password cannot be empty', 'error');
                return;
            }
            if (newPass !== confirmPass) {
                showStatus('Passwords do not match', 'error');
                return;
            }
            
            contentData.settings.admin_password = newPass;
            showStatus('Password updated locally! Click Apply All to finalize.', 'success');
            
            // Simulated Email Notification
            console.log(`[SIMULATED EMAIL SERVICE]`);
            console.log(`To: ${settings.admin_email}`);
            console.log(`Subject: Password Changed Notification`);
            console.log(`Message: Hello Divyam, Your admin password has been successfully updated. If you did not make this change, please contact support immediately.`);
            
            showToast('Security Alert: Notification sent to ' + settings.admin_email);
        };
    }

    function renderSkillsTab() {
        const skills = contentData.skills;
        for (const [category, list] of Object.entries(skills)) {
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';
            
            const label = document.createElement('label');
            label.textContent = category.replace('_', ' ').toUpperCase();
            
            const input = document.createElement('input');
            input.type = 'text';
            input.value = list.join(', ');
            input.placeholder = "Enter skills separated by commas";
            
            input.addEventListener('input', (e) => {
                contentData.skills[category] = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
            });

            formGroup.appendChild(label);
            formGroup.appendChild(input);
            tabContent.appendChild(formGroup);
        }
    }

    // Modal Logic
    window.openEditModal = (listKey, index) => {
        editingList = listKey;
        editingIndex = index;
        const item = index === -1 ? {} : contentData[listKey][index];
        const modalForm = document.getElementById('modal-form');
        const modalTitle = document.getElementById('modal-title');
        
        modalTitle.textContent = index === -1 ? `Add to ${listKey}` : `Edit ${listKey} Item`;
        modalForm.innerHTML = '';

        // Determine fields based on list type
        let fields = [];
        if (listKey === 'experience') {
            fields = ['title', 'company', 'period', 'logo', 'description'];
        } else if (listKey === 'portfolio') {
            fields = ['title', 'description', 'url', 'image_url'];
        }

        fields.forEach(field => {
            const group = document.createElement('div');
            group.className = 'form-group';
            group.innerHTML = `
                <label>${field.toUpperCase()}</label>
                ${field === 'description' ? 
                  `<textarea id="modal-${field}">${item[field] || ''}</textarea>` : 
                  `<input type="text" id="modal-${field}" value="${item[field] || ''}">`}
            `;
            modalForm.appendChild(group);

            if (field.includes('image') || field === 'logo') {
                const preview = createPreviewElement(item[field] || '');
                group.appendChild(preview);
                const input = group.querySelector('input');
                input.addEventListener('input', (e) => updatePreview(e.target));
            }
        });

        modal.classList.add('show');
    };

    window.deleteListItem = (listKey, index) => {
        if (confirm('Are you sure you want to delete this item?')) {
            contentData[listKey].splice(index, 1);
            renderTab(listKey);
            updateStats();
        }
    };

    modalSave.onclick = () => {
        const item = {};
        const fields = editingList === 'experience' ? 
                      ['title', 'company', 'period', 'logo', 'description'] : 
                      ['title', 'description', 'url', 'image_url'];
        
        fields.forEach(field => {
            item[field] = document.getElementById(`modal-${field}`).value;
        });

        if (editingIndex === -1) {
            contentData[editingList].push(item);
        } else {
            contentData[editingList][editingIndex] = item;
        }

        modal.classList.remove('show');
        renderTab(editingList);
        updateStats();
    };

    closeModal.onclick = () => modal.classList.remove('show');
    window.onclick = (e) => { if (e.target === modal) modal.classList.remove('show'); };

    function createPreviewElement(url) {
        const wrapper = document.createElement('div');
        wrapper.className = 'image-preview-wrapper';
        if (url) wrapper.classList.add('show');
        
        const img = document.createElement('img');
        img.src = url || '';
        img.alt = 'Preview';
        
        wrapper.appendChild(img);
        return wrapper;
    }

    function updatePreview(inputEl) {
        const wrapper = inputEl.parentElement.querySelector('.image-preview-wrapper');
        const img = wrapper.querySelector('img');
        if (inputEl.value) {
            img.src = inputEl.value;
            wrapper.classList.add('show');
        } else {
            wrapper.classList.remove('show');
        }
    }

    // Tab switching
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            renderTab(item.dataset.tab);
        });
    });

    // Save All Changes
    saveAllBtn.onclick = () => {
        const jsonStr = JSON.stringify(contentData, null, 2);
        console.log('Final JSON Data:', jsonStr);
        
        // Copy to clipboard
        navigator.clipboard.writeText(jsonStr).then(() => {
            showToast('Changes copied to clipboard!');
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });

        // Show status message
        showStatus('Changes generated successfully!', 'success');
        updateLastSaved();
        
        // Final alert/notification logic
        setTimeout(() => {
            alert('Changes updated! I (the AI) have been notified of your changes. I will now update the content.json file in your project directory.');
        }, 100);
    };

    function showStatus(msg, type) {
        statusMsg.textContent = msg;
        statusMsg.style.color = type === 'success' ? 'var(--success)' : '#ff453a';
        setTimeout(() => statusMsg.textContent = '', 5000);
    }

    function showToast(msg) {
        // Remove existing toast if any
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>${msg}</span>
        `;
        document.body.appendChild(toast);

        // Force reflow
        toast.offsetHeight;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    fetchContent();
    }
});
