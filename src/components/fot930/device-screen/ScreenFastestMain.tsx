import { Show } from '../../../lib/components';
import type { DeviceState } from '../../../types/fot930';
import { DropdownField } from './DropdownField';

interface ScreenFastestMainProps {
	state: DeviceState;
}

export function ScreenFastestMain({ state }: ScreenFastestMainProps) {
	const { referenceResults, referenceType, fastestSettings } =
		state.preparation;
	const { fiberCounter } = state;
	const hasReference = referenceResults.length > 0;
	const isReferenceTypeSelected = state.fastestMainReferenceTypeSelected;

	// Форматирование номера волокна с лидирующими нулями
	const fiberNumber = fiberCounter.toString().padStart(3, '0');

	// Форматирование даты и времени
	const formatDateTime = (timestamp: number) => {
		const date = new Date(timestamp);
		return date.toISOString().slice(0, 19).replace('T', ' ');
	};

	const imageFile =
		referenceType === 'LOOPBACK' ? 'loopback.png' : 'point-to-point.png';

	// Опции для выпадающего списка типа опорного значения
	const referenceTypeOptions = ['Обрат. петля', 'Точка-точка', 'Нет этл'];
	const referenceTypeValue =
		referenceType === 'LOOPBACK'
			? 'Обрат. петля'
			: referenceType === 'POINT_TO_POINT'
				? 'Точка-точка'
				: 'Нет этл';

	return (
		<div className="flex flex-col w-full h-full text-xs relative">
			<div className="text-lg font-bold mb-2 text-fot930-blue">
				FasTest 930 ({fastestSettings.portType})
			</div>

			<div className="flex gap-2">
				<div>
					<DropdownField
						label="След. кабель:"
						value="BigCable"
						isSelected={false}
						isActive={false}
						options={[]}
						isOpen={false}
					/>

					<DropdownField
						label="След. волокно:"
						value={`BCFiber${fiberNumber}`}
						isSelected={false}
						isActive={false}
						options={[]}
						isOpen={false}
					/>

					<DropdownField
						label="Тип опор. зн:"
						value={referenceTypeValue}
						isSelected={isReferenceTypeSelected}
						isActive={true}
						options={referenceTypeOptions}
						selectedIndex={state.dropdownIndex}
						isOpen={state.openDropdown === 'REFERENCE_TYPE'}
					/>
				</div>

				<div className="flex h-20 grow justify-center items-center">
					<Show when={referenceType !== 'NONE'}>
						<img
							className="h-20"
							src={`/images/device/${imageFile}`}
							alt={referenceTypeValue}
						/>
					</Show>
				</div>
			</div>

			<div className="flex-1">
				{hasReference ? (
					<div className="flex gap-2">
						<div className="w-18 text-center bg-green-50 border border-green-300 px-2 py-1 text-[10px] inline-block rounded">
							Нажмите FasTest, чтобы начать тест
						</div>

						<div className="grow">
							<div className="flex gap-3 items-center">
								<div className="shrink-0 text-fot930-blue">Опор. зн. (дБ)</div>
								<div className="w-full h-px bg-fot930-blue"></div>
							</div>

							{/* Таблица опорных значений */}
							<div className="border border-gray-300 mt-2">
								<div className="flex bg-gray-100 border-b border-gray-300">
									<div className="w-1/3 p-1 text-[10px] font-semibold border-r border-gray-300"></div>
									{fastestSettings.lossWavelengths.map((wl) => (
										<div
											key={wl}
											className="w-1/3 p-1 text-[10px] font-semibold text-center border-r border-gray-300 last:border-r-0"
										>
											{wl}
										</div>
									))}
								</div>
								<div className="flex">
									<div className="w-1/3 p-1 text-[10px] border-r border-gray-300">
										вн. помехи
									</div>
									{fastestSettings.lossWavelengths.map((wl) => {
										const ref = referenceResults.find(
											(r) => r.wavelength === wl
										);
										return (
											<div
												key={wl}
												className="w-1/3 p-1 text-[10px] text-center border-r border-gray-300 last:border-r-0"
											>
												{ref ? `${ref.value.toFixed(2)}` : '-'}
											</div>
										);
									})}
								</div>
							</div>

							{/* Дата последнего измерения */}
							<div className="text-[10px] text-fot930-blue mt-1">
								Изм. опорн. зн. между точек (
								{formatDateTime(referenceResults[0].timestamp)})
							</div>
						</div>
					</div>
				) : (
					<div className="flex justify-center text-center mt-2">
						<span className="bg-yellow-50 border border-yellow-300 mt-2 px-2 py-2 text-[10px] text-yellow-800 rounded">
							Измерение опорного значения ещё не было произведено
						</span>
					</div>
				)}
			</div>

			{/* TODO: Сделать вывод ошибки временным */}
			{/* Overlay для ошибки подключения */}
			<Show when={state.connectionError}>
				<div className="absolute -inset-8 bg-black/15 bg-opacity-20 flex justify-center items-center z-10">
					<div className="bg-red-50 border-2 border-red-300 px-4 py-3 text-[11px] text-red-800 rounded-lg shadow-lg max-w-xs text-center">
						<div className="font-semibold text-red-600 mb-1">
							⚠ Ошибка схемы подключения
						</div>
						<div className="text-[10px]">
							Проверьте правильность сборки схемы
						</div>
					</div>
				</div>
			</Show>
		</div>
	);
}
