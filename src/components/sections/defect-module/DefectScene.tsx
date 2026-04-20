import { useRef, useState } from 'react';
import { CableScene } from './defect-scene/CableScene';
import {
	SPL_DEFECT_OUTPUT_IDX,
	SVG_HEIGHT_CABLE,
	SVG_HEIGHT_FIP,
	SVG_VIEW_WIDTH
} from './defect-scene/constants';
import { SceneHints } from './defect-scene/SceneHints';
import { SplitterScene } from './defect-scene/SplitterScene';
import { VflCharQuestion } from './defect-scene/VflCharQuestion';
import { VflDevice } from './defect-scene/VflDevice';

interface DefectSceneProps {
	componentId: string;
	onStepComplete?: (stepId: string) => void;
	completedStepIds?: string[];
	vflEnabled: boolean;
	vflMode: 'CW' | 'MODULATED';
}

export function DefectScene({
	componentId,
	onStepComplete,
	completedStepIds = [],
	vflEnabled,
	vflMode
}: DefectSceneProps) {
	const svgRef = useRef<SVGSVGElement>(null);
	const isConnected = completedStepIds.includes('connect_fiber');
	const isCable = componentId === 'optical_cable_2';
	const isSplitter = componentId === 'splitter_1_2';

	const [defectFound, setDefectFound] = useState(false);
	const [vflCharAnswers, setVflCharAnswers] = useState<
		Record<string, { idx: number; locked: boolean }>
	>({});
	const [splConnIdx, setSplConnIdx] = useState<0 | 1 | null>(null);

	const splEffIdx: 0 | 1 | null =
		splConnIdx ?? (isConnected && isSplitter ? 0 : null);
	const splActiveHasDefect = splEffIdx === SPL_DEFECT_OUTPUT_IDX;

	const showBeam = vflEnabled && isConnected;
	const beamBlink = vflMode === 'MODULATED';
	const showCableBeam = showBeam && isCable;
	const showSplBeam = showBeam && isSplitter && splEffIdx !== null;

	const handleDefectClick = () => {
		if (!defectFound) {
			setDefectFound(true);
			onStepComplete?.('find_defect');
		}
	};

	// VFL character question logic
	let questionKey: string | null = null;
	let correctAnswerIdx = -1;
	let isCompletionQuestion = false;

	if (isCable && defectFound) {
		questionKey = 'cable';
		correctAnswerIdx = 0;
		isCompletionQuestion = true;
	} else if (isSplitter) {
		if (splActiveHasDefect && defectFound) {
			questionKey = 'spl_bad';
			correctAnswerIdx = 1;
			isCompletionQuestion = true;
		} else if (!splActiveHasDefect && showSplBeam && splEffIdx !== null) {
			questionKey = 'spl_good';
			correctAnswerIdx = 3;
			isCompletionQuestion = false;
		}
	}

	const fipActive =
		isSplitter &&
		completedStepIds.includes('find_defect') &&
		completedStepIds.includes('characterize_vfl');
	const fipConnected = completedStepIds.includes('connect_fip');
	const svgHeight = fipActive ? SVG_HEIGHT_FIP : SVG_HEIGHT_CABLE;

	const showQuestion =
		questionKey !== null &&
		(!isCompletionQuestion || !completedStepIds.includes('characterize_vfl'));
	const currentVflAnswer = questionKey
		? vflCharAnswers[questionKey]
		: undefined;

	const handleVflCharAnswer = (idx: number) => {
		if (!questionKey || currentVflAnswer?.locked) return;
		const locked = idx === correctAnswerIdx;
		setVflCharAnswers((prev) => ({ ...prev, [questionKey!]: { idx, locked } }));
		if (locked && isCompletionQuestion) {
			onStepComplete?.('characterize_vfl');
		}
	};

	return (
		<div className="space-y-3">
			<div
				className="relative w-full"
				style={{ aspectRatio: `${SVG_VIEW_WIDTH} / ${svgHeight}` }}
			>
				<svg
					ref={svgRef}
					width="100%"
					height="100%"
					viewBox={`0 0 ${SVG_VIEW_WIDTH} ${svgHeight}`}
					preserveAspectRatio="xMidYMid meet"
					className="block w-full h-full bg-gray-50 border-2 border-gray-200 rounded-lg select-none"
				>
					<title>Визуализация компонента</title>
					<defs>
						<style>{`
							@keyframes pulse-stroke {
								0%, 100% { stroke-opacity: 1; }
								50% { stroke-opacity: 0.25; }
							}
							.drag-pulse { animation: pulse-stroke 1.4s ease-in-out infinite; }
							@keyframes vfl-blink {
								0%, 49% { opacity: 1; }
								50%, 99% { opacity: 0; }
							}
							.beam-blink { animation: vfl-blink 1s linear infinite; }
							@keyframes fip-snap-anim {
								0%, 100% { stroke-opacity: 0.7; }
								50% { stroke-opacity: 0.1; }
							}
							.fip-snap-ring { animation: fip-snap-anim 1.5s ease-in-out infinite; }
							@keyframes fip-tip-anim {
								0%, 100% { opacity: 1; }
								50% { opacity: 0.35; }
							}
							.fip-tip-pulse { animation: fip-tip-anim 1.4s ease-in-out infinite; }
						`}</style>
					</defs>
					<VflDevice connected={isConnected} />
					{isCable && (
						<CableScene
							svgRef={svgRef}
							isConnected={isConnected}
							showBeam={showCableBeam}
							beamBlink={beamBlink}
							defectFound={defectFound}
							onConnect={() => onStepComplete?.('connect_fiber')}
							onDefectClick={handleDefectClick}
						/>
					)}
					{isSplitter && (
						<SplitterScene
							svgRef={svgRef}
							splEffIdx={splEffIdx}
							showBeam={showSplBeam}
							beamBlink={beamBlink}
							defectFound={defectFound}
							splActiveHasDefect={splActiveHasDefect}
							onSnap={(idx) => {
								setSplConnIdx(idx);
								onStepComplete?.('connect_fiber');
							}}
							onDefectClick={handleDefectClick}
							fipActive={fipActive}
							fipConnected={fipConnected}
							onFipConnect={() => onStepComplete?.('connect_fip')}
						/>
					)}
				</svg>
			</div>
			<SceneHints
				isCable={isCable}
				isSplitter={isSplitter}
				isConnected={isConnected}
				vflEnabled={vflEnabled}
				defectFound={defectFound}
				showCableBeam={showCableBeam}
				showSplBeam={showSplBeam}
				splActiveHasDefect={splActiveHasDefect}
			/>
			{showQuestion && (
				<VflCharQuestion
					currentAnswer={currentVflAnswer}
					onAnswer={handleVflCharAnswer}
				/>
			)}
		</div>
	);
}
