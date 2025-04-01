// src/components/shared/math/CurveSketchInteractive.tsx
"use client";
import React, { useState, useCallback } from 'react';
import { 
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
  Button,
  Card, CardContent, CardHeader, CardTitle, CardDescription,
  Input,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  Slider,
  Switch,
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/shadcn";
import { CurveSketch, CurveConfig, CurveOptions } from '@/components/shared/CurveSketch';
import { Plus, Trash2, RefreshCw, EyeOff, Eye } from 'lucide-react';

// Types for equation inputs
type EquationType = 'cartesian' | 'polar' | 'parametric';

interface EquationInputState {
  type: EquationType;
  cartesian: string; // y = f(x)
  polar: string; // r = f(θ)
  parametricX: string; // x = f(t)
  parametricY: string; // y = f(t)
  tMin: number;
  tMax: number;
  numPoints: number;
  options: CurveOptions;
  visible: boolean;
}

interface RangeState {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

// Parse a mathematical expression safely
const parseExpression = (expr: string, variable: string): ((val: number) => number) => {
  try {
    // Create a safe function that evaluates the expression
    const func = new Function(variable, 'Math', `
      try {
        return ${expr};
      } catch (e) {
        return NaN;
      }
    `);
    
    return (val: number) => {
      try {
        const result = func(val, Math);
        return isNaN(result) || !isFinite(result) ? NaN : result;
      } catch {
        return NaN;
      }
    };
  } catch {
    return () => NaN;
  }
};

// Generate equation label based on equation type and expressions
const generateEquationLabel = (eq: EquationInputState): string => {
  if (eq.type === 'cartesian') {
    return `y = ${eq.cartesian}`;
  } else if (eq.type === 'polar') {
    return `r = ${eq.polar}`;
  } else { // parametric
    return `x = ${eq.parametricX}, y = ${eq.parametricY}`;
  }
};

// Generate a curve configuration from an equation input
const equationToCurveConfig = (eq: EquationInputState): CurveConfig | null => {
  if (!eq.visible) return null;
  
  try {
    if (eq.type === 'cartesian') {
      const f = parseExpression(eq.cartesian, 'x');
      
      // Generate points
      const points = [];
      const numPoints = eq.numPoints || 100;
      const xMin = -10;
      const xMax = 10;
      const step = (xMax - xMin) / numPoints;
      
      for (let x = xMin; x <= xMax; x += step) {
        const y = f(x);
        if (!isNaN(y)) {
          points.push({ x, y });
        }
      }
      
      return {
        points,
        options: {
          ...eq.options,
          label: generateEquationLabel(eq)
        }
      };
    } 
    else if (eq.type === 'polar') {
      return {
        polarEquation: eq.polar,
        thetaRange: [0, 2 * Math.PI],
        numPoints: eq.numPoints || 200,
        options: {
          ...eq.options,
          label: generateEquationLabel(eq)
        }
      };
    } 
    else { // parametric
      const fx = parseExpression(eq.parametricX, 't');
      const fy = parseExpression(eq.parametricY, 't');
      
      // Generate points
      const points = [];
      const numPoints = eq.numPoints || 100;
      const tMin = eq.tMin || 0;
      const tMax = eq.tMax || 2 * Math.PI;
      const step = (tMax - tMin) / numPoints;
      
      for (let t = tMin; t <= tMax; t += step) {
        const x = fx(t);
        const y = fy(t);
        if (!isNaN(x) && !isNaN(y)) {
          points.push({ x, y });
        }
      }
      
      return {
        points,
        options: {
          ...eq.options,
          label: generateEquationLabel(eq)
        }
      };
    }
  } catch (e) {
    console.error('Error converting equation to curve:', e);
    return null;
  }
};

// Generate a unique color for a new curve
const getUniqueColor = (index: number): string => {
  const colors = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#22c55e', // green
    '#f59e0b', // amber
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f97316', // orange
  ];
  
  return colors[index % colors.length];
};

// Default equation state
const defaultEquationState: EquationInputState = {
  type: 'cartesian',
  cartesian: 'Math.sin(x)',
  polar: 'Math.sin(3 * theta)', // r = sin(3θ) (rose curve)
  parametricX: 'Math.cos(t)',
  parametricY: 'Math.sin(t)',
  tMin: 0,
  tMax: 2 * Math.PI,
  numPoints: 200,
  options: {
    strokeColor: '#3b82f6',
    strokeWidth: 2,
    showPoints: false,
    pointRadius: 3,
    strokeDashed: false,
    label: 'y = sin(x)'
  },
  visible: true
};

// Default range state
const defaultRangeState: RangeState = {
  xMin: -10,
  xMax: 10,
  yMin: -10,
  yMax: 10
};

interface InteractiveCurveSketchProps {
  initialCurves?: CurveConfig[];
  initialRange?: { xRange?: [number, number]; yRange?: [number, number] };
  width?: number;
  height?: number;
}

export const CurveSketchInteractive = ({
  initialCurves,
  initialRange,
  width = 600,
  height = 400
}: InteractiveCurveSketchProps) => {
  // State for visualization options
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [backgroundColor] = useState('transparent');
  
  // State for ranges
  const [ranges, setRanges] = useState<RangeState>({
    ...defaultRangeState,
    ...(initialRange ? {
      xMin: initialRange.xRange?.[0] ?? -10,
      xMax: initialRange.xRange?.[1] ?? 10,
      yMin: initialRange.yRange?.[0] ?? -10,
      yMax: initialRange.yRange?.[1] ?? 10
    } : {})
  });

  // State for equations
const [equations, setEquations] = useState<EquationInputState[]>(() => {
    if (initialCurves && initialCurves.length > 0) {
      return initialCurves.map((curve, index) => {
        // Create an appropriate equation state based on the curve type
        const eqState = { ...defaultEquationState };
        
        // Handle curve types
        if (curve.polarEquation) {
          eqState.type = 'polar';
          eqState.polar = curve.polarEquation;
          eqState.tMin = curve.thetaRange?.[0] ?? 0;
          eqState.tMax = curve.thetaRange?.[1] ?? (2 * Math.PI);
          eqState.numPoints = curve.numPoints || 200;
        } else if (curve.points) {
          eqState.type = 'cartesian';
          // If we have discrete points, we'd need to fit a function or show them as is
        } else if (curve.polarPoints) {
          eqState.type = 'polar';
          // Similar to points, we'd need to handle discrete polar points
        }
        
        // Set the options
        eqState.options = {
          ...defaultEquationState.options,
          ...curve.options,
          strokeColor: curve.options?.strokeColor || getUniqueColor(index),
          label: curve.options?.label || `Curve ${index + 1}`
        };
        
        return eqState;
      });
    }
    
    return [{ ...defaultEquationState }];
  });
  
  // Active equation being edited
  const [activeEquationIndex, setActiveEquationIndex] = useState(0);
  
  // Generate curve configs from equations
  const generateCurveConfigs = useCallback((): CurveConfig[] => {
    return equations
      .map(equationToCurveConfig)
      .filter((config): config is CurveConfig => config !== null);
  }, [equations]);
  
  // Add a new equation
  const addEquation = () => {
    const newIndex = equations.length;
    setEquations([
      ...equations,
      {
        ...defaultEquationState,
        options: {
          ...defaultEquationState.options,
          strokeColor: getUniqueColor(newIndex),
          label: `Curve ${newIndex + 1}`
        }
      }
    ]);
    setActiveEquationIndex(newIndex);
  };
  
  // Delete an equation
  const deleteEquation = (index: number) => {
    if (equations.length <= 1) return; // Always keep at least one equation
    
    const newEquations = [...equations];
    newEquations.splice(index, 1);
    setEquations(newEquations);
    
    // Update active index if needed
    if (activeEquationIndex >= newEquations.length) {
      setActiveEquationIndex(newEquations.length - 1);
    }
  };
  
  // Update equation at index
  const updateEquation = (index: number, updates: Partial<EquationInputState>) => {
    const newEquations = [...equations];
    newEquations[index] = {
      ...newEquations[index],
      ...updates
    };
    
    // Update label if equation type or expression changed
    if (updates.type || updates.cartesian || updates.polar || 
        updates.parametricX || updates.parametricY) {
      const eq = {
        ...newEquations[index],
        ...updates
      };
      newEquations[index].options.label = generateEquationLabel(eq);
    }
    
    setEquations(newEquations);
  };
  
  // Toggle equation visibility
  const toggleEquationVisibility = (index: number) => {
    const newEquations = [...equations];
    newEquations[index] = {
      ...newEquations[index],
      visible: !newEquations[index].visible
    };
    setEquations(newEquations);
  };
  
  // Update equation options
  const updateEquationOptions = (index: number, updates: Partial<CurveOptions>) => {
    const newEquations = [...equations];
    newEquations[index] = {
      ...newEquations[index],
      options: {
        ...newEquations[index].options,
        ...updates
      }
    };
    setEquations(newEquations);
  };
  
  // Reset to default view
  const resetView = () => {
    setRanges(defaultRangeState);
    setShowGrid(true);
    setShowAxes(true);
    setShowLabels(true);
  };
  
  // Current active equation
  const activeEquation = equations[activeEquationIndex];
  
  // Generate curve configs
  const curveConfigs = generateCurveConfigs();
  
  return (
    <div className="w-full">
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Interactive Math Visualization</CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-2"
                onClick={resetView}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Reset View
              </Button>
            </div>
          </div>
          <CardDescription>
            Explore mathematical functions with interactive visualization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Visualization panel */}
            <div className="flex-1">
              <div className="bg-card border rounded-md p-4 flex justify-center items-center">
                <CurveSketch
                  width={width}
                  height={height}
                  xRange={[ranges.xMin, ranges.xMax]}
                  yRange={[ranges.yMin, ranges.yMax]}
                  showGrid={showGrid}
                  showAxes={showAxes}
                  showLabels={showLabels}
                  backgroundColor={backgroundColor}
                  curves={curveConfigs}
                  className="w-full"
                />
              </div>
              
              {/* Equations list */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Equations</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={addEquation}
                    className="h-7 px-2"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Equation
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {equations.map((eq, index) => (
                    <div 
                      key={index}
                      className={`
                        flex items-center p-2 rounded-md cursor-pointer
                        ${activeEquationIndex === index ? 'bg-accent' : 'hover:bg-secondary/50'}
                        ${!eq.visible ? 'opacity-50' : ''}
                      `}
                      onClick={() => setActiveEquationIndex(index)}
                    >
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: eq.options.strokeColor }}
                      />
                      <div className="flex-1 text-sm truncate">
                        {eq.options.label}
                      </div>
                      <button 
                        className="p-1 rounded-md hover:bg-secondary"
                        onClick={(e) => { 
                          e.stopPropagation();
                          toggleEquationVisibility(index);
                        }}
                      >
                        {eq.visible ? 
                          <Eye className="h-4 w-4 text-muted-foreground" /> : 
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        }
                      </button>
                      {equations.length > 1 && (
                        <button 
                          className="p-1 rounded-md hover:bg-secondary"
                          onClick={(e) => { 
                            e.stopPropagation();
                            deleteEquation(index);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Controls panel */}
            <div className="md:w-80 space-y-4">
              <Tabs defaultValue="equation">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="equation">Equation</TabsTrigger>
                  <TabsTrigger value="display">Display</TabsTrigger>
                </TabsList>
                
                {/* Equation Tab */}
                <TabsContent value="equation" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Equation Type</label>
                      <Select
                        value={activeEquation.type}
                        onValueChange={(value: EquationType) => 
                          updateEquation(activeEquationIndex, { type: value })
                        }
                      >
                        <SelectTrigger className="w-40 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cartesian">Cartesian (y = f(x))</SelectItem>
                          <SelectItem value="polar">Polar (r = f(θ))</SelectItem>
                          <SelectItem value="parametric">Parametric</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Equation input based on type */}
                    {activeEquation.type === 'cartesian' && (
                      <div>
                        <label className="text-sm">y = </label>
                        <Input
                          value={activeEquation.cartesian}
                          onChange={(e) => 
                            updateEquation(activeEquationIndex, { cartesian: e.target.value })
                          }
                          placeholder="Enter function of x (e.g., Math.sin(x))"
                          className="mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Example: Math.sin(x), x*x, Math.sqrt(1-x*x)
                        </p>
                      </div>
                    )}
                    
                    {activeEquation.type === 'polar' && (
                      <div>
                        <label className="text-sm">r = </label>
                        <Input
                          value={activeEquation.polar}
                          onChange={(e) => 
                            updateEquation(activeEquationIndex, { polar: e.target.value })
                          }
                          placeholder="Enter function of theta (e.g., Math.sin(3*theta))"
                          className="mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Example: 2*Math.sin(3*theta), 1-Math.cos(theta)
                        </p>
                      </div>
                    )}
                    
                    {activeEquation.type === 'parametric' && (
                      <div className="space-y-2">
                        <div>
                          <label className="text-sm">x = </label>
                          <Input
                            value={activeEquation.parametricX}
                            onChange={(e) => 
                              updateEquation(activeEquationIndex, { parametricX: e.target.value })
                            }
                            placeholder="Enter function of t for x"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm">y = </label>
                          <Input
                            value={activeEquation.parametricY}
                            onChange={(e) => 
                              updateEquation(activeEquationIndex, { parametricY: e.target.value })
                            }
                            placeholder="Enter function of t for y"
                            className="mt-1"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-sm">t min</label>
                            <Input
                              type="number"
                              value={activeEquation.tMin}
                              onChange={(e) => 
                                updateEquation(activeEquationIndex, { 
                                  tMin: parseFloat(e.target.value) 
                                })
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-sm">t max</label>
                            <Input
                              type="number"
                              value={activeEquation.tMax}
                              onChange={(e) => 
                                updateEquation(activeEquationIndex, { 
                                  tMax: parseFloat(e.target.value) 
                                })
                              }
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Example: x = Math.cos(t), y = Math.sin(t) (circle)
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="style">
                      <AccordionTrigger className="text-sm">
                        Curve Style
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2">
                        <div>
                          <label className="text-sm font-medium">Stroke Color</label>
                          <div className="flex items-center mt-1">
                            <input
                              type="color"
                              value={activeEquation.options.strokeColor}
                              onChange={(e) => 
                                updateEquationOptions(activeEquationIndex, { 
                                  strokeColor: e.target.value 
                                })
                              }
                              className="w-8 h-8 border rounded p-0 cursor-pointer"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Stroke Width</label>
                          <div className="flex items-center gap-2">
                            <Slider
                              defaultValue={[activeEquation.options.strokeWidth || 2]}
                              min={1}
                              max={5}
                              step={0.5}
                              className="flex-1"
                              onValueChange={(value) => 
                                updateEquationOptions(activeEquationIndex, { 
                                  strokeWidth: value[0] 
                                })
                              }
                            />
                            <span className="text-sm w-10 text-right">
                              {activeEquation.options.strokeWidth}px
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Dashed Line</label>
                          <Switch
                            checked={!!activeEquation.options.strokeDashed}
                            onCheckedChange={(checked) => 
                              updateEquationOptions(activeEquationIndex, { 
                                strokeDashed: checked 
                              })
                            }
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Show Points</label>
                          <Switch
                            checked={!!activeEquation.options.showPoints}
                            onCheckedChange={(checked) => 
                              updateEquationOptions(activeEquationIndex, { 
                                showPoints: checked 
                              })
                            }
                          />
                        </div>
                        
                        {activeEquation.options.showPoints && (
                          <div>
                            <label className="text-sm font-medium">Point Radius</label>
                            <div className="flex items-center gap-2">
                              <Slider
                                defaultValue={[activeEquation.options.pointRadius || 3]}
                                min={1}
                                max={6}
                                step={0.5}
                                className="flex-1"
                                onValueChange={(value) => 
                                  updateEquationOptions(activeEquationIndex, { 
                                    pointRadius: value[0] 
                                  })
                                }
                              />
                              <span className="text-sm w-10 text-right">
                                {activeEquation.options.pointRadius}px
                              </span>
                            </div>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TabsContent>
                
                {/* Display Tab */}
                <TabsContent value="display" className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Coordinate Range</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs">X Min</label>
                        <Input
                          type="number"
                          value={ranges.xMin}
                          onChange={(e) => 
                            setRanges({
                              ...ranges,
                              xMin: parseFloat(e.target.value)
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs">X Max</label>
                        <Input
                          type="number"
                          value={ranges.xMax}
                          onChange={(e) => 
                            setRanges({
                              ...ranges,
                              xMax: parseFloat(e.target.value)
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs">Y Min</label>
                        <Input
                          type="number"
                          value={ranges.yMin}
                          onChange={(e) => 
                            setRanges({
                              ...ranges,
                              yMin: parseFloat(e.target.value)
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs">Y Max</label>
                        <Input
                          type="number"
                          value={ranges.yMax}
                          onChange={(e) => 
                            setRanges({
                              ...ranges,
                              yMax: parseFloat(e.target.value)
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="pt-3 space-y-2">
                      <h3 className="text-sm font-medium">Display Options</h3>
                      <div className="flex items-center justify-between">
                        <label className="text-sm">Show Grid</label>
                        <Switch
                          checked={showGrid}
                          onCheckedChange={setShowGrid}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm">Show Axes</label>
                        <Switch
                          checked={showAxes}
                          onCheckedChange={setShowAxes}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm">Show Labels</label>
                        <Switch
                          checked={showLabels}
                          onCheckedChange={setShowLabels}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};