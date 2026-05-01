import { Moon, Sun } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../../redux/slices/settingsSlice'

const ThemeToggle = () => {
  const dispatch = useDispatch()
  const theme = useSelector((state) => state.settings.theme)
  const isLight = theme === 'light'

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleTheme())}
      className="inline-flex w-full items-center justify-between rounded-lg px-1 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
      aria-label="Toggle dark mode"
    >
      <span className="inline-flex items-center gap-2">
        {isLight ? <Moon size={16} /> : <Sun size={16} />}
        Dark Mode
      </span>
      <span
        className={`relative h-6 w-11 rounded-full transition ${
          isLight ? 'bg-slate-300 dark:bg-slate-700' : 'bg-indigo-500'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition ${
            isLight ? 'left-0.5' : 'left-[1.35rem]'
          }`}
        />
      </span>
    </button>
  )
}

export default ThemeToggle
