import type { DeviceState } from '../../../types/fot930';

interface ScreenFastestMeasuringProps {
	state: DeviceState;
}

export function ScreenFastestMeasuring({ state }: ScreenFastestMeasuringProps) {
	const { fastestSettings } = state.preparation;

	// Если нет referenceResults, это Reference измерение
	const isReferenceMeasurement = state.currentMeasurementType === 'REFERENCE';

	return (
		<div className="flex flex-col items-center justify-center w-full h-full">
			<div className="text-lg font-bold mb-2 text-fot930-blue">
				{isReferenceMeasurement
					? 'Измерение опор. значения...'
					: 'Измерение волокна...'}
			</div>

			<div className="w-full max-w-50 mb-4">
				<div className="flex justify-center gap-1">
					{[0, 1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className="w-2 h-8 bg-fot930-blue animate-pulse"
							style={{ animationDelay: `${i * 0.1}s` }}
						/>
					))}
				</div>
			</div>

			<div className="text-xs text-gray-600 text-center space-y-1">
				<div>Режим: {fastestSettings.portType}</div>
				<div>Длины волн: {fastestSettings.lossWavelengths.join('nm, ')}nm</div>
			</div>

			<div className="text-[10px] text-gray-500 mt-4">Пожалуйста, подождите...</div>
		</div>
	);
}
