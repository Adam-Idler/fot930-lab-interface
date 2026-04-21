export function VflDevice({ connected }: { connected: boolean }) {
	return (
		<g>
			<rect x={8} y={72} width={60} height={156} rx={8} fill="#1e293b" />
			<rect
				x={57}
				y={142}
				width={11}
				height={16}
				rx={2}
				fill={connected ? '#15803d' : '#1e3a5f'}
			/>
			<circle cx={38} cy={92} r={7} fill={connected ? '#22c55e' : '#dc2626'} />
			{connected && (
				<circle cx={38} cy={92} r={11} fill="#22c55e" opacity={0.25} />
			)}
			<text x={38} y={158} textAnchor="middle" fontSize={12} fill="#94a3b8">
				VFL
			</text>
			<text
				x={-14}
				y={150}
				textAnchor="middle"
				dominantBaseline="middle"
				fontSize={13}
				fill="#9ca3af"
				transform="rotate(-90, -14, 150)"
				style={{ userSelect: 'none' }}
			>
				Прибор
			</text>
		</g>
	);
}
