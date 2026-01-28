/**
 * Компонент клавиатуры прибора FOT-930
 * Эмулирует физические кнопки управления прибором
 */

import type { DeviceButton } from '../../types/fot930';

interface DeviceKeyboardProps {
	onButtonPress: (button: DeviceButton) => void;
	disabled?: boolean;
}

export function DeviceKeyboard({
	onButtonPress,
	disabled = false
}: DeviceKeyboardProps) {
	return (
		<div className="grid grid-cols-3 gap-3 p-4 bg-gray-800 rounded-lg">
			{/* Верхний ряд: Power, Menu, Measure */}
			<Button
				label="POWER"
				onClick={() => onButtonPress('POWER')}
				className="bg-red-600 hover:bg-red-700"
				disabled={disabled}
			/>
			<Button
				label="MENU"
				onClick={() => onButtonPress('MENU')}
				className="bg-blue-600 hover:bg-blue-700"
				disabled={disabled}
			/>
			<Button
				label="MEASURE"
				onClick={() => onButtonPress('MEASURE')}
				className="bg-green-600 hover:bg-green-700"
				disabled={disabled}
			/>

			{/* Средний ряд: Back, Up, Enter */}
			<Button
				label="BACK"
				onClick={() => onButtonPress('BACK')}
				className="bg-gray-600 hover:bg-gray-700"
				disabled={disabled}
			/>
			<Button
				label="UP"
				icon="↑"
				onClick={() => onButtonPress('UP')}
				className="bg-gray-700 hover:bg-gray-800"
				disabled={disabled}
			/>
			<Button
				label="ENTER"
				onClick={() => onButtonPress('ENTER')}
				className="bg-blue-600 hover:bg-blue-700"
				disabled={disabled}
			/>

			{/* Нижний ряд: пустая, Down, пустая */}
			<div />
			<Button
				label="DOWN"
				icon="↓"
				onClick={() => onButtonPress('DOWN')}
				className="bg-gray-700 hover:bg-gray-800"
				disabled={disabled}
			/>
			<div />
		</div>
	);
}

interface ButtonProps {
	label: string;
	icon?: string;
	onClick: () => void;
	className?: string;
	disabled?: boolean;
}

function Button({
	label,
	icon,
	onClick,
	className = '',
	disabled = false
}: ButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={`
				px-4 py-3 rounded-lg font-semibold text-white text-sm
				transition-all duration-150
				active:scale-95
				disabled:opacity-50 disabled:cursor-not-allowed
				shadow-lg hover:shadow-xl
				${className}
			`}
		>
			{icon ? (
				<div className="flex flex-col items-center gap-1">
					<span className="text-2xl">{icon}</span>
					<span className="text-xs">{label}</span>
				</div>
			) : (
				<span>{label}</span>
			)}
		</button>
	);
}
