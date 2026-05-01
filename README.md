# Smart Expense Tracker with Financial Insights Dashboard

A modern full-stack-ready frontend architecture for finance tracking built with React + Vite.

## Tech Stack

- React (Vite, ES6+)
- Redux Toolkit + React Redux
- React Router
- Tailwind CSS
- Recharts
- LocalStorage persistence (mock authentication + data layer)

## Features

- Mock Login / Signup with persistent user session
- Dashboard with:
	- Monthly total spending
	- Category-wise pie chart
	- Daily trend line chart
	- Rule-based insights (top category + month-over-month change)
- Expense Management (CRUD):
	- Add, edit, delete expenses
	- Category/date/notes support
- Search / Filter / Sort:
	- Debounced search
	- Category filter
	- Date range filter
	- Amount/date sorting
- Budget Settings:
	- Monthly budget configuration
	- Budget exceeded alert
- UI/UX:
	- Sidebar navigation
	- Mobile-responsive layout
	- Dark mode toggle
- Performance:
	- Lazy-loaded routes
	- Memoized calculations
	- Pagination for large lists
- Bonus:
	- Export filtered expenses to CSV

## Project Structure

```
src/
	components/
	hooks/
	pages/
	redux/
		slices/
	services/
	utils/
```

## Getting Started

1. Install dependencies
2. Start development server
3. Build for production

Scripts:

- `npm run dev`
- `npm run build`
- `npm run preview`

## Notes

- Data is persisted in browser `localStorage` (no backend required for demo).
- Architecture is modular and ready to be connected to a real API later.
