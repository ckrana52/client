function Shape(ownerState) {
    // Owner State
    const {
        varient = 'circle',
        size = 30,
        rounded = Math.floor(size / 6),
        className = '',
        children,
        style,
    } = ownerState;

    return (
        <div>
            <div
                {...ownerState}
                style={{
                    width: size,
                    borderRadius: varient === 'circle' ? '50%' : rounded,
                    ...style,
                }}
                className={`flex items-center justify-center overflow-hidden ring ring-slate-300 text-slate-600 aspect-square ${className}`}
            >
                {children}
            </div>
        </div>
    );
}
export default Shape