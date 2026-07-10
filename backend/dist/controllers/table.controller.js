"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTables = getAllTables;
exports.createTable = createTable;
exports.deleteTable = deleteTable;
exports.updateTableStatus = updateTableStatus;
const tableService = __importStar(require("../services/table.service"));
async function getAllTables(req, res) {
    try {
        const tables = await tableService.getAllTables();
        res.json(tables);
    }
    catch (err) {
        console.error("Get tables failed:", err);
        res.status(400).json({ message: err?.message || "Unable to get tables" });
    }
}
async function createTable(req, res) {
    try {
        const table = await tableService.createTable();
        res.status(201).json(table);
    }
    catch (err) {
        console.error("Create table failed:", err);
        res.status(400).json({ message: err?.message || "Unable to create table" });
    }
}
async function deleteTable(req, res) {
    const idValue = req.params.id;
    const id = Array.isArray(idValue) ? idValue[0] : idValue;
    if (!id) {
        return res.status(400).json({ message: "Table id is required" });
    }
    try {
        await tableService.deleteTable(id);
        res.json({ message: "Table deleted successfully" });
    }
    catch (err) {
        console.error("Delete table failed:", err);
        res.status(400).json({ message: err?.message || "Unable to delete table" });
    }
}
async function updateTableStatus(req, res) {
    const idValue = req.params.id;
    const id = Array.isArray(idValue) ? idValue[0] : idValue;
    const { isInUse } = req.body;
    if (!id) {
        return res.status(400).json({ message: "Table id is required" });
    }
    if (typeof isInUse !== "boolean") {
        return res.status(400).json({ message: "isInUse must be a boolean" });
    }
    try {
        const table = await tableService.updateTableStatus(id, isInUse);
        res.json(table);
    }
    catch (err) {
        console.error("Update table status failed:", err);
        res.status(400).json({ message: err?.message || "Unable to update table status" });
    }
}
//# sourceMappingURL=table.controller.js.map