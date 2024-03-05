import React, { useState, useEffect } from "react";
import * as d3 from "d3";

const LineChart = ({ data, dimensions }: { data: any; dimensions: any }) => {
  const svgRef = React.useRef(null);
  const { margin } = dimensions;
  const ofsets = { left: 50, bottom: 50 };
  const [chartParentWidth, setChartWrapperSize] = useState(300);
  const height = 300;

  const makeChart = () => {
    if (data.length === 0) {
      return <></>;
    }

    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove();

    const xAccessor = (d: any) => new Date(d.date);
    const yAccessor = (d: any) => d.value;

    const xMinValue: Date | undefined = d3.min(data, xAccessor);
    const xMaxValue: Date | undefined = d3.max(data, xAccessor);
    const yMinValue: string | undefined = d3.min(data, yAccessor);
    const yMaxValue: string | undefined = d3.max(data, yAccessor);

    const xScale = d3
      .scaleTime()
      .domain([xMinValue || new Date(), xMaxValue || new Date()])
      .range([ofsets.left, chartParentWidth]);

    const yScale = d3
      .scaleLinear()
      .range([height - 80, 0])
      .domain([
        Number.parseInt(yMinValue as string) || 0,
        Number.parseInt(yMaxValue as string) || 0,
      ]);

    svg
      .append("g")
      .style("transform", `translate(0,${height - 50}px)`)
      .attr("id", "x-axis")
      .call(
        d3.axisBottom(xScale).tickFormat((date: any) => {
          return d3.timeFormat("%Y-%m-%d")(date);
        })
      );

    svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", "translate(10,25)")
      .call(d3.axisRight(yScale));

    const lineGenerator = d3
      .line<[number, number]>()
      .x((d) => xScale(xAccessor(d)) - ofsets.left)
      .y((d) => yScale(yAccessor(d)))
      .curve(d3.curveMonotoneX);

    var clip = svg
      .append("svg")
      .attr("id", "clip")
      .attr("width", chartParentWidth - ofsets.left)
      .attr("height", height)
      .attr("x", ofsets.left);

    clip
      .append("path")
      .datum(data)
      .attr("d", lineGenerator)
      .attr("fill", "none")
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 2)
      .attr("class", "line")
      .attr("transform", "translate(0,25)");

    clip
      .selectAll(".circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "circle")
      .attr("cx", (d) => xScale(xAccessor(d)) - ofsets.left)
      .attr("cy", (d) => yScale(yAccessor(d)))
      .attr("r", 4)
      .attr("fill", "#69b3a2")
      .attr("cursor", "pointer")
      .attr("transform", "translate(0,25)")

      .on("touchmouse mousemove", function (event, d) {
        //@ts-ignore
        const mousePos = d3.pointer(event, this);
        const tooltip = d3.select("#tolltip-linear");

        tooltip
          .style("display", "block")
          .style("top", `${mousePos[1] - 50}px`)
          .style("left", `${mousePos[0] + 50}px`);

        const inputDate = new Date(xAccessor(d));
        const year = inputDate.getFullYear();
        const month = String(inputDate.getMonth() + 1).padStart(2, "0");
        const day = String(inputDate.getDate()).padStart(2, "0");
        const hours = String(inputDate.getHours()).padStart(2, "0");
        const minutes = String(inputDate.getMinutes()).padStart(2, "0");
        const seconds = String(inputDate.getSeconds()).padStart(2, "0");

        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        tooltip.select(".tooltip__date").text(`${formattedDate}`);
        tooltip
          .select(".tooltip__content")
          .html(`The exact value of<br>this point line is: ${yAccessor(d)}`);
      })
      .on("mouseleave", function (event) {
        const tooltip = d3.select("#tolltip-linear");
        tooltip.style("display", "none");
      });

    interface ZoomEvent {
      transform: any;
    }

    function handleZoom(event: ZoomEvent) {
      const newTransform = event.transform;

      const newXScale = newTransform.rescaleX(xScale);
      const newYScale = newTransform.rescaleY(yScale);

      svg.select<SVGSVGElement>("#x-axis").call(d3.axisBottom(newXScale));

      const updatedLineGenerator = d3
        .line<[number, number]>()
        .x((d) => newXScale(xAccessor(d)) - ofsets.left)
        .y((d) => yScale(yAccessor(d)))
        .curve(d3.curveMonotoneX);

      const updatedLine = updatedLineGenerator(data);

      if (updatedLine !== null) {
        clip.select(".line").attr("d", updatedLine).attr("stroke-width", 2);
      }

      clip
        .selectAll(".circle")
        .attr("cx", (d) => newXScale(xAccessor(d)) - ofsets.left)
        .attr("cy", (d) => yScale(yAccessor(d)));
    }
    const zoomBehavior = d3
      .zoom<SVGSVGElement, ZoomEvent>()
      .scaleExtent([1, 50])
      .translateExtent([
        [ofsets.left, 0],
        [chartParentWidth - ofsets.left, height],
      ])
      .on("zoom", (event) => handleZoom(event));

    svg.call(zoomBehavior as any);
  };

  useEffect((): any => {
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove();

    makeChart();
  }, [data]);

  useEffect(() => {
    const parentW = document.querySelector(".lineChart")?.clientWidth || 0;

    console.log(parentW);
    setChartWrapperSize(parentW - ofsets.left);
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove();

    makeChart();
  }, [chartParentWidth]);

  return (
    <svg
      ref={svgRef}
      width={chartParentWidth + ofsets.left}
      height={height}
      style={{ padding: "10px", border: "1px solid #ccc" }}
    />
  );
};

export default LineChart;
