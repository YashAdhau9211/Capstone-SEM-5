"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanvasRenderer = void 0;
class CanvasRenderer {
    constructor() { }
    static getInstance() {
        if (!CanvasRenderer.instance) {
            CanvasRenderer.instance = new CanvasRenderer();
        }
        return CanvasRenderer.instance;
    }
    /**
     * Renders UI components to Figma canvas
     */
    renderComponents(components) {
        return __awaiter(this, void 0, void 0, function* () {
            const nodes = [];
            for (const component of components) {
                try {
                    const node = yield this.createNode(component);
                    if (node) {
                        nodes.push(node);
                    }
                }
                catch (error) {
                    console.error(`Error creating node for ${component.name}:`, error);
                }
            }
            return nodes;
        });
    }
    /**
     * Creates a single Figma node from a UI component
     */
    createNode(component) {
        return __awaiter(this, void 0, void 0, function* () {
            let node;
            switch (component.type) {
                case 'frame':
                    node = figma.createFrame();
                    this.applyFrameProperties(node, component);
                    break;
                case 'rectangle':
                    node = figma.createRectangle();
                    this.applyShapeProperties(node, component);
                    break;
                case 'ellipse':
                    node = figma.createEllipse();
                    this.applyShapeProperties(node, component);
                    break;
                case 'text':
                    node = figma.createText();
                    this.applyTextProperties(node, component);
                    break;
                case 'line':
                    node = figma.createLine();
                    this.applyLineProperties(node, component);
                    break;
                default:
                    console.warn(`Unsupported component type: ${component.type}`);
                    return null;
            }
            // Apply common properties
            this.applyCommonProperties(node, component);
            // Handle children recursively
            if (component.children && component.children.length > 0) {
                for (const child of component.children) {
                    const childNode = yield this.createNode(child);
                    if (childNode && 'appendChild' in node) {
                        node.appendChild(childNode);
                    }
                }
            }
            return node;
        });
    }
    /**
     * Applies common properties to any Figma node
     */
    applyCommonProperties(node, component) {
        if (component.name) {
            node.name = component.name;
        }
        if (component.x !== undefined) {
            node.x = component.x;
        }
        if (component.y !== undefined) {
            node.y = component.y;
        }
    }
    /**
     * Applies frame-specific properties
     */
    applyFrameProperties(frame, component) {
        if (component.width !== undefined) {
            frame.resize(component.width, frame.height);
        }
        if (component.height !== undefined) {
            frame.resize(frame.width, component.height);
        }
        if (component.fills) {
            frame.fills = component.fills;
        }
        if (component.strokes) {
            frame.strokes = component.strokes;
        }
        if (component.strokeWeight !== undefined) {
            frame.strokeWeight = component.strokeWeight;
        }
        if (component.cornerRadius !== undefined) {
            frame.cornerRadius = component.cornerRadius;
        }
        // Apply Auto Layout properties
        if (component.layoutMode) {
            frame.layoutMode = component.layoutMode;
        }
        if (component.primaryAxisSizingMode) {
            frame.primaryAxisSizingMode = component.primaryAxisSizingMode;
        }
        if (component.counterAxisSizingMode) {
            frame.counterAxisSizingMode = component.counterAxisSizingMode;
        }
        if (component.paddingLeft !== undefined) {
            frame.paddingLeft = component.paddingLeft;
        }
        if (component.paddingRight !== undefined) {
            frame.paddingRight = component.paddingRight;
        }
        if (component.paddingTop !== undefined) {
            frame.paddingTop = component.paddingTop;
        }
        if (component.paddingBottom !== undefined) {
            frame.paddingBottom = component.paddingBottom;
        }
        if (component.itemSpacing !== undefined) {
            frame.itemSpacing = component.itemSpacing;
        }
    }
    /**
     * Applies shape-specific properties (rectangle, ellipse)
     */
    applyShapeProperties(shape, component) {
        if (component.width !== undefined) {
            shape.resize(component.width, shape.height);
        }
        if (component.height !== undefined) {
            shape.resize(shape.width, component.height);
        }
        if (component.fills) {
            shape.fills = component.fills;
        }
        if (component.strokes) {
            shape.strokes = component.strokes;
        }
        if (component.strokeWeight !== undefined) {
            shape.strokeWeight = component.strokeWeight;
        }
        if (component.cornerRadius !== undefined && 'cornerRadius' in shape) {
            shape.cornerRadius = component.cornerRadius;
        }
    }
    /**
     * Applies text-specific properties
     */
    applyTextProperties(text, component) {
        if (component.characters) {
            text.characters = component.characters;
        }
        if (component.fontSize !== undefined) {
            text.fontSize = component.fontSize;
        }
        if (component.fontName) {
            text.fontName = component.fontName;
        }
        if (component.textAlignHorizontal) {
            text.textAlignHorizontal = component.textAlignHorizontal;
        }
        if (component.textAlignVertical) {
            text.textAlignVertical = component.textAlignVertical;
        }
        if (component.fills) {
            text.fills = component.fills;
        }
    }
    /**
     * Applies line-specific properties
     */
    applyLineProperties(line, component) {
        if (component.strokes) {
            line.strokes = component.strokes;
        }
        if (component.strokeWeight !== undefined) {
            line.strokeWeight = component.strokeWeight;
        }
    }
}
exports.CanvasRenderer = CanvasRenderer;
