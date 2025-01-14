'use client';

import { useEffect, useState } from 'react';

import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const Ticker = () => {
	const [chartData, setChartData] = useState<any>([]);
	const tickerSymbol = '3350.T'; // Metaplanet ticker
	const [isTrendingUp, setIsTrendingUp] = useState(true); // Optional
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch(
					`/api/ticker?ticker=${tickerSymbol}&from=2024-01-01&to=${new Date().toISOString().split('T')[0]}`
				);
				const data = await res.json();

				setChartData(data);
				setIsLoading(false);
			} catch (error) {
				console.error('Error fetching chart data:', error);
				setError(true);
			}
		};

		fetchData();
	}, []);

	if (error || (!isLoading && !chartData.length)) return <div>error</div>;
	if (isLoading) return <div>Loading...</div>;

	const chartConfig = {
		price: {
			label: 'Price (JPY)',
			color: 'hsl(var(--chart-1))',
		},
	} as ChartConfig;

	return (
		<Card>
			<CardHeader>
				<CardTitle>3350 Stock Price</CardTitle>
				<CardDescription>Metaplanet (Daily Closing Prices)</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<AreaChart
						data={chartData}
						margin={{
							left: 12,
							right: 12,
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value) => value.slice(5)} // Show only MM-DD
						/>
						<ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" hideLabel />} />
						<Area
							dataKey="price"
							type="linear"
							fill="var(--color-price)"
							fillOpacity={0.4}
							stroke="var(--color-price)"
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
			<CardFooter>
				<div className="flex w-full items-start gap-2 text-sm">
					<div className="grid gap-2">
						<div className="flex items-center gap-2 font-medium leading-none">
							{isTrendingUp ? 'Trending up' : 'Trending down'}{' '}
							<TrendingUp className={`h-4 w-4 ${isTrendingUp ? '' : 'rotate-180'}`} />
						</div>
						<div className="flex items-center gap-2 leading-none text-muted-foreground">
							From {chartData[0]?.date} to {chartData[chartData.length - 1]?.date}
						</div>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
};

export { Ticker };
