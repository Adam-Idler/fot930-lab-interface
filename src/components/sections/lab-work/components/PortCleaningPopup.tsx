import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { publicUrl } from '../../../../lib/utils';

interface PortCleaningPopupProps {
	onClose: () => void;
	onClean: () => void;
}

const CANVAS_SIZE = 280;
const CENTER = CANVAS_SIZE / 2;
const CONNECTOR_RADIUS = 132;
const ERASE_RADIUS = 14;
const CLEAN_THRESHOLD = 95;

export function PortCleaningPopup({
	onClose,
	onClean
}: PortCleaningPopupProps) {
	const baseCanvasRef = useRef<HTMLCanvasElement>(null);
	const dirtCanvasRef = useRef<HTMLCanvasElement>(null);
	const initialDirtyPixelsRef = useRef(0);
	const lastSampleTimeRef = useRef(0);
	const isCompletedRef = useRef(false);

	const [cleanPercent, setCleanPercent] = useState(0);
	const [isCompleted, setIsCompleted] = useState(false);

	// Draw clean connector end face on base canvas
	useEffect(() => {
		const canvas = baseCanvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const cx = CENTER;
		const cy = CENTER;

		// Dark background (ferrule housing interior)
		ctx.fillStyle = '#111';
		ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

		// Ferrule body (zirconia ceramic)
		const ferruleGrad = ctx.createRadialGradient(
			cx,
			cy,
			8,
			cx,
			cy,
			CONNECTOR_RADIUS
		);
		ferruleGrad.addColorStop(0, '#ebebeb');
		ferruleGrad.addColorStop(0.55, '#c8c8c8');
		ferruleGrad.addColorStop(1, '#8a8a8a');
		ctx.fillStyle = ferruleGrad;
		ctx.beginPath();
		ctx.arc(cx, cy, CONNECTOR_RADIUS, 0, Math.PI * 2);
		ctx.fill();

		// Subtle concentric ring texture
		ctx.strokeStyle = 'rgba(0,0,0,0.06)';
		ctx.lineWidth = 1;
		for (let r = 20; r < CONNECTOR_RADIUS; r += 18) {
			ctx.beginPath();
			ctx.arc(cx, cy, r, 0, Math.PI * 2);
			ctx.stroke();
		}

		// Cladding (125µm glass, shown proportionally)
		const claddingGrad = ctx.createRadialGradient(cx, cy, 3, cx, cy, 78);
		claddingGrad.addColorStop(0, '#f2f2ff');
		claddingGrad.addColorStop(0.75, '#d8d8ee');
		claddingGrad.addColorStop(1, '#b4b4cc');
		ctx.fillStyle = claddingGrad;
		ctx.beginPath();
		ctx.arc(cx, cy, 78, 0, Math.PI * 2);
		ctx.fill();

		// Cladding border
		ctx.strokeStyle = 'rgba(120,120,160,0.4)';
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		ctx.arc(cx, cy, 78, 0, Math.PI * 2);
		ctx.stroke();

		// Core glow (9µm, enlarged for visibility)
		const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 16);
		coreGrad.addColorStop(0, '#ffffff');
		coreGrad.addColorStop(0.6, 'rgba(220,230,255,0.9)');
		coreGrad.addColorStop(1, 'rgba(200,210,255,0)');
		ctx.fillStyle = coreGrad;
		ctx.beginPath();
		ctx.arc(cx, cy, 16, 0, Math.PI * 2);
		ctx.fill();

		// Core outline
		ctx.strokeStyle = 'rgba(130,140,200,0.5)';
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.arc(cx, cy, 6, 0, Math.PI * 2);
		ctx.stroke();
	}, []);

	// Draw dirt spots on dirt canvas
	useEffect(() => {
		const canvas = dirtCanvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

		// Clip dirt to the connector face circle
		ctx.save();
		ctx.beginPath();
		ctx.arc(CENTER, CENTER, CONNECTOR_RADIUS, 0, Math.PI * 2);
		ctx.clip();

		// Large dirt patches
		const patches = [
			{
				x: CENTER - 28,
				y: CENTER - 32,
				rx: 44,
				ry: 23,
				angle: 0.35,
				alpha: 0.88
			},
			{
				x: CENTER + 32,
				y: CENTER - 22,
				rx: 30,
				ry: 19,
				angle: -0.55,
				alpha: 0.84
			},
			{
				x: CENTER + 8,
				y: CENTER + 38,
				rx: 36,
				ry: 21,
				angle: 0.85,
				alpha: 0.87
			},
			{
				x: CENTER - 48,
				y: CENTER + 12,
				rx: 26,
				ry: 32,
				angle: 1.25,
				alpha: 0.81
			},
			{
				x: CENTER + 42,
				y: CENTER + 22,
				rx: 32,
				ry: 17,
				angle: -0.28,
				alpha: 0.86
			},
			{
				x: CENTER + 12,
				y: CENTER - 8,
				rx: 19,
				ry: 15,
				angle: 0.12,
				alpha: 0.91
			}
		];

		for (const p of patches) {
			ctx.save();
			ctx.translate(p.x, p.y);
			ctx.rotate(p.angle);
			ctx.fillStyle = `rgba(52, 26, 6, ${p.alpha})`;
			ctx.beginPath();
			ctx.ellipse(0, 0, p.rx, p.ry, 0, 0, Math.PI * 2);
			ctx.fill();
			// Slightly lighter inner texture
			ctx.fillStyle = `rgba(80, 45, 12, ${p.alpha * 0.4})`;
			ctx.beginPath();
			ctx.ellipse(3, 3, p.rx * 0.6, p.ry * 0.6, 0, 0, Math.PI * 2);
			ctx.fill();
			ctx.restore();
		}

		// Fine dust particles
		for (let i = 0; i < 55; i++) {
			const angle = Math.random() * Math.PI * 2;
			const radius = Math.random() * (CONNECTOR_RADIUS - 8);
			const x = CENTER + Math.cos(angle) * radius;
			const y = CENTER + Math.sin(angle) * radius;
			const r = 1.5 + Math.random() * 5.5;
			ctx.fillStyle = `rgba(${42 + Math.floor(Math.random() * 38)}, ${14 + Math.floor(Math.random() * 22)}, 2, ${0.62 + Math.random() * 0.38})`;
			ctx.beginPath();
			ctx.arc(x, y, r, 0, Math.PI * 2);
			ctx.fill();
		}

		ctx.restore(); // end clip

		// Count initial dirty pixels (sample every 4th for consistency)
		const imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
		let count = 0;
		for (let i = 3; i < imageData.data.length; i += 16) {
			if (imageData.data[i] > 50) count++;
		}
		initialDirtyPixelsRef.current = count;
	}, []);

	const calculateCleanPercent = useCallback((): number => {
		const canvas = dirtCanvasRef.current;
		if (!canvas) return 0;
		const ctx = canvas.getContext('2d');
		if (!ctx) return 0;

		const imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
		let remaining = 0;
		for (let i = 3; i < imageData.data.length; i += 16) {
			if (imageData.data[i] > 50) remaining++;
		}

		const initial = initialDirtyPixelsRef.current;
		if (initial === 0) return 100;
		return Math.max(
			0,
			Math.min(100, Math.round(((initial - remaining) / initial) * 100))
		);
	}, []);

	const handleMouseMove = useCallback(
		(e: React.MouseEvent<HTMLCanvasElement>) => {
			if (isCompletedRef.current) return;

			const canvas = dirtCanvasRef.current;
			if (!canvas) return;
			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			const rect = canvas.getBoundingClientRect();
			const scaleX = CANVAS_SIZE / rect.width;
			const scaleY = CANVAS_SIZE / rect.height;
			const x = (e.clientX - rect.left) * scaleX;
			const y = (e.clientY - rect.top) * scaleY;

			// Erase dirt at cursor position
			ctx.globalCompositeOperation = 'destination-out';
			ctx.beginPath();
			ctx.arc(x, y, ERASE_RADIUS, 0, Math.PI * 2);
			ctx.fill();
			ctx.globalCompositeOperation = 'source-over';

			// Throttle pixel sampling to every 100ms
			const now = Date.now();
			if (now - lastSampleTimeRef.current < 100) return;
			lastSampleTimeRef.current = now;

			const percent = calculateCleanPercent();
			setCleanPercent(percent);

			if (percent >= CLEAN_THRESHOLD && !isCompletedRef.current) {
				isCompletedRef.current = true;
				// Полностью очищаем оставшуюся грязь
				const dirtCanvas = dirtCanvasRef.current;
				if (dirtCanvas) {
					const dirtCtx = dirtCanvas.getContext('2d');
					if (dirtCtx) dirtCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
				}
				setCleanPercent(100);
				setIsCompleted(true);
				onClean();
			}
		},
		[calculateCleanPercent, onClean]
	);

	const statusLabel = isCompleted
		? 'Чистый'
		: cleanPercent >= 50
			? 'Очищается...'
			: 'Загрязнён';

	const statusDotColor = isCompleted
		? 'bg-green-500'
		: cleanPercent >= 50
			? 'bg-yellow-500 animate-pulse'
			: 'bg-red-500';

	const statusTextColor = isCompleted
		? 'text-green-700'
		: cleanPercent >= 50
			? 'text-yellow-700'
			: 'text-red-600';

	const cursorUrl = publicUrl('/images/icons/napkin.png');

	return (
		<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
			<div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 flex flex-col gap-4">
				{/* Header */}
				<div className="flex items-center justify-between">
					<h3 className="text-base font-semibold text-gray-900">
						Очистка оптического порта
					</h3>
					<button
						type="button"
						onClick={onClose}
						className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:cursor-pointer hover:text-gray-600 hover:bg-gray-100 transition-colors"
					>
						✕
					</button>
				</div>

				{/* Status badge */}
				<div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
					<div
						className={clsx('w-3 h-3 rounded-full shrink-0', statusDotColor)}
					/>
					<span className={clsx('text-sm font-semibold', statusTextColor)}>
						Состояние порта: {statusLabel}
					</span>
					{cleanPercent > 0 && !isCompleted && (
						<span className="ml-auto text-xs text-gray-400 tabular-nums">
							{cleanPercent}%
						</span>
					)}
				</div>

				{/* Canvas area */}
				<div
					className={clsx(
						'relative mx-auto rounded-full overflow-hidden shadow-lg ring-4 transition-all duration-500 select-none',
						isCompleted ? 'ring-green-500' : 'ring-gray-400'
					)}
					style={{ width: `${CANVAS_SIZE}px`, height: `${CANVAS_SIZE}px` }}
				>
					{/* Base layer: clean connector face */}
					<canvas
						ref={baseCanvasRef}
						width={CANVAS_SIZE}
						height={CANVAS_SIZE}
						className="absolute inset-0"
					/>
					{/* Dirt layer: erased by mouse movement */}
					<canvas
						ref={dirtCanvasRef}
						width={CANVAS_SIZE}
						height={CANVAS_SIZE}
						className="absolute inset-0"
						style={{
							cursor: `url("${cursorUrl}") 12 12, crosshair`
						}}
						onMouseMove={handleMouseMove}
					/>
					{/* Completion checkmark — no background, just the icon */}
					{isCompleted && (
						<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
							<span
								className="text-green-400 drop-shadow-lg"
								style={{ fontSize: '72px', lineHeight: 1 }}
							>
								✓
							</span>
						</div>
					)}
				</div>

				{/* Progress bar */}
				<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
					<div
						className={clsx(
							'h-full rounded-full transition-all duration-300',
							isCompleted
								? 'bg-green-500'
								: cleanPercent < 50
									? 'bg-red-400'
									: cleanPercent < CLEAN_THRESHOLD
										? 'bg-yellow-400'
										: 'bg-green-500'
						)}
						style={{ width: `${isCompleted ? 100 : cleanPercent}%` }}
					/>
				</div>

				{/* Hint */}
				<p className="text-xs text-gray-500 text-center leading-relaxed">
					{isCompleted
						? 'Порт очищен. Закройте окно и продолжайте подготовку прибора к работе.'
						: 'Наведите курсор на загрязнения и протрите торец коннектора.'}
				</p>
			</div>
		</div>
	);
}
