export function FormField({ label, children, error, optional = false }) {
  const id = children.props.id
  const labelStyles = 'block text-sm font-medium mb-1'
  const errorStyles = 'text-red-500 text-sm mt-1'

  return (
    <div>
      <label htmlFor={id} className={labelStyles}>
        {label}{' '}
        {optional && <span className='text-gray-400 text-sm'>(opcional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className={errorStyles} role='alert'>
          {error.message}
        </p>
      )}
    </div>
  )
}
