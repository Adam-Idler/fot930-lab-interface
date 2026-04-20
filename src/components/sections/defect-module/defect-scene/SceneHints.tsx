interface SceneHintsProps {
	isCable: boolean;
	isSplitter: boolean;
	isConnected: boolean;
	vflEnabled: boolean;
	defectFound: boolean;
	showCableBeam: boolean;
	showSplBeam: boolean;
	splActiveHasDefect: boolean;
}

export function SceneHints({
	isCable,
	isSplitter,
	isConnected,
	vflEnabled,
	defectFound,
	showCableBeam,
	showSplBeam,
	splActiveHasDefect
}: SceneHintsProps) {
	return (
		<>
			{defectFound && (
				<p className="text-center text-base font-medium text-green-600">
					✓ Дефект обнаружен
					{isCable ? ' на оптическом шнуре' : ' на выходе 2 сплиттера'}!
				</p>
			)}
			{!defectFound && isCable && !isConnected && (
				<p className="text-center text-base text-blue-500 italic">
					Перетащите коннектор к порту VFL прибора
				</p>
			)}
			{!defectFound && isCable && isConnected && !vflEnabled && (
				<p className="text-center text-base text-gray-500 italic">
					✓ Волокно подключено. Включите VFL на приборе.
				</p>
			)}
			{!defectFound && showCableBeam && (
				<p className="text-center text-base text-red-500 italic">
					Луч VFL активен. Найдите и нажмите на точку дефекта.
				</p>
			)}
			{!defectFound && isSplitter && !isConnected && (
				<p className="text-center text-base text-blue-500 italic">
					Перетащите один из коннекторов выхода к порту VFL прибора
				</p>
			)}
			{!defectFound && isSplitter && isConnected && !vflEnabled && (
				<p className="text-center text-base text-gray-500 italic">
					✓ Выход подключён. Включите VFL на приборе.
				</p>
			)}
			{!defectFound && showSplBeam && !splActiveHasDefect && (
				<p className="text-center text-base text-amber-600 italic">
					Луч без нарушений. Подключите другой выход для проверки.
				</p>
			)}
			{!defectFound && showSplBeam && splActiveHasDefect && (
				<p className="text-center text-base text-red-500 italic">
					Луч VFL активен. Найдите и нажмите на точку дефекта.
				</p>
			)}
		</>
	);
}
