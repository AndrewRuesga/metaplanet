import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
	// Parse query parameters
	const { searchParams } = new URL(request.url);
	const ticker = searchParams.get('ticker');
	const from = searchParams.get('from') || '2025-01-01';
	const to = searchParams.get('to') || new Date().toISOString().split('T')[0];

	if (!ticker) {
		return NextResponse.json({ success: false, error: 'Missing ticker parameter' }, { status: 400 });
	}

	try {
		// Convert dates to timestamps (Yahoo Finance expects Unix timestamps)
		const period1 = Math.floor(new Date(from).getTime() / 1000);
		const period2 = Math.floor(new Date(to).getTime() / 1000);

		// Fetch data using the `chart()` method
		const rawData = await yahooFinance.chart(ticker, { period1, period2 });
		if (!rawData || !rawData?.quotes?.[0]) {
			return NextResponse.json(
				{ success: false, error: 'No data available for the given ticker or period' },
				{ status: 404 }
			);
		}

		const formattedData = rawData.quotes.map((quote, index) => ({
			date: quote.date.toISOString().split('T')[0],
			price: quote.close || 0,
		}));

		return NextResponse.json(formattedData);
	} catch (error) {
		console.error('Error fetching ticker data:', error);
		return NextResponse.json({ success: false, error: 'Failed to fetch ticker data' }, { status: 500 });
	}
}
