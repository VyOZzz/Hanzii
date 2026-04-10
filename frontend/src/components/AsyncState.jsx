export function StateMessage({ type = 'info', children }) {
  return <div className={`state-message ${type}`}>{children}</div>
}

export function SkeletonBlock({ lines = 3 }) {
  return (
    <div className="skeleton-block" aria-hidden="true">
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="skeleton-line" />
      ))}
    </div>
  )
}
