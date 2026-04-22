import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
]

const initialForm = {
  name: '',
  age: '',
  gender: '',
  maritalStatus: '',
  state: '',
  category: '',
  bplCardHolder: false,
  annualIncome: '',
  familySize: '',
  hasBankAccount: true,
  occupation: '',
  landArea: '',
  educationLevel: '',
  hasDisability: false,
  isPregnantOrNewMother: false,
  numberOfDaughters: '',
  wantsToStartBusiness: false,
  hasExistingBusiness: false,
}

export default function ProfileForm() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const navigate = useNavigate()

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.age || form.age < 18 || form.age > 100) errs.age = 'Age must be 18–100'
    if (!form.gender) errs.gender = 'Select gender'
    if (!form.maritalStatus) errs.maritalStatus = 'Select marital status'
    if (!form.state) errs.state = 'Select your state'
    if (!form.category) errs.category = 'Select social category'
    if (!form.annualIncome || form.annualIncome < 0) errs.annualIncome = 'Enter valid income'
    if (!form.familySize || form.familySize < 1 || form.familySize > 20)
      errs.familySize = 'Family size must be 1–20'
    if (!form.occupation) errs.occupation = 'Select occupation'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setApiError('')
    try {
      const payload = {
        ...form,
        age: Number(form.age),
        annualIncome: Number(form.annualIncome),
        familySize: Number(form.familySize),
        landArea: form.landArea ? Number(form.landArea) : undefined,
        numberOfDaughters: form.numberOfDaughters !== '' ? Number(form.numberOfDaughters) : 0,
      }
      const { data } = await axios.post('/api/analyze', payload)
      navigate('/results', { state: { results: data, profile: payload } })
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Something went wrong. Please check that the backend server is running.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up" noValidate>

      {/* Section 1: Personal Information */}
      <div className="form-section">
        <h3 className="section-title">
          <span>👤</span> Personal Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name" error={errors.name} required>
            <input
              className="form-input"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </Field>

          <Field label="Age" error={errors.age} required>
            <input
              className="form-input"
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              min={18}
              max={100}
              placeholder="e.g. 35"
            />
          </Field>

          <Field label="Gender" error={errors.gender} required>
            <select className="form-input" name="gender" value={form.gender} onChange={handleChange}>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </Field>

          <Field label="Marital Status" error={errors.maritalStatus} required>
            <select className="form-input" name="maritalStatus" value={form.maritalStatus} onChange={handleChange}>
              <option value="">Select status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </Field>
        </div>
      </div>

      {/* Section 2: Location & Category */}
      <div className="form-section">
        <h3 className="section-title">
          <span>📍</span> Location &amp; Category
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="State / UT" error={errors.state} required>
            <select className="form-input" name="state" value={form.state} onChange={handleChange}>
              <option value="">Select state</option>
              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>

          <Field label="Social Category" error={errors.category} required>
            <select className="form-input" name="category" value={form.category} onChange={handleChange}>
              <option value="">Select category</option>
              <option value="general">General</option>
              <option value="obc">OBC</option>
              <option value="sc">SC</option>
              <option value="st">ST</option>
            </select>
          </Field>
        </div>

        <label className="flex items-center gap-3 cursor-pointer mt-2">
          <input
            type="checkbox"
            name="bplCardHolder"
            checked={form.bplCardHolder}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-sm font-medium text-gray-700">
            BPL (Below Poverty Line) Card Holder
          </span>
        </label>
      </div>

      {/* Section 3: Financial Information */}
      <div className="form-section">
        <h3 className="section-title">
          <span>💰</span> Financial Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Annual Family Income" error={errors.annualIncome} required>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
              <input
                className="form-input pl-7"
                type="number"
                name="annualIncome"
                value={form.annualIncome}
                onChange={handleChange}
                min={0}
                placeholder="e.g. 120000"
              />
            </div>
          </Field>

          <Field label="Family Size" error={errors.familySize} required>
            <input
              className="form-input"
              type="number"
              name="familySize"
              value={form.familySize}
              onChange={handleChange}
              min={1}
              max={20}
              placeholder="Number of family members"
            />
          </Field>
        </div>

        <label className="flex items-center gap-3 cursor-pointer mt-2">
          <input
            type="checkbox"
            name="hasBankAccount"
            checked={form.hasBankAccount}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-sm font-medium text-gray-700">
            Have a bank account (required for direct benefit transfer)
          </span>
        </label>
      </div>

      {/* Section 4: Occupation */}
      <div className="form-section">
        <h3 className="section-title">
          <span>💼</span> Occupation
        </h3>

        <Field label="Occupation" error={errors.occupation} required>
          <select className="form-input" name="occupation" value={form.occupation} onChange={handleChange}>
            <option value="">Select occupation</option>
            <option value="farmer">Farmer</option>
            <option value="agricultural_worker">Agricultural Worker</option>
            <option value="student">Student</option>
            <option value="self_employed">Self-Employed</option>
            <option value="business_owner">Business Owner</option>
            <option value="salaried_employee">Salaried Employee</option>
            <option value="daily_wage_worker">Daily Wage Worker</option>
            <option value="unemployed">Unemployed</option>
            <option value="homemaker">Homemaker</option>
            <option value="retired">Retired</option>
            <option value="street_vendor">Street Vendor</option>
            <option value="other">Other</option>
          </select>
        </Field>

        {form.occupation === 'farmer' && (
          <Field label="Land Area (in acres)">
            <input
              className="form-input"
              type="number"
              name="landArea"
              value={form.landArea}
              onChange={handleChange}
              min={0}
              step="0.5"
              placeholder="e.g. 2.5"
            />
          </Field>
        )}

        {form.occupation === 'student' && (
          <Field label="Education Level">
            <select className="form-input" name="educationLevel" value={form.educationLevel} onChange={handleChange}>
              <option value="">Select level</option>
              <option value="school">School (up to 12th)</option>
              <option value="undergraduate">Undergraduate</option>
              <option value="postgraduate">Postgraduate</option>
            </select>
          </Field>
        )}
      </div>

      {/* Section 5: Special Circumstances */}
      <div className="form-section">
        <h3 className="section-title">
          <span>🌟</span> Special Circumstances
        </h3>
        <p className="text-sm text-gray-500 -mt-2">
          Check all that apply — these unlock additional scheme eligibility
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {[
            { name: 'hasDisability', label: '♿ Person with Disability' },
            { name: 'isPregnantOrNewMother', label: '🤱 Pregnant / New Mother' },
            { name: 'wantsToStartBusiness', label: '🚀 Wants to Start a Business' },
            { name: 'hasExistingBusiness', label: '🏪 Has Existing Business' },
          ].map(({ name, label }) => (
            <label key={name} className="flex items-center gap-3 cursor-pointer bg-gray-50 
                                          rounded-lg px-4 py-3 hover:bg-blue-50 transition-colors">
              <input
                type="checkbox"
                name={name}
                checked={form[name]}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </label>
          ))}
        </div>

        <Field label="Number of Daughters (0–10)">
          <input
            className="form-input"
            type="number"
            name="numberOfDaughters"
            value={form.numberOfDaughters}
            onChange={handleChange}
            min={0}
            max={10}
            placeholder="0"
          />
        </Field>
      </div>

      {/* API Error */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex gap-2 items-start">
          <span className="text-lg">⚠️</span>
          <p className="text-sm">{apiError}</p>
        </div>
      )}

      {/* Submit */}
      <button type="submit" disabled={loading} className="btn-primary w-full text-lg py-4">
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Analyzing your eligibility…
          </span>
        ) : (
          '🔍 Analyze My Eligibility'
        )}
      </button>
    </form>
  )
}

function Field({ label, children, error, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
