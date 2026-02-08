/**
 * Редактируемая ячейка таблицы результатов с валидацией
 */

import clsx from 'clsx';
import { useEffect, useState } from 'react';
import type { CellStatus } from '../../../../types/fot930';

interface EditableCellProps {
	/** Введенное значение */
	value: number | null;

	/** Фактическое значение из прибора (для валидации) */
	actualValue: number;

	/** Статус валидации */
	status: CellStatus;

	/** Доступна ли ячейка для редактирования */
	isEditable: boolean;

	/** Callback при изменении значения (onBlur) */
	onValueChange: (value: number) => void;

	/** Сообщение об ошибке */
	errorMessage?: string;
}

export function EditableCell({
	value,
	status,
	isEditable,
	onValueChange,
	errorMessage
}: EditableCellProps) {
	// Локальное состояние для ввода (строка)
	const [localValue, setLocalValue] = useState<string>(
		value !== null ? value.toFixed(2) : ''
	);

	// Синхронизируем локальное значение с prop value при его изменении
	useEffect(() => {
		if (value !== null) {
			setLocalValue(value.toFixed(2));
		} else {
			setLocalValue('');
		}
	}, [value]);

	/**
	 * Обработчик onBlur - валидация при потере фокуса
	 */
	const handleBlur = () => {
		if (!isEditable) {
			return;
		}

		const trimmed = localValue.trim();

		// Пустое значение - не валидируем
		if (trimmed === '') {
			return;
		}

		// Парсим число
		const numValue = parseFloat(trimmed);

		if (Number.isNaN(numValue)) {
			// Некорректное число - возвращаем предыдущее значение
			setLocalValue(value !== null ? value.toFixed(2) : '');
			return;
		}

		// Отправляем значение для валидации
		onValueChange(numValue);
	};

	/**
	 * Обработчик onChange - обновляем локальное состояние
	 */
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!isEditable) {
			return;
		}
		setLocalValue(e.target.value);
	};

	const placeholder = isEditable ? '0.00' : '—';

	return (
		<td
			className={clsx(
				'px-4 py-3 text-center',
				status === 'error' && 'bg-red-50',
				status === 'valid' && 'bg-green-50',
				status === 'empty' && isEditable && 'bg-yellow-50'
			)}
		>
			<div className="flex flex-col items-center gap-1">
				<input
					type="text"
					step="0.01"
					value={localValue}
					onChange={handleChange}
					onBlur={handleBlur}
					disabled={!isEditable}
					placeholder={placeholder}
					className={clsx(
						'w-20 px-2 py-1 text-center font-mono border rounded',
						'focus:outline-none focus:ring-2 focus:ring-blue-500',
						isEditable
							? 'bg-white border-gray-300 hover:border-gray-400'
							: 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-500',
						status === 'error' && isEditable && 'border-red-500',
						status === 'valid' && 'border-green-500'
					)}
				/>

				{/* Сообщение об ошибке */}
				{status === 'error' && errorMessage && (
					<div className="text-xs text-red-600 max-w-[150px] text-center">
						{errorMessage}
					</div>
				)}

				{/* Индикатор валидного значения */}
				{status === 'valid' && (
					<div className="text-xs text-green-600 font-medium">✓</div>
				)}

				{/* Подсказка для пустой ячейки */}
				{status === 'empty' && isEditable && (
					<div className="text-xs text-yellow-700">Требуется ввод</div>
				)}
			</div>
		</td>
	);
}
