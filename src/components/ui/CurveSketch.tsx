// src/components/ui/CurveSketch.tsx
"use client";
import React, { useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";

// Types for curve configuration
export interface CartesianPoint {
  x: number;
  y: number;
}

export interface PolarPoint {
  r: number;
  theta: number; // in radians
}

export interface CurveOptions {
  strokeColor?: string;
  strokeWidth?: number;
  strokeDashed?: boolean;
  pointRadius?: number;
  showPoints?: boolean;
  label?: string;
}

export interface CurveConfig {
  // For cartesian coordinates
  points?: CartesianPoint[];
  // For polar coordinates
  polarPoints?: PolarPoint[];
  // For polar equations (as string to be evaluated)
  polarEquation?: string;
  thetaRange?: [number, number]; // For polar equation
  numPoints?: number;
  options?: CurveOptions;
}

export interface CurveSketchProps {
  width?: number;
  height?: number;
  xRange?: [number, number];
  yRange?: [number, number];
  showGrid?: boolean;
  showAxes?: boolean;
  showLabels?: boolean;
  backgroundColor?: string;
  curves?: CurveConfig[];
  className?: string;
}

export const CurveSketch: React.FC<CurveSketchProps> = ({
  width = 400,
  height = 400,
  xRange = [-10, 10],
  yRange = [-10, 10],
  showGrid = true,
  showAxes = true,
  showLabels = true,
  backgroundColor = 'transparent',
  curves = [],
  className = '',
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Convert from math coordinates to SVG coordinates
  const mapX = (x: number): number => {
    const [xMin, xMax] = xRange;
    return ((x - xMin) / (xMax - xMin)) * width;
  };

  const mapY = (y: number): number => {
    const [yMin, yMax] = yRange;
    // Invert Y coordinate because SVG y-axis is inverted
    return height - ((y - yMin) / (yMax - yMin)) * height;
  };

  // Convert polar to cartesian coordinates
  const polarToCartesian = (r: number, theta: number): CartesianPoint => {
    return {
      x: r * Math.cos(theta),
      y: r * Math.sin(theta),
    };
  };

  // Generate SVG path for a series of points
  const generatePath = (points: CartesianPoint[]): string => {
    if (points.length === 0) return '';

    let path = `M ${mapX(points[0].x)} ${mapY(points[0].y)}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${mapX(points[i].x)} ${mapY(points[i].y)}`;
    }
    return path;
  };

  // Safely evaluate a polar equation string
  const evaluatePolarEquation = (equation: string, theta: number): number => {
    try {
      // Create a safe evaluation context with Math functions
      const safeEval = new Function('theta', 'Math', `return ${equation};`);
      return safeEval(theta, Math);
    } catch (error) {
      console.error('Error evaluating polar equation:', error);
      return 0;
    }
  };

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous content by setting innerHTML
    svgRef.current.innerHTML = '';

    // Add the SVG elements
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svgRef.current.appendChild(svg);

    // Draw background
    if (backgroundColor !== 'transparent') {
      const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      background.setAttribute('width', width.toString());
      background.setAttribute('height', height.toString());
      background.setAttribute('fill', backgroundColor);
      svg.appendChild(background);
    }

    // Draw grid
    if (showGrid) {
      const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      gridGroup.setAttribute('class', 'grid');

      // Calculate grid step sizes
      const xStep = (xRange[1] - xRange[0]) / 20;
      const yStep = (yRange[1] - yRange[0]) / 20;

      // Draw vertical grid lines
      for (let x = xRange[0]; x <= xRange[1]; x += xStep) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', mapX(x).toString());
        line.setAttribute('y1', mapY(yRange[0]).toString());
        line.setAttribute('x2', mapX(x).toString());
        line.setAttribute('y2', mapY(yRange[1]).toString());
        line.setAttribute('stroke', 'rgba(128, 128, 128, 0.2)');
        line.setAttribute('stroke-width', '1');
        gridGroup.appendChild(line);
      }

      // Draw horizontal grid lines
      for (let y = yRange[0]; y <= yRange[1]; y += yStep) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', mapX(xRange[0]).toString());
        line.setAttribute('y1', mapY(y).toString());
        line.setAttribute('x2', mapX(xRange[1]).toString());
        line.setAttribute('y2', mapY(y).toString());
        line.setAttribute('stroke', 'rgba(128, 128, 128, 0.2)');
        line.setAttribute('stroke-width', '1');
        gridGroup.appendChild(line);
      }

      svg.appendChild(gridGroup);
    }

    // Draw axes
    if (showAxes) {
      const axesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      axesGroup.setAttribute('class', 'axes');

      // X-axis
      const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      xAxis.setAttribute('x1', mapX(xRange[0]).toString());
      xAxis.setAttribute('y1', mapY(0).toString());
      xAxis.setAttribute('x2', mapX(xRange[1]).toString());
      xAxis.setAttribute('y2', mapY(0).toString());
      xAxis.setAttribute('stroke', 'rgba(0, 0, 0, 0.5)');
      xAxis.setAttribute('stroke-width', '2');
      axesGroup.appendChild(xAxis);

      // Y-axis
      const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      yAxis.setAttribute('x1', mapX(0).toString());
      yAxis.setAttribute('y1', mapY(yRange[0]).toString());
      yAxis.setAttribute('x2', mapX(0).toString());
      yAxis.setAttribute('y2', mapY(yRange[1]).toString());
      yAxis.setAttribute('stroke', 'rgba(0, 0, 0, 0.5)');
      yAxis.setAttribute('stroke-width', '2');
      axesGroup.appendChild(yAxis);

      // Axis labels
      if (showLabels) {
        // X-axis labels
        const xStep = (xRange[1] - xRange[0]) / 10;
        for (let x = xRange[0]; x <= xRange[1]; x += xStep) {
          if (Math.abs(x) > 0.1) { // Skip origin
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', mapX(x).toString());
            label.setAttribute('y', (mapY(0) + 20).toString());
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('font-size', '12');
            label.setAttribute('fill', 'rgba(0, 0, 0, 0.7)');
            label.textContent = x.toFixed(1);
            axesGroup.appendChild(label);
          }
        }

        // Y-axis labels
        const yStep = (yRange[1] - yRange[0]) / 10;
        for (let y = yRange[0]; y <= yRange[1]; y += yStep) {
          if (Math.abs(y) > 0.1) { // Skip origin
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', (mapX(0) + 10).toString());
            label.setAttribute('y', (mapY(y) + 5).toString());
            label.setAttribute('text-anchor', 'start');
            label.setAttribute('font-size', '12');
            label.setAttribute('fill', 'rgba(0, 0, 0, 0.7)');
            label.textContent = y.toFixed(1);
            axesGroup.appendChild(label);
          }
        }

        // Origin label
        const originLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        originLabel.setAttribute('x', (mapX(0) + 10).toString());
        originLabel.setAttribute('y', (mapY(0) + 20).toString());
        originLabel.setAttribute('text-anchor', 'start');
        originLabel.setAttribute('font-size', '12');
        originLabel.setAttribute('fill', 'rgba(0, 0, 0, 0.7)');
        originLabel.textContent = '0';
        axesGroup.appendChild(originLabel);
      }

      svg.appendChild(axesGroup);
    }

    // Draw each curve
    curves.forEach((curve, index) => {
      const curveGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      curveGroup.setAttribute('class', `curve-${index}`);

      const options = curve.options || {};
      const strokeColor = options.strokeColor || `hsl(${(index * 137) % 360}, 70%, 50%)`;
      const strokeWidth = options.strokeWidth || 2;
      const strokeDashed = options.strokeDashed || false;
      const showPoints = options.showPoints || false;
      const pointRadius = options.pointRadius || 3;

      let points: CartesianPoint[] = [];

      // Process cartesian points
      if (curve.points && curve.points.length > 0) {
        points = curve.points;
      }
      // Process polar points
      else if (curve.polarPoints && curve.polarPoints.length > 0) {
        points = curve.polarPoints.map((p) => polarToCartesian(p.r, p.theta));
      }
      // Process polar equation
      else if (curve.polarEquation) {
        const thetaRange = curve.thetaRange || [0, 2 * Math.PI];
        const numPoints = curve.numPoints || 200;
        const thetaStep = (thetaRange[1] - thetaRange[0]) / numPoints;

        for (let theta = thetaRange[0]; theta <= thetaRange[1]; theta += thetaStep) {
          const r = evaluatePolarEquation(curve.polarEquation, theta);
          if (!isNaN(r) && isFinite(r)) {
            points.push(polarToCartesian(r, theta));
          }
        }
      }

      // Draw the curve path
      if (points.length > 0) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', generatePath(points));
        path.setAttribute('stroke', strokeColor);
        path.setAttribute('stroke-width', strokeWidth.toString());
        path.setAttribute('fill', 'none');
        
        if (strokeDashed) {
          path.setAttribute('stroke-dasharray', '5,5');
        }
        
        curveGroup.appendChild(path);

        // Draw points if requested
        if (showPoints) {
          points.forEach((point, i) => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', mapX(point.x).toString());
            circle.setAttribute('cy', mapY(point.y).toString());
            circle.setAttribute('r', pointRadius.toString());
            circle.setAttribute('fill', strokeColor);
            curveGroup.appendChild(circle);
          });
        }

        // Add label if provided
        if (options.label) {
          // Use the middle point for label placement
          const middlePoint = points[Math.floor(points.length / 2)];
          const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          label.setAttribute('x', mapX(middlePoint.x).toString());
          label.setAttribute('y', (mapY(middlePoint.y) - 10).toString());
          label.setAttribute('text-anchor', 'middle');
          label.setAttribute('font-size', '14');
          label.setAttribute('fill', strokeColor);
          label.textContent = options.label;
          curveGroup.appendChild(label);
        }
      }

      svg.appendChild(curveGroup);
    });

  }, [width, height, xRange, yRange, showGrid, showAxes, showLabels, backgroundColor, curves]);

  return (
    <div className={cn("curve-sketch flex justify-center items-center", className)}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="bg-card border border-border rounded-md"
      />
    </div>
  );
};