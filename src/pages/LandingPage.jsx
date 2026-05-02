import { useNavigate } from 'react-router-dom'
import { TrendingDown, PiggyBank, BarChart3, Lock, ArrowRight } from 'lucide-react'

const LandingPage = () => {
  const navigate = useNavigate()

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const features = [
    {
      icon: TrendingDown,
      title: 'Track Expenses',
      description: 'Easily track and categorize your expenses in real-time.',
    },
    {
      icon: PiggyBank,
      title: 'Manage Budgets',
      description: 'Set budgets, get alerts, and stay on track with your goals.',
    },
    {
      icon: BarChart3,
      title: 'Insightful Reports',
      description: 'Get beautiful reports and insights to make better decisions.',
    },
    {
      icon: Lock,
      title: 'Secure & Private',
      description: 'Your data is safe with us. We never share your information.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
                S
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">Smart Expense</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Tracker</p>
              </div>
            </div>

            <div className="hidden items-center gap-8 md:flex">
              <button
                type="button"
                onClick={() => scrollToSection('features')}
                className="text-sm font-medium text-slate-600 transition hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
              >
                Features
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('benefits')}
                className="text-sm font-medium text-slate-600 transition hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
              >
                Benefits
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('how-it-works')}
                className="text-sm font-medium text-slate-600 transition hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
              >
                How It Works
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/auth')}
                className="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 md:inline-block"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/auth')}
                className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 dark:bg-indigo-900/30">
              <span className="text-2xl">✨</span>
              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                Smart way to manage your money
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-tight text-slate-900 dark:text-white md:text-5xl">
              Track Expenses.
              <br />
              Manage Budgets.
              <br />
              <span className="text-indigo-600">Achieve Goals.</span>
            </h1>

            <p className="mb-8 text-lg text-slate-600 dark:text-slate-300">
              Smart Expense Tracker helps you track your daily expenses, manage budgets, and get meaningful insights to build better financial habits.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => scrollToSection('take-control')}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700"
              >
                Get Started Free
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="inline-flex items-center justify-center rounded-lg border-2 border-slate-200 px-6 py-3 font-medium text-slate-900 transition hover:border-indigo-600 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-100 dark:hover:border-indigo-600 dark:hover:text-indigo-400"
              >
                Learn More
              </button>
            </div>

            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 text-white font-bold shadow-lg">
                  A
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600 text-white font-bold shadow-lg">
                  B
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-pink-600 text-white font-bold shadow-lg">
                  C
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold shadow-lg">
                  D
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-900 dark:text-slate-100">Trusted by 10,000+ users</span>
                <br />
                worldwide
              </p>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 p-8 dark:from-indigo-900/20 dark:to-blue-900/20">
              <div className="space-y-4">
                <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Expenses</span>
                    <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      + 2.5% from last month
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">₹24,650</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Monthly Budget</p>
                    <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">₹50,000</p>
                  </div>
                  <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Savings</p>
                    <p className="mt-1 text-lg font-bold text-emerald-600">₹25,350</p>
                  </div>
                  <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Daily Expense</p>
                    <p className="mt-1 text-lg font-bold text-orange-600">₹795</p>
                  </div>
                </div>

                <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                  <p className="mb-2 text-xs font-medium text-slate-600 dark:text-slate-300">Expenses by Category</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-orange-500" />
                        <span className="text-xs text-slate-600 dark:text-slate-300">Food & Dining</span>
                      </div>
                      <span className="text-xs font-medium text-slate-900 dark:text-white">₹6,880</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500" />
                        <span className="text-xs text-slate-600 dark:text-slate-300">Transport</span>
                      </div>
                      <span className="text-xs font-medium text-slate-900 dark:text-white">₹3,540</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-purple-500" />
                        <span className="text-xs text-slate-600 dark:text-slate-300">Entertainment</span>
                      </div>
                      <span className="text-xs font-medium text-slate-900 dark:text-white">₹2,460</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-slate-200 bg-slate-50 py-20 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">
              Powerful Features
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Everything you need to manage your finances effectively
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="mb-4 inline-flex rounded-lg bg-indigo-100 p-3 dark:bg-indigo-900/30">
                    <Icon size={24} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">
              Why people love it
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Simple, fast, and designed to keep your finances under control
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              'See where your money goes at a glance',
              'Plan your budget without the spreadsheet drama',
              'Stay on track with clear insights and goals',
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="border-t border-slate-200 bg-slate-50 py-20 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">
              How it works
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Get started in just three easy steps
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { step: '1', title: 'Sign up', text: 'Create your account in seconds and set up your profile.' },
              { step: '2', title: 'Add income & budget', text: 'Set your monthly income and spending goals.' },
              { step: '3', title: 'Track & improve', text: 'Review spending, export data, and make smarter choices.' },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="take-control" className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-16 text-center dark:from-indigo-700 dark:to-blue-700">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Ready to take control of your finances?
          </h2>
          <p className="mb-8 text-lg text-indigo-100">
            Join thousands of happy users and start your journey to financial freedom today.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 font-semibold text-indigo-600 transition hover:bg-indigo-50"
          >
            Get Started Free
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            © 2026 Smart Expense Tracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
