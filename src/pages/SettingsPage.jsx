import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Settings as SettingsIcon,
  User,
  Download,
  Info,
  Sun,
  Moon,
  FileJson,
  FileText,
  File,
  Trash2,
  Copy,
} from 'lucide-react'
import { setMonthlyBudget, setMonthlyIncome, setTheme } from '../redux/slices/settingsSlice'
import { updateProfile } from '../redux/slices/authSlice'
import { clearExpenses } from '../redux/slices/expensesSlice'
import { exportExpensesToCSV } from '../services/exportService'

const SettingsPage = () => {
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState('general')
  const [budgetInput, setBudgetInput] = useState('')
  const [incomeInput, setIncomeInput] = useState('')
  const theme = useSelector((state) => state.settings.theme)
  const monthlyBudget = useSelector((state) => state.settings.monthlyBudget)
  const monthlyIncome = useSelector((state) => state.settings.monthlyIncome)
  const currentUser = useSelector((state) => state.auth.currentUser)
  const expenses = useSelector((state) => state.expenses.items)
  
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    bio: currentUser?.bio || '',
  })

  const handleBudgetChange = (e) => {
    const value = e.target.value
    setBudgetInput(value)
    if (value === '' || value === '0') {
      dispatch(setMonthlyBudget(''))
    } else {
      dispatch(setMonthlyBudget(value))
    }
  }

  const handleIncomeChange = (e) => {
    const value = e.target.value
    setIncomeInput(value)
    if (value === '' || value === '0') {
      dispatch(setMonthlyIncome(''))
    } else {
      dispatch(setMonthlyIncome(value))
    }
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveProfile = () => {
    dispatch(updateProfile(profileForm))
    alert('Profile updated successfully!')
  }

  const handleExportCSV = () => {
    exportExpensesToCSV(expenses)
    alert('Expenses exported to CSV!')
  }

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(expenses, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `expenses-backup-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
    alert('Expenses exported to JSON!')
  }

  const handleExportExcel = () => {
    alert('Excel export coming soon!')
  }

  const handleExportPDF = () => {
    alert('PDF export coming soon!')
  }

  const handleCreateBackup = () => {
    const backup = {
      expenses,
      monthlyBudget,
      monthlyIncome,
      profile: profileForm,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem('expenseTrackerBackup', JSON.stringify(backup))
    alert('Backup created successfully!')
  }

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      dispatch(clearExpenses())
      alert('All data cleared!')
    }
  }

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon, description: 'Basic app preferences' },
    { id: 'profile', label: 'Profile', icon: User, description: 'Manage your profile' },
    { id: 'data', label: 'Data & Export', icon: Download, description: 'Export or clear your data' },
    { id: 'about', label: 'About', icon: Info, description: 'App information' },
  ]

  return (
    <section className="flex flex-col gap-6 lg:flex-row">
      {/* Left Sidebar */}
      <aside className="w-full lg:w-64">
        <div className="space-y-1 rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-950">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full rounded-xl px-3 py-3 text-left transition ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{tab.label}</p>
                    {activeTab !== tab.id && (
                      <p className="text-xs opacity-70">{tab.description}</p>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Settings</h2>
                <p className="text-slate-500 dark:text-slate-400">
                  Manage your preferences and account settings
                </p>
              </div>
              <button
                onClick={() => dispatch(setTheme(theme === 'light' ? 'dark' : 'light'))}
                className={`flex items-center gap-2 rounded-lg border-2 px-4 py-2 transition ${
                  theme === 'light'
                    ? 'border-yellow-400 bg-yellow-50 text-yellow-700 dark:border-slate-700 dark:bg-slate-800'
                    : 'border-slate-200 dark:border-indigo-500 dark:bg-indigo-900/20'
                }`}
              >
                {theme === 'light' ? (
                  <>
                    <Sun size={16} />
                    <span className="text-sm font-medium">Light</span>
                  </>
                ) : (
                  <>
                    <Moon size={16} />
                    <span className="text-sm font-medium">Dark</span>
                  </>
                )}
              </button>
            </div>

            {/* Financial Settings */}
            <article className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
              <h3 className="text-lg font-semibold">Financial Settings</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Configure your monthly budget and income
              </p>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Monthly Budget
                  </label>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Set your monthly spending limit
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg font-medium text-slate-600 dark:text-slate-300">₹</span>
                    <input
                      type="number"
                      value={monthlyBudget || ''}
                      onChange={handleBudgetChange}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                      placeholder="Enter monthly budget"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Monthly Income
                  </label>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Set your monthly income
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg font-medium text-slate-600 dark:text-slate-300">₹</span>
                    <input
                      type="number"
                      value={monthlyIncome || ''}
                      onChange={handleIncomeChange}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                      placeholder="Enter monthly income"
                    />
                  </div>
                </div>
              </div>
            </article>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">Profile</h2>
              <p className="text-slate-500 dark:text-slate-400">
                Manage your personal information
              </p>
            </div>

            <article className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Bio</label>
                  <textarea
                    name="bio"
                    value={profileForm.bio}
                    onChange={handleProfileChange}
                    maxLength={150}
                    rows={4}
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                    placeholder="Tell us about yourself"
                  />
                  <p className="mt-1 text-xs text-slate-500">{profileForm.bio.length} / 150</p>
                </div>
              </div>
              <button
                onClick={handleSaveProfile}
                className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Save Profile
              </button>
            </article>
          </div>
        )}

        {/* Data & Export Tab */}
        {activeTab === 'data' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">Data & Export</h2>
              <p className="text-slate-500 dark:text-slate-400">
                Export your data or manage your account data
              </p>
            </div>

            {/* Export Options */}
            <article className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
              <h3 className="text-lg font-semibold">Export Your Data</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Download your expenses in different formats
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-3 rounded-lg border-2 border-slate-200 p-4 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
                >
                  <FileText className="text-green-600" size={24} />
                  <div className="text-left">
                    <p className="font-medium">Export as CSV</p>
                    <p className="text-xs text-slate-500">Download in CSV format</p>
                  </div>
                </button>

                <button
                  onClick={handleExportJSON}
                  className="flex items-center gap-3 rounded-lg border-2 border-slate-200 p-4 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
                >
                  <FileJson className="text-blue-600" size={24} />
                  <div className="text-left">
                    <p className="font-medium">Export as JSON</p>
                    <p className="text-xs text-slate-500">Download in JSON format</p>
                  </div>
                </button>

                <button
                  onClick={handleExportExcel}
                  className="flex items-center gap-3 rounded-lg border-2 border-slate-200 p-4 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
                >
                  <File className="text-green-700" size={24} />
                  <div className="text-left">
                    <p className="font-medium">Export as Excel</p>
                    <p className="text-xs text-slate-500">Download in Excel format</p>
                  </div>
                </button>

                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-3 rounded-lg border-2 border-slate-200 p-4 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
                >
                  <FileText className="text-red-600" size={24} />
                  <div className="text-left">
                    <p className="font-medium">Export as PDF</p>
                    <p className="text-xs text-slate-500">Download in PDF format</p>
                  </div>
                </button>
              </div>
            </article>

            {/* Backup & Clear */}
            <article className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
              <h3 className="text-lg font-semibold">Backup & Clear</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Create backups or clear all your data
              </p>

              <div className="mt-6 space-y-3">
                <button
                  onClick={handleCreateBackup}
                  className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Copy size={16} />
                  Create Backup
                </button>
                <button
                  onClick={handleClearAllData}
                  className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Clear All Data
                </button>
              </div>
            </article>
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">About ExpenseTracker</h2>
              <p className="text-slate-500 dark:text-slate-400">
                Learn more about our application
              </p>
            </div>

            <article className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
              <h3 className="text-lg font-semibold">App Information</h3>
              <div className="mt-4 space-y-3 text-slate-600 dark:text-slate-300">
                <p><span className="font-medium">Version:</span> 1.0.0</p>
                <p><span className="font-medium">Release Date:</span> May 2026</p>
                <p><span className="font-medium">Platform:</span> Web Application</p>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
              <h3 className="text-lg font-semibold">About ExpenseTracker</h3>
              <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  ExpenseTracker is a powerful and intuitive expense management application designed to help you take control of your finances. Whether you're managing personal expenses or tracking a household budget, our app provides the tools you need.
                </p>
                <p>
                  <span className="font-medium">Key Features:</span>
                </p>
                <ul className="ml-4 space-y-2 list-disc">
                  <li>Track your daily expenses and income</li>
                  <li>Set and monitor monthly budgets</li>
                  <li>Visualize spending patterns with charts and insights</li>
                  <li>Export your data in multiple formats</li>
                  <li>Dark mode support for comfortable viewing</li>
                  <li>Secure local storage of your financial data</li>
                </ul>
                <p>
                  Our mission is to empower you with the insights and tools needed to make informed financial decisions.
                </p>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
              <h3 className="text-lg font-semibold">Contact & Support</h3>
              <div className="mt-4 space-y-3 text-slate-600 dark:text-slate-300">
                <p>
                  <span className="font-medium">Email:</span> mrsameer12082006@gmail.com
                </p>
                <p>
                  <span className="font-medium">Feedback:</span> We'd love to hear from you! Send us your suggestions and feedback.
                </p>
              </div>
            </article>
          </div>
        )}

        {/* Other Tabs - Coming Soon */}
        {activeTab !== 'general' && activeTab !== 'profile' && activeTab !== 'data' && activeTab !== 'about' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-950">
            <h3 className="text-lg font-semibold">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Coming soon...</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default SettingsPage
