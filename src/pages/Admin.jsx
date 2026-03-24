import React, { useState, useEffect } from 'react';
import Login from '../components/Login';
import './Admin.css';
import { LogOut, Save, Download, Eye, Plus, Trash2, Edit } from 'lucide-react';

const Admin = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [content, setContent] = useState(null);
  const [currentTab, setCurrentTab] = useState('hero');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        setContent(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        showStatus('error', 'Failed to load content from database.');
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    if (content?.settings?.template) {
      document.body.className = content.settings.template;
    }
  }, [content?.settings?.template]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const showStatus = (type, msg) => {
    setStatus({ type, msg });
    setTimeout(() => setStatus({ type: '', msg: '' }), 5000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });
      if (!res.ok) throw new Error("Failed to save");
      showStatus('success', 'Changes saved successfully to database!');
    } catch (err) {
      showStatus('error', 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (section, field, value) => {
    setContent({
      ...content,
      [section]: {
        ...content[section],
        [field]: value
      }
    });
  };

  const updateListItem = (section, index, field, value) => {
    const newList = [...content[section]];
    newList[index] = { ...newList[index], [field]: value };
    setContent({ ...content, [section]: newList });
  };

  const addListItem = (section, template) => {
    setContent({
      ...content,
      [section]: [...content[section], template]
    });
  };

  const deleteListItem = (section, index) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const newList = content[section].filter((_, i) => i !== index);
      setContent({ ...content, [section]: newList });
    }
  };

  const updatePassword = async (newPassword) => {
    const updatedContent = { ...content, settings: { ...content.settings, admin_password: newPassword } };
    setContent(updatedContent);
    showStatus('success', 'Password updated locally! Please export JSON.');
  };

  if (!token) return <Login onLogin={setToken} />;
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px' }}>Loading...</div>;
  if (!content) return <div>Error loading content.</div>;

  return (
    <div className="admin-wrapper">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Dashboard</h2>
        </div>
        <nav className="sidebar-nav">
          {['hero', 'about', 'experience', 'portfolio', 'skills', 'contact', 'settings'].map(tab => (
            <button 
              key={tab}
              className={`nav-item ${currentTab === tab ? 'active' : ''}`}
              onClick={() => setCurrentTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="btn-export" onClick={() => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(content, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "content_backup.json");
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
          }}>
            <Download size={16} /> Export JSON
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <main className="content-area">
        <div className="top-bar">
          <div>
            <h1>{currentTab.charAt(0).toUpperCase() + currentTab.slice(1)} Settings</h1>
            <div className="dashboard-stats">
              <span className="stat-badge"><b>{content.experience.length}</b> Exp</span>
              <span className="stat-badge"><b>{content.portfolio.length}</b> Projects</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="/" target="_blank" className="btn-preview"><Eye size={16} /> Preview</a>
            <button className="btn-save" onClick={handleSave} disabled={saving}>
              <Save size={16} /> {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </div>

        <div className="tab-content" style={{ margin: '48px' }}>
          {status.msg && <div className={`status-msg ${status.type}`}>{status.msg}</div>}
          
          {currentTab === 'hero' && (
            <div className="form-container">
              {Object.entries(content.hero).map(([key, value]) => (
                <div className="form-group" key={key}>
                  <label>{key.replace('_', ' ')}</label>
                  <input 
                    type="text" 
                    value={value} 
                    onChange={(e) => updateField('hero', key, e.target.value)} 
                  />
                  {(key.includes('image') || key === 'logo') && value && (
                    <div className="image-preview-wrapper show" style={{ marginTop: '10px', maxWidth: '200px' }}>
                      <img src={`/${value}`} alt="Preview" style={{ width: '100%', borderRadius: '8px' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {currentTab === 'about' && (
            <div className="form-container">
              {Object.entries(content.about).map(([key, value]) => (
                <div className="form-group" key={key}>
                  <label>{key.replace('_', ' ')}</label>
                  <textarea 
                    value={value} 
                    onChange={(e) => updateField('about', key, e.target.value)} 
                  />
                </div>
              ))}
            </div>
          )}

          {currentTab === 'experience' && (
            <div className="list-container">
              {content.experience.map((exp, index) => (
                <div key={index} className="list-item-card">
                  <div className="item-info">
                    <h4>{exp.title}</h4>
                    <p>{exp.company}</p>
                  </div>
                  <div className="item-actions">
                    <button onClick={() => deleteListItem('experience', index)} className="btn-delete"><Trash2 size={16} /></button>
                  </div>
                  <div style={{ width: '100%', marginTop: '20px' }}>
                    <input type="text" value={exp.title} onChange={(e) => updateListItem('experience', index, 'title', e.target.value)} placeholder="Title" />
                    <input type="text" value={exp.company} onChange={(e) => updateListItem('experience', index, 'company', e.target.value)} placeholder="Company" />
                    <input type="text" value={exp.period} onChange={(e) => updateListItem('experience', index, 'period', e.target.value)} placeholder="Period" />
                    <input type="text" value={exp.logo} onChange={(e) => updateListItem('experience', index, 'logo', e.target.value)} placeholder="Logo Asset Path" />
                    {exp.logo && (
                      <div className="image-preview-wrapper show" style={{ marginTop: '10px', maxWidth: '100px' }}>
                        <img src={`/${exp.logo}`} alt="Preview" style={{ width: '100%', borderRadius: '8px' }} />
                      </div>
                    )}
                    <textarea value={exp.description} onChange={(e) => updateListItem('experience', index, 'description', e.target.value)} placeholder="Description" />
                  </div>
                </div>
              ))}
              <button 
                className="btn-add" 
                onClick={() => addListItem('experience', { title: 'New Role', company: '', period: '', logo: '', description: '' })}
              >
                <Plus size={16} /> Add Experience
              </button>
            </div>
          )}

          {currentTab === 'portfolio' && (
            <div className="list-container">
              {content.portfolio.map((item, index) => (
                <div key={index} className="list-item-card">
                  <div className="item-info">
                    <h4>{item.title}</h4>
                  </div>
                  <div className="item-actions">
                    <button onClick={() => deleteListItem('portfolio', index)} className="btn-delete"><Trash2 size={16} /></button>
                  </div>
                  <div style={{ width: '100%', marginTop: '20px' }}>
                    <input type="text" value={item.title} onChange={(e) => updateListItem('portfolio', index, 'title', e.target.value)} placeholder="Title" />
                    <input type="text" value={item.url} onChange={(e) => updateListItem('portfolio', index, 'url', e.target.value)} placeholder="URL" />
                    <input type="text" value={item.image_url} onChange={(e) => updateListItem('portfolio', index, 'image_url', e.target.value)} placeholder="Image Asset Path" />
                    {item.image_url && (
                      <div className="image-preview-wrapper show" style={{ marginTop: '10px', maxWidth: '300px' }}>
                        <img src={`/${item.image_url}`} alt="Preview" style={{ width: '100%', borderRadius: '8px' }} />
                      </div>
                    )}
                    <textarea value={item.description} onChange={(e) => updateListItem('portfolio', index, 'description', e.target.value)} placeholder="Description" />
                  </div>
                </div>
              ))}
              <button 
                className="btn-add" 
                onClick={() => addListItem('portfolio', { title: 'New Project', description: '', url: '', image_url: '' })}
              >
                <Plus size={16} /> Add project
              </button>
            </div>
          )}

          {currentTab === 'skills' && (
            <div className="form-container">
              {Object.entries(content.skills).map(([category, list]) => (
                <div className="form-group" key={category}>
                  <label>{category}</label>
                  <input 
                    type="text" 
                    value={list.join(', ')} 
                    onChange={(e) => {
                      const newList = e.target.value.split(',').map(s => s.trim());
                      setContent({
                        ...content,
                        skills: { ...content.skills, [category]: newList }
                      });
                    }} 
                  />
                </div>
              ))}
            </div>
          )}

          {currentTab === 'contact' && (
            <div className="form-container">
              {Object.entries(content.contact).map(([key, value]) => (
                <div className="form-group" key={key}>
                  <label>{key}</label>
                  <input 
                    type="text" 
                    value={value} 
                    onChange={(e) => updateField('contact', key, e.target.value)} 
                  />
                </div>
              ))}
            </div>
          )}

          {currentTab === 'settings' && (
            <div className="form-container">
              <div className="form-group">
                <label>Admin Email (View Only)</label>
                <input type="text" value={content.settings?.admin_email} disabled style={{ opacity: 0.6 }} />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" id="new-password" placeholder="Enter new password" />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" id="confirm-password" placeholder="Confirm new password" />
              </div>
              <button 
                className="btn-save" 
                style={{ marginTop: '20px' }}
                onClick={() => {
                  const newPass = document.getElementById('new-password').value;
                  const confirmPass = document.getElementById('confirm-password').value;
                  if (!newPass) return showStatus('error', 'Password cannot be empty');
                  if (newPass !== confirmPass) return showStatus('error', 'Passwords do not match');
                  updatePassword(newPass);
                }}
              >
                Update Password
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Admin;
