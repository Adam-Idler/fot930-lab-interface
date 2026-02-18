/**
 * Нижняя панель экрана прибора FOT-930
 * Отображает функции кнопок F1 и F2.
 * Стрелки — индикаторы: переключение выполняется кнопками LEFT/RIGHT на D-pad прибора.
 */

import clsx from 'clsx';
import type { DeviceState } from '../../../types/fot930';

interface FooterItem {
	label: string;
	enabled?: boolean;
}

function getFooterItems(state: DeviceState): FooterItem[] {
	switch (state.screen) {
		case 'FASTEST_SETUP': {
			const { fastestSettings } = state.preparation;
			const isCorrect =
				fastestSettings.portType === 'SM' &&
				fastestSettings.lengthUnit === 'm' &&
				fastestSettings.lossWavelengths.includes(1310) &&
				fastestSettings.lossWavelengths.includes(1550) &&
				!fastestSettings.lossWavelengths.includes(1625);
			return [
				{ label: 'Заводские настройки' },
				{ label: 'FasTest Изм.', enabled: isCorrect }
			];
		}

		case 'FASTEST_MAIN': {
			const { preparation } = state;
			return [
				{
					label: 'Изм. опор. сигнал',
					enabled: preparation.referenceType === 'LOOPBACK'
				},
				{
					label: 'Начать тест',
					enabled: preparation.isReadyForMeasurements
				},
				{ label: 'Перейти к настр. FasTest' }
			];
		}

		default:
			return [];
	}
}

interface DeviceFooterProps {
	state: DeviceState;
}

export function DeviceFooter({ state }: DeviceFooterProps) {
	const items = getFooterItems(state);
	if (items.length < 2) return null;

	const idx = state.footerPageIndex;
	const f1Item = items[idx];
	const f2Item = items[idx + 1];
	const hasNavigation = items.length > 2;
	const canGoLeft = hasNavigation && idx > 0;
	const canGoRight = hasNavigation && idx < items.length - 2;

	const f1Label = f1Item?.label ?? '';
	const f1Enabled = f1Item?.enabled !== false;
	const f2Label = f2Item?.label ?? '';
	const f2Enabled = f2Item?.enabled !== false;
	return (
		<div className="w-full flex items-center gap-1.5 px-2 pb-1">
			{/* Левый квадратный блок — индикатор стрелки влево */}
			<div
				className={clsx(
					'w-6 h-6 shrink-0 flex items-center justify-center rounded border border-gray-400',
					canGoLeft ? 'bg-fot930-blue' : 'bg-white'
				)}
			>
				{canGoLeft && (
					<img
						src="/images/icons/triangle-filled-left.svg"
						width={8}
						alt=""
						className="brightness-0"
					/>
				)}
			</div>

			{/* Блок F1 */}
			<div
				className={clsx(
					'flex-1 h-6 rounded flex items-center justify-center px-1 overflow-hidden border',
					f1Enabled
						? 'bg-fot930-blue border-fot930-blue'
						: 'bg-gray-100 border-gray-300'
				)}
			>
				<span
					className={clsx(
						'text-[10px] font-semibold truncate',
						f1Enabled ? 'text-black' : 'text-gray-400'
					)}
				>
					{f1Label}
				</span>
			</div>

			{/* Блок F2 */}
			<div
				className={clsx(
					'flex-1 h-6 rounded flex items-center justify-center px-1 overflow-hidden border',
					f2Enabled
						? 'bg-fot930-blue border-fot930-blue'
						: 'bg-gray-100 border-gray-300'
				)}
			>
				<span
					className={clsx(
						'text-[10px] font-semibold truncate',
						f2Enabled ? 'text-black' : 'text-gray-400'
					)}
				>
					{f2Label}
				</span>
			</div>

			{/* Правый квадратный блок — индикатор стрелки вправо */}
			<div
				className={clsx(
					'w-6 h-6 shrink-0 flex items-center justify-center rounded border border-gray-400',
					canGoRight ? 'bg-fot930-blue' : 'bg-white'
				)}
			>
				{canGoRight && (
					<img
						src="/images/icons/triangle-filled-right.svg"
						width={8}
						alt=""
						className="brightness-0"
					/>
				)}
			</div>
		</div>
	);
}
