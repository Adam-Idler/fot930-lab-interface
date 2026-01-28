import type {
	CompletedMeasurement,
	PassiveComponent
} from '../../../../types/fot930';
import { MeasurementTable } from '../../../fot930';

interface ResultsStageProps {
	measurements: CompletedMeasurement[];
	components: PassiveComponent[];
}

// TODO: Вывод результатов должен быть в приборе
// Пофиксить сохранение результатов в таблицу
export function ResultsStage({ measurements, components }: ResultsStageProps) {
	return (
		<div className="space-y-6">
			<div className="bg-white rounded-lg shadow-md p-6">
				<h2 className="text-xl font-semibold mb-4">
					Этап 5. Анализ результатов измерений
				</h2>

				<p className="text-sm text-gray-600 mb-4">
					Всего выполнено измерений: <strong>{measurements.length}</strong>
				</p>
			</div>

			{/* Таблицы результатов для каждого компонента */}
			{components.map((component) => (
				<MeasurementTable
					key={component.id}
					measurements={measurements}
					componentId={component.id}
					componentLabel={component.label}
				/>
			))}

			{measurements.length === 0 && (
				<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
					<p className="text-yellow-800">
						Нет выполненных измерений. Перейдите к этапу "Измерения" для
						выполнения измерений.
					</p>
				</div>
			)}
		</div>
	);
}
