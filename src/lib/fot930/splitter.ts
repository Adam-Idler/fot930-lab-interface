import type { PassiveComponentType } from '../../types/fot930';

/** Возвращает количество выходов сплиттера (0 для не-сплиттеров) */
export function getSplitterOutputCount(type: PassiveComponentType): number {
	const match = type.match(/^SPLITTER_1_(\d+)$/);
	return match ? parseInt(match[1], 10) : 0;
}

/** Является ли тип компонента сплиттером */
export function isSplitterType(type: PassiveComponentType): boolean {
	return type.startsWith('SPLITTER_');
}
