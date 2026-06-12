import Skeleton from '../../../components/Skeleton/Skeleton'
import './ViewLocalSkeleton.css'

function ViewLocalSkeleton() {
  return (
    <div className="local-skeleton">
      {/* fachada / carrusel */}
      <Skeleton height={320} radius={0} />

      {/* barra de filtros */}
      <div className="local-skeleton__filtros">
        <Skeleton width={180} height={40} />
        <Skeleton width={120} height={40} />
      </div>

      {/* grilla de productos */}
      <div className="local-skeleton__grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="local-skeleton__card" key={i}>
            <Skeleton height={160} />
            <Skeleton width="80%" height={14} />
            <Skeleton width="50%" height={14} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ViewLocalSkeleton