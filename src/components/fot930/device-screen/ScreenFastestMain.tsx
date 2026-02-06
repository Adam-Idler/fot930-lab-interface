import type { DeviceState } from '../../../types/fot930';

interface ScreenFastestMainProps {
	state: DeviceState;
}

export function ScreenFastestMain({ state }: ScreenFastestMainProps) {
	const { referenceResults, referenceType, fastestSettings } =
		state.preparation;
	const hasReference = referenceResults.length > 0;
	const isReferenceTypeSelected = state.fastestMainReferenceTypeSelected;
	const waveLengthsLength = fastestSettings.lossWavelengths.length;

	// Форматирование даты и времени
	const formatDateTime = (timestamp: number) => {
		const date = new Date(timestamp);
		return date.toISOString().slice(0, 19).replace('T', ' ');
	};

	return (
		<div className="flex flex-col w-full h-full p-3 text-xs">
			<div className="text-sm font-bold mb-3 pb-1 border-b border-fot930-blue text-fot930-blue">
				FasTest 930 ({fastestSettings.portType})
			</div>

			<div className="space-y-2 flex-1">
				<div>
					<span className="font-semibold">След. кабель:</span>{' '}
					<span className="text-gray-600">BigCable</span>
				</div>

				<div>
					<span className="font-semibold">След. волокно:</span>{' '}
					<span className="text-gray-600">BCFiber001</span>
				</div>

				<div
					className={`p-2 -ml-2 rounded border-2 transition-all ${
						isReferenceTypeSelected
							? 'border-blue-500 bg-blue-50'
							: 'border-transparent'
					}`}
				>
					<span className="font-semibold">Тип опор. зн:</span>{' '}
					<span className="text-gray-800 font-bold">
						{referenceType === 'LOOPBACK'
							? 'Обрат. петля'
							: referenceType === 'POINT_TO_POINT'
								? 'Точка-точка'
								: 'Нет этл'}
					</span>
				</div>

				{hasReference ? (
					<>
						<div className="bg-green-50 border border-green-300 px-2 py-1 text-[10px] text-green-700 inline-block rounded">
							Нажмите FasTest, чтобы начать тест
						</div>

						{/* Таблица опорных значений */}
						<div className="border border-gray-300 mt-2">
							<div
								className={`grid grid-cols-${waveLengthsLength + 1} bg-gray-100 border-b border-gray-300`}
							>
								<div className="p-1 text-[10px] font-semibold border-r border-gray-300"></div>
								{fastestSettings.lossWavelengths.map((wl) => (
									<div
										key={wl}
										className="p-1 text-[10px] font-semibold text-center border-r border-gray-300 last:border-r-0"
									>
										{wl}
									</div>
								))}
							</div>
							<div className={`grid grid-cols-${waveLengthsLength + 1}`}>
								<div className="p-1 text-[10px] border-r border-gray-300">
									вн. помехи
								</div>
								{fastestSettings.lossWavelengths.map((wl) => {
									const ref = referenceResults.find((r) => r.wavelength === wl);
									return (
										<div
											key={wl}
											className="p-1 text-[10px] text-center border-r border-gray-300 last:border-r-0"
										>
											{ref ? `${ref.value.toFixed(2)}dBm` : '-'}
										</div>
									);
								})}
							</div>
						</div>

						{/* Дата последнего измерения */}
						<div className="text-[9px] text-gray-500 mt-1">
							Изм. опорн. зн. между точек (
							{formatDateTime(referenceResults[0].timestamp)})
						</div>
					</>
				) : (
					<div className="bg-yellow-50 border border-yellow-300 px-2 py-2 text-[10px] text-yellow-800 rounded">
						Измерение опорного значения ещё не было произведено
					</div>
				)}
			</div>

			<div className="text-[10px] text-gray-500 text-center border-t border-gray-200 pt-1">
				UP/DOWN: Navigation | ENTER: Change | F1: Reference | F2: Measure
			</div>
		</div>
	);
}
