import clsx from 'clsx';
import type { DeviceState } from '../../../types/fot930';

interface ScreenFastestResultsProps {
	state: DeviceState;
}

export function ScreenFastestResults({ state }: ScreenFastestResultsProps) {
	const { currentFiberResult } = state;
	const { fastestSettings } = state.preparation;

	if (!currentFiberResult) {
		return (
			<div className="flex items-center justify-center w-full h-full p-3 text-xs">
				<div className="text-gray-500">No results available</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col w-full h-full text-xs">
			{/* Заголовок */}
			<div className="text-lg font-bold mb-2 text-fot930-blue">
				Результаты по кабелю
			</div>

			{/* Верхняя строка: Название кабеля слева, название волокна справа */}
			<div className="flex justify-between mb-3">
				<div>
					<span className="font-semibold">Кабель:</span>{' '}
					<span className="text-gray-800">{currentFiberResult.cableName}</span>
				</div>
				<div>
					<span className="font-semibold">Волокно:</span>{' '}
					<span className="text-gray-800">{currentFiberResult.fiberName}</span>
				</div>
			</div>

			{/* Основной контент: вкладки слева, таблица справа */}
			<div className="flex gap-2 mb-2 flex-1">
				{/* Вертикальные вкладки слева */}
				<div className="flex flex-col gap-1">
					<VerticalTab label="Потери" active />
					<VerticalTab label="ORL" active={false} disabled />
					<VerticalTab label="D" active={false} disabled />
				</div>

				{/* Контент справа */}
				<div className="flex-1 flex flex-col">
					{/* Подзаголовок таблицы */}
					<div className="text-xs text-center font-semibold mb-1">
						Потери (дБ)
					</div>

					{/* Таблица результатов */}
					<div className="border border-gray-300">
						{/* Заголовок таблицы */}
						<div className="grid grid-cols-4 bg-gray-100 border-b border-gray-300">
							<div className="p-1 text-[10px] font-semibold border-r border-gray-300">
								λ (нм)
							</div>
							<div className="p-1 text-[10px] font-semibold text-center border-r border-gray-300">
								A→B
							</div>
							<div className="p-1 text-[10px] font-semibold text-center border-r border-gray-300">
								B→A
							</div>
							<div className="p-1 text-[10px] font-semibold text-center">
								СР
							</div>
						</div>

						{/* Строки данных для каждой длины волны */}
						{currentFiberResult.wavelengths.map((result) => (
							<div
								key={result.wavelength}
								className="grid grid-cols-4 border-b border-gray-300 last:border-b-0"
							>
								<div className="p-1 text-[10px] border-r border-gray-300">
									{result.wavelength}
								</div>
								<div className="p-1 text-[10px] text-center border-r border-gray-300">
									{result.aToB.toFixed(2)}
								</div>
								<div className="p-1 text-[10px] text-center border-r border-gray-300">
									{result.bToA.toFixed(2)}
								</div>
								<div className="p-1 text-[10px] text-center font-semibold">
									{result.average.toFixed(2)}
								</div>
							</div>
						))}
					</div>

					{/* Длина волокна */}
					<div className="text-[10px] text-center text-gray-600 mt-2">
						Длина волокна: {currentFiberResult.fiberLength}{' '}
						{fastestSettings.lengthUnit}
					</div>
				</div>
			</div>

			{/* Подсказки управления */}
			<div className="text-[10px] text-gray-500 text-center border-t border-gray-200 pt-1 mt-auto">
				FasTest: Measure Next
			</div>
		</div>
	);
}

/**
 * Вспомогательный компонент вертикальной вкладки
 */
interface VerticalTabProps {
	label: string;
	active: boolean;
	disabled?: boolean;
}

function VerticalTab({ label, active, disabled = false }: VerticalTabProps) {
	return (
		<div
			className={clsx(
				'px-2 py-1 text-[10px] rounded border',
				active && 'bg-blue-100 border-blue-400 font-semibold text-blue-800',
				!active && !disabled && 'bg-gray-50 border-gray-300 text-gray-600',
				disabled && 'bg-gray-100 border-gray-200 text-gray-400'
			)}
		>
			{label}
		</div>
	);
}
