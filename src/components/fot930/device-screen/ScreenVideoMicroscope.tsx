import { Show } from '../../../lib/components';

const VM_LEVEL_MAX = 16;

// Целевые диапазоны (совпадают с deviceReducer)
const B_CENTER = 10;
const B_HALF = 1;
const C_CENTER = 11;
const C_HALF = 1;

interface FerruleEndFaceProps {
	/** 0 — яркость/контраст далеки от оптимума (грязь еле заметна), 1 — в целевом окне */
	dirtClarity: number;
}

function FerruleEndFace({ dirtClarity }: FerruleEndFaceProps) {
	const patchOpacity = 0.22 + dirtClarity * 0.78;
	const rimOpacity = 0.1 + dirtClarity * 0.42;

	return (
		<svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden>
			<title>Торец коннектора</title>
			<defs>
				<radialGradient id="ferrule-core" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="#e2e8f0" />
					<stop offset="55%" stopColor="#94a3b8" />
					<stop offset="100%" stopColor="#64748b" />
				</radialGradient>
				<clipPath id="vm-ferrule-face">
					<circle cx="100" cy="100" r="52" />
				</clipPath>
			</defs>
			<circle
				cx="100"
				cy="100"
				r="78"
				fill="#14532d"
				stroke="#166534"
				strokeWidth="4"
			/>
			<circle cx="100" cy="100" r="52" fill="url(#ferrule-core)" />
			{/* Загрязнения: multiply; заметность растёт при правильной яркости/контрасте */}
			<g
				clipPath="url(#vm-ferrule-face)"
				style={{ mixBlendMode: 'multiply' }}
				opacity={patchOpacity}
			>
				<ellipse
					cx="128"
					cy="82"
					rx="19"
					ry="11"
					fill="rgba(55, 32, 12, 0.72)"
					transform="rotate(28 128 82)"
				/>
				<ellipse
					cx="78"
					cy="118"
					rx="16"
					ry="23"
					fill="rgba(48, 28, 10, 0.68)"
					transform="rotate(-18 78 118)"
				/>
				<ellipse
					cx="108"
					cy="96"
					rx="13"
					ry="9"
					fill="rgba(62, 38, 16, 0.55)"
					transform="rotate(52 108 96)"
				/>
				<ellipse
					cx="92"
					cy="72"
					rx="15"
					ry="8"
					fill="rgba(44, 24, 8, 0.5)"
					transform="rotate(-42 92 72)"
				/>
				<ellipse
					cx="132"
					cy="124"
					rx="11"
					ry="18"
					fill="rgba(50, 30, 12, 0.62)"
					transform="rotate(8 132 124)"
				/>
				<circle cx="118" cy="108" r="1.75" fill="rgba(42, 22, 6, 0.75)" />
				<circle cx="86" cy="94" r="1.25" fill="rgba(38, 20, 5, 0.7)" />
				<circle cx="104" cy="132" r="1.45" fill="rgba(55, 32, 10, 0.72)" />
				<circle cx="72" cy="88" r="1.1" fill="rgba(48, 26, 8, 0.68)" />
				<circle cx="140" cy="96" r="1.2" fill="rgba(40, 22, 6, 0.7)" />
				<circle cx="96" cy="140" r="1.6" fill="rgba(52, 28, 9, 0.74)" />
				<circle cx="124" cy="58" r="1.05" fill="rgba(44, 24, 7, 0.65)" />
				<circle cx="58" cy="108" r="1.35" fill="rgba(50, 28, 8, 0.71)" />
				<circle cx="112" cy="76" r="0.95" fill="rgba(36, 18, 5, 0.64)" />
				<circle cx="130" cy="142" r="1.3" fill="rgba(46, 26, 7, 0.69)" />
			</g>
			{/* оболочка / стекло на торце — светлое, как на реальном полированном торце */}
			<circle
				cx="100"
				cy="100"
				r="18"
				fill="#eef2f7"
				stroke="#c5ced9"
				strokeWidth="2"
			/>
			<circle cx="100" cy="100" r="7" fill="#f8fafc" />
			<circle cx="100" cy="100" r="3" fill="#ffffff" opacity={0.9} />
			<g
				clipPath="url(#vm-ferrule-face)"
				style={{ mixBlendMode: 'multiply' }}
				opacity={rimOpacity}
			>
				<ellipse
					cx="100"
					cy="100"
					rx="50"
					ry="50"
					fill="none"
					stroke="rgba(35, 20, 8, 0.35)"
					strokeWidth="4"
				/>
			</g>
		</svg>
	);
}

/**
 * Нормализованное расстояние от значения до целевого окна [center-half, center+half].
 * 0 внутри окна, 1 при максимальном отклонении.
 */
function windowDist(value: number, center: number, half: number): number {
	const excess = Math.max(0, Math.abs(value - center) - half);
	const maxExcess = Math.max(center - half, VM_LEVEL_MAX - (center + half));
	return excess / maxExcess;
}

/** 0 — в целевом окне яркости/контраста, 1 — максимально «не настроено» */
function microscopeTuningDistance(
	brightnessLevel: number,
	contrastLevel: number
): number {
	const bDist = windowDist(brightnessLevel, B_CENTER, B_HALF);
	const cDist = windowDist(contrastLevel, C_CENTER, C_HALF);
	return Math.min(1, Math.sqrt((bDist ** 2 + cDist ** 2) / 2));
}

function buildImageFilter(
	isSharp: boolean,
	brightnessLevel: number,
	contrastLevel: number
): string {
	if (isSharp) return 'none';

	const dist = microscopeTuningDistance(brightnessLevel, contrastLevel);

	// Blur: 0 у края окна → 5px при максимальном отклонении
	const blurPx = (dist * 5).toFixed(1);

	// Яркость: 1.0 при целевом уровне, тёмно при 0, пересвет при 16
	const brightness = (0.3 + (brightnessLevel / VM_LEVEL_MAX) * 1.1).toFixed(2);

	// Контраст: 1.0 при целевом уровне, плоский при 0, жёсткий при 16
	const contrast = (0.3 + (contrastLevel / VM_LEVEL_MAX) * 1.3).toFixed(2);

	return `blur(${blurPx}px) brightness(${brightness}) contrast(${contrast})`;
}

interface LevelSliderProps {
	value: number;
	label: string;
}

function LevelSlider({ value, label }: LevelSliderProps) {
	const pct = Math.round((value / VM_LEVEL_MAX) * 100);
	return (
		<div className="flex flex-col items-center gap-0.5 h-full">
			<span className="text-[9px] text-gray-500 leading-none shrink-0">
				{label}
			</span>
			<div className="flex-1 w-4 bg-gray-200/70 rounded-full overflow-hidden relative flex flex-col justify-end">
				<div
					className="w-full bg-fot930-blue/60 rounded-full transition-all duration-150"
					style={{ height: `${pct}%` }}
				/>
			</div>
		</div>
	);
}

interface ScreenVideoMicroscopeProps {
	connected: boolean;
	brightnessLevel: number;
	contrastLevel: number;
	isSharp: boolean;
}

export function ScreenVideoMicroscope({
	connected,
	brightnessLevel,
	contrastLevel,
	isSharp
}: ScreenVideoMicroscopeProps) {
	const filterStyle = buildImageFilter(isSharp, brightnessLevel, contrastLevel);
	const tuningDist = microscopeTuningDistance(brightnessLevel, contrastLevel);
	const dirtClarity = 1 - tuningDist;
	const hintRowClass =
		'text-[10px] leading-tight text-gray-500 flex items-center gap-1';

	return (
		<div className="flex w-full h-full p-2 min-h-0 gap-2">
			<Show when={!connected}>
				<div className="flex-1 flex items-center justify-center px-1">
					<div className="bg-red-50 border-2 border-red-300 px-4 py-3 text-[11px] text-red-800 rounded-lg shadow-lg max-w-xs text-center">
						<div className="font-semibold text-red-600 mb-1">
							⚠ Видеомикроскоп не подключён
						</div>
						<div className="text-[10px]">
							Необходимо подключить видеомикроскоп к прибору. Чтобы выйти из
							этого экрана нажмите ESC.
						</div>
					</div>
				</div>
			</Show>

			<Show when={connected}>
				{/* Изображение */}
				<div className="flex-1 flex flex-col min-h-0 min-w-0 gap-1.5">
					<div className="flex-1 flex items-center justify-center min-h-0 bg-gray-100 rounded-lg border border-gray-300 p-2">
						<div
							className="w-full max-w-[180px] aspect-square flex items-center justify-center transition-[filter] duration-200"
							style={{ filter: filterStyle }}
						>
							<FerruleEndFace dirtClarity={dirtClarity} />
						</div>
					</div>
					<div className="flex justify-between shrink-0 space-y-0.5">
						<div className={hintRowClass}>
							<span className="font-bold text-fot930-blue">▲ ▼</span>
							<span>Яркость</span>
						</div>
						<div className={hintRowClass}>
							<span className="font-bold text-fot930-blue">◄ ►</span>
							<span>Контраст</span>
						</div>
					</div>
				</div>

				{/* Ползунки */}
				<div className="flex gap-1.5 h-full pb-8">
					<LevelSlider value={brightnessLevel} label="Ярк" />
					<LevelSlider value={contrastLevel} label="Контр" />
				</div>
			</Show>
		</div>
	);
}
