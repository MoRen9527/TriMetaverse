"use strict";
/**
 * TriCode bridge — unified code execution interface for the TriPilot extension.
 * Wraps @trimetaverse/tricode so all callers use a single access point.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeCodeTask = executeCodeTask;
exports.listAvailableTools = listAvailableTools;
exports.getToolStatus = getToolStatus;
let tricodeModule = null;
function getModule() {
    if (!tricodeModule) {
        tricodeModule = require('@trimetaverse/tricode');
    }
    return tricodeModule;
}
function executeCodeTask(request) {
    return getModule().executeCodeTask(request);
}
function listAvailableTools() {
    return getModule().listAvailableTools();
}
async function getToolStatus(tool) {
    return getModule().getToolStatus(tool);
}
//# sourceMappingURL=tricodeBridge.js.map