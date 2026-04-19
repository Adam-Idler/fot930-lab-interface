export type DefectModuleState = {
	selectedComponentId: string | null;
	confirmReset: boolean;
	completedVflStepIds: string[];
	completedComponentIds: string[];
};

export const initialDefectModuleState: DefectModuleState = {
	selectedComponentId: null,
	confirmReset: false,
	completedVflStepIds: [],
	completedComponentIds: []
};
