import { useEffect, useRef } from 'react'

export function MeshGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    const onResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    // Layer 1: Solid Color Blobs
    const colors1 = ['#000000', '#06b6d4', '#0891b2', '#164e63', '#f97316']
    const blobs = colors1.map((color) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 1.5 * 0.3, // Speed constraint
      vy: (Math.random() - 0.5) * 1.5 * 0.3,
      r: (Math.random() * 0.3 + 0.3) * Math.max(w, h),
      color,
    }))

    // Layer 2: Wireframe Points
    const colors2 = ['#000000', '#ffffff', '#06b6d4', '#f97316']
    const points = Array.from({ length: 35 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5 * 0.3,
      vy: (Math.random() - 0.5) * 0.5 * 0.3,
      color: colors2[Math.floor(Math.random() * colors2.length)],
    }))

    let raf: number

    const draw = () => {
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, w, h)

      // Render Mesh Gradient layer
      ctx.globalCompositeOperation = 'screen'
      blobs.forEach((b) => {
        b.x += b.vx
        b.y += b.vy
        if (b.x < -b.r || b.x > w + b.r) b.vx *= -1
        if (b.y < -b.r || b.y > h + b.r) b.vy *= -1

        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
        grad.addColorStop(0, b.color)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fill()
      })

      // Render Wireframe layer
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 0.6

      points.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
      })

      ctx.lineWidth = 1
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x
          const dy = points[i].y - points[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 200) {
            ctx.strokeStyle = points[i].color
            ctx.beginPath()
            ctx.moveTo(points[i].x, points[i].y)
            ctx.lineTo(points[j].x, points[j].y)
            ctx.stroke()
          }
        }
      }
      ctx.globalAlpha = 1.0

      raf = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-10 bg-black"
      style={{ display: 'block' }}
    />
  )
}
