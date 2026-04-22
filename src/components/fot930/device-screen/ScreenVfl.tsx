import clsx from 'clsx';
import type { DeviceState } from '../../../types/fot930';

interface VflDropdownProps {
	value: string;
	isSelected: boolean;
	isOpen: boolean;
	options: string[];
	highlightIndex: number;
}

function VflDropdown({
	value,
	isSelected,
	isOpen,
	options,
	highlightIndex
}: VflDropdownProps) {
	return (
		<div className="relative">
			<div
				className={clsx(
					'flex items-center gap-1 rounded border px-1 py-0.5 transition-all',
					isSelected ? 'border-fot930-blue bg-blue-50' : 'border-transparent'
				)}
			>
				<span className="font-bold grow text-sm text-gray-800">{value}</span>
				<span
					className={clsx(
						'text-xs px-0.5',
						isSelected ? 'bg-fot930-blue text-white' : 'text-fot930-blue'
					)}
				>
					▼
				</span>
			</div>

			{isOpen && (
				<div className="absolute top-full left-0 mt-0.5 bg-white border border-gray-300 rounded shadow-lg z-10 min-w-full">
					{options.map((option, index) => (
						<div
							key={option}
							className={clsx(
								'px-2 py-0.5 text-sm whitespace-nowrap',
								index === highlightIndex
									? 'bg-fot930-blue text-white font-bold'
									: 'text-gray-800'
							)}
						>
							{option}
						</div>
					))}
				</div>
			)}
		</div>
	);
}

interface ScreenVflProps {
	state: DeviceState;
}

export function ScreenVfl({ state }: ScreenVflProps) {
	const vflValue = state.vflEnabled ? 'Вкл' : 'Выкл';
	const modValue = state.vflModulationMode === 'CW' ? 'CW' : 'Модул';

	const vflHighlightIndex =
		state.openDropdown === 'VFL_ENABLED'
			? state.dropdownIndex
			: state.vflEnabled
				? 0
				: 1;
	const modHighlightIndex =
		state.openDropdown === 'VFL_MODULATION'
			? state.dropdownIndex
			: state.vflModulationMode === 'CW'
				? 0
				: 1;

	return (
		<div className="flex w-full h-full">
			{/* Левая панель: управление VFL (1/3) */}
			<div
				className="flex flex-col justify-end p-2 border-r border-gray-200"
				style={{ width: '34%' }}
			>
				<div className="text-xl font-semibold text-fot930-blue mb-2 pb-1">
					VFL
				</div>
				<div className="space-y-2">
					<VflDropdown
						value={vflValue}
						isSelected={state.vflSectionIndex === 0}
						isOpen={state.openDropdown === 'VFL_ENABLED'}
						options={['Вкл', 'Выкл']}
						highlightIndex={vflHighlightIndex}
					/>
					<VflDropdown
						value={modValue}
						isSelected={state.vflSectionIndex === 1}
						isOpen={state.openDropdown === 'VFL_MODULATION'}
						options={['CW', 'Модул']}
						highlightIndex={modHighlightIndex}
					/>
				</div>
			</div>

			{/* Правая панель: измеритель мощности (2/3), отображается серым */}
			<div className="flex flex-col p-2 flex-1 min-w-0">
				<div className="text-xl font-semibold text-gray-300 mb-2 pb-1">
					Измер-ль мощн.
				</div>

				{/* Кабель (disabled) */}
				<div className="flex items-center justify-between gap-1 mb-5">
					<div className="flex items-center gap-0.5">
						<span className="text-xs font-bold text-gray-300">BigCable</span>
						<span className="text-xs text-gray-300">▼</span>
					</div>
					<span className="text-xs text-gray-300">BCFiber015</span>
				</div>

				{/* Показания мощности */}
				<div className="flex justify-center items-end ml-12 gap-5">
					<span className="text-6xl font-semibold text-gray-300 leading-none tabular-nums">
						-7.25
					</span>
					<div className="flex flex-col gap-0.5">
						<div className="flex items-center gap-0.5">
							<span className="text-xs font-bold text-gray-300">дБм</span>
							<span className="text-xs text-gray-300">▼</span>
						</div>
						<div className="flex items-center gap-0.5 mt-5 -mb-10">
							<span className="text-xs font-bold text-gray-300">1550 нм</span>
							<span className="text-xs text-gray-300">▼</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
