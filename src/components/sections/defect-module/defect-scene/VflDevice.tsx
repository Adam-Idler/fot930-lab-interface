export function VflDevice({ connected }: { connected: boolean }) {
	return (
		<g>
			<rect x={5} y={48} width={40} height={104} rx={5} fill="#1e293b" />
			<rect
				x={38}
				y={86}
				width={7}
				height={28}
				rx={2}
				fill={connected ? '#15803d' : '#1e3a5f'}
			/>
			<circle
				cx={25}
				cy={61}
				r={4.5}
				fill={connected ? '#22c55e' : '#dc2626'}
			/>
			{connected && (
				<circle cx={25} cy={61} r={7} fill="#22c55e" opacity={0.25} />
			)}
			<text x={25} y={105} textAnchor="middle" fontSize={8} fill="#94a3b8">
				VFL
			</text>
			<text x={25} y={167} textAnchor="middle" fontSize={9} fill="#9ca3af">
				Прибор
			</text>
		</g>
	);
}
