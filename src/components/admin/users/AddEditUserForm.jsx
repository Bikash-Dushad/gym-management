"use client";
import { useState, useEffect } from "react";
import {
  listOfMembershipPlansService,
  getUserDetailsService,
} from "@/services/admin/client.service";
import {
  X,
  Check,
  Mail,
  User,
  Phone,
  Ruler,
  Droplet,
  WeightIcon,
  Tag,
  Award,
} from "lucide-react";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const TYPE = ["Gain", "Weight loose", "Others"];
const emptyForm = {
  name: "",
  email: "",
  phone: "",
  age: "",
  height: "",
  bloodGroup: "",
  membershipPlan: "",
  price: "",
  weight: "",
  type: "",
  trainer: "",
};

export default function AddEditUserForm({ userId, onClose, onSave, saving }) {
  const isEditMode = Boolean(userId);

  const [formData, setFormData] = useState(emptyForm);
  const [userLoading, setUserLoading] = useState(isEditMode);
  const [userError, setUserError] = useState("");

  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState("");

  // Fetch membership plans (always needed, for both Add and Edit)
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setPlansLoading(true);
        const response = await listOfMembershipPlansService();
        setPlans(response || []);
      } catch (error) {
        setPlansError(error.message || "Failed to load membership plans");
      } finally {
        setPlansLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // Fetch the specific user when editing
  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        setUserLoading(true);
        const data = await getUserDetailsService(userId);
        setFormData({
          name: data.users?.name || "",
          email: data.users?.email || "",
          phone: data.users?.phone || "",
          age: data.users?.age || "",
          height: data.users?.height || "",
          bloodGroup: data.users?.bloodGroup || "",
          membershipPlan: data.membership?.membershipPlan || "",
          price: data.membership?.price || "",
          weight: data.membership?.weight || "",
          type: data.membership?.type || "",
          trainer: data.membership?.trainer || "",
        });
      } catch (error) {
        setUserError(error.message || "Failed to load user details");
      } finally {
        setUserLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handlePlanChange = (e) => {
    const selectedId = e.target.value;
    const selectedPlan = plans.find((p) => p.id === selectedId);
    setFormData((prev) => ({
      ...prev,
      membershipPlan: selectedId,
      price: selectedPlan?.price ?? prev.price,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Map internal formData field names to what the backend expects,
    // and coerce numeric fields from strings to actual numbers.
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      age: Number(formData.age),
      height: Number(formData.height),
      bloodGroup: formData.bloodGroup,
      membershipPlanId: formData.membershipPlan,
      price: Number(formData.price),
      weight: Number(formData.weight),
      type: formData.type,
      trainerId: formData.trainer || "",
    };

    console.log("submitting payload:", payload); // remove once confirmed working

    onSave(payload);
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-card animate-fade-in">
        <div className="modal-header">
          <h3 className="modal-title">
            {isEditMode ? "Edit User Details" : "Add New User"}
          </h3>
          <button className="close-btn" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        {userLoading ? (
          <div className="modal-body">
            <p>Loading user details...</p>
          </div>
        ) : userError ? (
          <div className="modal-body">
            <p className="form-error-text">{userError}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-body">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-with-icon">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange("name")}
                  placeholder="e.g. John Doe"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange("email")}
                  placeholder="john.doe@gmail.com"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label">Phone Number</label>
                <div className="input-with-icon">
                  <Phone size={16} className="input-icon" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange("phone")}
                    placeholder="e.g. 9800000000"
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-group flex-1">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  min="0"
                  value={formData.age}
                  onChange={handleChange("age")}
                  placeholder="e.g. 28"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label">Height (ft)</label>
                <div className="input-with-icon">
                  <Ruler size={16} className="input-icon" />
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.01"
                    value={formData.height}
                    onChange={handleChange("height")}
                    placeholder="e.g. 5.5"
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-group flex-1">
                <label className="form-label">Weight (kg)</label>
                <div className="input-with-icon">
                  <WeightIcon size={16} className="input-icon" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.weight}
                    onChange={handleChange("weight")}
                    placeholder="e.g. 70"
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label">Blood Group</label>
                <div className="input-with-icon">
                  <Droplet size={16} className="input-icon" />
                  <select
                    value={formData.bloodGroup}
                    onChange={handleChange("bloodGroup")}
                    className="form-select"
                  >
                    <option value="">Select blood group</option>
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group flex-1">
                <label className="form-label">Type</label>
                <div className="input-with-icon">
                  <Tag size={16} className="input-icon" />
                  <select
                    value={formData.type}
                    onChange={handleChange("type")}
                    className="form-select"
                  >
                    <option value="">Select Type</option>
                    {TYPE.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label">Membership Plan</label>
                <div className="input-with-icon">
                  <Award size={16} className="input-icon" />
                  <select
                    value={formData.membershipPlan}
                    onChange={handlePlanChange}
                    className="form-select"
                    disabled={plansLoading}
                    required
                  >
                    <option value="">
                      {plansLoading ? "Loading plans..." : "Select a plan"}
                    </option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.title}
                      </option>
                    ))}
                  </select>
                </div>
                {plansError && <p className="form-error-text">{plansError}</p>}
              </div>
              <div className="form-group flex-1">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  min="0"
                  readOnly
                  value={formData.price}
                  placeholder="Auto-filled from plan"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Trainer</label>
              <input
                type="text"
                value={formData.trainer}
                onChange={handleChange("trainer")}
                placeholder="e.g. Ramesh Shrestha"
                className="form-input"
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                <Check size={16} />
                {saving ? "Saving..." : "Save User Profile"}
              </button>
            </div>
          </form>
        )}
      </div>


    </div>
  );
}
