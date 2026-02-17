/**
 * Шапка экрана прибора FOT-930
 * Отображает индикаторы, дату, время и индикатор питания
 */

import { useEffect, useState } from 'react';

export function DeviceHeader() {
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const formatDate = (date: Date): string => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	};

	const formatTime = (date: Date): string => {
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		return `${hours}:${minutes}`;
	};

	return (
		<div className="w-full bg-fot930-blue text-white text-xs font-semibold py-0.5 px-4 flex justify-between items-center">
			{/* Левая часть - индикаторы */}
			<div className="flex items-center gap-2">
				{/* Разделитель слева */}
				<span className="text-white/50">|</span>

				{/* PM индикатор */}
				<div className="flex items-center gap-0.5">
					<div className="w-3 h-2 bg-yellow-600 border border-white/30" />
					<span>PM</span>
				</div>

				{/* Ист. Выкл индикатор */}
				<div className="flex items-center gap-0.5">
					<div className="w-3 h-2 bg-green-900 border border-white/30" />
					<span>Ист. Выкл</span>
				</div>

				{/* VFL индикатор */}
				<div className="flex items-center gap-0.5">
					<div className="w-3 h-2 bg-red-900 border border-white/30" />
					<span>VFL</span>
				</div>

				{/* Разделитель справа */}
				<span className="text-white/50">|</span>
			</div>

			{/* Правая часть - дата, время, батарея */}
			<div className="flex items-center gap-0.5">
				<span>{formatDate(currentTime)}</span>
				<span className="text-white/50">|</span>
				<span>{formatTime(currentTime)}</span>
				<span className="text-white/50">|</span>
				{/* Иконка батареи */}
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1"
					strokeLinecap="round"
					strokeLinejoin="round"
					role="img"
					aria-label="Батарея"
				>
					<title>Батарея</title>
					{/* Корпус батареи */}
					<rect x="2" y="7" width="16" height="10" rx="1" ry="1" />
					{/* Внутренность батареи (зеленая заливка) */}
					<rect x="3" y="8" width="14" height="8" rx="0.5" ry="0.5" fill="#22c55e" />
					{/* Контакт батареи */}
					<line x1="22" y1="11" x2="18" y2="11" />
					<line x1="22" y1="13" x2="18" y2="13" />
				</svg>
				{/* Иконка вилки с кабелем */}
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#FFD700"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					role="img"
					aria-label="Питание от сети"
				>
					<title>Питание от сети</title>
					{/* Штыри вверх */}
					<line x1="9" y1="2" x2="9" y2="6" />
					<line x1="15" y1="2" x2="15" y2="6" />
					{/* Корпус вилки */}
					<rect x="7" y="6" width="10" height="8" rx="1" fill="#FFD700" />
					{/* Кабель вниз */}
					<line x1="12" y1="14" x2="12" y2="20" />
				</svg>
			</div>
		</div>
	);
}
