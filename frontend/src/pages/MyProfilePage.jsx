import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { updateMyProfile, changePassword } from "../services/employeeService";
import { getAllSkills, getMySkills, addOrUpdateMySkill, removeMySkill } from "../services/skillService";
import Avatar from "../components/Avatar.jsx";
import StarRating from "../components/StarRating.jsx";

export default function MyProfilePage() {
  const { user, updateUserInSession } = useAuth();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    designation: user?.designation || "",
  });
  const [profileMsg, setProfileMsg] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  const [mySkills, setMySkills] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [skillForm, setSkillForm] = useState({ skillId: "", skillName: "", category: "General", rating: 3, yearsOfExperience: 0 });
  const [skillSaving, setSkillSaving] = useState(false);

  const loadSkills = async () => {
    const [mine, all] = await Promise.all([getMySkills(), getAllSkills()]);
    setMySkills(mine.data);
    setCatalog(all.data);
  };

  useEffect(() => {
    loadSkills().catch((err) => console.error(err));
  }, []);

  // ---- Profile info ----
  const handleProfileChange = (e) => setProfileForm({ ...profileForm, [e.target.name]: e.target.value });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg("");
    setProfileSaving(true);
    try {
      const res = await updateMyProfile(profileForm);
      updateUserInSession(res.data);
      setProfileMsg("Profile updated successfully.");
    } catch (err) {
      setProfileMsg(err.response?.data?.message || "Unable to update profile.");
    } finally {
      setProfileSaving(false);
    }
  };

  // ---- Password ----
  const handlePwChange = (e) => setPwForm({ ...pwForm, [e.target.name]: e.target.value });

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    setPwMsg("");
    setPwError("");
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError("New passwords do not match.");
      return;
    }
    setPwSaving(true);
    try {
      await changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwMsg("Password changed successfully.");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPwError(err.response?.data?.message || "Unable to change password.");
    } finally {
      setPwSaving(false);
    }
  };

  // ---- Skills ----
  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    setSkillSaving(true);
    try {
      const payload = { rating: Number(skillForm.rating), yearsOfExperience: Number(skillForm.yearsOfExperience) || 0 };
      if (skillForm.skillId) {
        payload.skillId = Number(skillForm.skillId);
      } else {
        payload.skillName = skillForm.skillName.trim();
        payload.category = skillForm.category;
      }
      if (!payload.skillId && !payload.skillName) return;

      await addOrUpdateMySkill(payload);
      setSkillForm({ skillId: "", skillName: "", category: "General", rating: 3, yearsOfExperience: 0 });
      await loadSkills();
    } catch (err) {
      console.error(err);
    } finally {
      setSkillSaving(false);
    }
  };

  const handleRemoveSkill = async (skillId) => {
    if (!window.confirm("Remove this skill from your profile?")) return;
    await removeMySkill(skillId);
    await loadSkills();
  };

  const handleRatingUpdate = async (skill, newRating) => {
    await addOrUpdateMySkill({ skillId: skill.skillId, rating: newRating, yearsOfExperience: skill.yearsOfExperience });
    await loadSkills();
  };

  return (
    <div className="page">
      <div className="profile-header-card">
        <Avatar name={user?.name} color={user?.avatarColor} size={84} />
        <div>
          <h1>{user?.name}</h1>
          <p className="profile-role">{user?.designation} · {user?.department}</p>
          <p className="profile-meta">{user?.email}</p>
        </div>
        <span className="employee-id-badge">{user?.employeeId}</span>
      </div>

      <div className="dashboard-grid">
        {/* Edit profile */}
        <div className="table-card">
          <h2>Edit Profile</h2>
          {profileMsg && <div className="alert alert-info">{profileMsg}</div>}
          <form onSubmit={handleProfileSubmit}>
            <div className="input-group">
              <label>Full Name</label>
              <input name="name" value={profileForm.name} onChange={handleProfileChange} required />
            </div>
            <div className="input-group">
              <label>Designation</label>
              <input name="designation" value={profileForm.designation} onChange={handleProfileChange} required />
            </div>
            <div className="input-group">
              <label>Phone</label>
              <input name="phone" value={profileForm.phone} onChange={handleProfileChange} />
            </div>
            <div className="input-group">
              <label>Bio</label>
              <textarea name="bio" rows={3} value={profileForm.bio} onChange={handleProfileChange} placeholder="Tell your team about yourself..." />
            </div>
            <button className="primary-btn" type="submit" disabled={profileSaving}>
              {profileSaving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div className="table-card">
          <h2>Change Password</h2>
          {pwMsg && <div className="alert alert-success">{pwMsg}</div>}
          {pwError && <div className="alert alert-error">{pwError}</div>}
          <form onSubmit={handlePwSubmit}>
            <div className="input-group">
              <label>Current Password</label>
              <input type="password" name="currentPassword" value={pwForm.currentPassword} onChange={handlePwChange} required />
            </div>
            <div className="input-group">
              <label>New Password</label>
              <input type="password" name="newPassword" value={pwForm.newPassword} onChange={handlePwChange} required />
            </div>
            <div className="input-group">
              <label>Confirm New Password</label>
              <input type="password" name="confirmPassword" value={pwForm.confirmPassword} onChange={handlePwChange} required />
            </div>
            <button className="primary-btn" type="submit" disabled={pwSaving}>
              {pwSaving ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>

      {/* Skills management */}
      <div className="table-card">
        <div className="table-header">
          <div>
            <h2>My Skills &amp; Ratings</h2>
            <p>Self-assess your proficiency from 1 (beginner) to 5 (expert)</p>
          </div>
        </div>

        <form onSubmit={handleSkillSubmit} className="skill-add-form">
          <select
            value={skillForm.skillId}
            onChange={(e) => setSkillForm({ ...skillForm, skillId: e.target.value, skillName: "" })}
          >
            <option value="">Choose from catalog...</option>
            {catalog.map((s) => (
              <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
            ))}
          </select>

          <span className="or-divider">or</span>

          <input
            placeholder="Add a new skill"
            value={skillForm.skillName}
            onChange={(e) => setSkillForm({ ...skillForm, skillName: e.target.value, skillId: "" })}
          />

          <select value={skillForm.rating} onChange={(e) => setSkillForm({ ...skillForm, rating: e.target.value })}>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>{r} star{r > 1 ? "s" : ""}</option>
            ))}
          </select>

          <input
            type="number"
            min="0"
            className="years-input"
            placeholder="Yrs"
            value={skillForm.yearsOfExperience}
            onChange={(e) => setSkillForm({ ...skillForm, yearsOfExperience: e.target.value })}
          />

          <button className="primary-btn" type="submit" disabled={skillSaving}>
            {skillSaving ? "Adding..." : "Add Skill"}
          </button>
        </form>

        {mySkills.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◎</div>
            <h3>No skills yet</h3>
            <p>Add your first skill above.</p>
          </div>
        ) : (
          <div className="skill-list">
            {mySkills.map((s) => (
              <div key={s.id} className="skill-row editable">
                <div>
                  <strong>{s.skillName}</strong>
                  <span className="skill-category">{s.category} · {s.yearsOfExperience} yrs experience</span>
                </div>
                <div className="skill-row-actions">
                  <StarRating value={s.rating} onChange={(r) => handleRatingUpdate(s, r)} size={18} />
                  <button className="delete-btn small" onClick={() => handleRemoveSkill(s.skillId)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
