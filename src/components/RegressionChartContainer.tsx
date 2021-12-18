import React from "react";
import {
	Chart as ChartJS,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Legend,
	ChartOptions,
	ChartData,
	CoreChartOptions,
} from "chart.js";

import { Chart } from "react-chartjs-2";

import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

import {
	RegressionDataset,
	Regression,
	RegressionType,
} from "../scripts/regressiondata";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

type SortingChartContainerProps = {
	dataset: RegressionDataset;
	regressions?: Regression<RegressionType>[];
};

const ContainerPaper = styled(Paper)(({ theme }) => ({
	height: "fit-content",
	width: "80%",
	position: "relative",
	border: `2px solid ${theme.palette.divider}`,
	margin: "0.1rem 0",
}));

const chart_options: ChartOptions = {
	maintainAspectRatio: true,
	aspectRatio: 1,
	animation: false,
	responsive: true,
	layout: {
		padding: 5,
	},
	plugins: {
		tooltip: {
			enabled: false,
		},
		legend: { display: false },
	},
	scales: {
		yAxes: {
			display: false,
		},
		xAxes: {
			display: false,
		},
	},
};

type Colormap = {
	[key in RegressionType]: string;
};

let colormap: { [key: number]: string } = {};
colormap[RegressionType.Artif] = "#ff8800";
colormap[RegressionType.Guess] = "#454bee";
colormap[RegressionType.Answer] = "#61F416";

export default function SortingChartContainer({
	dataset,
	regressions,
}: SortingChartContainerProps) {
	// build chart dataset here, not in an external manner, then take in cues to know what style to display/data to highlight
	const full_datasets = [];
	const paired_coords: { x: number; y: number }[] = [];

	for (let i = 0; i < dataset.x_vals.length; i++) {
		paired_coords.push({ x: dataset.x_vals[i], y: dataset.y_vals[i] });
	}

	const scatter_set = {
		type: "scatter" as const,
		label: "points",
		data: paired_coords,
	};

	full_datasets.push(scatter_set);

	// regressions
	if (regressions) {
		for (const regression of regressions)
		{
			let color = colormap[regression.reg_type];
			let linear_pair: [{ x: number; y: number }, { x: number; y: number }];
			linear_pair = [{x: 0, y: regression.y_int}, {x: 100, y: (100*regression.slope)+regression.y_int}];
			console.log(linear_pair)

			const linear_set = {
				type: "line" as const,
				label: "regressions",
				data: linear_pair,
				borderColor: color,
				borderWidth: 5,
			};

			full_datasets.push(linear_set);
		}
	}

	const full_set = {
		labels: ["X"],
		datasets: full_datasets,
	};

	return (
		<ContainerPaper elevation={2} sx={{}}>
			<Chart type="scatter" data={full_set} options={chart_options} />
		</ContainerPaper>
	);
}
