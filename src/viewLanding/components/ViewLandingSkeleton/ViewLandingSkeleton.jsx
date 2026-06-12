import Skeleton from '../../../components/Skeleton/Skeleton'
import './ViewLandingSkeleton.css'

function ViewLandingSkeleton() {
  return (
    <div className="landing-skeleton">
      {/* hero */}
      <Skeleton height={280} radius={0} />

      {/* fila de categorías */}
      <div className="landing-skeleton__fila">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} width={90} height={90} radius={12} />
        ))}
      </div>

      {/* marcas destacadas */}
      <div className="landing-skeleton__fila">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} width={160} height={120} radius={12} />
        ))}
      </div>

      {/* ofertas */}
      <div className="landing-skeleton__grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="landing-skeleton__card" key={i}>
            <Skeleton height={140} />
            <Skeleton width="70%" height={14} />
            <Skeleton width="40%" height={14} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ViewLandingSkeleton