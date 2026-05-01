const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  return (
    <div className="mt-4 flex items-center justify-between gap-3">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700"
      >
        Previous
      </button>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Page {currentPage} of {totalPages}
      </p>
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700"
      >
        Next
      </button>
    </div>
  )
}

export default Pagination
