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
    const blobs1 = colors1.map((color) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 1.5 * 0.3, // Speed constraint
      vy: (Math.random() - 0.5) * 1.5 * 0.3,
      r: (Math.random() * 0.3 + 0.3) * Math.max(w, h),
      color,
    }))

    // Layer 2: Wireframe Layer
    const colors2 = ['#000000', '#ffffff', '#06b6d4', '#f97316']
    const blobs2 = colors2.map((color) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 1.5 * 0.2, // Speed constraint 0.2
      vy: (Math.random() - 0.5) * 1.5 * 0.2,
      r: (Math.random() * 0.3 + 0.3) * Math.max(w, h),
      color,
    }))

    let raf: number

    const draw = () => {
      ctx.globalAlpha = 1.0
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, w, h)

      // Render Base layer
      ctx.globalCompositeOperation = 'screen'
      blobs1.forEach((b) => {
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
      ctx.globalAlpha = 0.6 // Opacity 60%
      ctx.globalCompositeOperation = 'screen'

      blobs2.forEach((b) => {
        b.x += b.vx
        b.y += b.vy
        if (b.x < -b.r || b.x > w + b.r) b.vx *= -1
        if (b.y < -b.r || b.y > h + b.r) b.vy *= -1

        // Draw circles for wireframe
        ctx.lineWidth = 2
        ctx.strokeStyle = b.color
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.stroke()
      })

      // Connecting lines for full wireframe aesthetic
      ctx.beginPath()
      for (let i = 0; i < blobs2.length; i++) {
        for (let j = i + 1; j < blobs2.length; j++) {
          ctx.moveTo(blobs2[i].x, blobs2[i].y)
          ctx.lineTo(blobs2[j].x, blobs2[j].y)
        }
      }
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.lineWidth = 1
      ctx.stroke()

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
