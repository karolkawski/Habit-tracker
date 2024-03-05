import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { utcParse } from "d3";
import { startOfMonth, getDay } from "date-fns";

const CalendarChart = ({
  data,
  dimensions,
}: {
  data: any;
  dimensions: any;
}) => {
  const svgRef = React.useRef(null);
  const { margin } = dimensions;
  const [chartParentWidth, setChartWrapperSize] = useState(300);
  useEffect(() => {
    console.log(chartParentWidth);
    const parentW =
      document.querySelector(".Statistic__Chart")?.clientWidth || margin.left;

    setChartWrapperSize(parentW - margin.left);

    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove();
    d3.selectAll(".tooltip").remove();

    makeXAxis();
    makeYAxis();

    const { mouseleave, mousemove, mouseover } = makeTooltip();

    //@ts-ignore
    makeSquares(data, mouseleave, mousemove, mouseover);
  }, [chartParentWidth]);

  let selectedLegend = {};
  const ofsets = { left: 50 };
  const svgWidth = chartParentWidth + margin.left + margin.right;
  const cellSize = (chartParentWidth - ofsets.left) / 72;
  const height = 7 * cellSize + 50;

  const svgHeight = height + margin.top + margin.bottom;
  const dayNames = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  data.sort(
    (a: { date: string }, b: { date: string }) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const yScale = d3
    .scaleBand()
    .domain([...dayNames])
    .range([0, (cellSize + 5) * 7]);

  const xScale = d3
    .scaleTime()
    .domain([new Date("2023-01-01"), new Date("2023-12-31")])
    .range([0, chartParentWidth - ofsets.left]);

  const colorScale = d3
    .scaleLinear<string>()
    .range(["#e7e9e9", "#69b3a2"])
    .domain([0, 1]);

  const xAxis = d3
    .axisBottom<Date>(xScale)
    .tickFormat(d3.timeFormat("%b") as any)
    .ticks(12);

  const yAxis = d3.axisRight(yScale).ticks(8);

  type CustomMouseEvent<T extends HTMLElement> = MouseEvent & {
    target: T;
  };
  const onSquareClickHandler = (
    e: CustomMouseEvent<HTMLDivElement>,
    value: number
  ) => {
    const prevAttribute = e.target.getAttribute("prev");
    const nextAttribute = e.target.getAttribute("next");

    if (prevAttribute !== null && nextAttribute !== null) {
      const prev = Number.parseFloat(prevAttribute);
      const next = Number.parseFloat(nextAttribute);
      const svgEl = d3.select(svgRef.current);

      svgEl
        .select(".legend")
        .selectAll("rect")
        .style("stroke-width", "1x")
        .style("stroke", "rgb(204, 204, 204)");

      e.target.style.strokeWidth = "1px";
      e.target.style.stroke = "rgb(0,0,0)";

      selectedLegend = {};
      //@ts-ignore
      selectedLegend[value] = {
        next: next,
        prev: prev,
      };

      svgEl.select("#close-btn").style("opacity", "1");

      if (Object.keys(selectedLegend).length === 0) {
        svgEl.selectAll(".record").style("visibility", "visible");
        return;
      }

      Object.keys(selectedLegend).map((key) => {
        //@ts-ignore
        const { prev, next } = selectedLegend[key];
        svgEl
          .selectAll(".record")
          .style("visibility", (d: any) =>
            d.value > prev && d.value < next ? "visible" : "hidden"
          );
      });
    }
  };

  const resetFilter = () => {
    const svgEl = d3.select(svgRef.current);

    svgEl
      .select(".legend")
      .selectAll("rect")
      .style("stroke-width", "1x")
      .style("stroke", "rgb(204, 204, 204)");

    selectedLegend = {};

    svgEl.selectAll(".record").style("visibility", "visible");

    svgEl.select("#close-btn").style("opacity", "0");
  };

  const makeLegend = () => {
    const svgEl = d3.select(svgRef.current);
    const numColorStops = 10; // Number of color stops in the legend
    const colorStopHeight = 20; // Height of each color stop rectangle
    const colorStopWidth = 40; // Width of each color stop rectangle
    const legend = svgEl.append("svg").attr("class", "legend");

    for (let i = 0; i < numColorStops; i++) {
      const value = i * (5000 / (numColorStops - 1)); // Calcula3 value for each stop
      const color = colorScale(value);

      legend
        .append("rect")
        .attr("x", i * colorStopWidth)
        .attr("y", cellSize * 8 + 20)
        .attr("width", colorStopWidth)
        .attr("height", colorStopHeight)
        .attr("prev", i === 0 ? 0 : (i - 1) * (5000 / (numColorStops - 1)))
        .attr(
          "next",
          i === numColorStops - 1
            ? 5000
            : (i + 1) * (5000 / (numColorStops - 1))
        )
        .style("stroke-width", "1px")
        .style("stroke", "#ccc")
        .style("fill", color)
        .style("transform", `translate(${ofsets.left}px, 40px)`)
        .style("cursor", "pointer")
        .on("click", (e: any) => onSquareClickHandler(e, value));

      legend
        .append("text")
        .style("font-size", "11px")
        .attr("x", i * colorStopWidth + 5)
        .attr("y", cellSize * 8 + 50)
        .text(value.toFixed(0))
        .style("transform", `translate(${ofsets.left}px, 45px)`)
        .style("cursor", "default");
    }

    legend
      .append("text")
      .attr("x", 11 * colorStopWidth + 15)
      .attr("y", height + 20)
      .style("cursor", "pointer")
      .style("opacity", "0")
      .attr("id", "close-btn")
      .on("click", resetFilter)
      .text("X");
  };

  const calculateSquareX = (d: YourDataType) => {
    const dayofMonth = new Date(d.date).getDate();
    const firstDayOfMonth = startOfMonth(new Date(d.date));

    const startDayOfWeek = getDay(firstDayOfMonth);

    const dayofWeek = new Date(d.date).getDay();
    const month = new Date(d.date).getMonth();

    const isStartOfWeek =
      startDayOfWeek === 0
        ? dayofWeek === startDayOfWeek
        : dayofWeek >= startDayOfWeek;

    let monthWeekDay = isStartOfWeek
      ? dayofMonth % 7 === 0
        ? (dayofMonth - 1) / 7
        : dayofMonth / 7
      : dayofMonth % 7 === 0
      ? (dayofMonth - 1) / 7 + 1
      : dayofMonth / 7 + 1;

    if (startDayOfWeek != 0 && dayofMonth / 7 < 7 && dayofWeek === 0) {
      monthWeekDay = monthWeekDay - 1;
    }

    const monthWeekDayFloor = Math.floor(monthWeekDay);
    return month * (6 * cellSize) + monthWeekDayFloor * cellSize;
  };

  interface YourDataType {
    value: number;
    date: string;
  }
  const makeSquares = (
    data: unknown[],
    mouseleave: (() => void) | null,
    mousemove: {
      (e: MouseEvent, d: { date: any; value: any }): void;
      (arg0: unknown, arg1: number): void;
    },
    mouseover: (() => void) | null
  ) => {
    const svgEl = d3.select(svgRef.current);

    svgEl
      .append("defs")
      .append("SVG:clipPath")
      .attr("id", "clip")
      .append("SVG:rect")
      .attr("width", chartParentWidth)
      .attr("height", cellSize * 8 + 50)
      .attr("x", 0)
      .attr("y", 0);

    const scatter = svgEl
      .append("svg")
      .attr("width", chartParentWidth)
      .attr("height", cellSize * 8 + 50)
      .append("g")
      .attr("clip-path", "url(#clip)");

    scatter
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("class", "record")
      .attr("width", cellSize - 2)
      .attr("height", cellSize - 2)
      .attr("data", (d) => `${(d as YourDataType).value}`)
      .attr("date", (d) => `${(d as YourDataType).date}`)
      .attr("y", (d) => {
        const dayOfWeek = new Date((d as YourDataType).date).getDay();
        return dayOfWeek === 0
          ? 6 * (cellSize + 5)
          : (dayOfWeek - 1) * (cellSize + 5);
      })
      .attr("x", (d) => calculateSquareX(d as YourDataType))
      .attr("fill", (d) => colorScale((d as YourDataType).value))
      .style("cursor", "pointer")
      //@ts-ignore
      .on("mouseover", mouseover)
      .on("mousemove", (e, d) => mousemove(e, d))
      //@ts-ignore
      .on("mouseleave", mouseleave)
      .attr("transform", `translate(${ofsets.left}, 30)`);
  };

  const formatData = (data: string) => {
    const dataICzasObiekt = new Date(data);

    const rok = dataICzasObiekt.getFullYear();
    const miesiac = String(dataICzasObiekt.getMonth() + 1).padStart(2, "0");
    const dzien = String(dataICzasObiekt.getDate()).padStart(2, "0");

    return `${rok}-${miesiac}-${dzien}`;
  };

  const makeTooltip = () => {
    const tooltip = d3
      .select(".Statistic__Chart")
      .append("div")
      .style("visibilty", "hidden")
      .style("opacity", "0")
      .attr("class", "tooltip");

    const mouseover = () => {
      tooltip.style("visibility", "visible").style("opacity", "1");
    };

    const mouseleave = () => {
      tooltip.style("visibility", "hidden");
    };

    const mousemove = function (e: MouseEvent, d: { date: any; value: any }) {
      const parseDate = utcParse("%Y-%m-%dT%H:%M:%S.%LZ");

      console.log(d.date);

      const formattedDate = formatData(parseDate(d.date));

      tooltip
        .html(
          `<div class="tooltip__date">${formattedDate}</div>
                    <div class="tooltip__content">The exact value of<br>this cell is: ${d.value}</div>`
        )
        .style("left", () => e.clientX + 1 + "px")
        .style("top", () => e.clientY + "px");
    };

    return { mouseover, mouseleave, mousemove };
  };

  const makeXAxis = () => {
    const svgEl = d3.select(svgRef.current);

    svgEl
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(${ofsets.left},0)`)
      .call(xAxis);
  };

  const makeYAxis = () => {
    const svgEl = d3.select(svgRef.current);

    svgEl
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", "translate(10,25)")
      .call(yAxis);
  };

  useEffect(() => {
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove();
    d3.selectAll(".tooltip").remove();

    makeXAxis();
    makeYAxis();

    const { mouseleave, mousemove, mouseover } = makeTooltip();

    //@ts-ignore
    makeSquares(data, mouseleave, mousemove, mouseover);
  }, [data]);

  return (
    <svg
      ref={svgRef}
      width={svgWidth + margin.left}
      height={svgHeight + 50}
      style={{ padding: "10px", border: "1px solid #ccc" }}
    />
  );
};

export default CalendarChart;
