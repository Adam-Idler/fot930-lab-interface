export type DefectModuleState = {
	selectedComponentId: string | null;
	confirmReset: boolean;
	completedVflStepIds: string[];
	completedComponentIds: string[];
	fipDefectTypeAnswer: number | null;
	actionAnswer: number | null;
	actionAnswerGoodInput: number | null;
	vflCharAnswers: Record<string, { idx: number; locked: boolean }>;
};

export const initialDefectModuleState: DefectModuleState = {
	selectedComponentId: null,
	confirmReset: false,
	completedVflStepIds: [],
	completedComponentIds: [],
	fipDefectTypeAnswer: null,
	actionAnswer: null,
	actionAnswerGoodInput: null,
	vflCharAnswers: {}
};
