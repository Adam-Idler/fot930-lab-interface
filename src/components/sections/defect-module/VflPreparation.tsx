import clsx from 'clsx';

interface VflStep {
	id: string;
	title: string;
	description: string;
}

const VFL_STEPS: VflStep[] = [
	{
		id: 'connect_fiber',
		title: 'Подключите волокно к порту VFL',
		description:
			'Подключите один конец проверяемого волокна к порту VFL на приборе.'
	},
	{
		id: 'open_menu',
		title: 'Откройте меню «Источник/VFL»',
		description:
			'Нажмите кнопку MENU на приборе, перейдите к пункту «Источник/VFL» с помощью кнопок UP/DOWN и подтвердите выбор кнопкой ENTER.'
	},
	{
		id: 'select_vfl_mode',
		title: 'Перейдите в режим VFL',
		description:
			'В меню «Источник/VFL» выберите пункт «VFL» с помощью кнопок UP/DOWN и нажмите ENTER.'
	},
	{
		id: 'enable_vfl',
		title: 'Включите VFL',
		description:
			'Нажмите кнопку F1 для включения источника VFL. На экране прибора отобразится индикатор активного излучения.'
	}
];

interface VflPreparationProps {
	/** Идентификаторы завершённых шагов. Пустой массив — ни один не завершён. */
	completedStepIds?: string[];
}

export function VflPreparation({ completedStepIds = [] }: VflPreparationProps) {
	const completedSet = new Set(completedStepIds);
	const allComplete = VFL_STEPS.every((s) => completedSet.has(s.id));

	if (allComplete) {
		return (
			<div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 flex items-center gap-3">
				<div className="shrink-0 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
					✓
				</div>
				<span className="font-medium text-green-800">
					Подготовка VFL завершена
				</span>
			</div>
		);
	}

	// Первый незавершённый шаг — активный
	const activeIndex = VFL_STEPS.findIndex((s) => !completedSet.has(s.id));

	return (
		<div className="space-y-3">
			<h2 className="text-base font-semibold text-gray-800">Подготовка VFL</h2>
			{VFL_STEPS.map((step, index) => {
				const isComplete = completedSet.has(step.id);
				const isActive = index === activeIndex;
				const isLocked = !isComplete && !isActive;

				return (
					<div
						key={step.id}
						className={clsx(
							'border-2 rounded-lg p-4 transition-all',
							isComplete
								? 'border-green-500 bg-green-50'
								: isActive
									? 'border-blue-300 bg-blue-50'
									: 'border-gray-300 bg-gray-50 opacity-60'
						)}
					>
						<div className="flex items-start gap-3">
							<div
								className={clsx(
									'shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
									isComplete
										? 'bg-green-500 text-white'
										: isActive
											? 'bg-blue-500 text-white'
											: 'bg-gray-300 text-gray-700'
								)}
							>
								{isComplete ? '✓' : index + 1}
							</div>

							<div className="flex-1">
								<h4 className="font-semibold text-gray-900 mb-1">
									{step.title}
								</h4>

								{isLocked ? (
									<p className="text-xs text-gray-500 italic">
										Сначала выполните предыдущие шаги
									</p>
								) : isComplete ? (
									<div className="bg-green-100 border border-green-300 rounded p-2">
										<p className="text-xs text-green-800">✓ Выполнено</p>
									</div>
								) : (
									<p className="text-sm text-gray-600">{step.description}</p>
								)}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
