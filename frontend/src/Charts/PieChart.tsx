import { useEffect, useState } from "react";
import * as d3 from "d3";
import React from "react";

const PieChart = ({ data, dimensions }: { data: any; dimensions: any }) => {
  const svgRef = React.useRef(null);
  const { margin } = dimensions;
  const ofsets = { left: 50 };
  const [chartParentWidth, setChartWrapperSize] = useState(300);
  const height = 300;

  const onSquareClickHandler = (e: any, d: any) => {
    const svg = d3.select(svgRef.current);

    if (e.target.style.strokeWidth === "1px") {
      e.target.style.strokeWidth = "unset";
      e.target.style.stroke = "unset";
      svg.selectAll(".arc").style("visibility", "visible");
      return;
    }

    svg
      .selectAll(".pie-legend")
      .style("stroke-width", "unset")
      .style("stroke", "unset");

    e.target.style.strokeWidth = "1px";
    e.target.style.stroke = "rgb(0,0,0)";

    let selectedLegend = [];
    selectedLegend.push(d.data.name);

    svg.select("#close-btn").style("opacity", "1");

    if (selectedLegend.length === 0) {
      svg.selectAll(".arc").style("visibility", "visible");
      return;
    }

    selectedLegend.forEach((key) => {
      svg
        .selectAll(".arc")
        .style("visibility", (d: any) =>
          d.data.name === key ? "visible" : "hidden"
        );
    });
  };

  const makeChart = () => {
    if (data.length === 0) {
      return <></>;
    }

    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove();
    // set the dimensions and margins of the graph

    const radius =
      Math.min(chartParentWidth + ofsets.left, height) / 2 - margin;
    svg
      .append("svg")
      .attr("width", chartParentWidth + ofsets.left)
      .attr("height", height)
      .append("g")
      .attr(
        "transform",
        "translate(" + chartParentWidth / 2 + "," + height / 2 + ")"
      );

    const arc = d3
      .arc<any, d3.DefaultArcObject>()
      .outerRadius(radius - 10)
      .innerRadius(0);

    const colorScale = d3
      .scaleSequential(d3.interpolateRgb("#e7e9e9", "#69b3a2"))
      .domain([0, 5]);

    const pie = d3.pie<{ name: string; value: number }>().value(function (d) {
      return d.value;
    });

    const g = svg
      .selectAll(".arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc")
      .style(
        "transform",
        `translate(${(chartParentWidth + ofsets.left) / 2}px, ${height / 2}px)`
      );

    //   // append path, the pie for each age
    g.append("path")
      //@ts-ignore
      .attr("d", arc)
      .attr("fill", (d) => colorScale(d.value));

    //   // add text
    g.append("text")
      .attr("transform", function (d: any) {
        return "translate(" + arc.centroid(d) + ")";
      })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function (d) {
        return d.value;
      });

    const legendG = svg
      .selectAll(".legend")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("transform", function (d, i) {
        return "translate(" + 0 + "," + (i * 15 + 20) + ")";
      })
      .attr("class", "legend");

    legendG
      .append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("class", "pie-legend")
      .attr("fill", (d, i) => {
        return colorScale(d.value);
      })
      .style("cursor", "pointer")
      .on("click", (e, d: any) => onSquareClickHandler(e, d));

    legendG
      .append("text")
      .text(function (d) {
        return d.data.name + " (" + d.value + ")";
      })
      .style("font-size", 12)
      .attr("y", 10)
      .attr("x", 11);
  };

  useEffect((): any => {
    makeChart();
  }, [data]);

  useEffect(() => {
    const parentW =
      document.querySelector(".pieCharts")?.clientWidth || ofsets.left;

    setChartWrapperSize(parentW - ofsets.left);
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove();

    makeChart();
  }, [chartParentWidth]);

  return (
    <svg
      ref={svgRef}
      width={chartParentWidth + ofsets.left / 2}
      height={height}
      style={{ padding: "10px", border: "1px solid #ccc" }}
    />
  );
};

export default PieChart;
