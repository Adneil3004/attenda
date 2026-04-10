import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';



/* ── small helpers ── */
const EyeIcon = ({ open }) => open ? (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
) : (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const Toast = ({ message, type }) => {
  if (!message) return null;
  const colors = type === 'success'
    ? 'bg-green-50 text-green-700 border-green-200'
    : 'bg-red-50 text-red-700 border-red-200';
  return (
    <div className={`mb-6 p-4 rounded-lg text-sm font-medium border flex items-center gap-2 ${colors}`}>
      {type === 'success'
        ? <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        : <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 5a7 7 0 100 14A7 7 0 0012 5z" /></svg>
      }
      {message}
    </div>
  );
};

const ReadOnlyField = ({ label, value, placeholder = '—' }) => (
  <div className="space-y-1">
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
    <p className="text-sm font-medium text-gray-800">{value || placeholder}</p>
  </div>
);

/* ════════════════════════════════════════════ */
const Settings = () => {
  const { user } = useAuth();

  /* ── profile state ── */
  const [isEditing, setIsEditing]   = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [profileData, setProfileData] = useState({
    full_name: '', phone: '', birthdate: '', gender: 'Male'
  });
  const [editDraft, setEditDraft] = useState({ ...profileData });

  /* ── password state ── */
  const [pwdOpen, setPwdOpen]       = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg]         = useState({ type: '', text: '' });
  const [pwd, setPwd]               = useState({ current: '', new: '', confirm: '' });
  const [showPwd, setShowPwd]       = useState({ current: false, new: false, confirm: false });

  /* ── team state ── */
  const [teamMembers, setTeamMembers]   = useState([]);
  const [teamLoading, setTeamLoading]   = useState(false);
  const [teamMsg, setTeamMsg]           = useState({ type: '', text: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember]       = useState({ name: '', email: '', role: 'guest' });
  const [addingMember, setAddingMember] = useState(false);
  const [addError, setAddError]         = useState('');

  /* ── load profile ── */
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (data) {
        const loaded = {
          full_name: data.full_name || '',
          phone:     data.phone     || '',
          birthdate: data.birthdate || '',
          gender:    data.gender    || 'Male'
        };
        setProfileData(loaded);
        setEditDraft(loaded);
      }
    })();
  }, [user]);

  const flash = (setter, type, text) => {
    setter({ type, text });
    setTimeout(() => setter({ type: '', text: '' }), 3500);
  };

  /* ── load team members ── */
  const loadTeam = useCallback(async () => {
    if (!user) return;
    setTeamLoading(true);
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('owner_id', user.id)
      .order('invited_at', { ascending: true });
    setTeamLoading(false);
    if (!error) setTeamMembers(data || []);
  }, [user]);

  useEffect(() => { loadTeam(); }, [loadTeam]);

  /* ── role limit helpers ── */
  const hasAdmin    = teamMembers.some(m => m.role === 'admin');
  const hasCoAdmin  = teamMembers.some(m => m.role === 'co-admin');
  const totalCount  = teamMembers.length; // max 4

  /* ── add member ── */
  const handleAddMember = async (e) => {
    e.preventDefault();
    setAddError('');

    const { name, email, role } = newMember;
    if (!name.trim() || !email.trim()) {
      setAddError('Name and email are required.');
      return;
    }
    if (totalCount >= 4) {
      setAddError('You can only add up to 4 team members.');
      return;
    }
    if (role === 'admin' && hasAdmin) {
      setAddError('Only 1 Admin is allowed. Remove the existing Admin first.');
      return;
    }
    if (role === 'co-admin' && hasCoAdmin) {
      setAddError('Only 1 Co-Admin is allowed. Remove the existing Co-Admin first.');
      return;
    }

    setAddingMember(true);

    try {
      const redirectTo = `${window.location.origin}/attenda/reset-password`;

      // Invoke the secure Edge Function to handle invitation and table insertion
      const { data, error: invokeError } = await supabase.functions.invoke('invite-user', {
        body: { email: email.trim(), name: name.trim(), role, redirectTo }
      });

      if (invokeError) {
        throw invokeError;
      }
      
      if (data && data.error) {
        throw new Error(data.error);
      }

      await loadTeam();
      flash(setTeamMsg, 'success', `${name} added as ${role}. They will receive an invitation link via email.`);
      setShowAddModal(false);
      setNewMember({ name: '', email: '', role: 'guest' });
    } catch (err) {
      setAddError(err.message || 'Failed to send invitation.');
    } finally {
      setAddingMember(false);
    }
  };

  /* ── remove member ── */
  const handleRemoveMember = async (memberId, memberName) => {
    if (!window.confirm(`Remove ${memberName} from your team?`)) return;
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', memberId)
      .eq('owner_id', user.id);
    if (error) {
      flash(setTeamMsg, 'error', 'Failed to remove member.');
    } else {
      loadTeam();
      flash(setTeamMsg, 'success', `${memberName} has been removed.`);
    }
  };

  const roleBadgeColor = (role) => {
    if (role === 'admin')    return 'bg-purple-100 text-purple-700';
    if (role === 'co-admin') return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-600';
  };

  /* ── save profile ── */
  const handleSaveProfile = async () => {
    setProfileLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ...editDraft, updated_at: new Date().toISOString() })
        .eq('id', user.id);
      if (error) throw error;
      setProfileData({ ...editDraft });
      setIsEditing(false);
      flash(setProfileMsg, 'success', 'Profile updated successfully!');
    } catch (err) {
      flash(setProfileMsg, 'error', err.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditDraft({ ...profileData });
    setIsEditing(false);
  };

  /* ── change password ── */
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!pwd.new || !pwd.confirm) {
      flash(setPwdMsg, 'error', 'Please fill in all password fields.');
      return;
    }
    if (pwd.new.length < 6) {
      flash(setPwdMsg, 'error', 'Password must be at least 6 characters.');
      return;
    }
    const pwdRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])/;
    if (!pwdRegex.test(pwd.new)) {
      flash(setPwdMsg, 'error', 'Password must include at least 1 number and 1 special character (!@#$%^&*).');
      return;
    }
    if (pwd.new !== pwd.confirm) {
      flash(setPwdMsg, 'error', 'Passwords do not match.');
      return;
    }

    setPwdLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pwd.new });
      if (error) throw error;
      flash(setPwdMsg, 'success', 'Password changed successfully!');
      setPwd({ current: '', new: '', confirm: '' });
      setPwdOpen(false);
    } catch (err) {
      flash(setPwdMsg, 'error', err.message || 'Failed to change password.');
    } finally {
      setPwdLoading(false);
    }
  };

  /* ════════ RENDER ════════ */
  return (
    <div className="w-full h-full flex bg-[var(--color-surface)] text-[var(--color-on-surface-variant)] -mt-8 font-body">
      <main className="flex-1 flex flex-col xl:flex-row gap-10 py-10 px-8 xl:px-12 overflow-y-auto w-full max-w-7xl mx-auto">

        {/* ── LEFT COLUMN ── */}
        <div className="flex-1 space-y-6">
          <header className="mb-6">
            <h1 className="text-xl text-[var(--color-primary)] font-display">Account Settings</h1>
            <p className="text-sm text-gray-500 mt-2 max-w-xl leading-relaxed">
              Manage your personal information and security preferences.
            </p>
          </header>

          {/* ── Profile Card ── */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-400" />

            <div className="px-8 pt-8 pb-8">
              {/* Header row */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-xl bg-gray-200 overflow-hidden shadow-inner">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.full_name || 'User')}&background=4F46E5&color=fff&size=128`}
                        alt={profileData.full_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-base font-bold text-gray-900">{profileData.full_name || '—'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
                  </div>
                </div>

                {/* Edit / Save / Cancel buttons */}
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#f3f0ff] text-purple-700 text-xs font-bold hover:bg-purple-100 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={profileLoading}
                      className="flex items-center gap-2 px-5 py-2 rounded-lg bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors disabled:opacity-60"
                    >
                      {profileLoading
                        ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
                        : '✓ Save Changes'}
                    </button>
                  </div>
                )}
              </div>

              <Toast message={profileMsg.text} type={profileMsg.type} />

              {/* Fields */}
              {isEditing ? (
                /* ── EDIT MODE ── */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700">Full Name</label>
                    <input
                      type="text"
                      value={editDraft.full_name}
                      onChange={e => setEditDraft({ ...editDraft, full_name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full bg-[#f1f3f5] rounded-lg px-4 py-2.5 text-sm font-medium text-gray-800 border-none focus:ring-2 focus:ring-purple-300 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700">Email Address</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full bg-[#f1f3f5] rounded-lg px-4 py-2.5 text-sm text-gray-400 border-none cursor-not-allowed"
                    />
                    <p className="text-[10px] text-gray-400">Email cannot be changed here.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      value={editDraft.phone}
                      onChange={e => setEditDraft({ ...editDraft, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-[#f1f3f5] rounded-lg px-4 py-2.5 text-sm font-medium text-gray-800 border-none focus:ring-2 focus:ring-purple-300 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700">Birthdate</label>
                    <input
                      type="date"
                      value={editDraft.birthdate}
                      onChange={e => setEditDraft({ ...editDraft, birthdate: e.target.value })}
                      className="w-full bg-[#f1f3f5] rounded-lg px-4 py-2.5 text-sm font-medium text-gray-800 border-none focus:ring-2 focus:ring-purple-300 outline-none"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-semibold text-gray-700">Gender</label>
                    <div className="flex items-center gap-6">
                      {['Male', 'Female', 'Non-binary'].map(g => (
                        <label key={g} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                          <input
                            type="radio"
                            name="gender"
                            checked={editDraft.gender === g}
                            onChange={() => setEditDraft({ ...editDraft, gender: g })}
                            className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                          />
                          {g}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* ── VIEW MODE ── */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ReadOnlyField label="Full Name"     value={profileData.full_name} />
                  <ReadOnlyField label="Email Address" value={user?.email} />
                  <ReadOnlyField label="Phone Number"  value={profileData.phone}     placeholder="Not set" />
                  <ReadOnlyField label="Birthdate"     value={profileData.birthdate} placeholder="Not set" />
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender</p>
                    <p className="text-sm font-medium text-gray-800">{profileData.gender || 'Not set'}</p>
                  </div>
                </div>
              )}

              {/* ── Security / Change Password ── */}
              <hr className="my-8 border-gray-100" />

              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-primary)]">Security</p>
                    <p className="text-xs text-gray-400 mt-0.5">Update your login password.</p>
                  </div>
                  <button
                    onClick={() => { setPwdOpen(v => !v); setPwdMsg({ type: '', text: '' }); }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#f3f0ff] text-purple-700 text-xs font-bold rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    {pwdOpen ? 'Cancel' : 'Change Password'}
                  </button>
                </div>

                {/* Password form — collapsed by default */}
                {pwdOpen && (
                  <form onSubmit={handleChangePassword} className="mt-6 space-y-4 bg-[#fafafa] border border-gray-100 rounded-xl p-6">
                    <Toast message={pwdMsg.text} type={pwdMsg.type} />

                    {[
                      { key: 'new',     label: 'New Password' },
                      { key: 'confirm', label: 'Confirm New Password' }
                    ].map(({ key, label }) => (
                      <div key={key} className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700">{label}</label>
                        <div className="relative">
                          <input
                            type={showPwd[key] ? 'text' : 'password'}
                            value={pwd[key]}
                            onChange={e => setPwd({ ...pwd, [key]: e.target.value })}
                            placeholder="••••••••"
                            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-11 text-sm text-gray-800 focus:ring-2 focus:ring-purple-300 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPwd(v => ({ ...v, [key]: !v[key] }))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors p-1"
                          >
                            <EyeIcon open={showPwd[key]} />
                          </button>
                        </div>
                      </div>
                    ))}

                    <p className="text-[10px] text-gray-400">
                      Min. 6 chars · at least 1 number · at least 1 special character (!@#$%^&*)
                    </p>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={pwdLoading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-60"
                      >
                        {pwdLoading
                          ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating…</>
                          : 'Update Password'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </section>

          {/* ── Team & Access Card ── */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 pt-5 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[var(--color-primary)] font-display text-base">Team & Access</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Add up to 4 members (1 Admin, 1 Co-Admin, unlimited Guests up to the limit). Guests can only view.
                </p>
              </div>
              <button
                onClick={() => { setShowAddModal(true); setAddError(''); }}
                disabled={totalCount >= 4}
                className="bg-black text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
                Add User
              </button>
            </div>

            <Toast message={teamMsg.text} type={teamMsg.type} />

            {/* Capacity indicator */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full transition-all"
                  style={{ width: `${(totalCount / 4) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-400 font-semibold whitespace-nowrap">{totalCount} / 4 members</span>
            </div>

            {/* Members grid */}
            {teamLoading ? (
              <div className="py-6 text-center text-xs text-gray-400">Loading team…</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {teamMembers.map(m => (
                  <div key={m.id} className="flex items-center justify-between p-3.5 bg-[#f8f9fc] rounded-lg group">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(m.member_name)}&background=4F46E5&color=fff`}
                        className="w-9 h-9 rounded-md shadow-sm flex-shrink-0"
                        alt={m.member_name}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{m.member_name}</p>
                        <p className="text-[10px] text-gray-400 truncate">{m.member_email}</p>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded mt-0.5 inline-block ${roleBadgeColor(m.role)}`}>
                          {m.role}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveMember(m.id, m.member_name)}
                      className="text-gray-300 hover:text-red-500 transition-colors ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100"
                      title="Remove member"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
                {totalCount === 0 && (
                  <div className="col-span-2 py-8 text-center text-xs text-gray-400">
                    No team members yet. Click <strong>Add User</strong> to invite your first collaborator.
                  </div>
                )}
              </div>
            )}
          </section>

          {/* ══ ADD USER MODAL ══ */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* backdrop */}
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setShowAddModal(false)}
              />
              <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 z-10">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <h4 className="text-lg font-bold text-gray-900 mb-1">Add Team Member</h4>
                <p className="text-xs text-gray-400 mb-6">They'll receive an email with a secure link to join your team and set their password.</p>

                {addError && (
                  <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                    {addError}
                  </div>
                )}

                <form onSubmit={handleAddMember} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700">Full Name</label>
                    <input
                      type="text"
                      value={newMember.name}
                      onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                      placeholder="Jane Doe"
                      required
                      className="w-full bg-[#f1f3f5] rounded-lg px-4 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-purple-300"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700">Email Address</label>
                    <input
                      type="email"
                      value={newMember.email}
                      onChange={e => setNewMember({ ...newMember, email: e.target.value })}
                      placeholder="jane@example.com"
                      required
                      className="w-full bg-[#f1f3f5] rounded-lg px-4 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-purple-300"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700">Role</label>
                    <select
                      value={newMember.role}
                      onChange={e => setNewMember({ ...newMember, role: e.target.value })}
                      className="w-full bg-[#f1f3f5] rounded-lg px-4 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-purple-300"
                    >
                      <option value="guest">Guest — View only</option>
                      <option value="co-admin" disabled={hasCoAdmin}>Co-Admin{hasCoAdmin ? ' (already assigned)' : ''}</option>
                      <option value="admin" disabled={hasAdmin}>Admin{hasAdmin ? ' (already assigned)' : ''}</option>
                    </select>
                    <p className="text-[10px] text-gray-400">
                      {newMember.role === 'guest' && 'Guests can only view, not edit.'}
                      {newMember.role === 'co-admin' && 'Co-Admin can manage guests and tasks.'}
                      {newMember.role === 'admin' && 'Admin has full access except billing.'}
                    </p>
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={addingMember}
                      className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-60"
                    >
                      {addingMember
                        ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Adding…</>
                        : 'Add Member'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ── Payment Methods ── */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8">
            <h3 className="text-[var(--color-primary)] font-display text-base">Payment Methods</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#000a1f] rounded-xl p-5 text-white shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[160px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="flex justify-between items-center z-10 w-full mb-6">
                  <span className="text-sm font-black italic tracking-wider">VISA</span>
                </div>
                <div className="space-y-4 z-10 mt-auto">
                  <p className="text-sm font-mono tracking-[0.2em] text-white">••••  ••••  ••••  4242</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[7px] uppercase tracking-widest text-[#a3a3a3]">Card Holder</p>
                      <p className="text-[10px] font-bold uppercase mt-0.5">{profileData.full_name || 'Account Holder'}</p>
                    </div>
                    <div>
                      <p className="text-[7px] uppercase tracking-widest text-[#a3a3a3]">Expires</p>
                      <p className="text-[10px] font-bold mt-0.5">12/28</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-dashed border-gray-300 rounded-xl flex items-center justify-center min-h-[160px] hover:bg-gray-50 cursor-pointer transition-colors p-4">
                <div className="text-center text-gray-500">
                  <svg className="w-6 h-6 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="text-xs font-semibold text-gray-700">Link New Account</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm text-[var(--color-primary)] font-display">Recent Transactions</h4>
                <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline">View All History</button>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Annual Membership',   date: 'May 12, 2024',   amount: '$420.00' },
                  { name: 'Custom Calligraphy Set', date: 'April 28, 2024', amount: '$85.00'  }
                ].map(t => (
                  <div key={t.name} className="flex items-center justify-between p-3.5 bg-[#f9f9f9] rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">{t.name}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{t.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-900">{t.amount}</p>
                      <p className="text-[8px] font-bold text-indigo-600 mt-1 uppercase tracking-widest">Completed</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <footer className="text-center pt-8 text-[10px] text-gray-400">
            Attenda • Version 1.0 • © 2025
          </footer>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <aside className="xl:w-[300px] flex-shrink-0 space-y-6 pt-16">
          {/* Current Plan Card */}
          <div className="group bg-gradient-to-br from-[#0c142c] via-[#16214d] to-[#0c142c] rounded-xl p-7 text-white shadow-2xl space-y-6 relative overflow-hidden border border-white/10">
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
              <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] group-hover:left-[100%] transition-all duration-[1500ms] ease-in-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            <div className="relative z-10">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#86a3d9] font-bold mb-2">Current Plan</p>
              <h3 className="text-4xl font-display font-light text-white tracking-tight">
                Elite <span className="text-sm text-[#86a3d9] font-normal italic ml-1 opacity-80">/ Yearly</span>
              </h3>
            </div>

            <p className="relative z-10 text-xs text-white/70 leading-relaxed font-light">
              Full access to concierge services, priority guest seating, and digital calligraphy.
            </p>

            <ul className="relative z-10 space-y-3.5">
              {['Unlimited Invitations', 'Priority Support'].map(f => (
                <li key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/10 text-white flex items-center justify-center flex-shrink-0 border border-white/20">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs text-white/90 font-medium">{f}</span>
                </li>
              ))}
            </ul>

            <div className="relative z-10 pt-4">
              <button className="w-full py-3 bg-white text-[#0f1b3d] font-bold text-sm rounded-lg shadow-[0_4px_12px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all">
                Manage Subscription
              </button>
            </div>

            <div className="relative z-10 text-center">
              <button className="text-[10px] text-white/40 hover:text-white transition-colors tracking-widest uppercase font-bold">
                Cancel Subscription
              </button>
            </div>
          </div>

          {/* Privacy Box */}
          <div className="bg-[#f8f9fa] rounded-xl p-5 flex items-start gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-800">Data Privacy</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Your data is encrypted and secure.</p>
            </div>
            <div className="text-gray-400 mt-0.5">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.642 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.358-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
};

export default Settings;
