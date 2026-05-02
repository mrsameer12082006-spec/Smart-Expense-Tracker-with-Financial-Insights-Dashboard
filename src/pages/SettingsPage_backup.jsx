import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Settings as SettingsIcon,
  User,
  Lock,
  Bell,
  Palette,
  CreditCard,
  Download,
  Info,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react'
import { setTheme, setCurrency } from '../redux/slices/settingsSlice'

const SettingsPage = () => {
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState('general')
  const theme = useSelector((state) => state.settings.theme)
  const currency = useSelector((state) => state.settings.currency)
  const [budgetAlerts, setBudgetAlerts] = useState(true)
  const [autoBackup, setAutoBackup] = useState(true)
  const [accentColor, setAccentColor] = useState('indigo')
  const [dateFormat, setDateFormat] = useState('DD/MMM/YYYY')
  const [timeFormat, setTimeFormat] = useState('12')

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon, description: 'Basic app preferences' },
    { id: 'profile', label: 'Profile', icon: User, description: 'Manage your profile' },
    { id: 'security', label: 'Security', icon: Lock, description: 'Password and security' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Manage notifications' },
    { id: 'categories', label: 'Categories', icon: Palette, description: 'Manage expense categories' },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard, description: 'Manage payment methods' },
    { id: 'data', label: 'Data & Export', icon: Download, description: 'Export or clear your data' },
    { id: 'about', label: 'About', icon: Info, description: 'App information' },
  ]

  const accentColors = [
    { name: 'indigo', hex: '#818cf8', key: 'indigo' },
    { name: 'blue', hex: '#3b82f6', key: 'blue' },
    { name: 'emerald', hex: '#10b981', key: 'emerald' },
    { name: 'orange', hex: '#f97316', key: 'orange' },
    { name: 'pink', hex: '#ec4899', key: 'pink' },
    { name: 'purple', hex: '#a855f7', key: 'purple' },
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
            <div>
              <h2 className="text-2xl font-semibold">Settings</h2>
              <p className="text-slate-500 dark:text-slate-400">
                Manage your preferences and account settings
              </p>
            </div>

            {/* Appearance */}
            <article className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
              <h3 className="text-lg font-semibold">Appearance</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Customize the look and feel of the application
              </p>

              <div className="mt-6 space-y-6">
                {/* Theme */}
                <div className="border-b border-slate-200 pb-6 dark:border-slate-800">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Theme</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Choose your preferred theme
                  </p>
                  <div className="mt-3 flex gap-3">
                    {[
                      { value: 'light', label: 'Light', icon: Sun },
                      { value: 'dark', label: 'Dark', icon: Moon },
                      { value: 'system', label: 'System', icon: Monitor },
                    ].map((opt) => {
                      const Icon = opt.icon
                      return (
                        <button
                          key={opt.value}
                          onClick={() => dispatch(setTheme(opt.value))}
                          className={`flex items-center gap-2 rounded-lg border-2 px-4 py-2 transition ${
                            theme === opt.value
                              ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-900/20'
                              : 'border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <Icon size={16} />
                          <span className="text-sm font-medium">{opt.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Accent Color */}
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Accent Color
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Choose your preferred accent color
                  </p>
                  <div className="mt-3 flex gap-2">
                    {accentColors.map((color) => (
                      <button
                        key={color.key}
                        onClick={() => setAccentColor(color.key)}
                        className={`h-10 w-10 rounded-lg ring-2 ring-offset-2 transition ${
                          accentColor === color.key
                            ? 'ring-slate-400 dark:ring-slate-500'
                            : 'ring-transparent'
                        }`}
                        style={{
                          backgroundColor: color.hex,
                          boxShadow: accentColor === color.key ? `0 0 0 1px ${color.hex}` : 'none',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </article>

            {/* Currency & Region */}
            <article className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
              <h3 className="text-lg font-semibold">Currency & Region</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Manage your currency and regional settings
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Currency
                  </label>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Select your default currency
                  </p>
                  <select
                    value={currency}
                    onChange={(e) => dispatch(setCurrency(e.target.value))}
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                  >
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Date Format
                  </label>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Choose your preferred date format
                  </p>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                  >
                    <option value="DD/MMM/YYYY">DD/MMM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Time Format
                  </label>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Choose your preferred time format
                  </p>
                  <select
                    value={timeFormat}
                    onChange={(e) => setTimeFormat(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                  >
                    <option value="12">12 Hour (AM/PM)</option>
                    <option value="24">24 Hour</option>
                  </select>
                </div>
              </div>
            </article>



            {/* Other Preferences */}
            <article className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
              <h3 className="text-lg font-semibold">Other Preferences</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Other application preferences
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Enable Budget Alerts
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Get notified when you are close to your budget limit
                    </p>
                  </div>
                  <button
                    onClick={() => setBudgetAlerts(!budgetAlerts)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                      budgetAlerts ? 'bg-indigo-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                        budgetAlerts ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Auto Backup (Local)
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Automatically backup your data in browser storage
                      </p>
                    </div>
                    <button
                      onClick={() => setAutoBackup(!autoBackup)}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                        autoBackup ? 'bg-indigo-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                          autoBackup ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        )}

        {/* Other Tabs - Coming Soon */}
        {activeTab !== 'general' && (
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